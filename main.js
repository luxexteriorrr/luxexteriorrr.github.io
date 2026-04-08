document.addEventListener('DOMContentLoaded', async () => {

    // Load project data
    const response = await fetch('projects.json');
    const projects = await response.json();

    // Populate wheels
    const namesContainer = document.getElementById('wheel-names');
    const descriptionsContainer = document.getElementById('wheel-descriptions');
    const imagesContainer = document.getElementById('wheel-images');

    projects.forEach((project, i) => {
        // Name slide
        const nameSlide = document.createElement('div');
        nameSlide.className = 'keen-slider__slide';
        nameSlide.textContent = project.name;
        nameSlide.dataset.index = i;
        namesContainer.appendChild(nameSlide);

        // Description slide
        const descSlide = document.createElement('div');
        descSlide.className = 'keen-slider__slide';
        descSlide.textContent = project.description;
        descSlide.dataset.index = i;
        descriptionsContainer.appendChild(descSlide);

        // Image slide
        const imgSlide = document.createElement('div');
        imgSlide.className = 'keen-slider__slide';
        const img = document.createElement('img');
        img.src = project.thumbnail;
        img.alt = project.name;
        img.loading = 'lazy';
        imgSlide.appendChild(img);
        imgSlide.dataset.index = i;
        imagesContainer.appendChild(imgSlide);
    });

    // Track active index
    let activeIndex = 0;

    function updateActiveSlide(index) {
        activeIndex = index;
        const project = projects[index];

        // Update active classes on all wheels
        document.querySelectorAll('.keen-slider__slide').forEach(slide => {
            slide.classList.toggle('is-active', parseInt(slide.dataset.index) === index);
        });

        // Update footer
        document.getElementById('active-tags').textContent = project.tags.join(' / ');
        document.getElementById('active-year').textContent = project.year;

        // Animate footer update with GSAP
        gsap.fromTo('#active-tags', { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 });
        gsap.fromTo('#active-year', { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 });
    }

    // Wheel configuration
    const wheelConfig = {
        vertical: true,
        slides: {
            perView: 5,
            spacing: 0,
        },
        loop: true,
        rubberband: false,
        defaultAnimation: {
            duration: 600,
        },
    };

    // Initialize the three synced sliders
    const nameSlider = new KeenSlider('#wheel-names', {
        ...wheelConfig,
        slideChanged(s) {
            const idx = s.track.details.rel;
            updateActiveSlide(idx);
            descSlider.moveToIdx(idx, false, { duration: 500 });
            imgSlider.moveToIdx(idx, false, { duration: 500 });
        },
    });

    const descSlider = new KeenSlider('#wheel-descriptions', {
        ...wheelConfig,
        slideChanged(s) {
            const idx = s.track.details.rel;
            updateActiveSlide(idx);
            nameSlider.moveToIdx(idx, false, { duration: 500 });
            imgSlider.moveToIdx(idx, false, { duration: 500 });
        },
    });

    const imgSlider = new KeenSlider('#wheel-images', {
        ...wheelConfig,
        slides: {
            perView: 1,
            spacing: 0,
        },
        slideChanged(s) {
            const idx = s.track.details.rel;
            updateActiveSlide(idx);
            nameSlider.moveToIdx(idx, false, { duration: 500 });
            descSlider.moveToIdx(idx, false, { duration: 500 });
        },
    });

    // Click to navigate to project
    document.querySelectorAll('.keen-slider__slide').forEach(slide => {
        slide.addEventListener('click', () => {
            const idx = parseInt(slide.dataset.index);
            if (idx === activeIndex) {
                // Navigate to project
                const project = projects[idx];
                window.location.href = project.slug;
            } else {
                // Scroll to that project
                nameSlider.moveToIdx(idx);
                descSlider.moveToIdx(idx);
                imgSlider.moveToIdx(idx);
            }
        });
    });

    // Set initial active state
    updateActiveSlide(0);

    // Entrance animation with GSAP
    gsap.from('#header', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 });
    gsap.from('#footer', { opacity: 0, y: 20, duration: 0.8, delay: 0.2 });
    gsap.from('.column-names', { opacity: 0, x: -30, duration: 0.8, delay: 0.4 });
    gsap.from('.column-descriptions', { opacity: 0, x: -20, duration: 0.8, delay: 0.6 });
    gsap.from('.column-images', { opacity: 0, x: 20, duration: 0.8, delay: 0.8 });
});
