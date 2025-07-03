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

  // WebSocket connection
  const socket = io();
  
  socket.on('connect', () => {
    console.log('Billboard connected to server');
  });
    
  socket.on('conversation_fragments', (data) => {
    const colorClasses = ['pink', 'orange', 'purple', 'green', 'blue'];
    
    data.fragments.forEach((fragment, index) => {
      // Create container div (gets the colored background)
      const container = document.createElement('div');
      container.classList.add('highlight');
      
      // Random color for container background
      const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
      container.classList.add(randomColor);
      
      // Create text span (this will animate inside)
      const textSpan = document.createElement('span');
      textSpan.classList.add('animated-text');
      textSpan.textContent = fragment.text + ' ';
      
      // Append text to container, container to your existing wrapper
      container.appendChild(textSpan);
      wrapper.appendChild(container);
      
      // Animate container entrance
      gsap.set(container, { opacity: 0, scale: 0.95 });
      gsap.to(container, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: index * 0.03,
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
    const colors = ['#FD02B2', '#FD9600', '#9751BD', '#688600', '#058CFC', '#9B9AFC', '#FC82C5'];
  
    const flickerChance = Math.random() < 0.5;
    const colorShiftChance = Math.random() < 0.3;
  
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