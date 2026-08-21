/* ==========================================================================
   PETKO PORTFÓLIÓ – script.js
   Közös JavaScript minden oldalhoz.
   ==========================================================================
   Tartalomjegyzék:
   1. Navigáció (hamburger menü, sima görgetés, elrejtés görgetéskor)
   2. Animációk (szekciók, készség sávok, statisztika számláló)
   3. Hero effektek (gépelés, parallax)
   4. Projektkártyák hover
   5. Kapcsolati űrlap (EmailJS – ha #contact-form van az oldalon)
   6. Felgörgetés gomb
   7. Képek oldal – lightbox
   8. Designer oldal – videó modal
   ========================================================================== */

/* --- 1. Navigáció --- */

// Hamburger menü megnyitása / bezárása (mobil)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Menüpont kattintásra bezárjuk a mobil menüt
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Belső hivatkozások (#) sima görgetéssel
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navigáció elrejtése lefelé görgetéskor, megjelenítése felfelé
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (!navbar) return;
    const currentScrollY = window.scrollY;

    if (currentScrollY > 120 && currentScrollY > lastScrollY) {
        navbar.classList.add('navbar-hidden');
    } else {
        navbar.classList.remove('navbar-hidden');
    }

    lastScrollY = currentScrollY;
});

/* --- 2. Animációk --- */

// Szekciók fade-in animációja, amikor láthatóvá válnak
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Készség sávok animált kitöltése
const skillBars = document.querySelectorAll('.skill-progress');
skillBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillObserver.observe(bar);
});

// Statisztika számláló animáció (Rólam szekció)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }

    updateCounter();
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h3');
            const target = parseInt(statNumber.textContent, 10);
            animateCounter(statNumber, target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statObserver.observe(stat);
});

/* --- 3. Hero effektek --- */

// Gépelés-szerű animáció a főcímhez
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        typeWriter(heroTitle, originalText, 50);
    }
});

// Parallax effekt a hero szekcióban (ha van avatar elem)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroAvatar = document.querySelector('.hero-avatar');

    if (heroAvatar) {
        const rate = scrolled * -0.5;
        heroAvatar.style.transform = `translateY(${rate}px)`;
    }
});

/* --- 4. Projektkártyák hover --- */

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

/* --- 5. Kapcsolati űrlap (EmailJS) --- */

// Csak akkor fut, ha van #contact-form elem (jelenleg Formspree-t használ az index)
(function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('IN97Nwq6MeTX1d187');
    }
})();

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;

        if (!name || !email || !message) {
            alert('Please fill out all the fields!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address!');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_name: 'Portfolio Owner'
        };

        emailjs.send('service_xxhr2m7', 'template_8shimop', templateParams)
            .then(function () {
                alert("Thank you for your message! I'll get back to you soon.");
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, function () {
                alert('Oops! Something went wrong while sending your message. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

/* --- 6. Felgörgetés gomb --- */

const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (!scrollToTopBtn) return;
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --- 7. Képek oldal – lightbox --- */

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const backdrop = document.querySelector('.lightbox-backdrop');

    if (!lightbox || !lightboxImg) return;

    function openLightbox(img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('lightbox-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('lightbox-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-img-wrap').forEach(btn => {
        btn.addEventListener('click', () => {
            const img = btn.querySelector('img');
            if (img) openLightbox(img);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

/* --- 8. Designer oldal – videó modal --- */

function initDesignerVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const modalIframe = document.getElementById('modalVideoPlayer');
    const nativeVideo = document.getElementById('modalVideoNative');
    const modalCloseBtn = videoModal?.querySelector('.modal-close');
    const videoTrigger = document.querySelector('.gallery-video-item');
    const embedBase = videoTrigger?.dataset.videoEmbed;

    if (!videoModal) return;

    function isMobileView() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    function openModal() {
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Telefonon natív videó (iOS iframe autoplay/lejátszás gyakran elhasal)
        if (isMobileView() && nativeVideo) {
            nativeVideo.currentTime = 0;
            const playPromise = nativeVideo.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
            }
            return;
        }

        if (embedBase && modalIframe) {
            const separator = embedBase.includes('?') ? '&' : '?';
            modalIframe.src = `${embedBase}${separator}autoplay=true`;
        }
    }

    function closeModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        if (nativeVideo) {
            nativeVideo.pause();
            nativeVideo.currentTime = 0;
        }
        if (modalIframe) {
            modalIframe.src = '';
        }
    }

    window.openModal = openModal;
    window.closeModal = closeModal;

    if (videoTrigger) {
        videoTrigger.addEventListener('click', openModal);
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Oldal-specifikus funkciók indítása
document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    initDesignerVideoModal();
});
