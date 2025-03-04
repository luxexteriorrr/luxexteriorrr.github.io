document.addEventListener('DOMContentLoaded', () => {
        // gsap register
    gsap.registerPlugin(Flip,ScrollTrigger,Observer,ScrollToPlugin,Draggable,MotionPathPlugin,EaselPlugin,PixiPlugin,TextPlugin,RoughEase,ExpoScaleEase,SlowMo,CustomEase)
    
    //loading timeline 
    var loading = gsap.timeline()
    loading.fromTo('#openingtext', {opacity: '0'}, {delay: 1,duration:5, opacity:'1'})
    
    
    //gsap with spacing (/??)
    document.querySelectorAll('.contentmain p').forEach(par => {
        par.addEventListener('mouseenter', () => {  
            gsap.to(par, 
                {letterSpacing: '5px', duration: 5, ease: 'power2.out' } // End state
            );
        });
        //par.addEventListener('mouseleave', () => {
            //gsap.fromTo(par, 
                //{ letterSpacing: '5px' }, // Start state
                //{ letterSpacing: '1px', duration: 0.5, ease: 'power2.inOut' } // End state
            //);
        //});
    })

    //about page
    document.getElementById('about').addEventListener('click', function() {
        const overlay = document.querySelector('.aboutoverlay')
        if (overlay.classList.contains('active')) {
            overlay.classList.remove('active')
            this.innerHTML = 'About'
        } else {
            overlay.classList.add('active')
            this.innerHTML = 'Close'
        }
    })

    //scroll trigger
    gsap.to('.contentmain', {
        scrollTrigger: {
            trigger: '.contentmain',
            start: "top 5%", 
            toggleClass: { targets: "nav", className: "show" }, 
            markers: false // Optional: Debugging
        }
    })
    


    


})