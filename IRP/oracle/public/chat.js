document.addEventListener("DOMContentLoaded", () => {
  // Selectors
  const input = document.getElementById('SystemInput');
  const submitbutton = document.getElementById('systemsubmit');
  const chatContainer = document.querySelector('.chat-container');
  const form = document.getElementById('mainform');
  const proceed = document.getElementById('proceed')
  const onboarding = document.querySelector('.OnboardingWrapper')
  const chatWrapper = document.querySelector('.ChatWrapper')

  proceed.addEventListener('click', () => {
    onboarding.style.display = 'none'
    chatWrapper.style.display = 'flex'
  })


  // socket handling
  const socket = io();
  socket.on('connect', () => {
    console.log('🔌 Connected to WebSocket!');
  });





  // Chat history - v3 system prompt
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

    // trimm input
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

      // Send fragments after reply is available
      sendFragmentsToBillboard(userInput, reply);

    } catch (error) {
      console.error("Error in fetch:", error);
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
    msgDiv.classList.add('message', sender); // Adds both 'message' and 'user' or 'sentra'
  
    // --- Time stamp
    const timeStamp = document.createElement('h6');
    timeStamp.classList.add('timeStamp');
    const now = new Date();
    timeStamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    // --- Sender square block (color-coded manually)
    const messageBlock = document.createElement('div');
    messageBlock.classList.add('messageBlock');
    messageBlock.style.backgroundColor = sender === 'user' ? '#9751BD' : '#FFA500';
  
    // --- Message content
    const messageDetails = document.createElement('div');
    messageDetails.classList.add('messageDetails');
  
    const senderID = document.createElement('h6');
    senderID.classList.add('senderID');
    senderID.textContent = sender === 'user' ? 'You' : 'Sentra';
  
    const messageContent = document.createElement('h6');
    messageContent.classList.add('messageContent');
    messageContent.textContent = text;
  
    messageDetails.appendChild(senderID);
    messageDetails.appendChild(messageContent);
  
    // --- Assemble message
    msgDiv.appendChild(timeStamp);
    msgDiv.appendChild(messageBlock);
    msgDiv.appendChild(messageDetails);
  
    // --- Add to chat container
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  
  

  function removeLastMessage() {
    const messages = chatContainer.querySelectorAll('.message');
    if (messages.length > 0) {
      messages[messages.length - 1].remove();
    }
  }

    /// Reset conversation after inactivity (iPhone-focused)
    let idleTimeout;

    function resetInactivityTimer() {
      const chatWrapper = document.querySelector('.ChatWrapper');
      const isVisible = chatWrapper && window.getComputedStyle(chatWrapper).display !== 'none';
    
      if (!isVisible) return;
    
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        console.log("iPhone idle for 3 minutes — show idle screen");
        showIdleMessage();
        socket.emit('reset_conversation_for_new_user');
      }, 60000); // 3 minutes
    }
    
    // More comprehensive event listeners for iPhone
    ['touchstart', 'touchend', 'touchmove', 'scroll', 'click', 'input', 'focus'].forEach(evt =>
      window.addEventListener(evt, resetInactivityTimer)
    );
    
    // Also reset on message submission
    const submitButton = document.getElementById('SystemSubmit');
    submitButton.addEventListener('click', () => {
      resetInactivityTimer();
    });
    
  function showIdleMessage() {
    const overlay = document.getElementById('idleOverlay');
    overlay.classList.remove('hidden');
  }
  
  document.getElementById('resetButton').addEventListener('click', () => {
    location.reload(); // Hard reset for new user
  });

  proceed.addEventListener('click', () => {
    socket.emit('new_user_started');
    console.log('new user')
  });


  const continueButton = document.getElementById('continueButton');
  const resetButton = document.getElementById('resetButton');
  const idleOverlay = document.querySelector('.idle-overlay'); // assuming this is the overlay container

  // CONTINUE OLD CHAT
  continueButton.addEventListener('click', () => {
    idleOverlay.classList.add('hidden');       // Hide overlay
    resetInactivityTimer();                    // Restart idle timer
    console.log('User chose to continue old conversation');
  });

  // RESET / NEW CHAT
  resetButton.addEventListener('click', () => {
    console.log('User chose to start a new conversation');
    window.location.reload(); // Hard reset
  });


  //info overlay
  const infoLink = document.getElementById('infoLink');
  const closeInfo = document.getElementById('closeInfo');
  const infoOverlay = document.querySelector('.infoOverlay'); // or whatever the overlay's ID is

  infoLink.addEventListener('click', () => {
    infoOverlay.classList.remove('hidden');
  });

  closeInfo.addEventListener('click', () => {
    infoOverlay.classList.add('hidden');
  });


  const nav = document.querySelector('.Nav');

  // Function to hide nav when onboarding is visible
  function toggleNavVisibility() {
    if (!onboarding.classList.contains('hidden')) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
  }

  // Run on page load
  toggleNavVisibility();

  // Also re-run after onboarding is hidden (e.g. after clicking "proceed"
  proceed.addEventListener('click', () => {
    onboarding.classList.add('hidden');
    toggleNavVisibility(); // show nav again
  });


  
  




});
      
