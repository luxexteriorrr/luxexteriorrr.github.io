document.addEventListener("DOMContentLoaded", () => {
    //selectors
    const input = document.getElementById('SystemInput');
    const submitbutton = document.getElementById('systemsubmit'); // optional
    const chatContainer = document.querySelector('.chat-container');
    const form = document.getElementById('mainform');
    const resetButton = document.getElementById('resetButton'); // his line    

    //chat history 
    let messageHistory = [
        {
            role: 'system',
            content: 'You are Oracle, a friendly chatbot',
        }
    ];

    //hadnle the form submission 
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
        addMessageToChat('oracle', 'Oracle™ is thinking…');
      
        // API call
        try {
          const res = await fetch('/oracle', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: userInput })
          });
      
          const data = await res.json();
          const reply = data.output.trim();
          console.log("response data:", data);
          console.log("reply:", reply);
      
          // Remove placeholder
          removeLastMessage();
      
          // Add Oracle reply
          addMessageToChat('oracle', reply);
          messageHistory.push({ role: 'system', content: reply });
      
        } catch (error) {
          console.error("❌ Error in fetch:", error);
          removeLastMessage();
          addMessageToChat('oracle', 'Oracle™ encountered a disturbance and cannot speak.');
        }
      });
      

    function addMessageToChat(sender, text) {
        if (!text) {
          console.warn("❗ No text provided to addMessageToChat()");
          return;
        }
      
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.textContent = sender === 'user' ? `You: ${text}` : `Oracle™: ${text}`;
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
      
    function removeLastMessage() {
        const messages = chatContainer.querySelectorAll('.message');
        if (messages.length > 0) {
          messages[messages.length - 1].remove();
        }
    };
    resetButton.addEventListener('click', () => {
        chatContainer.innerHTML = '';
        messageHistory = [
          {
            role: "system",
            content: "You are Oracle™, a cryptic branding AI..."
          }
        ];
        addMessageToChat('oracle', 'The past fades. A new seeker arrives.');
      });
      

})
      
