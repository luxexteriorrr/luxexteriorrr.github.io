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
        
            inactivityTimer = setTimeout(triggerFade, 2000); // Restart inactivity timer 
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
    //disappearContent()
    function widthspacing() {
      const allParagraphs = document.querySelectorAll('p');

      allParagraphs.forEach(paragraph => {
        ScrollTrigger.create({
          trigger: paragraph,
          start: "top 50%",
          once: false,
          markers: false,
          scrub: false,
          onEnter: () => {
            const randomWidth = Math.floor(Math.random() * (65 - 15 + 1)) + 15;
            const randomHeight = Math.floor(Math.random() * (45 - 5 + 1)) + 45;
            //const randomLine = Math.floor(Math.random() * (5 - 1 + 1)) + 5;
            gsap.to(paragraph, {
              width: `${randomWidth}%`,
              height: `${randomHeight}%`,
              //lineHeight: `${randomLine}`,
              duration: 50,
              ease: 'linear'
            });
          }
        });
      });
    }
    widthspacing();

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
          duration: 6,
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
    showNav()
    document.querySelector('#loadingdiv').style.display = 'none'

  
      

    
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
      // drawing svg 3
      gsap.fromTo("#elipseThree", 
        { drawSVG: "0%" }, 
        { 
        drawSVG: "100%",
        scrollTrigger: {
            trigger: "#images",
            start: "top center",
            end: "bottom center",
            scrub: true,
            markers: false // Show start/end markers
        },
        ease: "linear"
        }
    );








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
        ambient1.fade(0, 0.8, 3000); // fade in over 3 seconds
      });

      // Crossfade on scroll to #two
      ScrollTrigger.create({
        trigger: "#two",
        start: "top center",
        onEnter: () => {
          ambient1.fade(0.8, 0.2, 2000); // fade out ambient1
          if (!ambient2.playing()) ambient2.play();
          ambient2.fade(0.2, 0.8, 2000); // fade in ambient2
        },
        onLeaveBack: () => {
          ambient2.fade(0.8, 0.2, 2000);
          if (!ambient1.playing()) ambient1.play();
          ambient1.fade(0.2, 0.8, 2000);
        }
      });

      // Crossfade on scroll to #links
      ScrollTrigger.create({
        trigger: "#links",
        start: "top center",
        onEnter: () => {
          ambient2.fade(0.8, 0.2, 2000);
          if (!ambient3.playing()) ambient3.play();
          ambient3.fade(0.8, 0.2, 2000);
        },
        onLeaveBack: () => {
          ambient3.fade(0.8, 0.2, 2000);
          if (!ambient2.playing()) ambient2.play();
          ambient2.fade(0.8, 0.2, 2000);
        }
      });







  
})