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
    const paragraphs = document.querySelectorAll('p');
    const pageWrapper = document.querySelector('.pagewrapper')


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
    //show nav 
    function showNav () {nav.style.display = 'flex'}
    //hide nav 
    function hideNav () {nav.style.display = 'none'}
    
    // loading animation function
    function loadingAnim () {
                
        // 1. Call disableScroll() before animation starts + nav
        hideNav ();
        disableScroll();
    
        // 2. the loading div animation 
        var loading = gsap.timeline();
        loading.fromTo('#loadingdiv', {width: '0%'}, {delay: 3, duration: 5, width: '100%'});
        loading.fromTo('#loadingdiv', {height: '24px'}, {delay: 0, duration: 1, height: '0px'});
        loading.fromTo('#loadingtext', {opacity: '1'}, {delay: 0, duration: 0.5, opacity: '0'});


        // 3. show other links and enable scroll 
        loading.call(() => {
            showNav();
            enableScroll();
        });
        
    }
    //loadingAnim()

    document.querySelector('#loadingdiv').style.display = 'none'



    
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
    


    // Function to clone all paragraphs into .clonee
    function clone(event) {
        const container = document.querySelector(".clonee"); // ✅ Get correct overlay container

        if (!container) {
            console.error("No .clonee container found!");
            return;
        }

        const clickedParagraph = event.target; // Get the paragraph that was clicked
        const clone = clickedParagraph.cloneNode(true); // Clone the clicked paragraph
        container.appendChild(clone); // Append to clone overlay

        console.log("Cloned paragraph added to .clonee:", clone);
    }

    // ✅ Attach event listener to each paragraph
    document.querySelectorAll("p").forEach(p => {
        p.addEventListener("click", clone);
    });

    

})