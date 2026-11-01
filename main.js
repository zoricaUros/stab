document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Header: pozadina pri skrolu ---------- */
    const header = document.getElementById('header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobilna navigacija ---------- */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const closeNav = () => {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
    };
    burger.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

    /* ---------- Tabovi menija ---------- */
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.menu');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.toggle('is-active', t === tab));
            panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === tab.dataset.tab));
            tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });

    /* ---------- Reveal animacije pri skrolu ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    /* ---------- Status: otvoreno / zatvoreno (svaki dan 08–24) ---------- */
    const OPEN = 8, CLOSE = 24;
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const isOpen = h >= OPEN && h < CLOSE;
    document.getElementById('statusText').textContent = isOpen ? 'Otvoreno sada' : 'Otvaramo u 08:00';
    document.getElementById('statusDot').classList.toggle('is-closed', !isOpen);

    /* ---------- Forma za rezervaciju (demo) ---------- */
    const form = document.getElementById('reservationForm');
    const msg = document.getElementById('formMsg');
    form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(input => {
            const bad = !input.value.trim();
            input.classList.toggle('is-invalid', bad);
            if (bad) valid = false;
        });
        if (!valid) {
            msg.style.color = '#d9806f';
            msg.textContent = 'Molimo popunite sva obavezna polja.';
            return;
        }

        /* Laravel: ovde fetch POST ka ruti, sa CSRF tokenom:
           fetch(form.action, {
               method: 'POST',
               headers: {
                   'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                   'Accept': 'application/json'
               },
               body: new FormData(form)
           })
        */
        msg.style.color = '';
        msg.textContent = 'Hvala! Javićemo vam se uskoro radi potvrde.';
        form.reset();
    });

    /* ---------- Godina u footeru ---------- */
    document.getElementById('year').textContent = new Date().getFullYear();
});
