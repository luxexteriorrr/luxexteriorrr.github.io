document.addEventListener('DOMContentLoaded', async () => {

    const response = await fetch('projects.json');
    const projects = await response.json();

    const namesEl = document.getElementById('slider-names');
    const titlesEl = document.getElementById('slider-titles');
    const imagesEl = document.getElementById('slider-images');
    const abstractEl = document.getElementById('abstract-text');
    const timeEl = document.getElementById('local-time');

    // Populate slides
    projects.forEach((project, i) => {
        // Name
        const name = document.createElement('div');
        name.className = 'keen-slider__slide slide-name';
        name.dataset.index = i;
        name.textContent = project.name;
        namesEl.appendChild(name);

        // Title (description as short title in the list)
        const title = document.createElement('div');
        title.className = 'keen-slider__slide slide-title';
        title.dataset.index = i;
        title.innerHTML = `
            <span class="title-text">${project.description}</span>
            <span class="arrow">↗</span>
        `;
        titlesEl.appendChild(title);

        // Image
        const imgSlide = document.createElement('div');
        imgSlide.className = 'keen-slider__slide slide-image';
        imgSlide.dataset.index = i;
        const img = document.createElement('img');
        img.src = project.thumbnail;
        img.alt = project.name;
        imgSlide.appendChild(img);
        imagesEl.appendChild(imgSlide);
    });

    let activeIndex = 0;
    let sliders = [];
    let isSyncing = false;

    // Update active highlights + abstract
    function updateActive(index) {
        if (index === activeIndex && document.querySelector('.slide-name.is-active')) return;
        activeIndex = index;

        document.querySelectorAll('.slide-name').forEach(el => {
            el.classList.toggle('is-active', parseInt(el.dataset.index) === index);
        });
        document.querySelectorAll('.slide-title').forEach(el => {
            el.classList.toggle('is-active', parseInt(el.dataset.index) === index);
        });
        document.querySelectorAll('.slide-image').forEach(el => {
            el.classList.toggle('is-active', parseInt(el.dataset.index) === index);
        });

        // Update abstract text
        const project = projects[index];
        if (project) {
            abstractEl.style.opacity = 0;
            setTimeout(() => {
                abstractEl.textContent = project.description;
                abstractEl.style.opacity = 1;
            }, 150);
        }
    }

    // Sync sliders
    function syncSliders(sourceIdx, slideIdx) {
        if (isSyncing) return;
        isSyncing = true;
        sliders.forEach((s, i) => {
            if (i !== sourceIdx) s.moveToIdx(slideIdx);
        });
        updateActive(slideIdx);
        isSyncing = false;
    }

    // Wheel plugin
    function WheelPlugin(slider) {
        let timeout;
        let busy = false;

        function onWheel(e) {
            const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
            if (Math.abs(delta) < 4) return;
            e.preventDefault();

            if (!busy) {
                busy = true;
                if (delta > 0) slider.next();
                else slider.prev();
                clearTimeout(timeout);
                timeout = setTimeout(() => { busy = false; }, 450);
            }
        }

        slider.on('created', () => {
            slider.container.addEventListener('wheel', onWheel, { passive: false });
        });
    }

    // Both name and title lists share the same container height now
    const listsHeight = document.querySelector('.lists').clientHeight;
    const listPerView = Math.floor(listsHeight / 20);

    // Images: each is 47.5vh
    const imagesHeight = imagesEl.parentElement.clientHeight;
    const imageSlideHeight = window.innerHeight * 0.475;
    const imagesPerView = imagesHeight / imageSlideHeight;

    function makeConfig(idx, perView) {
        return {
            vertical: true,
            loop: true,
            rubberband: false,
            initial: 0,
            slides: {
                perView: perView,
                origin: 'center',
                spacing: 0,
            },
            defaultAnimation: {
                duration: 500,
                easing: (t) => 1 - Math.pow(1 - t, 3),
            },
            slideChanged: (s) => {
                syncSliders(idx, s.track.details.rel);
            },
        };
    }

    const namesSlider = new KeenSlider('#slider-names', makeConfig(0, listPerView), [WheelPlugin]);
    const titlesSlider = new KeenSlider('#slider-titles', makeConfig(1, listPerView), [WheelPlugin]);
    const imagesSlider = new KeenSlider('#slider-images', makeConfig(2, imagesPerView), [WheelPlugin]);

    sliders = [namesSlider, titlesSlider, imagesSlider];
    updateActive(0);

    // Position the bar: each slide = listsHeight / perView, centered by origin:'center'
    const barEl = document.querySelector('.bar');
    const slideHeight = listsHeight / listPerView;
    barEl.style.height = slideHeight + 'px';
    barEl.style.top = ((listsHeight - slideHeight) / 2) + 'px';

    // Click to navigate to project
    document.querySelectorAll('.slide-name, .slide-title, .slide-image').forEach(slide => {
        slide.addEventListener('click', () => {
            const idx = parseInt(slide.dataset.index);
            if (!isNaN(idx)) window.location.href = projects[idx].slug;
        });
    });

    // Time
    function tick() {
        timeEl.textContent = new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    }
    tick();
    setInterval(tick, 1000);
});
