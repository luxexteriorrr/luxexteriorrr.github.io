document.addEventListener('DOMContentLoaded', () => {
    // gsap register
    gsap.registerPlugin(Flip,ScrollTrigger,Observer,ScrollToPlugin,Draggable,MotionPathPlugin,EaselPlugin,PixiPlugin,TextPlugin,RoughEase,ExpoScaleEase,SlowMo,CustomEase,)


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
    const paragraphs = document.querySelectorAll('.section p');
    const pageWrapper = document.querySelector('.pagewrapper')
    const enter = document.querySelector('#enter')
    const erosionParagraphs = document.querySelectorAll(".erosion");
    

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
    //disappearContent ()


    //disable scroll
    function disableScroll() {document.body.style.overflow = "hidden";}
    //enable scroll
    function enableScroll() { document.body.style.overflow = "auto";}
    function showNav() {
        // Then animate nav links in
        gsap.to("nav a", {
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "linear"
        });
      }
      
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
            duration: 5
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
            opacity: 0.1,
            duration: 3
        })

        .call(() => {
            showNav();
            enableScroll();
        });
    });

    //document.querySelector('#loadingdiv').style.display = 'none'



    
   //function with the spacing 
    function wordspacing () {
            //gsap with spacing (/??)
        paragraphs.forEach(par => {
        par.addEventListener('mouseenter', () => {  
            gsap.to(par, {
                    wordSpacing: '1rem',
                    width: '75%',
                    duration: 10, 
                     ease: 'linear'
                } // End state
            );
        });
    })
    }
    wordspacing ()

    //replacing with black cubes
    function erodeTextWithSize(element, options = {}) {
        let words = element.textContent.split(" ");
        const delay = options.delay || 800;
        
        // Select half of the words randomly
        let erosionCount = Math.floor(words.length / 4);
        let erosionIndexes = [];
    
        while (erosionIndexes.length < erosionCount) {
            let randomIndex = Math.floor(Math.random() * words.length);
            if (!erosionIndexes.includes(randomIndex)) {
                erosionIndexes.push(randomIndex);
            }
        }
    
        let index = 0;
        const erosionInterval = setInterval(() => {
            if (index >= erosionIndexes.length) {
                clearInterval(erosionInterval);
                return;
            }
    
            let wordIndex = erosionIndexes[index];
            
            let span = document.createElement("span");
            span.textContent = words[wordIndex];
            
            // 🎛 Random font size between 8px and 50px (change range as needed)
            let randomSize = Math.floor(Math.random() * 42) + 20;  
            span.style.fontSize = `${randomSize}px`;
            span.style.display = "inline-block"; // Prevents layout shifts
    
            // 20% chance to erode the word into black blocks
            if (Math.random() > 0.8) {
                span.textContent = "█".repeat(words[wordIndex].length);
            }
            
            words[wordIndex] = span.outerHTML;
            element.innerHTML = words.join(" ");
            
            index++;
        }, delay);
    }
    
    //messing with the letters (ADD THE FUNCTION WHEN THEY ARE IN VIEW)
    function erodeFragment(element, options = {}) {
        let words = element.textContent.split(" ");
        const delay = options.delay || 500;
        
        let index = 0;
        const interval = setInterval(() => {
            if (index >= words.length) {
                clearInterval(interval);
                return;
            }
    
            let word = words[index];
            let newWord = word
                .split("")
                .map(letter => (Math.random() > 0.5 ? letter : " ")) // 50% chance of letter being erased
                .join("");
    
            words[index] = newWord;
            element.textContent = words.join(" ");
            index++;
        }, delay);
    }

    erosionParagraphs.forEach((el, i) => {
        // stagger erosion slightly for each paragraph
        setTimeout(() => {
            erodeTextWithSize(el, { delay: 300, style: "block" });
        }, i * 1000);
    });

    /*
    erosionParagraphs.forEach((el, i) => {
        // stagger erosion slightly for each paragraph
        setTimeout(() => {
            erodeFragment(el, { delay: 600});
        }, i * 1000);
    });
    //erodeText() */
    


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
    






    

})