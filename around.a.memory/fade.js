//function to disspear
    //the logic 
        //event listener on all of the DOM elements which listens for a minute
        //if the event listener catches no interaction myfunction() will execute
        //if the event listener catches interaction, then the timer resets
        //myfunction(){} will be 
            //interacion observer API will get the elements in current viewport and push them into an array 
                //it will have to manually check this and push() or splice() elements out of the visible list 
            //for loop will iterate over the elements in array calling a function on all of the elements in it (maybe text items first or what not?)
                        //maybe check for inner text 
                //the function will be a gsap timeline with random variable for the duration (within like 15-20s) which will affect the rate
                //but the essential is that the rate of decay will be varried for the items.
  //Define Global Variables
        let inactivityTimer;
        let visibleElements = []; // Track elements currently in the viewport

//Inactivity Timer (Triggers After 30 Seconds)
        function resetTimer() {
            clearTimeout(inactivityTimer); // Clear previous timer

            // Restore visibility if elements have faded
            visibleElements.forEach(el => {
                el.style.transition = "opacity 1s ease-in-out";
                el.style.opacity = "1"; // Bring elements back
            });

            inactivityTimer = setTimeout(triggerFade, 30000); // Reset inactivity timer
        }

        // Register several events, not just scroll
        var events = ['scroll']; //'mousedown', 'mousemove', 'keypress', 'touchstart'
        events.forEach((item) => {
            // The event stops, resets and restarts the timer
            document.addEventListener(item, resetTimer, true);
        });

        // 🔹 Step 3: Intersection Observer to Track Visible Elements
        function observeElements() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!visibleElements.includes(entry.target)) {
                            visibleElements.push(entry.target);
                        }
                    } else {
                        visibleElements = visibleElements.filter(el => el !== entry.target);
                    }
                });
                console.log("Currently visible elements:", visibleElements);
                triggerFade()
            }, { threshold: 0.1 });

            // Observe all elements inside <body>
            document.querySelectorAll("body *").forEach(el => observer.observe(el));
        }

        // 🔹 Step 4: Function to Fade Out Visible Elements After Inactivity
        function triggerFade() {
            console.log("No activity detected. Start fading elements...");
            fadeOutVisibleElements(); // Call fade function
        }

        function fadeOutVisibleElements() {
            visibleElements.forEach(el => {
                //el.style.transition = "opacity 1s ease-in-out";
                el.style.opacity = "0"; // Fades out elements
            });
        }

        // 🔹 Step 5: Start Everything
        observeElements();
        resetTimer()
