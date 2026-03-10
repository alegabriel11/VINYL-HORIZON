const pool = require('./config/db');

async function migrate() {
    console.log("Iniciando migración de base de datos para Waitlist & Notificaciones...");
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // 1. Añadir restocked_at a vinyls
        console.log("Añadiendo columna restocked_at a la tabla vinyls...");
        await client.query(`
            ALTER TABLE vinyls 
            ADD COLUMN IF NOT EXISTS restocked_at TIMESTAMP WITH TIME ZONE;
        `);

        // 2. Crear tabla restock_requests
        console.log("Creando tabla restock_requests...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS restock_requests (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                sku VARCHAR(255) NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(sku, user_id)
            );
        `);

        // 3. Crear tabla notifications
        console.log("Creando tabla notifications...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query('COMMIT');
        console.log("✅ Migración completada con éxito.");
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("❌ Error durante la migración:", e);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
