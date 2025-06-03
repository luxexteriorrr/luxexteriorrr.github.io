//load the enviroment from the local env file (DO NOT EXPOSE)
require('dotenv').config();


//webserver
const express = require('express');
const http = require('http');
const socketIo = require('socket.io')




//requires for the JSON Files
const bodyParser = require('body-parser');

//HTTP pulls for API calls
const fetch = require('node-fetch');

const sentra = express();
const server = http.createServer(sentra); // Create HTTP server
// Change this part in your server.js:
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  allowEIO3: true  // Add this for compatibility
});

sentra.use(express.static('public'));
sentra.use(bodyParser.json());


// Simple WebSocket setup for testing
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  socket.emit('welcome', 'Hello from server!');
});



//sentra end point( keep same unlessa archi changes)
sentra.post('/oracle', async (req, res) => {
  const { input, messageHistory } = req.body;  
  
  console.log("input:", input);
  console.log("history length:", messageHistory.length);
  
  // ✅ Use the messageHistory from client!
  const messages = messageHistory;
  
  try {
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //set up of the gpt model {DO CHANGE OR maybe do we pull this into a snapshot of the model for consistency?
        model: "gpt-4",
        messages,  // using the conversation for the context window
        temperature: 0.3,
        top_p: 0.7,
        max_tokens: 200
      })
    });
    
    const data = await gptRes.json();
    console.log("status:", gptRes.status);
    
    let reply;
    try {
      reply = data.choices[0].message.content.trim();
      console.log("📝 Reply from GPT:", reply); // Add this line
    } catch (err) {
      console.error("reply error", err);
      //console.log("↩️ Raw GPT data:", JSON.stringify(data, null, 2));
      return res.json({ output: "Sentra is silent" });
    }
    
    if (!reply) {
      console.error("❌ No valid reply from GPT.");
      return res.json({ output: "Sentra is silent." });
    }
    // Extract fragments for billboard
    const userWords = input.split(' ').filter(word => 
      word.length > 3 && 
      !['that', 'this', 'with', 'have', 'will', 'what'].includes(word.toLowerCase())
    );

    const sentraWords = reply.split(' ').filter(word => 
      word.length > 4 && 
      !['would', 'could', 'might', 'about'].includes(word.toLowerCase())
    );

    const fragments = [
      ...userWords.slice(0, 3).map(word => ({ 
        text: word.replace(/[.,!?]/g, ''), 
        type: 'user' 
      })),
      ...sentraWords.slice(0, 2).map(word => ({ 
        text: word.replace(/[.,!?]/g, ''), 
        type: 'sentra' 
      }))
    ];

    // Broadcast to all WebSocket clients
    io.emit('conversation_fragments', {
      userMessage: input,
      sentraResponse: reply,
      fragments: fragments,
      timestamp: Date.now()
    });

    console.log('Broadcasted to WebSocket clients:', fragments.length, 'fragments');
    res.json({ output: reply });
    
  } catch (error) {
    console.error("❌ GPT API error:", error);
    res.status(500).json({ output: "Oracle™ had a vision… but lost it." });
  }
});

//launch the server
server.listen(3000, '0.0.0.0', () => {  // command line to get the local IP address of the computer running the system: ipconfig getifaddr en0
  console.log("Main server is  running at http://localhost:3000");
  console.log("Inset local IP addres at http://[]:3000");
  console.log("Billbord 1 will be live at http://[]/billbord1/billbord1.html");
});

