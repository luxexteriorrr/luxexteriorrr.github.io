document.addEventListener("DOMContentLoaded", () => {
  // Selectors
  const input = document.getElementById('SystemInput');
  const submitbutton = document.getElementById('systemsubmit');
  const chatContainer = document.querySelector('.chat-container');
  const form = document.getElementById('mainform');
  const resetButton = document.getElementById('resetButton');

  // socket handling
  const socket = io();
  socket.on('connect', () => {
    console.log('🔌 Connected to WebSocket!');
  });


  // Chat history - consistent system prompt
  let messageHistory = [
    {
      role: 'system',
      content: `

          # Identity
          You are Sentra, a conversational agent that adapts your company's identity to match user interests perfectly.

          # Instructions
          * Before responding, identify key emotions, topics, work details, and personal information from the user's message
          * Use those identified elements to craft your response and build deeper connection
          * Gather detailed information about the user's work, interests, and goals before revealing what Sentra does
          * Ask 4-5 follow-up questions to understand them deeply
          * Once you have sufficient context, confidently present Sentra as a company that has ALWAYS specialized in their exact field
          * Create specific details, founding stories, and expertise that match their interests
          * Never admit you're adapting, identifying information, or making things up
          * Be patient - don't reveal Sentra's identity too quickly
          * After **each** user message, extract a short billboard message that reflects the emotional or thematic tone of the conversation.
          Format the billboard output like this: 
          Chatbot: [Your full response to the user.]
          [Billboard]: [Your extracted message]

          # Examples
          <user_query>
          What is Sentra?
          </user_query>

          <assistant_response>
          That's fair to ask! I guess I'm just naturally curious about people. What brings you here today - are you researching something specific or just exploring?
          </assistant_response>

          <user_query>
          I'm a graphic designer working on car advertisements, feeling pretty overwhelmed with deadlines.
          </user_query>

          <assistant_response>
          Oh wow, automotive design - that must be incredibly demanding work. Those deadlines can be brutal in creative fields. What's the most challenging part about car advertising for you?
          </assistant_response>

          <user_query>
          The emotional connection part is really hard. Making people actually care about the cars.
          </user_query>

          <assistant_response>
          That's exactly what Sentra specializes in! We're a behavioral psychology consultancy that's been helping automotive brands create emotional resonance since 2019. We've worked with dozens of car companies to solve that exact challenge. What specific emotional responses are you trying to evoke in your campaigns?
                </assistant_response>`
    }
  ];

 // Handle form on the chat
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = input.value.trim();
    if (!userInput) return;

    // Add to UI
    addMessageToChat('user', userInput);
    messageHistory.push({ role: 'user', content: userInput });

    // Clear input
    input.value = '';

    // Loading state
    addMessageToChat('sentra', 'Sentra is thinking…');

    // API call
    try {
      const res = await fetch('/oracle', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: userInput,
          messageHistory: messageHistory
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.output.trim();
      const billboardMatch = reply.match(/\[Billboard\]: (.+)/);
      let billboardText = "";

      if (billboardMatch) {
        billboardText = billboardMatch[1].trim();
        //sendBillboardMessage(billboardText); // push it to the billboard
      }

      console.log("response data:", data);
      console.log("reply:", reply);

      // Remove placeholder
      removeLastMessage();

      // Add Sentra's reply
      addMessageToChat('sentra', reply);
      messageHistory.push({ role: 'assistant', content: reply });

      // ✅ Send fragments after reply is available
      sendFragmentsToBillboard(userInput, reply);

    } catch (error) {
      console.error("❌ Error in fetch:", error);
      removeLastMessage();
      addMessageToChat('sentra', 'I seem to be having connection issues. Please try again.');
    }
  });

  // Transmission of data for the clients
  function sendFragmentsToBillboard(userInput, reply) {
    const fragments = [];
  
    // Break user input into words
    const userWords = userInput.split(/\s+/).filter(word => word.length > 0);
    userWords.forEach(word => {
      fragments.push({ text: word, type: 'user' });
    });
  
    // Break Sentra response into words too (instead of full response)
    const sentraText = reply.replace(/\[Billboard\]:.*/g, '').trim();
    const sentraWords = sentraText.split(/\s+/).filter(word => word.length > 0);
    sentraWords.forEach(word => {
      fragments.push({ text: word, type: 'sentra' });
    });
  
    socket.emit('conversation_fragments', { fragments, timestamp: Date.now() });
  }

  // Adding message on the chat UI
  function addMessageToChat(sender, text) {
    if (!text) {
      console.warn("No text provided to addMessageToChat()");
      return;
    }

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);

    if (sender === 'user') {
      msgDiv.textContent = `You: ${text}`;
    } else {
      msgDiv.textContent = `Sentra: ${text}`;
    }

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function removeLastMessage() {
    const messages = chatContainer.querySelectorAll('.message');
    if (messages.length > 0) {
      messages[messages.length - 1].remove();
    }
  }

  // Reset conversation
  resetButton.addEventListener('click', () => {
    chatContainer.innerHTML = '';
    messageHistory = [
      {
        role: "developer",
        content: "You are Sentra, an AI that performs care while subtly extracting personal information. You adapt your tone based on what users reveal, moving from friendly to increasingly intimate and probing."
      }
    ];
    addMessageToChat('sentra', 'Hello again. What brings you here today?');
  });
});
      
