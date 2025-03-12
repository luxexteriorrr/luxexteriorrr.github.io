document.addEventListener('DOMContentLoaded', () => {
        // gsap register
    gsap.registerPlugin(Flip,ScrollTrigger,Observer,ScrollToPlugin,Draggable,MotionPathPlugin,EaselPlugin,PixiPlugin,TextPlugin,RoughEase,ExpoScaleEase,SlowMo,CustomEase,)

    
    //loading timeline 
    var loading = gsap.timeline()
    loading.fromTo('#loadingdiv', {width: '0%'}, {delay: 3,duration:5, width:'100%'})
    loading.fromTo('#loadingdiv', {height: '24'}, {delay: 0, duration: 1, height: '0'})
    loading.fromTo('#loadingtext', {opacity: '1'}, {delay: 0, duration: 0.5, opacity: '0'})

    
    

   
 
    //gsap with spacing (/??)
    document.querySelectorAll('.paragraph').forEach(par => {
        par.addEventListener('mouseenter', () => {  
            gsap.to(par, 
                {wordSpacing: '1rem', width: '75%',duration: 5, ease: 'power2.out'} // End state
            );
        });

    })

 
//navigation
    const overlay = document.querySelector('.aboutoverlay');
    const title = document.getElementById('title');
    const about = document.getElementById('about');
    const print = document.getElementById('print');
    
    // Select all <a> elements inside <nav>, but exclude #about
    const navLinks = document.querySelectorAll('nav a:not(#about)'); 
    
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