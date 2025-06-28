document.addEventListener('DOMContentLoaded', () => {
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
  
  //random animations 
  function startTextAnimations(textSpan) {
    //chance-based system
    const animationChance = Math.random() < 0.08; // Their chance(0.08)
    const marqueeChance = Math.random() < 0.2;    // Their chance(0.2)
    
    if (marqueeChance) {
      // marquee system (4 types)
      const marqueeType = Math.floor(Math.random() * 4) + 1;
      const marqueeDuration = randomRange(1500, 4000); // range
      
      switch(marqueeType) {
        case 1: // Horizontal left to right
          gsap.set(textSpan, { x: -200 });
          gsap.to(textSpan, { x: 200, duration: marqueeDuration/1000, repeat: -1, ease: "none" });
          break;
        case 2: // Horizontal right to left (faster)
          gsap.set(textSpan, { x: -200 });
          gsap.to(textSpan, { x: 200, duration: (marqueeDuration/2)/1000, repeat: -1, ease: "none" });
          break;
        case 3: // Vertical top to bottom
          gsap.set(textSpan, { y: -50 });
          gsap.to(textSpan, { y: 50, duration: marqueeDuration/1000, repeat: -1, ease: "none" });
          break;
        case 4: // Vertical bottom to top
          gsap.set(textSpan, { y: -50 });
          gsap.to(textSpan, { y: 50, duration: marqueeDuration/1000, repeat: -1, ease: "none" });
          break;
      }
    } else if (animationChance) {
      // Their animation system (5 types)
      const animationType = Math.floor(Math.random() * 5) + 1;
      const animationDuration = randomRange(600, 2400); // Their range
      
      switch(animationType) {
        case 1: // Scale pulse
          gsap.to(textSpan, { scale: 1.2, duration: animationDuration/1000/2, repeat: -1, yoyo: true });
          break;
        case 3: // Opacity flicker
          gsap.to(textSpan, { opacity: 0.3, duration: animationDuration/1000/2, repeat: -1, yoyo: true });
          break;
        case 4: // Skew
          gsap.to(textSpan, { skewX: 15, duration: animationDuration/1000/2, repeat: -1, yoyo: true });
          break;
        case 5: // Color shift (if you have multiple colors)
          gsap.to(textSpan, { color: "#ff0000", duration: animationDuration/1000/2, repeat: -1, yoyo: true });
          break;
      }
    }
    
    // Add their glitch system
    addGlitchEffects(textSpan);
  }
  
  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  function addGlitchEffects(textSpan) {
    // Their glitch system with chance(0.005)
    setInterval(() => {
      if (Math.random() < 0.005) {
        // Random background color change
        const colors = ['#FD02B2', '#FD9600', '#9751BD', '#688600', '#058CFC'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        gsap.to(textSpan.parentElement, { backgroundColor: randomColor, duration: 0.1 });
      }
    }, 100);
  }
    

});