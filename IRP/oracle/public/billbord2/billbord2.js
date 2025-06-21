document.addEventListener('DOMContentLoaded',() => {

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



    //master timeline 
    let masterTimeline = gsap.timeline({repeat:-1})


    //logo animation GSAP NUMBER 1
    function createLogoCycleTimeline(loops = 3) {
        let logoTL = gsap.timeline({repeat: loops - 1});
        
        logoTL.set("#logo-1", {visibility: "visible"})     // Start state
            .set("#logo-2, #logo-3, #logo-4, #logo-5", {visibility: "hidden"})
            
            .set("#logo-1", {visibility: "hiden", ease: "power2.out"}, "+=0.5")        // Hide logo 1
            .set("#logo-2", {visibility: "visible", ease: "power2.in"}, "+=0.0")       // Show logo 2
            
            .set("#logo-2", {visibility: "hidden", ease: "power2.out"}, "+=0.5")        // Hide logo 2  
            .set("#logo-3", {visibility: "visible", ease: "power2.in"}, "+=0.0")       // Show logo 3
            
            .set("#logo-3", {visibility: "hideen", ease: "power2.out"}, "+=0.5")        // Hide logo 3
            .set("#logo-4", {visibility: "visible", ease: "power2.in"}, "+=0.0")       // Show logo 4
            
            .set("#logo-4", {visibility: "hidden", ease: "power2.out"}, "+=0.5")        // Hide logo 4
            .set("#logo-5", {visibility: "visible", ease: "power2.in"}, "+=0.0")       // Show logo 5
            
            .set("#logo-5", {visibility: "hidden", ease: "power2.out"}, "+=0.5")        // Hide logo 5
            .set("#logo-1", {visibility: "visible", ease: "power2.in"}, "+=0.0");      // Back to logo 1
        return logoTL;
    }

    // Add to master timeline
    masterTimeline.add(createLogoCycleTimeline(5)) // 5 color cycles

    function splitTextForReveal(selector) {
        gsap.registerPlugin(SplitText);
        return new SplitText(selector, {type: "chars, words"});
    }

    function createSloganTimeline(loop = 3) {
        let bb1TL = gsap.timeline();
        
        // Split text into animatable parts
        let mainHeadline = new SplitText("#slogan-1 h2", {type: "chars"});
        let bodyText = new SplitText("#slogan-1 h3", {type: "words"});
        let disclaimerText = new SplitText("#slogan-1 .BottomText h4:first-child", {type: "words"});
        let copyrightText = new SplitText("#slogan-1 .BottomText h4:last-child", {type: "chars"});
        
        // Set initial states - all hidden
        gsap.set(mainHeadline.chars, {opacity: 0, y: 100, rotation: 5});
        gsap.set(bodyText.words, {opacity: 0, scale: 0});
        gsap.set([disclaimerText.words, copyrightText.chars], {opacity: 0});
        
        // Animation sequence
        bb1TL.staggerTo(mainHeadline.chars, 0.8, {        // Fixed: bb1TL not b1TL
            opacity: 1,
            y: 0,
            rotation: 0,
            ease: "back.out(1.7)",
            stagger: 0.05
          })
          .staggerTo(bodyText.words, 0.4, {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            stagger: 0.03
          }, "-=0.3")
          .staggerTo(disclaimerText.words, 0.2, {
            opacity: 1,
            ease: "power2.inOut",
            stagger: 0.02
          }, "+=0.5")
          .staggerTo(copyrightText.chars, 0.1, {
            opacity: 1,
            ease: "none",
            stagger: 0.02
          }, "+=0.2");
          
        return bb1TL;
    }
      
    // Add to master timeline
    masterTimeline.add(createSloganTimeline(3)); // Fixed: lowercase m, comment updated


})