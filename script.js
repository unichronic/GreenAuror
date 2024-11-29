const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;




function showSlide(index) {
    const slideWidth = slides[0].clientWidth;
    const container = document.querySelector('.carousel-container');
    container.style.transform = `translateX(-${index * slideWidth}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        currentIndex = i;
        showSlide(currentIndex);
    });
});

// Auto-play functionality
setInterval(nextSlide, 5000);


const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const storiesWrapper = document.querySelector('.stories-wrapper');

let scrollAmount = 0;

nextBtn.addEventListener('click', () => {
    if (scrollAmount < storiesWrapper.scrollWidth - storiesWrapper.clientWidth) {
        scrollAmount += 330; // Adjust the scroll distance
        storiesWrapper.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
});

prevBtn.addEventListener('click', () => {
    if (scrollAmount > 0) {
        scrollAmount -= 330; // Adjust the scroll distance
        storiesWrapper.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
});
