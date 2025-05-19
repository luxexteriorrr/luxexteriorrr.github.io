document.addEventListener('DOMContentLoaded',() => {
    //toggle the full screen action 
    function fullScreen () {
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

    //p5 sketch initiated 
    new p5((p) => {
        p.setup = function() {
          let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent('poster1wrapper');
          p.clear();
        };
        let trail = [];
        
        function draw() {
          clear();
        
          trail.push({
          x: mouseX,
          y: mouseY,
          color: color(random(255), random(255), random(255))
        });
        
        
          // Limit length
          if (trail.length > 50) {
            trail.shift();
          }
        
          // Draw trail
          for (let i = 1; i < trail.length; i++) {
            let t = trail[i];
            let alpha = map(i, 0, trail.length, 50, 255);
            t.color.setAlpha(alpha);
            fill(t.color);
        
            push();
            translate(t.x, t.y);
            rect(-5, -5, 10, 10);
            pop();
          }
        
        }        
       
      });
      






})