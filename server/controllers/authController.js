const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Registro de un nuevo usuario
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // 1. Validar que vengan los datos
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // 2. Comprobar si el usuario ya existe en la base de datos
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // 3. Encriptar la contraseña usando bcrypt
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 4. Guardar el nuevo usuario en PostgreSQL
        const newUserQuery = `
            INSERT INTO users (first_name, last_name, email, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING id, first_name, last_name, email, role, created_at
        `;
        const result = await pool.query(newUserQuery, [firstName, lastName, email, passwordHash]);
        const user = result.rows[0];

        // 5. Generar un JWT (Token de sesión) para que quede logueado automáticamente
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // 6. Enviar éxito
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).json({ message: 'Error en el servidor al registrar el usuario.' });
    }
};

// Login de usuario existente
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verificar si mandaron email y password
        if (!email || !password) {
            return res.status(400).json({ message: 'Correo electrónico y contraseña son requeridos.' });
        }

        // 2. Buscar al usuario por su email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas (Correo no encontrado).' });
        }

        const user = userResult.rows[0];

        // 3. Verificar si la contraseña enviada coincide con el hash guardado
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas (Contraseña incorrecta).' });
        }

        // 4. Generar el JWT para la sesión
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // 5. Devolver al cliente la información y el token
        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor al intentar iniciar sesión.' });
    }
};
