document.addEventListener('DOMContentLoaded', () => {
    //selectors
    const title = document.querySelector('.title')
    const paragraphs = document.querySelectorAll('p')
    

    //update spaceing 
    title.addEventListener('mouseover',() => {
        gsap.to(title, {
            letterSpacing: '8px', 
            duration: 0.5,
            ease: 'power2.out',
        })
    })
    title.addEventListener('mouseout',() => {
        gsap.to(title, {
            letterSpacing: '0px', 
            duration: 0.5,
            ease: 'power2.out',
        })
    })

    paragraphs.forEach((p, index) => {
        p.addEventListener('mouseover', () => {
            gsap.to(p, {
                letterSpacing: '8px', 
                duration: 1,
                ease: 'power2.out',
            })
        })
    })

    paragraphs.forEach((p, index) => {
        p.addEventListener('mouseout', () => {
            gsap.to(p, {
                letterSpacing: '0px', 
                duration: 1,
                ease: 'power2.out',
            })
        })
    })


})