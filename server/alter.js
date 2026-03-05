const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_ne2baMdHYW6G@ep-purple-shadow-aifiyie5-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require' });

async function run() {
    try {
        await client.connect();
        await client.query('ALTER TABLE vinyls ADD COLUMN IF NOT EXISTS sku VARCHAR(50) UNIQUE;');
        console.log('ALTER success');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
