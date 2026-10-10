(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var root = document.documentElement;
    root.classList.add('js');

    /* Header state on scroll */
    var header = document.querySelector('header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 24);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Scroll reveal */
    var revealTargets = document.querySelectorAll(
        '.stat-card, .service-card, .experience-card, .faq-heading'
    );
    if ('IntersectionObserver' in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                /* Also reveal anything already scrolled past (anchor jumps, fast scrolling) */
                if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
        revealTargets.forEach(function (el, i) {
            el.classList.add('reveal');
            if (el.matches('.service-card, .stat-card')) {
                el.style.transitionDelay = (i % 3) * 70 + 'ms';
            }
            revealObserver.observe(el);
        });
    }

    /* Stat count-up */
    var numbers = document.querySelectorAll('.stat-number');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                countObserver.unobserve(entry.target);
                var el = entry.target;
                var match = el.textContent.trim().match(/^(\d+)(\D*)$/);
                if (!match) { return; }
                var end = parseInt(match[1], 10);
                var suffix = match[2];
                var start = null;
                var step = function (t) {
                    if (start === null) { start = t; }
                    var p = Math.min((t - start) / 1100, 1);
                    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
                    if (p < 1) { requestAnimationFrame(step); }
                };
                requestAnimationFrame(step);
            });
        }, { threshold: 0.6 });
        numbers.forEach(function (n) { countObserver.observe(n); });
    }

    /* Scroll progress bar */
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var updateBar = function () {
        var h = root.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
    };
    updateBar();
    window.addEventListener('scroll', updateBar, { passive: true });

    /* Cursor spotlight on cards */
    var spot = document.querySelectorAll('.service-card, .stat-card, .highlight-box, .book-option, .clinic-card');
    spot.forEach(function (el) {
        el.classList.add('spot');
        el.addEventListener('pointermove', function (e) {
            var r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* Scrollspy for header links */
    var links = Array.prototype.slice.call(document.querySelectorAll('header nav a[href^="#"]'));
    if ('IntersectionObserver' in window && links.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                links.forEach(function (a) {
                    a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        links.forEach(function (a) {
            var t = document.querySelector(a.getAttribute('href'));
            if (t) { spy.observe(t); }
        });
    }

    /* Subtle tilt on hero photo */
    var photo = document.querySelector('.hero-image');
    if (photo && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        photo.addEventListener('pointermove', function (e) {
            var r = photo.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            photo.style.transform = 'perspective(900px) rotateY(' + x * 6 + 'deg) rotateX(' + -y * 6 + 'deg)';
        });
        photo.addEventListener('pointerleave', function () { photo.style.transform = ''; });
    }

    /* FAQ: search, topic filter, single-open accordion */
    var faq = document.getElementById('faq');
    if (faq) {
        var items = Array.prototype.slice.call(faq.querySelectorAll('details'));
        var chips = Array.prototype.slice.call(faq.querySelectorAll('.faq-chip'));
        var search = document.getElementById('faq-search');
        var empty = faq.querySelector('.faq-empty');
        var topic = 'all';

        var apply = function () {
            var q = search.value.trim().toLowerCase();
            var shown = 0;
            items.forEach(function (d) {
                var match = (topic === 'all' || d.dataset.category === topic) &&
                    (!q || d.textContent.toLowerCase().indexOf(q) !== -1);
                d.hidden = !match;
                if (match) { shown++; }
                if (!match) { d.open = false; }
                else if (q && shown === 1) { d.open = true; }
            });
            empty.hidden = shown !== 0;
        };

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                topic = chip.dataset.filter;
                chips.forEach(function (c) {
                    var on = c === chip;
                    c.classList.toggle('is-active', on);
                    c.setAttribute('aria-pressed', on);
                });
                apply();
            });
        });
        search.addEventListener('input', apply);

        items.forEach(function (d) {
            d.addEventListener('toggle', function () {
                if (!d.open) { return; }
                items.forEach(function (o) { if (o !== d) { o.open = false; } });
            });
        });

        /* Deep link: #faq-... not used; open first item by default */
        if (items.length) { items[0].open = true; }
    }
}());
