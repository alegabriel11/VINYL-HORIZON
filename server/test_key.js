require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
    try {
        console.log("API KEY LOADED:", process.env.GEMINI_API_KEY ? "YES (length " + process.env.GEMINI_API_KEY.length + ")" : "NO");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("hello");
        console.log(result.response.text());
    } catch (e) {
        console.log("RAW ERROR:");
        console.log(e);
    }
}
run();
