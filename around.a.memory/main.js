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

    //overlay
    function toggleOverlay(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) {
            console.error(`Overlay with ID '${overlayId}' not found.`);
            return;
        }
    
        const isActive = overlay.classList.toggle("active"); // Toggle 'active' class
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
        //opacity: 0.5,
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

        /*.to('#loadingdiv', {
            height: '0px',
            duration: 1
        })*/

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
            //disappearContent ();
        });
    });
    showNav()
    //document.querySelector('#loadingdiv').style.display = 'none'

    function widthspacing() {
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
    widthspacing();

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
    smoothWordFade();






    function smoothWordGrow() {
        const ero2 = document.querySelectorAll(".ero2");
      
        ero2.forEach((paragraph, i) => {
          ScrollTrigger.create({
            trigger: paragraph,
            start: "top 85%",
            markers: false,
            once: true,
            onEnter: () => {
              const words = paragraph.textContent.trim().split(" ");
      
              // Wrap each word in a span
              paragraph.innerHTML = words
                .map(word => `<span class="fade-word">${word} </span>`)
                .join("");
      
              const wordSpans = paragraph.querySelectorAll(".fade-word");
              const wordIndexes = [...Array(wordSpans.length).keys()];
      
              // Shuffle word order
              for (let i = wordIndexes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [wordIndexes[i], wordIndexes[j]] = [wordIndexes[j], wordIndexes[i]];
              }
      
              // Increase font size one word at a time
              wordIndexes.forEach((index, step) => {
                setTimeout(() => {
                  // Random font size between 0.8rem and 2.8rem in 0.1 steps
                  const randomSize = (Math.floor(Math.random() * 21) + 8) / 10;
      
                  gsap.to(wordSpans[index], {
                    fontSize: `${randomSize}rem`,
                    duration: 15,
                    ease: "power1.out"
                  });
                }, step * 6000); // 6s between each
              });
            }
          });
        });
      }
      
    smoothWordGrow();
      

    
    // Event listener for opening overlays (Uses `data-overlay` attributes)
    document.querySelectorAll("[data-overlay]").forEach(trigger => {
        trigger.addEventListener("click", function () {
            const overlayId = this.getAttribute("data-overlay"); // Get the overlay ID from the clicked element
            toggleOverlay(overlayId);
        });
    });
    
    // Event listener for closing overlays (Delegated)
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







    //the opening section 

    // Animate "walk" — expand letter spacing
    gsap.to("#walk", {
      letterSpacing: "5rem",
      duration: 10,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#walk",
        start: "center 50%",
        end: "bottom ",
        markers: false,
        scrub: true
      }
    });
    // Animate "urban" — expand letter spacing
    gsap.to("#urban", {
      fontSize: "1rem",
      duration: 10,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#urban",
        start: "center 50%",
        end: "bottom ",
        markers: false,
        scrub: true
      }
    });
    // Animate "escape" — expand letter spacing
    gsap.to("#escape", {
      backgroundColor: "rgba(173, 216, 230, 0.6)", // light blue
      duration: 0.5,
      scrollTrigger: {
        trigger: "#escape",
        start: "top 80%",
        end: "top 50%",
        scrub: true
      }
    });
    // Animate "escape" — expand letter spacing
    gsap.to("#expands", {
      fontSize: '2rem', 
      duration: 5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#expands",
        start: "center 50%",
        end: "bottom",
        markers: false,
        scrub: true
      }
    });
    // Animate "ambience" — stuck
    gsap.to("#ambience", {
      backgroundColor: "rgba(173, 216, 230, 0.6)",
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#ambience",
        start: "center center",
        end: "+=1000", // how long it stays pinned
        pin: true,
        pinSpacing: false,
        markers: false,
        scrub: true
      }
    });
    // Animate "is" — stuck
    gsap.to("#is", {
      backgroundColor: "rgba(173, 216, 230, 0.6)",
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#is",
        start: "center center",
        end: "+=1000", // how long it stays pinned
        pin: true,
        pinSpacing: false,
        markers: false,
        scrub: true
      }
    });
    // Animate "web" - stuck
    gsap.to("#web", {
      backgroundColor: "rgba(173, 216, 230, 0.6)",
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#web",
        start: "center center",
        end: "+=1000", // how long it stays pinned
        pin: true,
        pinSpacing: false,
        markers: false,
        scrub: true
      }
    });

    //sounds trial
    // Define the sounds
    const ambient1 = new Howl({
      src: ['/around.a.memory/assets/audio/ambient1.mp3'],
      loop: true,
      volume: 0
    });

    const ambient2 = new Howl({
      src: ['/around.a.memory/assets/audio/ambient2.mp3'],
      loop: true,
      volume: 0
    });
    const test = new Howl({
      src: ['/around.a.memory/assets/audio/ambient1.mp3'],
      onload: () => console.log("Audio loaded!"),
      onloaderror: (id, err) => console.error("Error loading audio:", err)
    });
        // Start ambient1 on #enter click
    enter.addEventListener("click", () => {
      ambient1.play();
      ambient1.fade(0, 0.6, 3000); // fade in over 3 seconds
    });

    // Crossfade on scroll into section #two
    ScrollTrigger.create({
      trigger: "#two",
      start: "top center",
      onEnter: () => {
        ambient1.fade(0.6, 0, 2000); // fade out ambient1
        ambient2.play();
        ambient2.fade(0, 0.6, 2000); // fade in ambient2
      },
      onLeaveBack: () => {
        ambient2.fade(0.6, 0, 2000);
        ambient1.play();
        ambient1.fade(0, 0.6, 2000);
      }
    });

      const ctx = Howler.ctx;
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime); // lower = more muffled

      // Connect Howler's internal audio node to the filter
      ambient1._sounds[0]._node.disconnect();
      ambient1._sounds[0]._node.connect(filter);
      filter.connect(ctx.destination);


    
    
    
    
    
  
})