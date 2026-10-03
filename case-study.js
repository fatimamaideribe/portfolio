// Case study behaviour: scroll progress, reveal-on-scroll, image lightbox.
(function () {
    // Opened inside the desktop's built-in browser: hide the "back to desktop" chrome
    if (window.self !== window.top) document.documentElement.classList.add('in-fatos');

    const progress = document.querySelector('.cs-progress');
    if (progress) {
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('in'));
    }

    // Lightbox for any figure image
    const box = document.createElement('div');
    box.className = 'cs-lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image preview');
    box.innerHTML = '<button type="button" aria-label="Close preview">×</button><img alt=""><p></p>';
    document.body.appendChild(box);
    const boxImg = box.querySelector('img');
    const boxCap = box.querySelector('p');
    let lastFocus = null;

    const close = () => {
        box.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    };

    document.querySelectorAll('.cs-fig img, .cs-shots img').forEach((img) => {
        img.tabIndex = 0;
        const open = () => {
            lastFocus = img;
            boxImg.src = img.currentSrc || img.src;
            boxImg.alt = img.alt;
            const cap = img.closest('figure')?.querySelector('figcaption');
            boxCap.textContent = cap ? cap.textContent : img.alt;
            box.classList.add('open');
            document.body.style.overflow = 'hidden';
            box.querySelector('button').focus();
        };
        img.addEventListener('click', open);
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });
    });

    box.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && box.classList.contains('open')) close();
    });
})();
