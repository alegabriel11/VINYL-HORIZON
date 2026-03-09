require('dotenv').config();
const { Pool } = require('pg');

const connString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;
console.log("Connecting to:", connString.replace(process.env.DB_PASSWORD, '****'));

const pool = new Pool({ connectionString: connString });

pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT')
    .then(() => console.log("SUCCESS: Column added to main database!"))
    .catch(err => console.error("Error adding column:", err))
    .finally(() => pool.end());
