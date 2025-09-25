(function () {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

    script.onload = function () {
        if (typeof emailjs !== 'undefined') {
            try {
                emailjs.init({
                    publicKey: 'WJFQUeozx0cUbrPmJ' // EmailJs Public Key
                });

                setTimeout(setupContactForm, 100);
            } catch (e) {
                console.warn('Error initializing EmailJS:', e);
            }
        } else {
            console.warn('EmailJS failed to load correctly.');
        }
    };

    // script.onerror = function () {
    //     console.warn('Failed to load EmailJS. Contact form will use fallback.');
    // };

    document.head.appendChild(script);
})();

function setupContactForm() {
    const EMAILJS_SERVICE_ID = 'service_6zh7czp';
    const EMAILJS_TEMPLATE_ID = 'template_i25uemq';

    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        const normalText = submitBtn.querySelector('.normal-text');
        const loadingText = submitBtn.querySelector('.loading');
        const successMessage = document.getElementById('success-message');

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (normalText) normalText.style.display = 'none';
        if (loadingText) loadingText.style.display = 'inline';
        submitBtn.disabled = true;
        toggleFormInputs(true);

        const templateParams = {
            name: name,
            email: email,
            phone: phone,
            subject: subject || 'Contact Form Submission',
            message: message
        };


        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function (response) {
                console.log(templateParams);
                // console.log('SUCCESS!', response.status, response.text);
                if (successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({behavior: 'smooth'});

                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 5000);
                }
                contactForm.reset();
            })
            .catch(function (error) {
                console.error('FAILED...', error);
                alert('Failed to send message. Please try again or contact me directly.');
            })
            .finally(function () {
                if (normalText) normalText.style.display = 'inline';
                if (loadingText) loadingText.style.display = 'none';
                submitBtn.disabled = false;
                toggleFormInputs(false);
            });
    });
}

function toggleFormInputs(disabled) {
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form button');
    inputs.forEach(input => {
        if (input) {
            input.disabled = disabled;
        }
    });
}

// AOS initialization
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Typing animation
function startTypingAnimation() {
    const typingElement = document.getElementById('typing-name');

    if (!typingElement) {
        console.log('Element not found, retrying...');
        setTimeout(startTypingAnimation, 100);
        return;
    }

    const words = ['Nischal Neupane'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 150;
        if (isDeleting) {
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTypingAnimation);
} else {
    startTypingAnimation();
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

const currentTheme = localStorage.getItem('theme') || 'dark';

if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
}

if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        const currentTheme = body.getAttribute('data-theme');

        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        } else {
            body.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
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

window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content, .profile-img');
    const speed = 0.5;

    parallaxElements.forEach(element => {
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Back to top button
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'btn btn-primary position-fixed';
backToTopButton.style.cssText = `
            bottom: 30px;
            right: 30px;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            z-index: 1000;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        `;
document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', function () {
    window.scrollTo({top: 0, behavior: 'smooth'});
});

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// Loading screen (optional)
window.addEventListener('load', function () {
    document.body.classList.add('loaded');

    // Add a subtle entrance animation to the page
    document.querySelector('.hero').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.hero').style.transition = 'opacity 1s ease-in-out';
        document.querySelector('.hero').style.opacity = '1';
    }, 100);
});

// Mobile menu close on link click
const navLinks = document.querySelectorAll('.nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    });
});

// Form validation enhancement
const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function () {
        if (this.value.trim() === '') {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#27ae60';
        }
    });

    input.addEventListener('focus', function () {
        this.style.borderColor = '#3498db';
    });
});
