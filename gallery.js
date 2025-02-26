document.addEventListener('DOMContentLoaded',() => {
    //zoomout button selector
    const zoomOut = document.getElementById('zoomOUT')
    //zoomin button selector
    const zoomIN = document.getElementById('zoomIN')
    //the layer with the drag
    const draglayer = document.getElementById('drag-layer')
    //selecting the gallery lay3r
    const gallery = document.querySelector('.gallery')
    const totalRows = 20
    const imagesperRow = 40
    const totalImages = totalRows * imagesperRow
    const images = []
    let isZoomed = false

    function getRandomHeight(min, max) {
        return Math.floor(Math.random() * (max-min + 1)) + min
    }  

    for ( let i = 0; i < totalImages; i++) {
            const img = document.createElement('div');
            img.className = "img";
            img.style.height = `${getRandomHeight(30,40)}px`;
    
            const imgElement = document.createElement('img')
            const randomImageNumber = Math.floor (Math.random () * 3) + 1
            imgElement.src = `assets/images/img${randomImageNumber}.png`
            img.appendChild(imgElement)
            gallery.appendChild(img)
            images.push(img)
    
        }



    //zoom out
    zoomOut.addEventListener('click', () => {
        if (!isZoomed) return
        isZoomed = false
        draglayer.style.display = 'none'

        const currentTransform = window.getComputedStyle('gallery').transform;
        

    })
})