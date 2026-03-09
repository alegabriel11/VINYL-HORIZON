const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ne2baMdHYW6G@ep-purple-shadow-aifiyie5-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        const alterTableQuery = `
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
        `;

        await client.query(alterTableQuery);
        console.log('Orders table altered successfully! Added customer_name column.');
    } catch (e) {
        console.error('Error altering table:', e);
    } finally {
        await client.end();
    }
}
run();
