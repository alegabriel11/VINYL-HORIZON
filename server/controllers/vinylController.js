const pool = require('../config/db');

exports.createVinyl = async (req, res) => {
    try {
        const { id, title, artist, price, description, cover_image_url, stock, sku, release_year, genre } = req.body;

        // Note: Our DB schema uses id (uuid), title, artist, price, description, cover_image_url, stock, sku, release_year, genre

        // We generate a UUID if one is not provided.
        const uuidId = id || require('crypto').randomUUID();

        const query = `
            INSERT INTO vinyls (id, title, artist, price, description, cover_image_url, stock, sku, release_year, genre)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const values = [uuidId, title, artist, price, description, cover_image_url, stock || 0, sku || null, release_year || null, genre || null];

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
        const { title, artist, price, description, cover_image_url, stock, release_year, genre } = req.body;

        const query = `
            UPDATE vinyls 
            SET title = $1, artist = $2, price = $3, description = $4, cover_image_url = $5, stock = $6, release_year = $7, genre = $8
            WHERE sku = $9
            RETURNING *;
        `;
        const values = [title, artist, price, description, cover_image_url, stock || 0, release_year || null, genre || null, sku];

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
