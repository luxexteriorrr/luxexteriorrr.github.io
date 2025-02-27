document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.grid-element').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.flexGrow = 3;
        });
        el.addEventListener('mouseleave', () => {
            el.style.flexGrow = 1;
        });
    });    
})