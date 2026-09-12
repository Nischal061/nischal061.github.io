(function () {
    'use strict';

    const $ = (sel) => document.querySelector(sel);

    const themeToggle = $('#theme-toggle');
    const themeIcon = $('#theme-icon');
    const body = document.body;

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        localStorage.setItem('theme', theme);
    }

    applyTheme(localStorage.getItem('theme') || 'dark');

    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });

    const nav = $('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = $('#menu-toggle');
    const menuIcon = $('#menu-icon');
    const mobileMenu = $('#nav-links');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        menuIcon.className = mobileMenu.classList.contains('open') ? 'fas fa-xmark' : 'fas fa-bars';
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuIcon.className = 'fas fa-bars';
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));

    const backToTop = $('#back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 420);
    }, { passive: true });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const revealables = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealables.forEach((el) => revealObserver.observe(el));

    const typingEl = $('#typing-text');
    const words = ['Full-Stack Developer', '.NET / SQL Enthusiast', 'QA Manager', 'Bug Hunter', 'Always Learning'];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
        const word = words[wordIndex];
        typingEl.textContent = word.substring(0, charIndex);
        let delay = deleting ? 45 : 95;

        if (!deleting && charIndex === word.length) {
            delay = 1600;
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 450;
        } else {
            charIndex += deleting ? -1 : 1;
        }

        setTimeout(type, delay);
    }

    type();

    const heatmapEl = $('#contribution-heatmap');

    function renderHeatmap(data) {
        const contributions = data.contributions;
        const byDate = new Map();
        contributions.forEach((c) => byDate.set(c.date, c));

        const dates = contributions.map((c) => c.date).sort();
        const first = new Date(dates[0] + 'T00:00:00Z');
        const last = new Date(dates[dates.length - 1] + 'T00:00:00Z');

        const start = new Date(first);
        start.setUTCDate(first.getUTCDate() - first.getUTCDay());

        const columns = [];
        let column = [];
        const current = new Date(start);
        const keyOf = (d) => d.toISOString().slice(0, 10);

        while (current <= last) {
            const item = byDate.get(keyOf(current));
            column.push(item ? { level: item.level || 0, count: item.count || 0, date: item.date } : { level: 0, count: 0, date: keyOf(current) });
            if (column.length === 7) {
                columns.push(column);
                column = [];
            }
            current.setUTCDate(current.getUTCDate() + 1);
        }
        if (column.length) {
            while (column.length < 7) {
                column.push({ level: 0, count: 0, date: '' });
            }
            columns.push(column);
        }

        const grid = document.createElement('div');
        grid.className = 'heatmap-grid';

        columns.forEach((week) => {
            const col = document.createElement('div');
            col.className = 'heatmap-col';
            week.forEach((day) => {
                const cell = document.createElement('span');
                cell.className = 'heatmap-day level-' + day.level;
                if (day.date) {
                    cell.title = day.date + ': ' + day.count + ' contribution' + (day.count === 1 ? '' : 's');
                }
                col.appendChild(cell);
            });
            grid.appendChild(col);
        });

        heatmapEl.innerHTML = '';
        heatmapEl.appendChild(grid);

        const legend = document.createElement('div');
        legend.className = 'heatmap-legend';
        legend.innerHTML = 'Less <span class="heatmap-day level-1"></span><span class="heatmap-day level-2"></span><span class="heatmap-day level-3"></span><span class="heatmap-day level-4"></span> More';
        heatmapEl.appendChild(legend);
    }

    function heatmapFallback() {
        heatmapEl.innerHTML =
            '<p class="muted mono">Couldn\'t load the live graph right now. It\'s growing fast — see the stats below.</p>';
    }

    fetch('https://github-contributions-api.jogruber.de/v4/Mr-Neupane?y=last')
        .then((res) => {
            if (!res.ok) throw new Error('bad response');
            return res.json();
        })
        .then((data) => {
            if (data && data.contributions && data.contributions.length) {
                renderHeatmap(data);
            } else {
                heatmapFallback();
            }
        })
        .catch(heatmapFallback);

    const contactForm = $('#contact-form');
    const EMAILJS_PUBLIC_KEY = 'WJFQUeozx0cUbrPmJ';
    const EMAILJS_SERVICE_ID = 'service_6zh7czp';
    const EMAILJS_TEMPLATE_ID = 'template_i25uemq';
    const submitBtn = $('#submit-btn');
    const successMessage = $('#success-message');
    const EMAIL_TO = 'neupanenischal517@gmail.com';

    function loadEmailJS(cb) {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        s.onload = cb;
        s.onerror = function () {
            window.__emailjsFailed = true;
        };
        document.head.appendChild(s);
    }

    function mailtoFallback(data) {
        const subject = encodeURIComponent(data.subject || 'Portfolio Contact');
        const body = encodeURIComponent('Name: ' + data.name + '\nEmail: ' + data.email + '\nPhone: ' + (data.phone || '-') + '\n\n' + data.message);
        window.location.href = 'mailto:' + EMAIL_TO + '?subject=' + subject + '&body=' + body;
    }

    loadEmailJS(function () {
        if (window.emailjs) {
            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        }
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = $('#name').value.trim();
        const email = $('#email').value.trim();
        const phone = $('#phone').value.trim();
        const subject = $('#subject').value.trim();
        const message = $('#message').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !message) {
            alert('Please fill in your name, email and message.');
            return;
        }
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        submitBtn.disabled = true;
        document.querySelectorAll('#contact-form input, #contact-form textarea').forEach((el) => {
            el.disabled = true;
        });

        const done = () => {
            submitBtn.disabled = false;
            document.querySelectorAll('#contact-form input, #contact-form textarea').forEach((el) => {
                el.disabled = false;
            });
        };

        const templateParams = { name: name, email: email, phone: phone, subject: subject || 'Portfolio Contact', message: message };

        if (window.emailjs) {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    successMessage.classList.add('show');
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => successMessage.classList.remove('show'), 5000);
                    contactForm.reset();
                })
                .catch(() => {
                    alert('Failed to send. Opening your email app instead...');
                    mailtoFallback(templateParams);
                })
                .finally(done);
        } else {
            alert('Sending form unavailable — opening your email app instead...');
            mailtoFallback(templateParams);
            done();
        }
    });
})();