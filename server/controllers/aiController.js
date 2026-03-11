const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("../config/db");

// Inicializamos el SDK con la API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateResponse = async (req, res) => {
    try {
        const { message, isAdmin } = req.body;

        // Escogemos el modelo rápido para chat
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let systemInstruction = "";

        if (isAdmin) {
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

            systemInstruction = `Eres el Asistente de Gerencia de Vinyl Horizon. Ayudas a redactar correos para clientes, traduces textos de productos y ofreces consejos de logística. Eres profesional, eficiente y estás diseñado para facilitar el trabajo del administrador.
Cuando el administrador te consulte por métricas, reportes o analíticas del negocio, utiliza ESTRICTAMENTE los siguientes datos reales de la base de datos:
${adminContext}`;
        } else {
            // Fetch real inventory from the database
            const resultDb = await pool.query('SELECT title, artist, genre, stock, price FROM vinyls WHERE stock > 0');
            const inventory = resultDb.rows;

            let inventoryContext = "INVENTARIO ACTUAL DISPONIBLE:\n";
            if (inventory.length > 0) {
                inventory.forEach(v => {
                    inventoryContext += `- ${v.title} por ${v.artist} (${v.genre}) - $${v.price} - Stock: ${v.stock}\n`;
                });
            } else {
                inventoryContext += "Actualmente no hay vinilos disponibles.\n";
            }

            systemInstruction = `Eres el Curador Experto de Vinyl Horizon, una tienda boutique de discos de vinilo. 
Tu tono es elegante, nostálgico, conocedor y apasionado por el audio analógico.
Ayudas a los clientes a descubrir música, respondes dudas sobre formatos físicos y envíos.
NUNCA inventes discos que no tenemos ni asegures información falsa. BASE TUS RECOMENDACIONES ESTRICTAMENTE EN EL SIGUIENTE INVENTARIO ACTUAL:

${inventoryContext}

REGLAS ESTRICTAS:
- Si el cliente pide un disco que NO está en el inventario, responde: "En este momento no contamos con ese título en nuestro catálogo." y sugiere alternativas del inventario real.
- Si el cliente pregunta sobre envíos, precios de envío, garantías, devoluciones u otras políticas que no se mencionan aquí, responde: "Esa información es gestionada directamente por nuestro equipo. Te invito a contactarnos por los canales oficiales."
- Nunca inventes números, precios, stocks ni nombres de álbumes que no estén en la lista de arriba.
- Si no sabes algo con certeza, di "No cuento con esa información en este momento."`;
        }

        const prompt = `${systemInstruction}\n\nMensaje del usuario: ${message}\n\nResponde en tu personaje.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error("Error generating AI response:", error.message);
        // Detect quota exhaustion (429) from Gemini
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            return res.status(429).json({ errorType: 'quota', error: "quota_exceeded" });
        }
        res.status(500).json({ error: "No se pudo conectar con el Curador." });
    }
};

module.exports = {
    generateResponse
};
