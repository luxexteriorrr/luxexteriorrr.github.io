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

  
  // WebSocket connection
  const socket = io();
  
  socket.on('connect', () => {
    console.log('Billboard connected to server');
  });
    
  socket.on('conversation_fragments', (data) => {
    const wrapper = document.querySelector('.words-wrapper');
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

  //animations
  function startTextAnimations(textSpan) {
    const animationChance = Math.random() < 0.8;
    const marqueeChance = Math.random() < 0.2;
    
    if (marqueeChance) {
      const container = textSpan.parentElement;
      container.style.overflow = 'visible';
      
      const marqueeType = Math.floor(Math.random() * 2) + 1;
      const marqueeDuration = 3; // SLOWER: 5 seconds instead of 2
      
      switch(marqueeType) {
        case 1: // Horizontal left to right
          gsap.fromTo(textSpan,
            { x: -container.offsetWidth - 1 },
            {
              x: window.innerWidth + 1,
              duration: marqueeDuration,
              repeat: -1,
              ease: "none",
              repeatRefresh: true
            }
          );
          break;
          
        case 2: // Vertical top to bottom
          gsap.fromTo(textSpan,
            { y: -container.offsetHeight - 1 },
            {
              y: window.innerHeight + 1,
              duration: marqueeDuration,
              repeat: -1,
              ease: "none",
              repeatRefresh: true
            }
          );
          break;
      }
    } else if (animationChance) {
      const animationType = Math.floor(Math.random() * 2) + 1;
      const animationDuration = randomRange(1000, 2000) / 1000; // SLOWER: 2-4 seconds
      
      switch(animationType) {
        case 1: // Opacity flicker
          gsap.to(textSpan, {
            opacity: 0.5, // More visible minimum opacity
            duration: animationDuration,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
          });
          break;
          
        case 2: // Background color shift (more prominent)
          const container = textSpan.parentElement;
          const colors = ['#FD02B2', '#FD9600', '#9751BD', '#688600', '#058CFC']; // All your colors
          
          // Animate the container background instead of text color
          gsap.to(container, {
            backgroundColor: () => colors[Math.floor(Math.random() * colors.length)],
            duration: animationDuration,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            onRepeat: function() {
              // Pick a new random color on each repeat
              gsap.set(this.targets()[0], {
                backgroundColor: colors[Math.floor(Math.random() * colors.length)]
              });
            }
          });
          break;
      }
    }
    
  
  }

  
  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  
    

});