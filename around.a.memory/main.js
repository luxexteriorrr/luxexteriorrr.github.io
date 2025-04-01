document.addEventListener('DOMContentLoaded', () => {
    // gsap register
    gsap.registerPlugin(ScrollTrigger,TextPlugin,DrawSVGPlugin)

    ScrollTrigger.refresh();
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
          document.documentElement.requestFullscreen().then(() => {
            ScrollTrigger.refresh();
          });
        } else if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            ScrollTrigger.refresh();
          });
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
    const paragraphs3 = document.querySelectorAll('#three p')
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
    hideNav();
    disableScroll();

    // Flashing animation for #enter before click
    gsap.to("#enter", {
        opacity: 0.5,
        duration: 3,
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

        .to('#loadingtext', {
            delay: 1,
            opacity: 0,
            duration: 1
        })

        .to('#on1', {
          opacity: 1,
          duration: 12,
        })
        
        .to('#on1', {
          opacity: 0,
          duration: 6
        })
        
        .to('#on2', {
          opacity: 1,
          duration: 12,
        })
        
        .to('#on2', {
          opacity: 0,
          duration: 6
        })
        
        .to('#on3', {
          opacity: 1,
          duration: 12,
        })
        
        .to('#on3', {
          opacity: 0,
          duration: 6
        })
        
        .to('#on4', {
          opacity: 1,
          duration: 12
        })
        
        .to('#on4', {
          opacity: 0,
          duration: 6
        }) 

        .to('#on5', {
          opacity: 1,
          duration: 3
        })          

        /*.to('#loadingwrapper', {
          height: '25%',
          duration: 10
      })*/

        .call(() => {
            showNav();
            enableScroll();
            disappearContent();
            ScrollTrigger.refresh();
        });
    });
    //showNav()
    //document.querySelector('#loadingdiv').style.display = 'none'

    function widthspacing() {
      const allParagraphs = document.querySelectorAll('p');

      allParagraphs.forEach(paragraph => {
        ScrollTrigger.create({
          trigger: paragraph,
          start: "top 50%",
          toggleActions: "play play resume resume",
          once: false,
          markers: false,
          onEnter: () => {
            const randomWidth = Math.floor(Math.random() * (65 - 45 + 1)) + 45;
            gsap.to(paragraph, {
              width: `${randomWidth}%`,
              duration: 20,
              ease: 'linear'
            });
          }
        });
      });
    }
    widthspacing();

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
    //smoothWordGrow(); kind not wana use
      

    
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
            trigger: "#opening",
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
            trigger: "#three",
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
      fontSize: '6rem',
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
      fontSize: '4rem', 
      duration: 5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#expands",
        start: "o 50%",
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


    //the first visit section
    gsap.to("#remember", {
      fontSize: '12rem',
      scale: 1.2,
      filter: "blur(2px)",
      opacity: 0.4,
      duration: 5,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#remember",
        start: "top 70%",
        end: "top 30%",
        scrub: false,
        markers: false
      }
    });
    
    gsap.to("#grasp", {
      fontSize: '6rem',
      scale: 1.2,
      filter: "blur(2px)",
      opacity: "0.2",
      duration: 5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#grasp",
        start: "center center",
        end: "+=5000", // how long it stays pinned
        pin: false,
        pinSpacing: false,
        markers: false,
        scrub: false
      }
    });
    gsap.to("#somewhere", {
      fontSize: '6rem',
      lineHeight: '6rem',
      scale: 1.2,
      filter: "blur(2px)",
      duration: 5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#somewhere",
        start: "center 50%",
        end: "+=500", // how long it stays pinned
        pin: false,
        pinSpacing: false,
        markers: false,
        scrub: false
      }
    });

    //the third section
    gsap.to("#you", {
      fontSize: '6rem',
      lineHeight:'6rem',
      scale: 1.2,
      filter: "blur(2px)",
      opacity: 0.4,
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#you",
        start: "top 70%",
        end: "top 30%",
        scrub: true,
        markers: false
      }
    });
    gsap.to("#Illusion", {
      fontSize: '6rem',
      lineHeight:'6rem',
      scale: 1.2,
      filter: "blur(2px)",
      opacity: 0.4,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#Illusion",
        start: "top 70%",
        end: "top 30%",
        scrub: true,
        markers: false
      }
    });


    //images section 
    gsap.utils.toArray("#images img").forEach((img, i) => {
      gsap.to(img, {
        filter: "blur(20px)",
        duration: 10,
        ease: "power2.out",
        scrollTrigger: {
          trigger: img,
          start: "center 50%",
          end: "bottom 50%",
          scrub: false,
          markers: false
        }
      });
    });
    
    
    //eror overlay 
    // Get all fake links
    const fakeLinks = document.querySelectorAll('.fakelinks');
    const overlay404 = document.querySelector('.overlay404');
    const closeError = document.getElementById('closeerror');
  
    fakeLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        overlay404.classList.add('active');
      });
    });
  
    closeError.addEventListener('click', () => {
      overlay404.classList.remove('active');
    });





      // Define the sounds
      const ambient1 = new Howl({
        src: ['/around.a.memory/assets/audio/birds.mp3'],
        loop: true,
        volume: 0
      });

      const ambient2 = new Howl({
        src: ['/around.a.memory/assets/audio/walk.mp3'],
        loop: true,
        volume: 0
      });

      const ambient3 = new Howl({
        src: ['/around.a.memory/assets/audio/pond.mp3'],
        loop: true,
        volume: 0
      });

      // Start ambient1 on #enter click
      enter.addEventListener("click", () => {
        ambient1.play();
        ambient1.fade(0, 0.6, 3000); // fade in over 3 seconds
      });

      // Crossfade on scroll to #two
      ScrollTrigger.create({
        trigger: "#two",
        start: "top center",
        onEnter: () => {
          ambient1.fade(0.6, 0.1, 2000); // fade out ambient1
          if (!ambient2.playing()) ambient2.play();
          ambient2.fade(0.1, 0.3, 2000); // fade in ambient2
        },
        onLeaveBack: () => {
          ambient2.fade(0.3, 0.1, 2000);
          if (!ambient1.playing()) ambient1.play();
          ambient1.fade(0.1, 0.6, 2000);
        }
      });

      // Crossfade on scroll to #links
      ScrollTrigger.create({
        trigger: "#links",
        start: "top center",
        onEnter: () => {
          ambient2.fade(0.3, 0.1, 2000);
          if (!ambient3.playing()) ambient3.play();
          ambient3.fade(0.1, 0.3, 2000);
        },
        onLeaveBack: () => {
          ambient3.fade(0.3, 0.1, 2000);
          if (!ambient2.playing()) ambient2.play();
          ambient2.fade(0.1, 0.3, 2000);
        }
      });







  
})