require('dotenv').config();
const { Pool } = require('pg');

const connString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;
const pool = new Pool({ connectionString: connString });

pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT')
    .then(() => pool.query(`DELETE FROM orders WHERE shipping_address IS NULL OR shipping_address = ''`))
    .then(res => console.log(`SUCCESS: Deleted ${res.rowCount} old incomplete orders!`))
    .catch(err => console.error("Error:", err))
    .finally(() => pool.end());
