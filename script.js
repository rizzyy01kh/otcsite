/* =========================
   NAVBAR MOBILE
========================= */
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

/* =========================
   SCROLL TO PRINTERS
========================= */
const shopNowBtn = document.getElementById('shopNowBtn');

if (shopNowBtn) {
    shopNowBtn.addEventListener('click', () => {
        document.getElementById('printers').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

/* =========================
   BRAND FILTER (BUTTONS)
========================= */
const filterButtons = document.querySelectorAll('.filters button');
const brandGroups = document.querySelectorAll('.brand-group');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const brand = button.dataset.filter;

        brandGroups.forEach(group => {
            if (brand === 'all' || group.classList.contains(brand)) {
                group.style.display = 'grid';
                group.previousElementSibling.style.display = 'block'; // section title
            } else {
                group.style.display = 'none';
                group.previousElementSibling.style.display = 'none';
            }
        });
    });
});

/* =========================
   LIVE SEARCH (FIXED)
========================= */
const searchInput = document.getElementById('navSearch');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    brandGroups.forEach(group => {
        const products = group.querySelectorAll('.product');
        let matchFound = false;

        products.forEach(product => {
            const name = product.querySelector('h3').innerText.toLowerCase();
            const classes = product.className.toLowerCase();

            const match =
                name.includes(query) ||
                classes.includes(query);

            product.style.display = match ? 'flex' : 'none';

            if (match) matchFound = true;
        });

        // SHOW / HIDE ENTIRE BRAND SECTION
        if (matchFound || query === '') {
            group.style.display = 'grid';
            group.previousElementSibling.style.display = 'block';
        } else {
            group.style.display = 'none';
            group.previousElementSibling.style.display = 'none';
        }
    });

    // auto-scroll on typing
    if (query.length > 0) {
        document.getElementById('printers').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

/* =========================
   HERO SLIDER
========================= */
const slides = document.querySelectorAll('.hero-slider img');
let currentSlide = 0;

function showSlide(index){
    slides.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
}

if (slides.length > 0) {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 3000);
}

/* =========================
   LOGO → BACK TO HOME
========================= */
const homeLogo = document.getElementById('homeLogo');

homeLogo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
