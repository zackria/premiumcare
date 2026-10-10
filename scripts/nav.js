(function () {
    'use strict';

    var header = document.querySelector('header');
    var nav = header && header.querySelector('nav');
    var list = nav && nav.querySelector('ul');
    if (!list) { return; }

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    if (!list.id) { list.id = 'site-menu'; }
    toggle.setAttribute('aria-controls', list.id);
    nav.appendChild(toggle);

    var set = function (open) {
        header.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', open);
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('nav-locked', open);
    };

    toggle.addEventListener('click', function () {
        set(!header.classList.contains('nav-open'));
    });

    list.addEventListener('click', function (e) {
        if (e.target.closest('a')) { set(false); }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('nav-open')) {
            set(false);
            toggle.focus();
        }
    });

    window.matchMedia('(min-width: 769px)').addEventListener('change', function (e) {
        if (e.matches) { set(false); }
    });
}());
