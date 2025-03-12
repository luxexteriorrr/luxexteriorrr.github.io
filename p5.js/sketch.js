document.addEventListener('DOMContentLoaded', () => {
  new p5((p) => {
    p.setup = function () {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(220);
    };

    p.draw = function () {
      p.ellipse(p.mouseX, p.mouseY, 80, 80);
    };
  });
});
