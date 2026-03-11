const apiKey = "AIzaSyB9jRGB_e2rEDX8Z_F4a9ALPdIfD3hH4Dg";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function verifyAPIKey() {
  console.log("Iniciando prueba de conexión con Gemini API...");
  try {
    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error al conectar:", response.status, response.statusText);
        console.error("Detalles:", errorText);
        process.exit(1);
    }

    const data = await response.json();
    console.log("✅ Conexión exitosa. Modelos disponibles encontrados:", data.models?.length || 0);

    const isGeminiFlashAvailable = data.models?.some(model => model.name.includes("gemini-1.5-flash"));
    if (isGeminiFlashAvailable) {
        console.log("🌟 Modelo gemini-1.5-flash detectado. ¡Tu API Key está lista para ser usada!");
    } else {
        console.log("✅ Tu API Key es válida, pero no veo gemini-1.5-flash. Los modelos disponibles son: ");
        console.log(data.models?.map(m => m.name).join(", "));
    }
  } catch (error) {
    console.error("❌ Error de red o ejecución:", error);
  }
}

verifyAPIKey();
