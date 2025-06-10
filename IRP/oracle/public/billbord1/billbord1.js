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
    





  // p5 sketch with ml5 hand tracking
  new p5((p) => {
    let handPose;
    let video;
    let hands = [];
    let trail = [];
    let videoW = 640;
    let videoH = 480;
    let scaleFactor = 1;

    p.preload = function() {
      handPose = ml5.handPose();
    }

    p.setup = function() {
      let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
      cnv.parent('poster1wrapper');
      p.noStroke();
      p.clear();

      // Setup video
      video = p.createCapture(p.VIDEO);
      video.size(videoW, videoH);
      video.hide();

      // Set scale factor so video height fills canvas height
      scaleFactor = p.height / videoH;

      // Start hand detection
      handPose.detectStart(video, gotHands);
    };

    p.draw = function() {
      p.clear();

      // Calculate video positioning
      let scaledW = videoW * scaleFactor;
      let scaledH = videoH * scaleFactor;
      let videoOffsetX = p.width / 2 - scaledW / 2;
      let videoOffsetY = p.height / 2 - scaledH / 2;

      // Process hand tracking data
      for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        if (hand.keypoints.length > 8) {
          let kp = hand.keypoints[8]; // Index finger tip

          // Map video coordinates to canvas space
          let xInVideo = kp.x * scaleFactor;
          let yInVideo = kp.y * scaleFactor;

          // Flip X (mirrored), and offset to match canvas
          let mappedX = p.width - (videoOffsetX + xInVideo);
          let mappedY = videoOffsetY + yInVideo;

          trail.push({
            x: mappedX,
            y: mappedY,
            color: p.color(p.random(255), p.random(255), p.random(255))
          });

          if (trail.length > 50) trail.shift();
        }
      }

      // Draw the trail
      for (let i = 0; i < trail.length; i++) {
        let t = trail[i];
        let alpha = p.map(i, 0, trail.length, 50, 255);
        t.color.setAlpha(alpha);
        p.fill(t.color);
        p.push();
        p.translate(t.x, t.y);
        p.rect(-5, -5, 10, 10);
        p.pop();
      }

      /* 
      for (let i = receivedFragments.length - 1; i >= 0; i--) {
        let fragment = receivedFragments[i];
        
        // Fade out over time
        let age = Date.now() - fragment.birth;
        fragment.life = p.map(age, 0, 10000, 1, 0); // 10 second fade
        
        if (fragment.life <= 0) {
          receivedFragments.splice(i, 1);
          continue;
        }
        
        // Set color based on type
        if (fragment.type === 'user') {
          p.fill(100, 150, 255, 255 * fragment.life); // Blue for user
        } else {
          p.fill(255, 100, 150, 255 * fragment.life); // Pink for Sentra
        }
        
        // Draw text
        p.textAlign(p.CENTER);
        p.textSize(fragment.size);
        p.text(fragment.text, fragment.x, fragment.y);
      }  */
    };

    // Callback for hand detection
    function gotHands(results) {
      hands = results;
    }

    // Handle window resize
    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      scaleFactor = p.height / videoH;
    }

  });
});