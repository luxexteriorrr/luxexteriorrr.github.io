//load the enviroment from the local env file (DO NOT EXPOSE)
require('dotenv').config();
//webserver
const express = require('express');
//requires for the JSON Files
const bodyParser = require('body-parser');
//HTTP pulls for API calls
const fetch = require('node-fetch');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

//Confirm API key is loaded
//console.log("✅ API key loaded:", process.env.OPENAI_API_KEY?.slice(0, 8) + "...");





app.post('/oracle', async (req, res) => {
  const input = req.body.input;
  console.log("Received input:", input);

  const messages = [
    {
      role: "system",
      content: "You are a friendly chatbot"
    },
    { role: "user", content: input }
  ];

  try {
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        temperature: 0.3,
        top_p: 0.7,
        max_tokens: 200
      })
    });

    const data = await gptRes.json();
    console.log("🔍 GPT status:", gptRes.status);

    let reply;

      try {
        reply = data.choices[0].message.content.trim();
      } catch (err) {
        console.error("❌ Could not extract reply from GPT:", err);
        console.log("↩️ Raw GPT data:", JSON.stringify(data, null, 2));
        return res.json({ output: "Oracle™ is silent." });
      }


    if (!reply) {
      console.error("❌ No valid reply from GPT.");
      return res.json({ output: "Oracle™ is silent." });
    }

    res.json({ output: reply });

  } catch (error) {
    console.error("❌ GPT API error:", error);
    res.status(500).json({ output: "Oracle™ had a vision… but lost it." });
  }
});

  
//launch the server
app.listen(3000, () => {
  console.log("🔮 Oracle™ Poster is live at http://localhost:3000");
});

