document.fonts.ready.then(() => {
  // Toggle the full screen action
  function fullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
  //full screen handling 
  document.addEventListener('keydown', 
    (e) => {
      if (e.key === 'Enter') {
        fullScreen()
      }
    }, false
  )
  
  //global selectors
  const wrapper = document.querySelector('.words-wrapper');

  // All nine from the Figma palette. This list and the `colors` array in
  // startTextAnimations used to disagree — blocks were drawn from five classes
  // while the colour shift picked from seven hexes, so two colours could only
  // ever appear on something that happened to be animating.
  const colorClasses = ['pink', 'orange', 'purple', 'green', 'blue',
                        'darkblue', 'lilac', 'peachy', 'yellow'];

  // Picked at random, but never the colour immediately before it. Uniform
  // random over nine puts a repeat next to itself often enough to read as a
  // mistake — roughly a one-in-three chance somewhere in four blocks — and two
  // touching blocks of one colour merge into a single shape, which loses the
  // turn boundary the whole layout exists to show.
  let lastColor = null;
  function nextColor() {
    const choices = colorClasses.filter(c => c !== lastColor);
    lastColor = choices[Math.floor(Math.random() * choices.length)];
    return lastColor;
  }

  // The wall holds still. Both of the ambient animations are off: blocks arrive
  // and then stay exactly as they are, which is what the boards do.
  //
  // Both were written when every word was its own box, where a single word
  // dimming or shifting hue read as the system losing its grip on that word for
  // a moment. Applied to a whole utterance the same code reads as a broken
  // render — a paragraph does not flicker, a screen does. The movement that is
  // left is the arrival itself, which is the only movement that means anything:
  // something was just said, and it has just been filed.
  //
  // Kept behind flags rather than deleted, so either can be looked at again
  // without a rebuild:
  //   ?flicker=1   whole-block opacity pulse
  //   ?drift=1     background colour drift
  const params = new URLSearchParams(location.search);
  const FLICKER = params.get('flicker') === '1';
  const DRIFT   = params.get('drift') === '1';

  // WebSocket connection
  const socket = io();
  
  socket.on('connect', () => {
    console.log('Billboard connected to server');
  });
    
  socket.on('conversation_fragments', (data) => {

    // One block per utterance, not per word. The fragments arrive already
    // tagged 'user' or 'sentra', so consecutive fragments of the same type are
    // one thing somebody said and get gathered back into it.
    //
    // Per word, the wall read as a texture of language with no speakers in it.
    // Per utterance, you can see the shape of the exchange — how short the
    // human turns are and how long Sentra's answers run — which is the
    // argument the piece is making.
    const utterances = [];
    for (const fragment of data.fragments) {
      const current = utterances[utterances.length - 1];
      if (current && current.type === fragment.type) current.words.push(fragment.text);
      else utterances.push({ type: fragment.type, words: [fragment.text] });
    }

    utterances.forEach((utterance, index) => {
      const container = document.createElement('div');
      container.classList.add('highlight', utterance.type);

      container.classList.add(nextColor());

      const textSpan = document.createElement('span');
      textSpan.classList.add('animated-text');
      textSpan.textContent = utterance.words.join(' ');

      container.appendChild(textSpan);
      wrapper.appendChild(container);

      // Stagger by utterance now. At 0.03 per word a long reply took seconds
      // to finish arriving; there are only ever a couple of blocks per round,
      // so they can afford to be slower and land more deliberately.
      gsap.set(container, { opacity: 0, scale: 0.95 });
      gsap.to(container, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: index * 0.18,
        ease: "power2.out",
        onComplete: () => {
          startTextAnimations(textSpan);
        }
      });
    });
    
    // ADD THIS HERE - after all fragments are processed:
    wrapper.scrollTo({
      top: wrapper.scrollHeight,
      behavior: 'smooth'
    });
  });
  

  function startTextAnimations(textSpan) {
    const container = textSpan.parentElement;
    // The same nine the blocks are drawn from, so a word that shifts can only
    // shift into a colour the wall already contains. This was seven before and
    // omitted dark blue and yellow.
    const colors = ['#FD02B2', '#FD9600', '#9751BD', '#688600', '#058CFC',
                    '#003397', '#9B9AFC', '#FC82C5', '#D8FD28'];
  
    // Flicker was written when every word was its own box: one word dimming
    // reads as the system momentarily losing its grip on that word. A whole
    // paragraph doing it reads as a broken render. Off unless asked for.
    const flickerChance = FLICKER && Math.random() < 0.5;
    const colorShiftChance = DRIFT && Math.random() < 0.3;

    const opacityDuration = randomRange(1500, 4000) / 1000;
    const colorDuration = randomRange(4000, 8000) / 1000;

    // Subtle opacity flicker on text itself
    if (flickerChance) {
      gsap.to(textSpan, {
        opacity: 0.5,               // Less drastic, barely flickers
        duration: opacityDuration,
        repeat: -1,
        yoyo: false,
        ease: "sine.inOut"
      });
    }
  
    // Background color shift on parent container
    if (colorShiftChance) {
      gsap.to(container, {
        backgroundColor: () => colors[Math.floor(Math.random() * colors.length)],
        duration: colorDuration,
        repeat: -1,
        yoyo: false,
        ease: "power2.inOut",
        onRepeat: function () {
          gsap.set(this.targets()[0], {
            backgroundColor: colors[Math.floor(Math.random() * colors.length)]
          });
        }
      });
    }
  }
  
  
  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }


  socket.on('new_user_started', () => {
    console.log('Resetting billboard for new user');
    clearBillboard();
  });

  // Clear billboard function
  function clearBillboard() {
    console.log('Clearing billboard with reverse animation...');
    const allHighlights = wrapper.querySelectorAll('.highlight');
    
    // Adjust stagger based on how many elements
    const staggerDelay = Math.min(0.03, 1 / allHighlights.length); // Max 1 second total
    
    gsap.to(allHighlights, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4, // Faster individual animation
      stagger: {
        each: staggerDelay,
        from: "start"
      },
      ease: "power2.in",
      onComplete: () => {
        wrapper.innerHTML = '';
        gsap.killTweensOf("*");
      }
    });
  }
  
  // Optional: see all socket messages coming in
  socket.onAny((event, ...args) => {
    console.log(`Billboard received event: ${event}`, args);
  });
  
    

});