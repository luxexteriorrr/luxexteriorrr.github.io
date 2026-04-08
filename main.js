document.addEventListener('DOMContentLoaded', async () => {

    // Load project data
    const response = await fetch('projects.json');
    const projects = await response.json();

    // Populate wheels
    const namesContainer = document.getElementById('wheel-names');
    const descriptionsContainer = document.getElementById('wheel-descriptions');

    projects.forEach((project, i) => {
        // Name slide
        const nameSlide = document.createElement('div');
        nameSlide.className = 'keen-slider__slide';
        nameSlide.innerHTML = `<span>${project.name}</span>`;
        nameSlide.dataset.index = i;
        namesContainer.appendChild(nameSlide);

        // Description slide
        const descSlide = document.createElement('div');
        descSlide.className = 'keen-slider__slide';
        descSlide.innerHTML = `<span>${project.description}</span>`;
        descSlide.dataset.index = i;
        descriptionsContainer.appendChild(descSlide);
    });

    // State
    let activeIndex = 0;
    let isSyncing = false;

    // Preview image element
    const previewEl = document.getElementById('preview-image');
    const abstractEl = document.getElementById('abstract-text');
    const tagsEl = document.getElementById('active-tags');
    const yearEl = document.getElementById('active-year');
    const enterEl = document.getElementById('enter-link');
    const projectLink = document.getElementById('project-link');

    function updateActiveSlide(index) {
        activeIndex = index;
        const project = projects[index];

        // Update active class on slides
        document.querySelectorAll('#wheel-names .keen-slider__slide').forEach((slide, i) => {
            slide.classList.toggle('is-active', i === index);
        });
        document.querySelectorAll('#wheel-descriptions .keen-slider__slide').forEach((slide, i) => {
            slide.classList.toggle('is-active', i === index);
        });

        // Update preview image with crossfade
        const existingImg = previewEl.querySelector('img');
        const newImg = document.createElement('img');
        newImg.src = project.thumbnail;
        newImg.alt = project.name;
        newImg.style.opacity = '0';
        previewEl.appendChild(newImg);

        gsap.to(newImg, {
            opacity: 1,
            duration: 0.4,
            onComplete: () => {
                if (existingImg) existingImg.remove();
            }
        });
        if (existingImg) {
            gsap.to(existingImg, { opacity: 0, duration: 0.3 });
        }

        // Update abstract
        gsap.to(abstractEl, {
            opacity: 0,
            duration: 0.15,
            onComplete: () => {
                abstractEl.textContent = project.description;
                gsap.to(abstractEl, { opacity: 1, duration: 0.3 });
            }
        });

        // Update footer
        tagsEl.textContent = project.tags.join(' · ');
        yearEl.textContent = project.year;

        // Update project link
        projectLink.href = project.slug;
        enterEl.classList.add('visible');

        // Animate footer
        gsap.fromTo(tagsEl, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(yearEl, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }

    // Wheel scroll plugin for keen-slider
    function WheelControls(slider) {
        let touchTimeout;
        let position;
        let wheelActive;

        function dispatch(e, name) {
            position.x -= e.deltaX;
            position.y -= e.deltaY;
            slider.container.dispatchEvent(
                new CustomEvent(name, {
                    detail: { x: position.x, y: position.y }
                })
            );
        }

        function wheelStart(e) {
            position = { x: e.pageX, y: e.pageY };
            dispatch(e, 'ksDragStart');
        }

        function wheel(e) {
            dispatch(e, 'ksDrag');
        }

        function wheelEnd(e) {
            dispatch(e, 'ksDragEnd');
        }

        function eventWheel(e) {
            e.preventDefault();
            if (!wheelActive) {
                wheelStart(e);
                wheelActive = true;
            }
            wheel(e);
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                wheelActive = false;
                wheelEnd(e);
            }, 50);
        }

        slider.on('created', () => {
            slider.container.addEventListener('wheel', eventWheel, { passive: false });
        });
    }

    // Sync without infinite loop
    function syncTo(sourceIdx, ...targets) {
        if (isSyncing) return;
        isSyncing = true;
        updateActiveSlide(sourceIdx);
        targets.forEach(s => {
            s.moveToIdx(sourceIdx, false, { duration: 400 });
        });
        setTimeout(() => { isSyncing = false; }, 60);
    }

    // Slider config — show multiple items, active in center
    const wheelConfig = {
        vertical: true,
        loop: true,
        rubberband: false,
        mode: 'snap',
        slides: {
            perView: 7,
            spacing: 0,
            origin: 'center',
        },
        defaultAnimation: {
            duration: 500,
        },
    };

    // Init sliders
    const nameSlider = new KeenSlider('#wheel-names', {
        ...wheelConfig,
        slideChanged(s) {
            syncTo(s.track.details.rel, descSlider);
        },
    }, [WheelControls]);

    const descSlider = new KeenSlider('#wheel-descriptions', {
        ...wheelConfig,
        slideChanged(s) {
            syncTo(s.track.details.rel, nameSlider);
        },
    }, [WheelControls]);

    // Click to select or enter
    function addClickHandlers(slider, otherSlider) {
        slider.slides.forEach((slide, i) => {
            slide.addEventListener('click', () => {
                if (i === activeIndex) {
                    window.location.href = projects[i].slug;
                } else {
                    nameSlider.moveToIdx(i);
                    descSlider.moveToIdx(i);
                }
            });
        });
    }

    addClickHandlers(nameSlider, descSlider);
    addClickHandlers(descSlider, nameSlider);

    // Global scroll — scroll anywhere on page moves the wheels
    document.addEventListener('wheel', (e) => {
        const overWheel = e.target.closest('.keen-slider');
        if (!overWheel) {
            e.preventDefault();
            const dir = e.deltaY > 0 ? 1 : -1;
            nameSlider.moveToIdx(nameSlider.track.details.rel + dir);
        }
    }, { passive: false });

    // Click on image area to enter project
    previewEl.addEventListener('click', () => {
        window.location.href = projects[activeIndex].slug;
    });
    previewEl.style.cursor = 'pointer';

    // Set initial state
    updateActiveSlide(0);

    // Entrance animations
    gsap.from('.line', { opacity: 0, duration: 0.6, delay: 0.1 });
    gsap.from('.names-container', { opacity: 0, x: -20, duration: 0.6, delay: 0.3 });
    gsap.from('.descriptions-container', { opacity: 0, x: -10, duration: 0.6, delay: 0.4 });
    gsap.from('.image-container', { opacity: 0, duration: 0.8, delay: 0.5 });
    gsap.from('.abstract', { opacity: 0, y: 10, duration: 0.6, delay: 0.6 });
});
