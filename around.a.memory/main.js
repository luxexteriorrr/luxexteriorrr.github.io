document.addEventListener('DOMContentLoaded', () => {
    // gsap register
    gsap.registerPlugin(ScrollTrigger,TextPlugin,DrawSVGPlugin)

    //full screen 
    document.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Enter") {
            toggleFullScreen();
          }
        },
        false,
      );
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }

    //selectors
    const nav = document.getElementById('nav')
    const overlay1 = document.querySelector('.projectoverlay');
    const title = document.getElementById('title');
    const about = document.getElementById('about');
    const print = document.getElementById('print');
    const navLinks = document.querySelectorAll('nav a'); 
    const paragraphs2 = document.querySelectorAll('#two p');
    const pageWrapper = document.querySelector('.pagewrapper')
    const enter = document.querySelector('#enter')
    const erosionParagraphs = document.querySelectorAll(".erosion");
    const sectionTwo = document.querySelector('#two')
    
    //disapearing of the contenet 
    function disappearContent () {
        let inactivityTimer ; 
        let visibleElements = new Set(); // Track elements currently in the viewport with the class decay
        let isFadingOut = false; // Track if fade-out is happening
        //lookout for the events on the page and reset the timer 
        ["scroll", "mousedown", "mousemove", "keypress", "touchstart"].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });
        //track the visible elements of the page
        function observeElements() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.classList.contains("decay")) {
                        visibleElements.add(entry.target);
                    } else {
                        visibleElements.delete(entry.target);
                    }
                });
                console.log("in viewport", Array.from(visibleElements));
            }, { threshold: 0.1 });
        
            // Observe only `.decay` elements
            document.querySelectorAll(".decay").forEach(el => observer.observe(el));
        }   
        //resetting the timer + fade back in
        function resetTimer() {
            clearTimeout(inactivityTimer);
            console.log('reset time main');
        
            // If fading out, stop it functio and fade in()
            if (isFadingOut) {
                console.log("activity");
                isFadingOut = false; // stop fade out if there is user interaction
            }
        
            fadeInVisibleElements(); // Restore elements
        
            inactivityTimer = setTimeout(triggerFade, 5000); // Restart inactivity timer 
        }
        //trigger fade on no activity
        function triggerFade() {
            console.log("fade");
            isFadingOut = true
            fadeOutVisibleElements();
        }
        //fade out function
        function fadeOutVisibleElements() {
            const elementsArray = Array.from(visibleElements); // Convert Set to Array
            gsap.utils.shuffle(elementsArray);
            
            let index = 0; // Start index
        
            function fadeNextElement() {
                if (index >= elementsArray.length || !isFadingOut) return; // Stop when all elements are faded
        
                let el = elementsArray[index]; // Get current element
                //let randomDuration = gsap.utils.random(1, 3); // Random fade duration (1-3s)
                
                gsap.to(el, { 
                    opacity: 0, 
                    duration: 1, 
                    ease: "linear",
                    onComplete: () => {
                        index++; // Move to next element
                        fadeNextElement(); // Call function recursively
                    },
                    delay: 1,
                });
            }
        
            fadeNextElement(); // Start the first fade
        }
        //fade in function
        function fadeInVisibleElements() {
            const elementsArray = Array.from(visibleElements);
            let index = 0;
        
            function fadeNextElement() {
                if (index >= elementsArray.length) return;
        
                let el = elementsArray[index];
                //let randomDuration = gsap.utils.random(1, 2);
        
                gsap.to(el, { 
                    opacity: 1, 
                    duration: 0.5, 
                    ease: "linear",
                    onComplete: () => {
                        index++; 
                        fadeNextElement(); 
                    }
                });
            }
        
            fadeNextElement();
        }
        observeElements();
        resetTimer();

    }



    // ALL OF THE ABOVE KEEP OUTSIDE OF MEDIA QUERY -------------- !important





    //disable scroll
    function disableScroll() {document.body.style.overflow = "hidden";}
    //enable scroll
    function enableScroll() { document.body.style.overflow = "auto";}
    //increase opacity of the nav links
    function showNav() {
        // Then animate nav links in
        gsap.to("nav a", {
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "linear"
        });
    }
    //decrease opacity of the navlinks
    function hideNav() {
        // Animate nav links out
        gsap.to("nav a", {
          opacity: 0,
          duration: 1,
          stagger: {
            each: 0.05,
            from: "end" // optional: fade out in reverse order
          },
          ease: "linear",
        });
    }
      
    
    // Initial state on page load
    //hideNav();
    //disableScroll();

    // Flashing animation for #enter before click
    gsap.to("#enter", {
        opacity: 0.5,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    }); 

    enter.addEventListener('click', () => {
        const loadingText = document.getElementById('loadingtext');

        let progress = 0;
        const fakeDuration = 5000; // Match duration of loading bar (5s)
        const intervalTime = 30;
        const steps = fakeDuration / intervalTime;

        const tl = gsap.timeline();

        tl.to('#enter', {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                document.getElementById('enter').style.display = 'none';
            }
        })

        .fromTo('#loadingtext', { opacity: 0 }, {
            opacity: 1,
            duration: 1
        })

        .add(() => {
            // Start fake loading % count here
            const interval = setInterval(() => {
                progress += 100 / steps;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                loadingText.textContent = `${Math.floor(progress)}%`;
            }, intervalTime);
        }, "+=0") // start alongside bar animation

        .fromTo('#loadingdiv', { width: '0%' }, {
            width: '100%',
            duration: 5,
        }, "<") // start at same time as add()

        .to('#loadingdiv', {
            height: '0px',
            duration: 1
        })

        .to('#loadingtext', {
            opacity: 0,
            duration: 0.5
        })

        .to('#maintitle', {
            opacity: 1,
            duration: 3
        })

        .to('#maintitle', {
            opacity: 0.05,
            duration: 3
        })

        .call(() => {
            showNav();
            enableScroll();
            disappearContent ();
        });
    });
    showNav()
    document.querySelector('#loadingdiv').style.display = 'none'

    function wordspacing() {
        paragraphs2.forEach(paragraph => {
          ScrollTrigger.create({
            trigger: paragraph,
            start: "top 50%",
            toggleActions: "play play resume resume",
            once: false,
            markers: false, // ✅ Turn on debug markers
            onEnter: () => {
              const randomWidth = Math.floor(Math.random() * (65 - 45 + 1)) + 45;
              gsap.to(paragraph, {
                width: `${randomWidth}%`,
                /*marginRight: '0',*/
                duration: 20,
                ease: 'linear'
              });
            }
          });
        });
      }
    wordspacing();
 

    function smoothErodeText() {
      const ero2 = document.querySelectorAll(".ero2");
    
      ero2.forEach((paragraph) => {
        ScrollTrigger.create({
          trigger: paragraph,
          start: "top 85%",
          markers: false,
          once: false,
          onEnter: () => {
            const delay = 6000;
            const style = "block";
    
            const words = paragraph.textContent.trim().split(" ");
    
            // Wrap words in spans
            paragraph.innerHTML = words
              .map(word => `<span class="erode-word">${word} </span>`)
              .join("");
    
            const wordSpans = paragraph.querySelectorAll(".erode-word");
            const wordIndexes = [...Array(wordSpans.length).keys()];
    
            // Shuffle the order
            for (let i = wordIndexes.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [wordIndexes[i], wordIndexes[j]] = [wordIndexes[j], wordIndexes[i]];
            }
    
            // Replace one word at a time
            wordIndexes.forEach((index, step) => {
              setTimeout(() => {
                const span = wordSpans[index];
                let replacement = "";
    
                switch (style) {
                  case "block":
                    replacement = "█".repeat(span.textContent.trim().length);
                    break;
                  case "blank":
                    replacement = " ".repeat(span.textContent.trim().length);
                    break;
                  case "flicker":
                    replacement = (Math.random() > 0.5) ? "▚▞▛" : " ";
                    break;
                  default:
                    replacement = "█";
                }
    
                span.textContent = replacement;
              }, step * delay);
            });
          }
        });
      });
    }
    smoothErodeText();
    

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
              wordIndexes.forEach((index, step) => {
                setTimeout(() => {
                  gsap.to(wordSpans[index], {
                    opacity: 0,
                    duration: 1,
                    ease: "power1.out"
                  });
                }, step * 2000); // 2s between each
              });
            }
          });
        });
    }
    smoothWordFade();
      
    //overlay
    function toggleOverlay(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) {
            console.error(`Overlay with ID '${overlayId}' not found.`);
            return;
        }
    
        const isActive = overlay.classList.toggle("active"); // Toggle 'active' class
    }
    
    // ✅ Event listener for opening overlays (Uses `data-overlay` attributes)
    document.querySelectorAll("[data-overlay]").forEach(trigger => {
        trigger.addEventListener("click", function () {
            const overlayId = this.getAttribute("data-overlay"); // Get the overlay ID from the clicked element
            toggleOverlay(overlayId);
        });
    });
    
    // ✅ Event listener for closing overlays (Delegated)
    document.addEventListener("click", function (event) {
        if (event.target.matches("#closebutton")) {
            const overlay = event.target.closest(".overlay"); // Find closest overlay to the clicked close button
            if (overlay) {
                toggleOverlay(overlay.id);
            }
        }
    });
    
    // drawing svg 1
    gsap.fromTo("#elipseOne", 
        { drawSVG: "0%" }, 
        { 
        drawSVG: "100%",
        scrollTrigger: {
            trigger: "#one",
            start: "top center",
            end: "bottom center",
            scrub: true,
            markers: false // Show start/end markers
        },
        ease: "linear"
        }
    );
    // drawing svg 2
    gsap.fromTo("#elipseTwo", 
        { drawSVG: "0%" }, 
        { 
        drawSVG: "100%",
        scrollTrigger: {
            trigger: "#two",
            start: "top center",
            end: "bottom center",
            scrub: true,
            markers: false // Show start/end markers
        },
        ease: "linear"
        }
    );
  
})