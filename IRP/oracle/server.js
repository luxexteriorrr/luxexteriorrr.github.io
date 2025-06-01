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
const io = socketIo(server); // server defined

sentra.use(express.static('public'));
sentra.use(bodyParser.json());

//websocket connection handling 
io.on('connection', (socket) => {
  console.log('client connected', socket.id)

  socket.on('disconnect', () => {
    console.log('client disconected', socket.id)
  })

  //listen for text 
  socket.on('text_message', (data) => {
    console.log('recieved data', data)
    socket.emit('test responnce', "server says hello")
  })
})



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
    } catch (err) {
      console.error("reply error", err);
      //console.log("↩️ Raw GPT data:", JSON.stringify(data, null, 2));
      return res.json({ output: "Sentra is silent" });
    }
    
    if (!reply) {
      console.error("❌ No valid reply from GPT.");
      return res.json({ output: "Sentra is silent." });
    }
    
    res.json({ output: reply });
    
  } catch (error) {
    console.error("❌ GPT API error:", error);
    res.status(500).json({ output: "Oracle™ had a vision… but lost it." });
  }
});

//launch the server
server.listen(3000, () => {
  console.log("Sentra live at http://localhost:3000");
  console.log('websocket connection initiated')
});

