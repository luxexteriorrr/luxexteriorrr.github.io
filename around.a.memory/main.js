document.addEventListener('DOMContentLoaded', () => {
    // gsap register
    gsap.registerPlugin(Flip,ScrollTrigger,Observer,ScrollToPlugin,Draggable,MotionPathPlugin,EaselPlugin,PixiPlugin,TextPlugin,RoughEase,ExpoScaleEase,SlowMo,CustomEase,)


            
//selectors

    //navigation
    const nav = document.getElementById('nav')
    const overlay = document.querySelector('.aboutoverlay');
    const title = document.getElementById('title');
    const about = document.getElementById('about');
    const print = document.getElementById('print');
    // Select all <a> elements inside <nav>, but exclude #about
    const navLinks = document.querySelectorAll('nav a:not(#about)');


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
                    }
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
    disappearContent ()






















    //disable scroll
    function disableScroll() {
        document.body.style.overflow = "hidden";
    }
    //enable scroll
    function enableScroll() {
        document.body.style.overflow = "auto";
    }
    //show nav 
    function showNav () {
        nav.style.display = 'flex'
    }
    //hide nav 
    function hideNav () {
        nav.style.display = 'none'
    }
    

    // Call disableScroll() before animation starts + nav
    hideNav ();
    //disableScroll();
    // GSAP Loading Timeline
    var loading = gsap.timeline();
    loading.fromTo('#loadingdiv', {width: '0%'}, {delay: 3, duration: 5, width: '100%'});
    loading.fromTo('#loadingdiv', {height: '24px'}, {delay: 0, duration: 1, height: '0px'});
    loading.fromTo('#loadingtext', {opacity: '1'}, {delay: 0, duration: 0.5, opacity: '0'});
    // Call enableScroll() after animation completes
    //loading.call(enableScroll);
    loading.call (showNav);
    

    
    

   
    //gsap with spacing (/??)
    document.querySelectorAll('.paragraph').forEach(par => {
        par.addEventListener('mouseenter', () => {  
            gsap.to(par, 
                {wordSpacing: '1rem', width: '75%',duration: 5, ease: 'linear'} // End state
            );
        });

    })

 
     
    // Toggle function
    function toggleOverlay() {
        const isActive = overlay.classList.toggle('active'); // Toggle 'active' class
    
        // Toggle title, print, and button text
        title.style.display = isActive ? 'none' : 'block';
        print.style.display = isActive ? 'none' : 'block';
        about.innerHTML = isActive ? 'Close' : 'About';
    
        // Hide all <a> elements in <nav> (except #about) when overlay is active
        navLinks.forEach(link => link.style.display = isActive ? 'none' : 'inline-block');
    }
    
    // Attach event listener
    about.addEventListener('click', toggleOverlay);
    
    


    //scroll trigger
    //gsap.to('.contentmain', {
        //scrollTrigger: {
            //trigger: '.contentmain',
            //start: "top 5%", 
            //toggleClass: { targets: "nav", className: "show" }, 
            //markers: false // Optional: Debugging
        //}
    //})


    //function to double the content 
    var double = function (event) {
        let clicked = event.target;
        if (!(clicked instanceof HTMLElement)) return;
        let cloned = clicked.cloneNode(true); // Clone the element (including children)
    
        // Optionally modify the cloned element to differentiate it
        cloned.style.opacity = "0.6"; // Example: Make it semi-transparent
        cloned.style.border = "2px dashed red"; // Example: Add a visual cue
        cloned.style.position = "absolute" //adding position absolute
        cloned.classList.add = ('paragraph')

        //add the cooradinates to where it has been clicked 
        cloned.style.left = `${event.pageX}px`;
        cloned.style.top = `${event.pageY}px`;

        const container = document.querySelector('.contentmain');

        container.appendChild(cloned);
        console.log(clicked)
    }
    
    // Attach event listener to the entire document
    //document.addEventListener("click", double);



    // Attach event listener to each paragraph
     // Select all paragraph elements
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
        p.addEventListener('click', double);
    });    
})