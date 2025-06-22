document.fonts.ready.then(() => {
    // Toggle the full screen action
    function fullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else if (document.exitFullscreen) {
            document.exitFullscreen()
            }
    }
    //full screen handling 
    document.addEventListener('keydown', 
        (e) => {
            if (e.key === 'Enter') {
                fullScreen()
            }
        }, false
    )



    // Overall Master Timeline
    function createMasterTimeline() {
        let masterTL = gsap.timeline({repeat: -1});
        
        masterTL
            // Hide the billboard wrapper initially
            .set(".BillboardSlogan", {display: "none"})  // or whatever your wrapper class is
            
            // Logo cycling phase
            .add(createLogoCycleTimeline(5))  // 3 logo cycles first
            .set(".BillboardLogo", {display: "none"})  // or whatever your wrapper class is
            
            // Show billboards and start sequence
            .set(".BillboardSlogan", {display: "flex"})  // Show wrapper
            .add(createBillboardMasterTimeline(), "+=1")  // Billboards after logos
            
            // Hide wrapper again before loop
            .set(".BillboardSlogan", {display: "none"})
            .add("reset", "+=2");
        
        return masterTL;
    }


    //logo animation GSAP NUMBER 1
    function createLogoCycleTimeline(loops = 3) {
        let logoTL = gsap.timeline({repeat: loops - 1});
        
        logoTL.set("#logo-1", {visibility: "visible"})     // Start state
            .set("#logo-2, #logo-3, #logo-4, #logo-5", {visibility: "hidden"})
            
            
            .set("#logo-1", {visibility: "hidden"}, "+=0.2")        // Hide logo 1
            .set("#logo-2", {visibility: "visible"}, "+=0.0")       // Show logo 2
            
            .set("#logo-2", {visibility: "hidden"}, "+=0.2")        // Hide logo 2  
            .set("#logo-3", {visibility: "visible"}, "+=0.0")       // Show logo 3
            
            .set("#logo-3", {visibility: "hidden"}, "+=0.2")        // Hide logo 3
            .set("#logo-4", {visibility: "visible"}, "+=0.0")       // Show logo 4
            
            .set("#logo-4", {visibility: "hidden"}, "+=0.2")        // Hide logo 4
            .set("#logo-5", {visibility: "visible"}, "+=0.0")       // Show logo 5
            
            .set("#logo-5", {visibility: "hidden"}, "+=0.2")        // Hide logo 5
            .set("#logo-1", {visibility: "visible"}, "+=0.0");      // Back to logo 1
        return logoTL;
    }
   
    function splitTextForReveal(selector) {
        gsap.registerPlugin(SplitText);
        return new SplitText(selector, {type: "chars, words"});
    }
    // Billboard main timeline
    function createBillboardMasterTimeline() {
        let masterTL = gsap.timeline();
        
        masterTL
          // Show Billboard 1 and run its animation
          .set("#slogan-1", {display: "flex"})
          .set("#slogan-2, #slogan-3", {display: "none"})
          .add(createSlogan1Timeline())  
          
          // Switch to Billboard 2
          .set("#slogan-1", {display: "none"})
          .set("#slogan-2", {display: "flex"})
          .add(createSlogan2Timeline()) 
          
          // Switch to Billboard 3
          .set("#slogan-2", {display: "none"})
          .set("#slogan-3", {display: "flex"})
          .add(createSlogan3Timeline()) 
          
          // Back to start
          .set("#slogan-3", {display: "none"});
          
        return masterTL;
    }

    //slogan 1 timeline 
    function createSlogan1Timeline() {
        let s1TL = gsap.timeline();
        
        // Split text for staggering
        let headlineWords = new SplitText("#slogan-1 h2", {type: "words"});
        let bodyWords = new SplitText("#slogan-1 h3", {type: "words"});
        let bottomWords = new SplitText("#slogan-1 .BottomText", {type: "words"});
        
        // Set everything hidden
        gsap.set([headlineWords.words, bodyWords.words, bottomWords.words], {opacity: 0, y: 30});
        
    
        s1TL
          // Stagger headline words
          .staggerTo(headlineWords.words, 1, {
            delay: 1,
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.5)  // 0.2s between each word

          .to({}, {duration: 1})
          
          // Stagger body text words (faster)
          .staggerTo(bodyWords.words, 1, {
            opacity: 1, 
            y: 0,
            ease: "power2.out"
          }, 0.1, "+=0.5")  // 0.05s between words, start 0.5s after headline

          .to({}, {duration: 1})
          
          // Stagger bottom text
          .staggerTo(bottomWords.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"  
          }, 0.05, "+=0.3")
          
         // Actual pause (no change, just duration)
        .to({}, {duration: 5})
          
          // Stagger out (reverse)
          .staggerTo([headlineWords.words, bodyWords.words, bottomWords.words], 1, {
            opacity: 0,
            y: -20,
            ease: "power2.in"
          }, 0.02, "+=1");
          
        return s1TL;
    }
    //slogan 2 timeline
    function createSlogan2Timeline() {
        let s2TL = gsap.timeline();
        
        // Split text for staggering
        let headlineWords2 = new SplitText("#slogan-2 h1", {type: "words"});
        let bodyWords2 = new SplitText("#slogan-2 h3", {type: "words"});
        let bottomWords2 = new SplitText("#slogan-2 .BottomText", {type: "words"});
        
        // Set everything hidden
        gsap.set([headlineWords2.words, bodyWords2.words, bottomWords2.words], {opacity: 0, y: 30});
        
    
        s2TL
          // Stagger headline words
          .staggerTo(headlineWords2.words, 1, {
            delay: 1,
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.5)  // 0.2s between each word

          .to({}, {duration: 1})
          
          // Stagger body text words (faster)
          .staggerTo(bodyWords2.words, 0.5, {
            opacity: 1, 
            y: 0,
            ease: "power2.out"
          }, 0.1, "+=0.5")  // 0.05s between words, start 0.5s after headline

          .to({}, {duration: 1})
          
          // Stagger bottom text
          .staggerTo(bottomWords2.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"  
          }, 0.05, "+=0.3")
          
         // Actual pause (no change, just duration)
        .to({}, {duration: 3})
          
          // Stagger out (reverse)
          .staggerTo([headlineWords2.words, bodyWords2.words, bottomWords2.words], 1, {
            opacity: 0,
            y: -20,
            ease: "power2.in"
          }, 0.02, "+=1");
          
        return s2TL;
    }
    //slogan 3 timeline
    function createSlogan3Timeline() {
        let s3TL = gsap.timeline();
        
        // Split text for staggering
        let headlineWords3 = new SplitText("#slogan-3 h1", {type: "words"});
        let bodyWords3 = new SplitText("#slogan-3 h2", {type: "words"});
        let bottomWords3 = new SplitText("#slogan-3 .BottomText", {type: "words"});
        
        // Set everything hidden
        gsap.set([headlineWords3.words, bodyWords3.words, bottomWords3.words], {opacity: 0, y: 30});
        
    
        s3TL
            // Stagger headline words
            .staggerTo(headlineWords3.words, 1, {
            delay: 1,
            opacity: 1,
            y: 0,
            ease: "power2.out"
            }, 1)  // 0.2s between each word

            .to({}, {duration: 3})
            
            // Stagger body text words (faster)
            .staggerTo(bodyWords3.words, 1, {
            opacity: 1, 
            y: 0,
            ease: "power2.out"
            }, 0.1, "+=0.5")  // 0.05s between words, start 0.5s after headline

            .to({}, {duration: 2})
            
            // Stagger bottom text
            .staggerTo(bottomWords3.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"  
            }, 0.05, "+=0.3")
            
            // Actual pause (no change, just duration)
        .to({}, {duration: 5})
            
            // Stagger out (reverse)
            .staggerTo([headlineWords3.words, bodyWords3.words, bottomWords3.words], 1, {
            opacity: 0,
            y: -20,
            ease: "power2.in"
            }, 0.02, "+=1");
            
        return s3TL;
    }

    // Start the master timeline
    createMasterTimeline()
      
    


})