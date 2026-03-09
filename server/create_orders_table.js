const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

// Using the connection string from alter.js or env variable
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ne2baMdHYW6G@ep-purple-shadow-aifiyie5-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY,
                user_id VARCHAR(255),
                customer_name VARCHAR(255),
                total_amount DECIMAL(10,2),
                status VARCHAR(50) DEFAULT 'paid',
                items JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await client.query(createTableQuery);
        console.log('Orders table created successfully!');
    } catch (e) {
        console.error('Error creating table:', e);
    } finally {
        await client.end();
    }
}
run();
