document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }

    var toggle = navbar.querySelector('.nav-toggle');
    var navLinks = navbar.querySelector('.nav-links');
    if (!toggle || !navLinks) {
        return;
    }

    function closeMenu() {
        navbar.classList.remove('nav-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        navbar.classList.add('nav-open');
        toggle.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function () {
        if (navbar.classList.contains('nav-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.addEventListener('click', function (event) {
        var target = event.target;
        if (target && target.tagName === 'A' && window.innerWidth <= 768) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});
