<script>
let baseRadius = 200;
let pulseScale = 1;
let pulseVelocity = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed');
  noStroke();

  // Click to pulse
  window.addEventListener("click", () => {
    pulseVelocity = 0.01;
  });
}

function draw() {
  clear();
  drawingContext.filter = 'blur(100px)';

  let centerX = width / 2;
  let centerY = height / 2;

  // Breathing animation
  let softPulse = map(sin(frameCount * 0.02), -1, 1, 0.95, 1.05);

  // Click pulse
  pulseScale += pulseVelocity;
  pulseVelocity *= 0.85;
  pulseScale = lerp(pulseScale, 1, 0.05);

  let radius = baseRadius * softPulse * pulseScale;

  for (let r = radius; r > 0; r -= 1) {
    let t = r / radius;
    let c = lerpColor(color(255, 255, 255), color(129, 195, 255), t);
    c.setAlpha(80 * (1 - t));
    fill(c);
    ellipse(centerX, centerY, r * 2);
  }

}
</script>

function smoothWordFade() {
  erosionParagraphs.forEach((paragraph, i) => {
    ScrollTrigger.create({
      trigger: paragraph,
      start: "top 85%",
      markers: false,
      once: false,
      onEnter: () => {
        const words = paragraph.textContent.trim().split(" ");

        // Wrap each word in a span
        paragraph.innerHTML = words
          .map(word => `<span class="fade-word">${word} </span>`)
          .join("");

        const wordSpans = paragraph.querySelectorAll(".fade-word");
        const wordIndexes = [...Array(wordSpans.length).keys()];

        // Shuffle word order so fade is randomized
        for (let i = wordIndexes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [wordIndexes[i], wordIndexes[j]] = [wordIndexes[j], wordIndexes[i]];
        }

        // Fade out words one by one every ~3s
      // Fade out words one by one with randomized opacity
      wordIndexes.forEach((index, step) => {
          setTimeout(() => {
          const randomOpacity = (Math.floor(Math.random() * 10) + 1) / 10;
      
          gsap.to(wordSpans[index], {
              opacity: randomOpacity,
              duration: 4,
              ease: "power1.out"
          });
          }, step * 6000); // 6s between each
      });

      }
    });
  });
}
//smoothWordFade();