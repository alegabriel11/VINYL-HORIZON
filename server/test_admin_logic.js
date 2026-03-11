const pool = require('./config/db');

async function test() {
    try {
             // Gather Business Intelligence for Admin Copilot
             const ordersRes = await pool.query("SELECT COUNT(*) as total_orders, SUM(total_amount) as total_revenue, AVG(total_amount) as avg_ticket FROM orders WHERE status IN ('paid', 'shipped')");
             const { total_orders, total_revenue, avg_ticket } = ordersRes.rows[0];

             const criticalStockRes = await pool.query("SELECT title, artist, stock FROM vinyls WHERE stock > 0 AND stock <= 3");
             let criticalStockStr = criticalStockRes.rows.map(v => `- ${v.title} por ${v.artist} (Stock: ${v.stock})`).join('\n') || "Ninguno";

             const wishlistRes = await pool.query(`
                 SELECT v.title, v.artist, COUNT(r.id) as request_count 
                 FROM restock_requests r 
                 JOIN vinyls v ON r.sku = v.sku 
                 GROUP BY v.title, v.artist 
                 ORDER BY request_count DESC 
                 LIMIT 5;
             `);
             let desiredStr = wishlistRes.rows.map(v => `- ${v.title} por ${v.artist} (${v.request_count} solicitudes)`).join('\n') || "Ninguno";

             const repeatUsersRes = await pool.query(`
                 WITH user_order_counts AS (
                     SELECT user_id, COUNT(*) as order_count
                     FROM orders
                     WHERE status IN ('paid', 'shipped') AND user_id IS NOT NULL
                     GROUP BY user_id
                 )
                 SELECT 
                     COUNT(*) as total_customers,
                     SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END) as repeat_customers
                 FROM user_order_counts;
             `);
             const { total_customers, repeat_customers } = repeatUsersRes.rows[0] || { total_customers: 0, repeat_customers: 0 };
             const repeatRate = total_customers > 0 ? ((repeat_customers / total_customers) * 100).toFixed(2) : 0;

             const adminContext = `
REPORTE DE NEGOCIO ACTUAL:
Ventas Totales: $${Number(total_revenue || 0).toFixed(2)} (en ${total_orders} pedidos)
Ticket Promedio: $${Number(avg_ticket || 0).toFixed(2)} por pedido
Tasa de Retorno (Clientes recurrentes): ${repeatRate}%
Discos en Stock Crítico (3 o menos):
${criticalStockStr}
Discos Más Deseados (Lista de espera):
${desiredStr}
             `;
             console.log("Success:\n" + adminContext);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

test();
