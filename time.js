document.addEventListener('DOMContentLoaded', () => {
    //selectors
    const clientime = document.getElementById('clienttime')
    

    function clock() {
        const now = new Date()
        const currentTime = now.toLocaleTimeString()
        document.getElementById('localtime').textContent = `Local:${currentTime}`
    }
    setInterval(clock, 1000);
    clock()    
})