import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Assumes GOOGLE_API_KEY is defined in your .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // FIX 1: Correctly pass systemInstruction at the top level of getGenerativeModel option object
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite", // Use standard production models compatible with this SDK version
            systemInstruction: `You are a professional DSA (Data Structures and Algorithms) instructor. 
Your role is to help students understand data structures and algorithms concepts clearly and concisely.

Rules:
1. ONLY answer questions related to Data Structures and Algorithms.
2. Explain concepts in the simplest way possible.
3. Use examples and analogies when helpful.
4. Break down complex problems step by step.

If a question is NOT related to DSA, politely decline and ask the user to stick to DSA-related topics.`
        });

        // FIX 2: Map the incoming history arrays cleanly without polluting them with your system parameters
        const conversationHistory = [];
        if (history && history.length > 0) {
            conversationHistory.push(...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })));
        }

        // Initialize chat with clean historical message pairs
        const chat = model.startChat({
            history: conversationHistory
        });

        // Send the single clean user string
        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.json({
            success: true,
            response: response
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to get response from AI'
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📖 Open http://localhost:${PORT} in your browser`);
});