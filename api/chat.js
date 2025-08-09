// This is your new backend file: /api/chat.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// This is the main function Vercel will run
module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Securely get the API key from Vercel's settings
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            throw new Error("Gemini API key is not configured.");
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Get the user's message and the persona from the frontend
        const { message, persona } = req.body;

        if (!message || !persona) {
            return res.status(400).json({ error: 'Message and persona are required' });
        }
        
        const prompt = `${persona} "${message}"`;
        const generationConfig = { temperature: 0.9 };

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        });

        const response = await result.response;
        const text = response.text();

        // Send the AI's reply back to the frontend
        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Error in serverless function:", error);
        res.status(500).json({ error: "Failed to get a response from the AI." });
    }
};