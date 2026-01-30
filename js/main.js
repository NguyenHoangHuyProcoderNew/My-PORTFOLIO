/* ============================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   Professional Vietnamese Developer Portfolio
   ============================================ */

// ============================================
// 1. DOM ELEMENTS
// ============================================
const DOM = {
    header: document.querySelector('.header'),
    menuToggle: document.querySelector('.menu-toggle'),
    navMenu: document.querySelector('.nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    lightbox: document.getElementById('lightbox'),
    lightboxImage: document.getElementById('lightbox-image'),
    lightboxClose: document.querySelector('.lightbox-close'),
    lightboxPrev: document.querySelector('.lightbox-nav.prev'),
    lightboxNext: document.querySelector('.lightbox-nav.next'),
};

// ============================================
// 2. STATE
// ============================================
const state = {
    currentLightboxImages: [],
    currentLightboxIndex: 0,
    isMenuOpen: false,
};

// ============================================
// 3. HEADER SCROLL EFFECT
// ============================================
function initHeaderScroll() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// 4. MOBILE MENU
// ============================================
function initMobileMenu() {
    if (!DOM.menuToggle || !DOM.navMenu) return;

    DOM.menuToggle.addEventListener('click', () => {
        state.isMenuOpen = !state.isMenuOpen;
        DOM.menuToggle.classList.toggle('active', state.isMenuOpen);
        DOM.navMenu.classList.toggle('active', state.isMenuOpen);
        document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
    });

    // Close menu when clicking nav links
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (state.isMenuOpen) {
                state.isMenuOpen = false;
                DOM.menuToggle.classList.remove('active');
                DOM.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (state.isMenuOpen &&
            !DOM.navMenu.contains(e.target) &&
            !DOM.menuToggle.contains(e.target)) {
            state.isMenuOpen = false;
            DOM.menuToggle.classList.remove('active');
            DOM.navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// 5. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = DOM.header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 6. SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .scale-in');

    if (animatedElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// 7. PROJECT GALLERY/SLIDER
// ============================================
function initProjectGalleries() {
    const galleries = document.querySelectorAll('.project-gallery');

    galleries.forEach(gallery => {
        const slides = gallery.querySelector('.project-slides');
        const slideItems = gallery.querySelectorAll('.project-slide');
        const prevBtn = gallery.querySelector('.gallery-nav.prev');
        const nextBtn = gallery.querySelector('.gallery-nav.next');
        const dotsContainer = gallery.querySelector('.gallery-dots');

        if (!slides || slideItems.length === 0) return;

        let currentIndex = 0;
        const totalSlides = slideItems.length;

        // Create dots
        if (dotsContainer && totalSlides > 1) {
            slideItems.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('gallery-dot');
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Slide ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.gallery-dot') : [];

        function updateSlider() {
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        gallery.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        // Click to open lightbox
        slideItems.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    const images = Array.from(slideItems).map(s => {
                        const slideImg = s.querySelector('img');
                        return slideImg ? slideImg.src : '';
                    }).filter(src => src);

                    openLightbox(images, index);
                });
            }
        });
    });
}

// ============================================
// 8. LIGHTBOX
// ============================================
function initLightbox() {
    if (!DOM.lightbox) return;

    // Close on backdrop click
    DOM.lightbox.addEventListener('click', (e) => {
        if (e.target === DOM.lightbox) {
            closeLightbox();
        }
    });

    // Close button
    if (DOM.lightboxClose) {
        DOM.lightboxClose.addEventListener('click', closeLightbox);
    }

    // Navigation
    if (DOM.lightboxPrev) {
        DOM.lightboxPrev.addEventListener('click', () => {
            navigateLightbox(-1);
        });
    }

    if (DOM.lightboxNext) {
        DOM.lightboxNext.addEventListener('click', () => {
            navigateLightbox(1);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!DOM.lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
}

function openLightbox(images, index = 0) {
    if (!DOM.lightbox || !DOM.lightboxImage) return;

    state.currentLightboxImages = images;
    state.currentLightboxIndex = index;

    DOM.lightboxImage.src = images[index];
    DOM.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Show/hide navigation based on number of images
    if (DOM.lightboxPrev) {
        DOM.lightboxPrev.style.display = images.length > 1 ? '' : 'none';
    }
    if (DOM.lightboxNext) {
        DOM.lightboxNext.style.display = images.length > 1 ? '' : 'none';
    }
}

function closeLightbox() {
    if (!DOM.lightbox) return;

    DOM.lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const newIndex = state.currentLightboxIndex + direction;
    const total = state.currentLightboxImages.length;

    state.currentLightboxIndex = (newIndex + total) % total;
    DOM.lightboxImage.src = state.currentLightboxImages[state.currentLightboxIndex];
}

// ============================================
// 9. ACTIVE NAV LINK HIGHLIGHTING
// ============================================
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');

    if (sections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                DOM.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ============================================
// 10. INITIALIZE ALL
// ============================================
function init() {
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initProjectGalleries();
    initLightbox();
    initActiveNavHighlight();

    console.log('Portfolio website initialized successfully!');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
