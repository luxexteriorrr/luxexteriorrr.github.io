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
        let inactivityTimer ; //seconds of innactivity
        let visibleElements = new Set(); // Track elements currently in the viewport

        //resetting the timer
        function resetTimer () {
            clearTimeout(inactivityTimer); //set the timer for the 30 seconds
            visibleElements.forEach(el => {
                gsap.to(el, { opacity: 1, duration: 1, ease: "power2.inOut" });
            });  // Restore visibility for faded elements
            inactivityTimer = setTimeout(triggerFade, 30000);// Restart inactivity timer
        }

        //lookout for the events on the page and reset the timer 
        ["scroll", "mousedown", "mousemove", "keypress", "touchstart"].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });

        //track the visible elements of the page
        function observeElements() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        visibleElements.add(entry.target);
                    } else {
                        visibleElements.delete(entry.target);
                    }
                });
                console.log("Currently visible elements:", Array.from(visibleElements));
            }, { threshold: 0.1 });
        
            // Observe all elements inside <body>
            document.querySelectorAll("body *").forEach(el => observer.observe(el));
        }        

        //fade the elements out 
        function triggerFade() {
            console.log("No activity detected. Fading elements...");
            fadeOutVisibleElements();
        }

        //randomized durations 
        function fadeOutVisibleElements() {
            visibleElements.forEach(el => {
                let randomDuration = gsap.utils.random(15, 20); // Random duration between 15-20 seconds
                gsap.to(el, { opacity: 0, duration: randomDuration, ease: "power2.inOut" });
            });
        }

        observeElements();
        resetTimer();






















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
                {wordSpacing: '1rem', width: '75%',duration: 5, ease: 'power2.out'} // End state
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