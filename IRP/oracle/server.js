require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

// ✅ Confirm API key is loaded
console.log("✅ API key loaded:", process.env.OPENAI_API_KEY?.slice(0, 8) + "...");

app.post('/oracle', async (req, res) => {
    const input = req.body.input;
    console.log("🧠 Received input:", input);
  
    const messages = [
        {
            role: "system",
            content: "You are Oracle™, a branding AI. Listen to the user input and output a branding slogan incorporating a subject of the user input. In all the branding quotes, use the Oracle word"
          },
      { role: "user", content: input }
    ];
  
    console.log("📨 Sending messages:", messages);
  
    try {
      const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          temperature: 0.8,
          max_tokens: 50
        })
      });
  
      const data = await gptRes.json();
      console.log("GPT raw response:", data);
  
      const reply = data.choices?.[0]?.message?.content.trim() || "Oracle™ is silent.";
      res.json({ output: reply });
  
    } catch (error) {
      console.error("❌ GPT API error:", error);
      res.status(500).json({ output: "Oracle™ had a vision... but lost it." });
    }
  });
  

app.listen(3000, () => {
  console.log("🔮 Oracle™ Poster is live at http://localhost:3000");
});

