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
        nameSlide.textContent = project.name;
        namesContainer.appendChild(nameSlide);

        // Description slide
        const descSlide = document.createElement('div');
        descSlide.className = 'keen-slider__slide slide slide-description';
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
        const img = document.createElement('img');
        img.src = project.thumbnail;
        img.alt = project.name;
        img.loading = 'lazy';
        imgSlide.appendChild(img);
        imagesContainer.appendChild(imgSlide);
    });

    // Track active index
    let activeIndex = 0;
    let sliders = [];

    // Highlight active slide across all columns
    function updateActive(index) {
        activeIndex = index;

        document.querySelectorAll('.slide-name').forEach((el, i) => {
            el.classList.toggle('is-active', i === index);
        });
        document.querySelectorAll('.slide-description').forEach((el, i) => {
            el.classList.toggle('is-active', i === index);
        });
        document.querySelectorAll('.slide-image').forEach((el, i) => {
            el.classList.toggle('is-active', i === index);
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
            // Determine scroll direction (vertical wheel = slide change)
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
                }, 300);
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
        },
        loop: true,
        rubberband: false,
        defaultAnimation: {
            duration: 600,
        },
        slideChanged: (s) => {
            syncSliders(index, s.track.details.rel);
        },
        created: (s) => {
            // Initial state
            if (index === 0) updateActive(0);
        },
    });

    // Create sliders
    const namesSlider = new KeenSlider('#slider-names', sliderConfig(0), [WheelPlugin]);
    const descsSlider = new KeenSlider('#slider-descriptions', sliderConfig(1), [WheelPlugin]);
    const imagesSlider = new KeenSlider('#slider-images', sliderConfig(2), [WheelPlugin]);

    sliders = [namesSlider, descsSlider, imagesSlider];

    // Click on name or description to navigate to project
    document.querySelectorAll('.slide-name, .slide-description').forEach((slide, i) => {
        slide.addEventListener('click', () => {
            const projectIndex = i % projects.length;
            window.location.href = projects[projectIndex].slug;
        });
    });

    // Click on image to navigate
    document.querySelectorAll('.slide-image').forEach((slide, i) => {
        slide.addEventListener('click', () => {
            const projectIndex = i % projects.length;
            window.location.href = projects[projectIndex].slug;
        });
    });

    // Hover on name to jump slider
    document.querySelectorAll('.slide-name').forEach((slide, i) => {
        slide.addEventListener('mouseenter', () => {
            const projectIndex = i % projects.length;
            namesSlider.moveToIdx(projectIndex);
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
