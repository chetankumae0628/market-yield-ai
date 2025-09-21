import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch("https://api.gemini.com/v1/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.API_KEY}`
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 200
            })
        });

        const data = await response.json();
        res.json({ reply: data.reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
