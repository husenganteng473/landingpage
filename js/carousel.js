// Carousel functionality
document.addEventListener("DOMContentLoaded", () => {
    // Carousel
    const carousel = document.getElementById("carousel");
    if (carousel) {
        const slides = carousel.children;
        const total = slides.length;
        let index = 0;
        function showSlide(i) {
            index = (i + total) % total;
            carousel.style.transform = `translateX(-${index * 100}%)`;
        }
        document.getElementById("next").addEventListener("click", () => showSlide(index + 1));
        document.getElementById("prev").addEventListener("click", () => showSlide(index - 1));
        setInterval(() => showSlide(index + 1), 4000);
    }
});

// Initialize Lucide icons when the page is fully loaded
window.addEventListener('load', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});