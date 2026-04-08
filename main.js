document.addEventListener('DOMContentLoaded', async () => {

    // Load project data
    const response = await fetch('projects.json');
    const projects = await response.json();

    const listEl = document.getElementById('project-list');
    const imageCol = document.getElementById('image-column');
    const abstractEl = document.getElementById('abstract-text');

    let activeIndex = 0;

    // Build project rows
    projects.forEach((project, i) => {
        // List row
        const row = document.createElement('div');
        row.className = 'project-row';
        row.dataset.index = i;
        row.innerHTML = `
            <div class="name">${project.name}</div>
            <div class="title">
                <span>${project.description}</span>
                <span class="arrow">↗</span>
            </div>
        `;
        listEl.appendChild(row);

        // Image in right column
        const imgWrap = document.createElement('div');
        imgWrap.className = 'project-image';
        imgWrap.dataset.index = i;
        const img = document.createElement('img');
        img.src = project.thumbnail;
        img.alt = project.name;
        img.loading = 'lazy';
        imgWrap.appendChild(img);
        imageCol.appendChild(imgWrap);
    });

    // Set active project
    function setActive(index) {
        activeIndex = index;
        const project = projects[index];

        // Update row highlights
        document.querySelectorAll('.project-row').forEach((row, i) => {
            row.classList.toggle('is-active', i === index);
        });

        // Update images
        document.querySelectorAll('.project-image').forEach((img, i) => {
            img.classList.toggle('is-visible', i === index);
        });

        // Update abstract with fade
        gsap.to(abstractEl, {
            opacity: 0,
            duration: 0.15,
            onComplete: () => {
                abstractEl.textContent = project.description;
                gsap.to(abstractEl, { opacity: 1, duration: 0.3 });
            }
        });
    }

    // Hover to preview
    document.querySelectorAll('.project-row').forEach(row => {
        row.addEventListener('mouseenter', () => {
            const idx = parseInt(row.dataset.index);
            setActive(idx);
        });
    });

    // Click to navigate
    document.querySelectorAll('.project-row').forEach(row => {
        row.addEventListener('click', () => {
            const idx = parseInt(row.dataset.index);
            const project = projects[idx];
            window.location.href = project.slug;
        });
    });

    // Click on image to navigate too
    document.querySelectorAll('.project-image').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const idx = parseInt(img.dataset.index);
            window.location.href = projects[idx].slug;
        });
    });

    // Initial state
    setActive(0);

    // Entrance animation
    gsap.from('.header', { opacity: 0, y: -10, duration: 0.5, delay: 0.1 });
    gsap.from('.abstract', { opacity: 0, duration: 0.5, delay: 0.2 });
    gsap.from('.project-row', {
        opacity: 0, y: 8, duration: 0.4, stagger: 0.05, delay: 0.3
    });
    gsap.from('.project-image', {
        opacity: 0, y: 20, duration: 0.6, stagger: 0.1, delay: 0.4
    });
});
