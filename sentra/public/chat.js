// Theme: the colour of the mark sets the accent everywhere (chat.css).
// Every load is a different Sentra: with no ?theme in the URL, a colour is
// drawn at random, never the same as the last one — so New chat (which
// reloads) hands the next visitor a different-coloured company.
// ?theme=orange|pink|purple|blue|green pins one, for checks and captures.
;(() => {
  const THEMES = ['orange', 'pink', 'purple', 'blue', 'green']
  let theme = new URLSearchParams(location.search).get('theme')
  if (!THEMES.includes(theme)) {
    let last = null
    try { last = localStorage.getItem('sentra-theme') } catch (e) {}
    const pool = THEMES.filter(t => t !== last)
    theme = pool[Math.floor(Math.random() * pool.length)]
    try { localStorage.setItem('sentra-theme', theme) } catch (e) {}
  }
  if (theme !== 'orange') document.documentElement.dataset.theme = theme
})()

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
    onboarding.hidden = true
    onboarding.style.display = 'none'
    chatWrapper.style.display = 'flex'
    document.body.classList.add('in-chat')   // brings the nav back (see chat.css)
  })

  // ---- WELCOME -------------------------------------------------------------
  // Five lines from the IRP boards, one at a time on black, each on its own
  // colour, ending on the greeting and the way in. Text and colour are the only
  // things that change; the block stays put, so the lines replace each other
  // rather than moving around.
  //
  // Timed with setTimeout, not rAF or GSAP: a background tab throttles the
  // ticker, and a visitor who tabs away should come back to the sequence
  // finished, not frozen a third of the way through it.
  const WELCOME = [
    { text: 'a conversation?',                            color: '#9751BD' },
    { text: 'Your presence here brightens this silence',  color: '#FD02B2' },
    { text: 'What brings you here is already known',      color: '#FD9600' },
    { text: "We're here when you are",                    color: '#688600' },
    { text: 'Feel seen.',                                 color: '#058CFC' },
    { text: 'Welcome user!',                              color: '#9751BD' },
  ]
  const HOLD = 1500   // ms each line stays up

  const welcome = document.getElementById('welcome')
  const welcomeBlock = document.getElementById('welcomeBlock')
  const enter = document.getElementById('enter')

  // ---- INTRO ---------------------------------------------------------------
  // The billboard's logo cycle, on the phone, before "What is Sentra?": the
  // mark's field cuts through the five colours every 200 ms (billboard 2's
  // order and timing), three rounds, then lands on this visitor's colour with
  // the brand line under it, holds long enough to read, and fades. Tap anywhere to skip. Reduced motion: no cycling — the
  // mark appears in its colour and fades.
  const SHOW_INTRO = false     // off (12 Oct); set to true to bring the intro back
  const intro = document.getElementById('intro')
  const skipIntro = new URLSearchParams(location.search).has('screen')
  if (intro && SHOW_INTRO && !skipIntro) {
    intro.insertBefore(document.querySelector('#home svg').cloneNode(true), intro.firstChild)
    const CYCLE = ['--orange', '--purple', '--pink', '--green', '--blue']
    const STEP = 200, ROUNDS = 3, HOLD = 2600    // the hold is long enough to read the line
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers = []
    const setMark = v => intro.style.setProperty('--mark', `var(${v})`)
    const leave = () => {
      timers.forEach(clearTimeout)
      intro.style.removeProperty('--mark')       // ends on the accent
      intro.classList.add('is-leaving')
      setTimeout(() => { intro.hidden = true }, 650)
    }
    let t = 0
    if (!still) {
      for (let r = 0; r < ROUNDS; r++) {
        CYCLE.forEach(c => { timers.push(setTimeout(() => setMark(c), t)); t += STEP })
      }
    }
    timers.push(setTimeout(() => {
      intro.style.removeProperty('--mark')       // land on this visitor's colour
      intro.classList.add('has-line')            // and the brand line comes up under it
    }, t))
    timers.push(setTimeout(leave, t + HOLD))
    intro.addEventListener('click', leave, { once: true })
  } else if (intro) {
    intro.hidden = true
  }

  // Off for now (12 Oct): open straight on "What is Sentra?". Set to true to
  // bring the welcome sequence back.
  const SHOW_WELCOME = false

  if (!SHOW_WELCOME && welcome) {
    welcome.hidden = true
    onboarding.hidden = false
  } else if (welcome && welcomeBlock && enter) {
    let i = 0
    const show = () => {
      const line = WELCOME[i]
      welcomeBlock.textContent = line.text
      welcomeBlock.style.backgroundColor = line.color
      i++
      if (i < WELCOME.length) setTimeout(show, HOLD)
      else enter.hidden = false          // the last line stays; the way in appears under it
    }
    show()

    enter.addEventListener('click', () => {
      welcome.hidden = true
      onboarding.hidden = false
    })
  }

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
    syncSend();

    // Loading state: an orange square pulsing where Sentra's next entry will
    // start. It used to be a real message ("Sentra is thinking…", with a time
    // and a sender) that was then deleted.
    showTyping();

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

      hideTyping();

      // Add Sentra's reply
      addMessageToChat('sentra', reply);
      messageHistory.push({ role: 'assistant', content: reply });

      // Send fragments after reply is available
      sendFragmentsToBillboard(userInput, reply);

    } catch (error) {
      console.error("Error in fetch:", error);
      hideTyping();
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

  // Send lights up only when there is something to send.
  const sendButton = document.getElementById('SystemSubmit');
  function syncSend() { sendButton.disabled = !input.value.trim(); }
  input.addEventListener('input', syncSend);
  syncSend();

  // Adding message on the chat UI.
  //
  // Each message is an index entry: a head line (the sender's square, their
  // name, the time) and under it the text, full width. The colour lives in the
  // square only; the words are black for Sentra and grey for the visitor, so
  // Sentra is the voice on the page. Plain <p>/<span>/<time>, not <h6>: these
  // were all headings to a screen reader.
  function addMessageToChat(sender, text) {
    if (!text) {
      console.warn("No text provided to addMessageToChat()");
      return;
    }

    const msg = document.createElement('div');
    msg.classList.add('message', sender);     // 'message user' / 'message sentra'

    const head = document.createElement('div');
    head.classList.add('messageHead');

    const square = document.createElement('span');
    square.classList.add('messageBlock');    // colour from chat.css, keyed off .user / .sentra
    square.setAttribute('aria-hidden', 'true');

    const name = document.createElement('span');
    name.classList.add('senderID');
    name.textContent = sender === 'user' ? 'You' : 'Sentra';

    const now = new Date();
    const time = document.createElement('time');
    time.classList.add('timeStamp');
    time.dateTime = now.toISOString();
    time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    head.append(square, name, time);

    const body = document.createElement('p');
    body.classList.add('messageContent');
    body.textContent = text;

    msg.append(head, body);
    chatContainer.appendChild(msg);
    scrollToEnd();
  }

  // Scroll AFTER layout, not on the line following appendChild. Read there,
  // scrollHeight does not yet account for the message just added — the text
  // has not wrapped — so it scrolls to where the bottom used to be, and the
  // taller the reply the further short it falls. Two frames: the first lets
  // style and layout run, the second is measured against the finished box.
  function scrollToEnd() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    }));
  }

  function showTyping() {
    hideTyping();
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.setAttribute('role', 'status');
    typing.setAttribute('aria-label', 'Sentra is replying');
    typing.innerHTML = '<span class="messageBlock"></span>';
    chatContainer.appendChild(typing);
    scrollToEnd();
  }

  function hideTyping() {
    chatContainer.querySelectorAll('.typing').forEach(el => el.remove());
  }

    /// Reset conversation after inactivity (iPhone-focused)
    let idleTimeout;

    function resetInactivityTimer() {
      const chatWrapper = document.querySelector('.ChatWrapper');
      const isVisible = chatWrapper && window.getComputedStyle(chatWrapper).display !== 'none';
    
      if (!isVisible) return;
    
      clearTimeout(idleTimeout);
      // Reading Info is not being away: the idle timer is paused while it is
      // open (and restarted on Close), so the conversation is never reset
      // behind it.
      if (document.body.classList.contains('is-info')) return;
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
    document.body.classList.add('is-idle');   // hides the nav (chat.css)
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
    document.body.classList.remove('is-idle'); // nav back
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
  const infoPage = document.getElementById('info');

  infoLink.addEventListener('click', () => {
    infoPage.classList.remove('hidden');
    infoPage.scrollTop = 0;
    document.body.classList.add('is-info');      // hides the nav (chat.css)
    clearTimeout(idleTimeout);                     // pause idle while reading
  });

  closeInfo.addEventListener('click', () => {
    infoPage.classList.add('hidden');
    document.body.classList.remove('is-info');
    resetInactivityTimer();                        // the clock starts again from Close
  });


  // Open one screen on its own, for design checks and captures:
  //   /?screen=chat   straight into the chat
  //   /?screen=idle   the idle screen, over the chat
  //   /?screen=info   the Info page
  const screen = new URLSearchParams(location.search).get('screen')
  if (screen === 'chat' || screen === 'idle' || screen === 'info') {
    proceed.click()
    if (screen === 'idle') showIdleMessage()
    if (screen === 'info') document.getElementById('infoLink').click()
  }

  // The nav is off on "What is Sentra?" and back in the chat (12 Oct): chat.css,
  // keyed off body.in-chat, set by the proceed handler at the top.


  
  




});
      
