const pool = require('../config/db');

exports.createVinyl = async (req, res) => {
    try {
        const { id, title, artist, price, description, cover_image_url, stock, sku, release_year, genre, audio_preview_url } = req.body;

        // Note: Our DB schema uses id (uuid), title, artist, price, description, cover_image_url, stock, sku, release_year, genre, audio_preview_url

        // We generate a UUID if one is not provided.
        const uuidId = id || require('crypto').randomUUID();

        const query = `
            INSERT INTO vinyls (id, title, artist, price, description, cover_image_url, stock, sku, release_year, genre, audio_preview_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;
        const values = [uuidId, title, artist, price, description, cover_image_url, stock || 0, sku || null, release_year || null, genre || null, audio_preview_url || null];

        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Vinyl created successfully',
            vinyl: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating vinyl:', error);
        res.status(500).json({ message: 'Error creating vinyl', error: error.message });
    }
};

exports.getVinyls = async (req, res) => {
    try {
        const query = 'SELECT * FROM vinyls ORDER BY created_at DESC;';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching vinyls:', error);
        res.status(500).json({ message: 'Error fetching vinyls', error: error.message });
    }
};

exports.updateVinyl = async (req, res) => {
    try {
        const { sku } = req.params;
        const { title, artist, price, description, cover_image_url, stock, release_year, genre, audio_preview_url } = req.body;

        const query = `
            UPDATE vinyls 
            SET title = $1, artist = $2, price = $3, description = $4, cover_image_url = $5, stock = $6, release_year = $7, genre = $8, audio_preview_url = $9
            WHERE sku = $10
            RETURNING *;
        `;
        const values = [title, artist, price, description, cover_image_url, stock || 0, release_year || null, genre || null, audio_preview_url || null, sku];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Vinyl not found' });
        }

        res.status(200).json({
            message: 'Vinyl updated successfully',
            vinyl: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating vinyl:', error);
        res.status(500).json({ message: 'Error updating vinyl', error: error.message });
    }
};

exports.deleteVinyl = async (req, res) => {
    try {
        const { sku } = req.params;
        const query = 'DELETE FROM vinyls WHERE sku = $1 RETURNING *;';
        const result = await pool.query(query, [sku]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Vinyl not found' });
        }

        res.status(200).json({ message: 'Vinyl deleted successfully', vinyl: result.rows[0] });
    } catch (error) {
        console.error('Error deleting vinyl:', error);
        res.status(500).json({ message: 'Error deleting vinyl', error: error.message });
    }
};

exports.checkout = async (req, res) => {
    const client = await pool.connect();
    try {
        const { items, userId, customerName, totalAmount, shippingAddress, paymentMethod } = req.body; // array of { id, quantity }

        await client.query('BEGIN');

        for (const item of items) {
            const { id, quantity } = item;

            // Check stock first
            const checkQuery = 'SELECT stock FROM vinyls WHERE id = $1 FOR UPDATE;';
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rowCount === 0) {
                throw new Error(`Vinyl with id ${id} not found.`);
            }

            const currentStock = checkResult.rows[0].stock;
            if (currentStock < quantity) {
                throw new Error(`Not enough stock for vinyl ${id}.`);
            }

            // Deduct stock
            const updateQuery = 'UPDATE vinyls SET stock = stock - $1 WHERE id = $2;';
            await client.query(updateQuery, [quantity, id]);
        }

        // Create the order
        const orderId = require('crypto').randomUUID();
        const createOrderQuery = `
            INSERT INTO orders (id, user_id, customer_name, total_amount, items, shipping_address, payment_method)
            VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
            RETURNING *;
        `;
        const orderValues = [
            orderId,
            userId || 'guest',
            customerName || 'Anonymous',
            totalAmount || 0,
            JSON.stringify(items),
            shippingAddress || '',
            paymentMethod || 'credit'
        ];

        await client.query(createOrderQuery, orderValues);

        await client.query('COMMIT');
        res.status(200).json({ message: 'Checkout successful.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error during checkout:', error);
        res.status(400).json({ message: 'Error during checkout.', error: error.message });
    } finally {
        client.release();
    }
};

exports.getOrders = async (req, res) => {
    try {
        const query = 'SELECT * FROM orders ORDER BY created_at DESC;';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['paid', 'shipped', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        await client.query('BEGIN');

        // Check current status and items to see if we need to restock
        const orderQuery = 'SELECT * FROM orders WHERE id = $1 FOR UPDATE;';
        const orderResult = await client.query(orderQuery, [id]);

        if (orderResult.rowCount === 0) {
            throw new Error(`Order ${id} not found.`);
        }

        const order = orderResult.rows[0];

        // If cancelling a previously paid or shipped order, we should restock
        if (status === 'cancelled' && order.status !== 'cancelled') {
            const items = order.items; // Assuming JSONB format array
            for (const item of items) {
                const { id: vinylId, quantity } = item;
                const updateQuery = 'UPDATE vinyls SET stock = stock + $1 WHERE id = $2;';
                await client.query(updateQuery, [quantity, vinylId]);
            }
        }

        // If somehow changing from cancelled back to paid (e.g. undo cancel), you'd need to deduct stock.
        // For simplicity, we just block un-cancelling.
        if (order.status === 'cancelled' && status !== 'cancelled') {
            throw new Error('Cannot change status of a cancelled order.');
        }

        // Update the order status
        const updateOrderQuery = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *;';
        const updatedOrderResult = await client.query(updateOrderQuery, [status, id]);

        await client.query('COMMIT');
        res.status(200).json({ message: 'Order status updated successfully.', order: updatedOrderResult.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating order status:', error);
        res.status(400).json({ message: 'Error updating order status.', error: error.message });
    } finally {
        client.release();
    }
};
