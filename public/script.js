// Scroll event to hide/show header
let lastScrollY = window.scrollY;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        // Scrolling down
        header.classList.add('hidden');
    } else {
        // Scrolling up
        header.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;
});

// Project gallery image rotation
let currentIndex = 0;
const images = document.querySelectorAll('.projects-preview .gallery img');
const totalImages = images.length;

function showNextImage() {
    images[currentIndex].style.opacity = '0';
    currentIndex = (currentIndex + 1) % totalImages;
    images[currentIndex].style.opacity = '1';
}

setInterval(showNextImage, 3000); // Change image every 3 seconds
showNextImage(); // Initial call to show the first
