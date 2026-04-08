document.addEventListener('DOMContentLoaded', async () => {

    // Load project data
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
            <div>
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

    // Track active index
    let activeIndex = 0;
    let sliders = [];

    // Highlight active slide across all columns
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

    // Sync all sliders to a given index, except the one that triggered it
    let isSyncing = false;

    function syncSliders(sourceIndex, targetSlideIndex) {
        if (isSyncing) return;
        isSyncing = true;

        sliders.forEach((slider, i) => {
            if (i !== sourceIndex && slider) {
                slider.moveToIdx(targetSlideIndex);
            }
        });

        updateActive(targetSlideIndex);
        isSyncing = false;
    }

    // Wheel plugin: converts mouse wheel into slide changes
    function WheelPlugin(slider) {
        let touchTimeout;
        let wheelActive = false;

        function dispatch(e) {
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) < 5) return;
            e.preventDefault();

            if (!wheelActive) {
                wheelActive = true;

                if (delta > 0) {
                    slider.next();
                } else {
                    slider.prev();
                }

                clearTimeout(touchTimeout);
                touchTimeout = setTimeout(() => {
                    wheelActive = false;
                }, 400);
            }
        }

        slider.on('created', () => {
            slider.container.addEventListener('wheel', dispatch, { passive: false });
        });
    }

    // Slider config shared across all three
    const sliderConfig = (index) => ({
        vertical: true,
        slides: {
            perView: 3,
            spacing: 0,
            origin: 'center',
        },
        initial: 0,
        loop: true,
        rubberband: false,
        defaultAnimation: {
            duration: 600,
        },
        slideChanged: (s) => {
            syncSliders(index, s.track.details.rel);
        },
        created: (s) => {
            updateActive(0);
        },
    });

    // Create sliders
    const namesSlider = new KeenSlider('#slider-names', sliderConfig(0), [WheelPlugin]);
    const descsSlider = new KeenSlider('#slider-descriptions', sliderConfig(1), [WheelPlugin]);
    const imagesSlider = new KeenSlider('#slider-images', sliderConfig(2), [WheelPlugin]);

    sliders = [namesSlider, descsSlider, imagesSlider];

    // Click to navigate to project
    document.querySelectorAll('.slide-name, .slide-description, .slide-image').forEach(slide => {
        slide.style.cursor = 'pointer';
        slide.addEventListener('click', () => {
            const idx = parseInt(slide.dataset.index);
            if (!isNaN(idx)) {
                window.location.href = projects[idx].slug;
            }
        });
    });

    // Local time display
    function updateTime() {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
    updateTime();
    setInterval(updateTime, 1000);
});
