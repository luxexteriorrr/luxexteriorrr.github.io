document.addEventListener('DOMContentLoaded', () => {
    //smothing the flexboxes for webkit compat
    document.querySelectorAll('.grid-element').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.flexGrow = 3;
        });
        el.addEventListener('mouseleave', () => {
            el.style.flexGrow = 1;
        });
    });    

    //effects of the text
    document.querySelectorAll('.grid-element').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.querySelector('.project').classList.add('active')
        })
        el.addEventListener('mouseleave', () => {
            el.querySelector('.project').classList.remove('active')
        })
    })
})