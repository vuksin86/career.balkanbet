/* ============================================================================
   UNUTRAŠNJE STRANE — ponašanje zajedničko za poslovi-u-lokalima.html,
   poslovi-u-centrali.html, zivot-u-balkan-betu.html, csr.html i
   o-kompaniji.html. Stilovi su u styles.css (prefiks `.ip-`).

   Svaki blok traži svoje elemente i ćuti ako ih na stranici nema, pa obe
   strane učitavaju isti fajl bez ikakvog podešavanja.
============================================================================ */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* HEADER — providan dok je hero iza njega, staklo dobija ČIM SKROL KRENE
     (isto pravilo kao naslovna u varijaciji #3 i oglas). CSS strana je u
     styles.css, marker je `.ip-hero`. */
  var header = document.querySelector('header');
  function updateHeader() { header.classList.toggle('is-solid', window.scrollY > 0); }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* REVEAL — isti .reveal fade-in kao na ostalim stranama, jednom po elementu. */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  /* SLAJDER (mit / realnost). Slajdovi su naslagani u istoj ćeliji grida i
     samo se pretapaju. Automatski na 7s; klik na strelicu restartuje tajmer,
     a tajmer stoji dok je pokazivač nad trakom. */
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var slides = root.querySelectorAll('[data-slide]');
    var countEl = root.querySelector('[data-count]');
    var i = 0, timer = null;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-active', k === i);
        s.setAttribute('aria-hidden', k === i ? 'false' : 'true');
      });
      if (countEl) countEl.innerHTML = '<b>' + pad(i + 1) + '</b> / ' + pad(slides.length);
    }
    function start() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(function () { show(i + 1); }, 7000);
    }
    root.querySelector('[data-prev]').addEventListener('click', function () { show(i - 1); start(); });
    root.querySelector('[data-next]').addEventListener('click', function () { show(i + 1); start(); });
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  /* ČESTA PITANJA — harmonika. Više stavki sme biti otvoreno istovremeno. */
  document.querySelectorAll('.ip-faq__item').forEach(function (item) {
    var btn = item.querySelector('.ip-faq__q');
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* VIDEO KARTICA — poster sa play dugmetom; klik pušta snimak sa zvukom i
     kontrolama, a natpis se sklanja. */
  document.querySelectorAll('.ip-video').forEach(function (box) {
    var video = box.querySelector('video');
    box.querySelector('.ip-video__cover').addEventListener('click', function () {
      box.classList.add('is-playing');
      video.controls = true;
      video.play();
    });
  });

  /* VREMENSKA LINIJA (O kompaniji) — klik na godinu ili strelice menja panel
     i fotografiju; sve se pretapa, ništa ne skače. */
  document.querySelectorAll('[data-timeline]').forEach(function (root) {
    var years = root.querySelectorAll('.ip-year');
    var panels = root.querySelectorAll('.ip-panel');
    var imgs = root.querySelectorAll('.ip-timeline__media img');
    var i = 0;
    function show(n) {
      i = (n + years.length) % years.length;
      [years, panels, imgs].forEach(function (list) {
        list.forEach(function (el, k) { el.classList.toggle('is-active', k === i); });
      });
      years.forEach(function (y, k) { y.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    }
    years.forEach(function (y, k) { y.addEventListener('click', function () { show(k); }); });
    root.querySelector('[data-tl-prev]').addEventListener('click', function () { show(i - 1); });
    root.querySelector('[data-tl-next]').addEventListener('click', function () { show(i + 1); });
    var start = 0;
    years.forEach(function (y, k) { if (y.classList.contains('is-active')) start = k; });
    show(start);
  });

  /* KONTAKT FORMA (CSR, O kompaniji) — NIŠTA ne šalje (nema backend). Jedino
     pravilo je checkbox saglasnosti; submit menja formu potvrdom. */
  document.querySelectorAll('form[data-contact]').forEach(function (form) {
    var err = form.querySelector('[data-error]');
    var done = document.getElementById(form.getAttribute('data-contact'));
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.querySelector('input[type="checkbox"]').checked) {
        err.textContent = 'Potrebno je da prihvatiš uslove pre slanja poruke.';
        err.classList.remove('hidden');
        return;
      }
      err.classList.add('hidden');
      form.classList.add('hidden');
      done.classList.remove('hidden');
    });
  });

  /* ==========================================================================
     PREKIDAČ VARIJACIJE — demo kontrola za prikaz klijentu, nije deo dizajna.
     Isti blok kao na dnu index.html, listanje.html i oglas-primer.html; ovde
     ne menja ništa, ali postoji da izbor ne ispari kad se napusti naslovna.
  ========================================================================== */
  (function () {
    var root = document.documentElement;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'var-toggle';
    function current() {
      var v = root.getAttribute('data-var');
      return v === '3' ? 3 : v === '2' ? 2 : 1;
    }
    var NEXT = { 3: 1, 1: 2, 2: 3 };
    var now = current();
    btn.textContent = '#' + now;
    var label = 'Varijacija #' + now + ' — klikni za varijaciju #' + NEXT[now];
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.addEventListener('click', function () {
      var next = String(NEXT[current()]);
      try { localStorage.setItem('bb-varijacija', next); } catch (e) {}
      var u = new URL(location.href);
      u.searchParams.set('var', next);
      location.href = u.toString();
    });
    document.body.appendChild(btn);
  })();
})();
