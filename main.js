document.addEventListener('DOMContentLoaded', async () => {

    const response = await fetch('projects.json');
    const projects = await response.json();

    const namesContainer = document.getElementById('slider-names');
    const descsContainer = document.getElementById('slider-descriptions');
    const imagesContainer = document.getElementById('slider-images');
    const timeEl = document.getElementById('local-time');

    // Populate slides
    projects.forEach((project, i) => {
        // Name slide
        const nameSlide = document.createElement('div');
        nameSlide.className = 'keen-slider__slide slide slide-name';
        nameSlide.dataset.index = i;
        nameSlide.textContent = project.name;
        namesContainer.appendChild(nameSlide);

        // Description slide
        const descSlide = document.createElement('div');
        descSlide.className = 'keen-slider__slide slide slide-description';
        descSlide.dataset.index = i;
        descSlide.innerHTML = `
            <div class="desc-inner">
                <div class="desc-text">${project.description}</div>
                <div class="desc-meta">${project.year} — ${project.tags.join(', ')}</div>
            </div>
        `;
        descsContainer.appendChild(descSlide);

        // Image slide
        const imgSlide = document.createElement('div');
        imgSlide.className = 'keen-slider__slide slide slide-image';
        imgSlide.dataset.index = i;
        const img = document.createElement('img');
        img.src = project.thumbnail;
        img.alt = project.name;
        imgSlide.appendChild(img);
        imagesContainer.appendChild(imgSlide);
    });

    let activeIndex = 0;
    let sliders = [];
    let isSyncing = false;

    // Update active highlights
    function updateActive(index) {
        activeIndex = index;
        document.querySelectorAll('.slide-name').forEach(el => {
            el.classList.toggle('is-active', parseInt(el.dataset.index) === index);
        });
        document.querySelectorAll('.slide-description').forEach(el => {
            el.classList.toggle('is-active', parseInt(el.dataset.index) === index);
        });
        document.querySelectorAll('.slide-image').forEach(el => {
            el.classList.toggle('is-active', parseInt(el.dataset.index) === index);
        });
    }

    // Sync all sliders
    function syncSliders(sourceIdx, slideIdx) {
        if (isSyncing) return;
        isSyncing = true;
        sliders.forEach((s, i) => {
            if (i !== sourceIdx) s.moveToIdx(slideIdx);
        });
        updateActive(slideIdx);
        isSyncing = false;
    }

    // Wheel plugin — debounced scroll-to-slide
    function WheelPlugin(slider) {
        let timeout;
        let busy = false;

        function onWheel(e) {
            const dy = Math.abs(e.deltaY);
            const dx = Math.abs(e.deltaX);
            const delta = dy > dx ? e.deltaY : e.deltaX;

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

    // Shared config — names get more perView (small slides), images fewer (large slides)
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
                easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
            },
            animationEnded: (s) => {
                syncSliders(idx, s.track.details.rel);
            },
        };
    }

    // Create the three synced sliders with different perView values
    const namesSlider = new KeenSlider(
        '#slider-names',
        makeConfig(0, 7),  // many names visible
        [WheelPlugin]
    );
    const descsSlider = new KeenSlider(
        '#slider-descriptions',
        makeConfig(1, 3),  // fewer descriptions visible
        [WheelPlugin]
    );
    const imagesSlider = new KeenSlider(
        '#slider-images',
        makeConfig(2, 2),  // large images, ~2 visible
        [WheelPlugin]
    );

    sliders = [namesSlider, descsSlider, imagesSlider];
    updateActive(0);

    // Click to navigate
    document.querySelectorAll('.slide-name, .slide-description, .slide-image').forEach(slide => {
        slide.addEventListener('click', () => {
            const idx = parseInt(slide.dataset.index);
            if (!isNaN(idx)) window.location.href = projects[idx].slug;
        });
    });

    // Local time
    function tick() {
        timeEl.textContent = new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    }
    tick();
    setInterval(tick, 1000);
});
