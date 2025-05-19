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
        let trail = [];
      
        p.setup = function () {
          let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent('poster1wrapper');
          p.noStroke();
          p.clear();
        };
      
        p.draw = function () {
          p.clear();
      
          trail.push({
            x: p.mouseX,
            y: p.mouseY,
            color: p.color(p.random(255), p.random(255), p.random(255))
          });
      
          if (trail.length > 50) trail.shift();
      
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
      });
      

      
      






})