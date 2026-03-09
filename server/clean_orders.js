require('dotenv').config();
const { Pool } = require('pg');

const connString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;
console.log("Connecting to Database...");

const pool = new Pool({ connectionString: connString });

const cleanQuery = `
    DELETE FROM orders 
    WHERE shipping_address IS NULL 
       OR shipping_address = '' 
       OR payment_method IS NULL 
       OR payment_method = '';
`;

pool.query(cleanQuery)
    .then(res => console.log(`SUCCESS: Deleted ${res.rowCount} old incomplete orders from the database!`))
    .catch(err => console.error("Error deleting orders:", err))
    .finally(() => pool.end());
