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



    // Overall Master Timeline - simplified wrapper transition
    function createMasterTimeline() {
        let masterTL = gsap.timeline({repeat: -1});
        
        masterTL
            .set(".BillboardSlogan", {display: "none"})
            
            // Logo cycling phase
            .add(createLogoCycleTimeline(5))
            
            // Simple logo fade out
            .to(".BillboardLogo", {
                opacity: 0,
                duration: 2,
                ease: "power2.in"
            })
            .set(".BillboardLogo", {display: "none"})
            
            // Show slogan wrapper (no animation)
            .set(".BillboardSlogan", {display: "flex"})
            
            // Billboard sequence (individual slides handle the animation)
            .add(createBillboardMasterTimeline(2), "+=0.5")
            
            // Hide wrapper and bring back logo
            .set(".BillboardSlogan", {display: "none"})
            .set(".BillboardLogo", {display: "flex", opacity: 1})
            .to(".BillboardLogo", {
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            })
            .add("reset", "+=1");
        
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
    // Billboard Master with individual slide transitions
    function createBillboardMasterTimeline() {
        let billboardTL = gsap.timeline();
        
        billboardTL
            // Billboard 1 
            .set("#slogan-1", {display: "flex"})
            .fromTo("#slogan-1", {y: "100%", opacity: 1}, {y: "0%", opacity: 1, duration: 1, ease: "power2.out"})
            .set("#slogan-2, #slogan-3", {display: "none"})
            .add(createSlogan1Timeline())
            
            // Transition to Billboard 2
            .to("#slogan-1", {y: "-100%", opacity: 1, duration: 1, ease: "power2.in"})
            .set("#slogan-1", {display: "none"})
            .set("#slogan-2", {display: "flex"})
            .fromTo("#slogan-2", {y: "100%", opacity: 1}, {y: "0%", opacity: 1, duration: 1, ease: "power2.out"})
            .add(createSlogan2Timeline())
            
            // Transition to Billboard 3
            .to("#slogan-2", {y: "-100%", opacity: 1, duration: 1, ease: "power2.in"})
            .set("#slogan-2", {display: "none"})
            .set("#slogan-3", {display: "flex"})
            .fromTo("#slogan-3", {y: "100%", opacity: 0}, {y: "0%", opacity: 1, duration: 1, ease: "power2.out"})
            .add(createSlogan3Timeline())
            
            // Final slide out
            .to("#slogan-3", {y: "-100%", opacity: 1, duration: 1, ease: "power2.in"})
            .set("#slogan-3", {display: "none"});
            
        return billboardTL;
    }

    //slogan 1 timeline 
    function createSlogan1Timeline() {
        let s1TL = gsap.timeline();
        
        // Get spans for scaleX animation + split text for staggering
        let headlineSpans = document.querySelectorAll("#slogan-1 h2 span");
        let headlineWords = new SplitText("#slogan-1 h2 span", {type: "words"});
        let bodyWords = new SplitText("#slogan-1 h3", {type: "words"});
        let bottomWords = new SplitText("#slogan-1 .BottomText", {type: "words"});
        
        // Set spans to scaleX 0 (horizontal wipe from left)
        gsap.set(headlineSpans, {scaleX: 0, transformOrigin: "left bottom"});
        // Set text invisible
        gsap.set([headlineWords.words, bodyWords.words, bottomWords.words], {opacity: 0, y: 30});
        
        s1TL
          // First: horizontal wipe reveal of colored span backgrounds
          .staggerTo(headlineSpans, 0.6, {
            delay: 1,
            scaleX: 1,
            ease: "power2.out"
          }, 0.2) // 0.2s between each span wiping in
          
          // Then: stagger the text words within the revealed spans
          .staggerTo(headlineWords.words, 0.8, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.15) // start 0.3s after spans finish
          
          .to({}, {duration: 0.5}) // pause
          
          // Stagger body text words (faster)
          .staggerTo(bodyWords.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.01, "+=0.5") // 0.1s between words, start 0.5s after headline
          
          .to({}, {duration: 1}) // pause
          
          // Stagger bottom text
          .staggerTo(bottomWords.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.01, "+=0.3")
          
          // Hold everything visible
          .to({}, {duration: 5})
          
          // Stagger out (reverse) - text first, then spans scale away
          .staggerTo([headlineWords.words, bodyWords.words, bottomWords.words], 1, {
            opacity: 0,
            y: -20,
            ease: "power2.in"
          }, 0.02, "+=1")
          
          .staggerTo(headlineSpans, 0.5, {
            scaleY: 0,
            ease: "power2.in"
          }, 0.1, "+=0.2"); // spans wipe away after text fades
        
        return s1TL;
      }
    //slogan 2 timeline
    function createSlogan2Timeline() {
        let s2TL = gsap.timeline();
        
        // Get spans for scaleX animation + split text for staggering
        let headlineSpans2 = document.querySelectorAll("#slogan-2 h1 span");
        let headlineWords2 = new SplitText("#slogan-2 h1 span", {type: "words"});
        let bodyWords2 = new SplitText("#slogan-2 h3", {type: "words"});
        let bottomWords2 = new SplitText("#slogan-2 .BottomText", {type: "words"});
        
        // Set spans to scaleX 0 (horizontal wipe from left)
        gsap.set(headlineSpans2, {scaleX: 0, transformOrigin: "left center"});
        // Set all text invisible (regular stagger fade)
        gsap.set([headlineWords2.words, bodyWords2.words, bottomWords2.words], {opacity: 0, y: 30});
        
        s2TL
          // First: horizontal wipe reveal of colored span backgrounds
          .staggerTo(headlineSpans2, 0.6, {
            delay: 1,
            scaleX: 1,
            ease: "power2.out"
          }, 0.2) // 0.2s between each span wiping in
          
          // Then: stagger the text words within the revealed spans
          .staggerTo(headlineWords2.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.01, "+=0.3") // start 0.3s after spans finish
          
          .to({}, {duration: 1}) // pause
          
          // Stagger body text words
          .staggerTo(bodyWords2.words, 0.5, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.01, "+=0.5")
          
          .to({}, {duration: 1}) // pause
          
          // Stagger bottom text
          .staggerTo(bottomWords2.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.05, "+=0.3")
          
          // Hold everything visible
          .to({}, {duration: 3})
          
          // Stagger out - all text fades normally, then spans scale away
          .staggerTo([headlineWords2.words, bodyWords2.words, bottomWords2.words], 1, {
            opacity: 0,
            y: -20,
            ease: "power2.in"
          }, 0.02, "+=1")
          
          .staggerTo(headlineSpans2, 0.5, {
            scaleX: 0,
            ease: "power2.in"
          }, 0.1, "+=0.2"); // spans wipe away after text fades
        
        return s2TL;
      }
    //slogan 3 timeline
    function createSlogan3Timeline() {
        let s3TL = gsap.timeline();
        
        // Get spans for scaleX animation + split text for staggering
        let headlineSpans3 = document.querySelectorAll("#slogan-3 h1 span");
        let bodySpans3 = document.querySelectorAll("#slogan-3 h2 span");
        let headlineWords3 = new SplitText("#slogan-3 h1 span", {type: "words"});
        let bodyWords3 = new SplitText("#slogan-3 h2 span", {type: "words"});
        let bottomWords3 = new SplitText("#slogan-3 .BottomText", {type: "words"});
        
        // Set all spans to scaleX 0 (horizontal wipe from left)
        gsap.set([headlineSpans3, bodySpans3], {scaleX: 0, transformOrigin: "left center"});
        // Set all text invisible (regular stagger fade)
        gsap.set([headlineWords3.words, bodyWords3.words, bottomWords3.words], {opacity: 0, y: 30});
        
        s3TL
          // First: horizontal wipe reveal of h1 span background ("Quiet!")
          .staggerTo(headlineSpans3, 0.6, {
            delay: 1,
            scaleX: 1,
            ease: "power2.out"
          }, 0.2)
          
          // Then: stagger the h1 text within the revealed span
          .staggerTo(headlineWords3.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 1, "+=0.3")
          
          .to({}, {duration: 3}) // pause
          
          // Next: horizontal wipe reveal of h2 span backgrounds ("The Machines Are Learning")
          .staggerTo(bodySpans3, 0.6, {
            scaleX: 1,
            ease: "power2.out"
          }, 0.01, "+=0.5") // 0.15s between each span
          
          // Then: stagger the h2 text within the revealed spans
          .staggerTo(bodyWords3.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.5, "+=0.3")
          
          .to({}, {duration: 2}) // pause
          
          // Stagger bottom text (no spans)
          .staggerTo(bottomWords3.words, 1, {
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }, 0.05, "+=0.3")
          
          // Hold everything visible
          .to({}, {duration: 5})
          
          // Stagger out - all text fades normally, then spans scale away
          .staggerTo([headlineWords3.words, bodyWords3.words, bottomWords3.words], 1, {
            opacity: 0,
            y: -20,
            ease: "power2.in"
          }, 0.02, "+=1")
          
          .staggerTo([headlineSpans3, bodySpans3], 0.5, {
            scaleX: 0,
            ease: "power2.in"
          }, 0.1, "+=0.2"); // all spans wipe away after text fades
        
        return s3TL;
      }

    // Start the master timeline
    createMasterTimeline()
      
    


})