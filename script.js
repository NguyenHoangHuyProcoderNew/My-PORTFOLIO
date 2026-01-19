// === PRELOADER ===
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1000);
});

// === CUSTOM CURSOR ===
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

document.addEventListener('mousedown', () => {
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Hover effect on links and buttons
document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.opacity = '0.5';
    });
});

// === PARTICLES.JS ===
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: '#6366f1' },
            shape: { type: 'circle' },
            opacity: { value: 0.3, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#6366f1', opacity: 0.2, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// === NAVBAR ===
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
});

// === TYPING EFFECT ===
const typedText = document.querySelector('.typed-text');
const words = ['Full Stack Developer', 'Web Developer', 'Desktop Developer', 'Problem Solver'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typedText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Start typing effect
setTimeout(type, 1000);

// === COUNTER ANIMATION ===
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounters() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        updateCounter();
    });
}

// Trigger counter animation when in view
const heroStats = document.querySelector('.hero-stats');
const observerCounter = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observerCounter.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (heroStats) observerCounter.observe(heroStats);

// === SKILL BARS ANIMATION ===
const skillBars = document.querySelectorAll('.skill-progress');

const observerSkills = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = progress + '%';
            observerSkills.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => observerSkills.observe(bar));

// === PROJECT FILTERS ===
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category.includes(filter)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// === CONTACT FORM ===
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Create mailto link
        const mailtoLink = `mailto:nguyenhoanghuy.contact@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Từ: ${name}\nEmail: ${email}\n\n${message}`)}`;

        window.location.href = mailtoLink;

        // Show success message
        alert('Cảm ơn bạn đã liên hệ! Email client của bạn sẽ được mở.');

        contactForm.reset();
    });
}

// === BACK TO TOP ===
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// === AOS INIT ===
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: false,        // Cho phép animate lại
        mirror: true,       // Animate khi scroll lên
        offset: 50,
        anchorPlacement: 'top-bottom'
    });
}

// === TILT EFFECT ON PROJECT CARDS ===
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// === PARALLAX EFFECT ON HERO ===
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    }
});

// === MAGNETIC BUTTONS ===
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

console.log('Portfolio loaded successfully! 🚀');

// === SECTION SCROLL ANIMATIONS (RE-TRIGGERABLE) ===
// Animations will play every time elements come into view
const setupScrollAnimations = () => {
    // Hero entrance animation with WOW effect
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && !heroContent.classList.contains('entrance')) {
        setTimeout(() => {
            heroContent.classList.add('entrance');
            // Add shimmer effect to name
            const heroName = heroContent.querySelector('.name');
            if (heroName) heroName.classList.add('shimmer-text');
        }, 500);
    }

    // === SECTION ENTERING WITH BLUR EFFECT ===
    const allSections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('entering');
                entry.target.style.opacity = '1';
            } else {
                entry.target.classList.remove('entering');
            }
        });
    }, { threshold: 0.1 });

    allSections.forEach(section => {
        section.style.transition = 'opacity 0.5s ease';
        sectionObserver.observe(section);
    });

    // === SECTION HEADERS WITH SWING EFFECT ===
    const sectionHeaders = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Add swing to title
                const title = entry.target.querySelector('.section-title');
                if (title) {
                    title.classList.add('swing-in');
                    setTimeout(() => title.classList.remove('swing-in'), 1000);
                }
            } else {
                entry.target.classList.remove('animate');
            }
        });
    }, { threshold: 0.3 });

    sectionHeaders.forEach(header => headerObserver.observe(header));

    // === ABOUT INFO ITEMS WITH ELASTIC BOUNCE ===
    const infoItems = document.querySelectorAll('.info-item');
    const infoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(infoItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('elastic-bounce');
                    entry.target.style.opacity = '1';
                }, index * 150);
            } else {
                entry.target.classList.remove('elastic-bounce');
                entry.target.style.opacity = '0';
            }
        });
    }, { threshold: 0.2 });

    infoItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.3s';
        infoObserver.observe(item);
    });

    // === SKILLS WITH ZOOM BOUNCE & GLOW BARS ===
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(skillCategories).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('zoom-in-bounce');
                    entry.target.classList.add('gradient-border');
                }, index * 200);
            } else {
                entry.target.classList.remove('zoom-in-bounce');
                entry.target.classList.remove('gradient-border');
            }
        });
    }, { threshold: 0.15 });

    skillCategories.forEach(cat => skillObserver.observe(cat));

    // === SKILL BARS WITH GLOW EFFECT ===
    const skillBarsAnim = document.querySelectorAll('.skill-progress');
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.classList.add('wow-fill');
                entry.target.style.width = progress + '%';
            } else {
                entry.target.classList.remove('wow-fill');
                entry.target.style.width = '0%';
            }
        });
    }, { threshold: 0.3 });

    skillBarsAnim.forEach(bar => skillBarObserver.observe(bar));

    // === PROJECTS WITH 3D WOW ENTER ===
    const projectCardsAnim = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(projectCardsAnim).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('wow-enter');
                    // Add heartbeat to category badge
                    const badge = entry.target.querySelector('.project-category');
                    if (badge) {
                        badge.classList.add('heartbeat');
                        setTimeout(() => badge.classList.remove('heartbeat'), 3000);
                    }
                }, index * 300);
            } else {
                entry.target.classList.remove('wow-enter');
            }
        });
    }, { threshold: 0.15 });

    projectCardsAnim.forEach(card => projectObserver.observe(card));

    // === CONTACT WITH GLOW ENTER & JELLO ===
    const contactInfo = document.querySelector('.contact-info');
    const socialLinksContact = document.querySelectorAll('.contact-info .social-link');

    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('glow-enter');

                // Social links with jello effect
                socialLinksContact.forEach((link, index) => {
                    setTimeout(() => {
                        link.classList.add('jello');
                        link.style.opacity = '1';
                        link.style.transform = 'scale(1)';
                    }, 400 + (index * 150));
                });
            } else {
                entry.target.classList.remove('glow-enter');
                socialLinksContact.forEach(link => {
                    link.classList.remove('jello');
                    link.style.opacity = '0';
                    link.style.transform = 'scale(0)';
                });
            }
        });
    }, { threshold: 0.2 });

    if (contactInfo) contactObserver.observe(contactInfo);

    // Style social links initial state
    socialLinksContact.forEach(link => {
        link.style.opacity = '0';
        link.style.transform = 'scale(0)';
        link.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });

    // === CONTACT ITEMS WITH FLIP IN X ===
    const contactItems = document.querySelectorAll('.contact-item');
    const contactItemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(contactItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('flip-in-x');
                    entry.target.style.opacity = '1';
                }, index * 150);
            } else {
                entry.target.classList.remove('flip-in-x');
                entry.target.style.opacity = '0';
            }
        });
    }, { threshold: 0.2 });

    contactItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.3s';
        contactItemObserver.observe(item);
    });

    // === STATS WITH PULSE & RAINBOW EFFECT ===
    const statItems = document.querySelectorAll('.stat-item');
    const statNumbers = document.querySelectorAll('.stat-number');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate counters with acceleration
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    let current = 0;
                    const duration = 2000;
                    const startTime = performance.now();

                    const updateCounter = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Easing function for more dramatic effect
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        current = Math.floor(easeOut * target);
                        stat.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.textContent = target;
                            // Add rainbow effect after counting
                            stat.classList.add('rainbow-text');
                            setTimeout(() => stat.classList.remove('rainbow-text'), 2000);
                        }
                    };
                    requestAnimationFrame(updateCounter);
                });

                // Enhanced pulse effect
                statItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('heartbeat');
                    }, 2000 + (index * 200));
                });
            } else {
                statNumbers.forEach(stat => {
                    stat.textContent = '0';
                    stat.classList.remove('rainbow-text');
                });
                statItems.forEach(item => {
                    item.classList.remove('heartbeat');
                });
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    // === FLOATING BADGES WITH SCALE ROTATE ===
    const floatingBadges = document.querySelectorAll('.floating-badge');
    floatingBadges.forEach((badge, index) => {
        setTimeout(() => {
            badge.classList.add('scale-up-rotate');
            badge.classList.add('active');
        }, 1500 + (index * 400));
    });
};

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupScrollAnimations, 100);
});

// Re-trigger animations on scroll for dynamic content
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Add subtle parallax to section backgrounds
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const parallaxOffset = scrollProgress * 20;
            section.style.backgroundPositionY = `${parallaxOffset}px`;
        }
    });

    lastScrollY = currentScrollY;
});

// Form input focus animations
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.classList.add('focus-animate');
    });

    input.addEventListener('blur', function () {
        this.parentElement.classList.remove('focus-animate');
    });
});

// Enhanced hover effects for skill items
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(10px)';
        this.style.transition = 'transform 0.3s ease';
    });

    item.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0)';
    });
});

// Contact items hover glow
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
        this.style.transform = 'translateX(5px)';
    });

    item.addEventListener('mouseleave', function () {
        this.style.boxShadow = 'none';
        this.style.transform = 'translateX(0)';
    });
});

console.log('Advanced animations loaded! ✨');
