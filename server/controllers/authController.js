const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Registro de un nuevo usuario
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, nickname, email, password } = req.body;

        if (!firstName || !lastName || !nickname || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUserQuery = `
            INSERT INTO users (first_name, last_name, nickname, email, password_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, first_name, last_name, nickname, email, role, created_at, avatar_url, cover_url
        `;
        const result = await pool.query(newUserQuery, [firstName, lastName, nickname, email, passwordHash]);
        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, nickname: user.nickname },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                nickname: user.nickname,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatar_url || null,
                coverUrl: user.cover_url || null,
            }
        });

    } catch (error) {
        console.error("Error en register:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Registro de un nuevo administrador
exports.registerAdmin = async (req, res) => {
    try {
        const { firstName, lastName, nickname, email, password } = req.body;

        if (!firstName || !lastName || !nickname || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUserQuery = `
            INSERT INTO users (first_name, last_name, nickname, email, password_hash, role)
            VALUES ($1, $2, $3, $4, $5, 'admin')
            RETURNING id, first_name, last_name, nickname, email, role, created_at
        `;
        const result = await pool.query(newUserQuery, [firstName, lastName, nickname, email, passwordHash]);
        const user = result.rows[0];

        res.status(201).json({
            message: 'Administrador registrado exitosamente',
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                nickname: user.nickname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error en registerAdmin:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Login de usuario existente
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Correo electrónico y contraseña son requeridos.' });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas (Correo no encontrado).' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas (Contraseña incorrecta).' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, nickname: user.nickname },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                nickname: user.nickname,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatar_url || null,
                coverUrl: user.cover_url || null,
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor al intentar iniciar sesión.' });
    }
};

// Obtener perfil de usuario por ID
exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, first_name, last_name, nickname, email, role, avatar_url, cover_url, cart_data, wishlist_data, created_at FROM users WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        const user = result.rows[0];
        res.json({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            nickname: user.nickname,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatar_url || null,
            coverUrl: user.cover_url || null,
            cartData: user.cart_data ? JSON.parse(user.cart_data) : [],
            wishlistData: user.wishlist_data ? JSON.parse(user.wishlist_data) : [],
            createdAt: user.created_at,
        });
    } catch (error) {
        console.error('Error en getProfile:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Actualizar perfil de usuario (avatar, cover, cart, wishlist)
exports.updateProfile = async (req, res) => {
    try {
        const { userId, avatarUrl, coverUrl, cartData, wishlistData } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'userId es requerido.' });
        }

        const fields = [];
        const values = [];
        let idx = 1;

        if (avatarUrl !== undefined) { fields.push(`avatar_url = $${idx++}`); values.push(avatarUrl); }
        if (coverUrl !== undefined) { fields.push(`cover_url = $${idx++}`); values.push(coverUrl); }
        if (cartData !== undefined) { fields.push(`cart_data = $${idx++}`); values.push(JSON.stringify(cartData)); }
        if (wishlistData !== undefined) { fields.push(`wishlist_data = $${idx++}`); values.push(JSON.stringify(wishlistData)); }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar.' });
        }

        values.push(userId);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING avatar_url, cover_url, cart_data, wishlist_data`;
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({
            message: 'Perfil actualizado.',
            avatarUrl: result.rows[0].avatar_url,
            coverUrl: result.rows[0].cover_url,
            cartData: result.rows[0].cart_data ? JSON.parse(result.rows[0].cart_data) : [],
            wishlistData: result.rows[0].wishlist_data ? JSON.parse(result.rows[0].wishlist_data) : [],
        });
    } catch (error) {
        console.error('Error en updateProfile:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const crypto = require('crypto');
const { sendResetEmail } = require('../utils/mailer');

// Solicitar restablecimiento de contraseña village
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'El correo es requerido.' });

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            // Por seguridad, no revelamos si el correo existe o no village
            return res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const clientOrigin = req.headers.origin || 'http://localhost:5173'; // Obtener el origen dinámicamente village

        await pool.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = NOW() + interval \'1 hour\' WHERE email = $2',
            [token, email]
        );

        await sendResetEmail(email, token, clientOrigin);

        res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
    } catch (error) {
        console.error("Error en requestPasswordReset:", error);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

// Restablecer la contraseña village
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ message: 'Token y contraseña requeridos.' });

        const userResult = await pool.query(
            'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
            [token]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'El token es inválido o ha expirado.' });
        }

        const userId = userResult.rows[0].id;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await pool.query(
            'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
            [passwordHash, userId]
        );

        res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ message: 'Error al actualizar la contraseña.' });
    }
};
