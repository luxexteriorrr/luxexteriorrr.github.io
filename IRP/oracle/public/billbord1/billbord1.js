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
    console.log('💬 Received fragments:', data);
    
    const wrapper = document.querySelector('.words-wrapper');
    const colorClasses = ['pink', 'orange', 'purple', 'green', 'blue'];

    data.fragments.forEach(fragment => {
      const span = document.createElement('h1');
      span.classList.add('highlight');

      // Assign random color class
      const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
      span.classList.add(randomColor);

      span.textContent = fragment.text;
      wrapper.appendChild(span);
    });
  });

    





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