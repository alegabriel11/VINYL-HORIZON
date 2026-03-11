const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    console.log("API Key:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "MISSING ❌");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("Di solo: FUNCIONA");
        const text = result.response.text();
        console.log("Gemini Response:", text);
    } catch (e) {
        console.error("Gemini Error:", e.message);
        if (e.status) console.error("HTTP Status:", e.status);
        if (e.errorDetails) console.error("API Error details:", JSON.stringify(e.errorDetails));
    }
}

test();
