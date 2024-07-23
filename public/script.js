document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section, .section-about, .projects-preview');
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;

    // Function to handle section fade-in based on visibility
    function checkVisibility() {
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const { top, bottom } = section.getBoundingClientRect();
            const sectionTop = top + scrollY;
            const sectionBottom = bottom + scrollY;

            if (sectionTop < scrollY + viewportHeight && sectionBottom > scrollY) {
                section.classList.add('fade-in');
            } else {
                section.classList.remove('fade-in');
            }
        });
    }

    // Function to handle header visibility
    function handleHeader() {
        if (window.scrollY > lastScrollY) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    }

    // Initialize functions
    window.addEventListener('scroll', () => {
        checkVisibility();
        handleHeader();
    });
    
    checkVisibility(); // Initial check for section visibility

    // Project gallery image rotation
    const images = document.querySelectorAll('.projects-preview .gallery img');
    let currentIndex = 0;
    const totalImages = images.length;

    function showNextImage() {
        images[currentIndex].style.opacity = '0';
        currentIndex = (currentIndex + 1) % totalImages;
        images[currentIndex].style.opacity = '1';
    }

    setInterval(showNextImage, 3000); // Change image every 3 seconds
    showNextImage(); // Initial call to show the first image
});
