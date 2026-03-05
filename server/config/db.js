const { Pool } = require('pg');
require('dotenv').config();

// Configuración del Pool de conexiones a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Mensaje de éxito al conectar la primera vez
pool.on('connect', () => {
    console.log('✅ Base de Datos PostgreSQL conectada con éxito.');
});

// Manejo de errores inesperados en el pool de conexiones
pool.on('error', (err) => {
    console.error('❌ Error inesperado en el cliente de PostgreSQL', err);
    process.exit(-1);
});

module.exports = pool;
