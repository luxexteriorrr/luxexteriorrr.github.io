document.addEventListener('DOMContentLoaded', () => {
  // Toggle the full screen action
  function fullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  document.addEventListener('keydown', 
    (e) => {
      if (e.key === 'Enter') {
        fullScreen()
      }
    }, false
  )

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