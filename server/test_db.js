const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        const res = await pool.query('SELECT * FROM users LIMIT 1');
        console.log('Users table exists:', res.rows);

        // Simulate user creation
        const insertRes = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            ['Test', 'User', 'test@test.com', 'hash']
        );
        console.log('Insert success:', insertRes.rows);

        await pool.query('DELETE FROM users WHERE email = $1', ['test@test.com']);
    } catch (e) {
        console.error('DB Error:', e.message);
    } finally {
        pool.end();
    }
}

test();
