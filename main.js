document.addEventListener('DOMContentLoaded',() => {

  // Add an event listener listening for scroll
  window.addEventListener("scroll", navHighlighter);

  //function for the nav
  function navHighlighter() {
      // Get all sections that have an ID defined
      const sections = document.querySelectorAll("section[id]");
    // Get current scroll position
    let scrollY = window.pageYOffset;
    // Now we loop through sections to get height, top and ID values for each
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = (current.getBoundingClientRect().top + window.pageYOffset) - 5;
      sectionId = current.getAttribute("id");
      if (
        scrollY > sectionTop &&
        scrollY <= sectionTop + sectionHeight
      ){
        document.querySelector(".menu a[href*=" + sectionId + "]").classList.add("active");
      } else {
        document.querySelector(".menu a[href*=" + sectionId + "]").classList.remove("active");
      }
    });
    
  }

  // Select all word elements
  const words = document.querySelectorAll('.meaning');

  // Add hover effect to each word
  words.forEach(word => {
      word.addEventListener('mouseover', () => {
          // Generate a random color
          const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

          // Change to the random color
          gsap.to(word, {
              duration: 0.2,
              color: randomColor,
          });

          // Revert back to the original color after 1 second
          setTimeout(() => {
              gsap.to(word, {
                  duration: 0.2,
                  color: 'blue', // Replace 'blue' with your original color
              });
          }, 1000);
      });
  });

  //progress bar selector
  const progress = document.querySelector('.progressbar')
  const second = document.querySelector('.progressbar.two')
  const three = document.querySelector(".progressbar.three")
  const four = document.querySelector(".progressbar.four")
  const five = document.querySelector('.progressbar.five')
  //height of the page 
  window.onload = function () {
    height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    console.log(height)
  }
  window.onscroll = function () {
    distance = window.scrollY
    var scrolled = (distance/height) * 100
    progress.style.height = scrolled + "%"
    second.style.height = scrolled + "%"
    three.style.height =  scrolled + "%"
    four.style.height =  scrolled + "%"
    five.style.transform = `scaleY(${scrolled/100})`
  }



})
