/* Silver Fox Horizons — Concept 02 “Chancery” */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Dateline ---------- */
  var dateEls = document.querySelectorAll('[data-today]');
  if (dateEls.length) {
    var today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    dateEls.forEach(function (el) { el.textContent = today; });
  }

  /* ---------- Reveals ---------- */
  var targets = document.querySelectorAll('[data-reveal], [data-draw], .plate--scale, .hero');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
    // the hero should always begin on load
    var hero = document.querySelector('.hero');
    if (hero) requestAnimationFrame(function () { setTimeout(function () { hero.classList.add('is-in'); }, 80); });
  }

  /* ---------- Compact masthead ---------- */
  var compact = document.querySelector('.compact');
  var masthead = document.querySelector('.masthead');
  if (compact && masthead) {
    var ticking = false;
    var update = function () {
      var limit = masthead.offsetTop + masthead.offsetHeight;
      var show = window.scrollY > limit;
      compact.classList.toggle('is-visible', show);
      compact.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) compact.removeAttribute('inert'); else compact.setAttribute('inert', '');
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Mobile menu ---------- */
  var sheet = document.getElementById('menu');
  var toggles = document.querySelectorAll('[data-menu-toggle]');
  var lastToggle = null;
  function setMenu(open, from) {
    if (!sheet) return;
    sheet.classList.toggle('is-open', open);
    sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) sheet.removeAttribute('inert'); else sheet.setAttribute('inert', '');
    toggles.forEach(function (t) { t.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      lastToggle = from || null;
      var first = sheet.querySelector('nav a');
      if (first) setTimeout(function () { first.focus(); }, 60);
    } else if (lastToggle) { lastToggle.focus(); }
  }
  toggles.forEach(function (t) {
    t.addEventListener('click', function () { setMenu(!sheet.classList.contains('is-open'), t); });
  });
  if (sheet) {
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('is-open')) setMenu(false); });
  }

  /* ---------- Expertise: contents highlight ---------- */
  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    tocLinks[0].classList.add('is-active');
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
          var link = map[e.target.id];
          if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) cio.observe(s); });
  }

  /* ---------- Insights filter ---------- */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var stories = Array.prototype.slice.call(document.querySelectorAll('[data-category]'));
    var countEl = document.querySelector('[data-count]');
    var empty = document.querySelector('.archive__empty');
    var buttons = filterBar.querySelectorAll('.filter');
    buttons.forEach(function (b) {
      var cat = b.getAttribute('data-filter');
      var n = cat === 'all' ? stories.length : stories.filter(function (s) { return s.getAttribute('data-category') === cat; }).length;
      var sup = document.createElement('sup'); sup.textContent = n; b.appendChild(sup);
    });
    var apply = function (cat) {
      var shown = 0;
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter') === cat ? 'true' : 'false'); });
      stories.forEach(function (s) {
        var match = cat === 'all' || s.getAttribute('data-category') === cat;
        s.hidden = !match;
        s.classList.remove('is-entering');
        if (match) { shown++; if (!reduce) { void s.offsetWidth; s.classList.add('is-entering'); } }
      });
      if (countEl) countEl.textContent = shown === 1 ? 'One essay' : shown + ' essays';
      if (empty) empty.hidden = shown !== 0;
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-filter');
        apply(cat);
        if (history.replaceState) history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat);
      });
    });
    var initial = (location.hash || '').slice(1);
    var valid = Array.prototype.some.call(buttons, function (b) { return b.getAttribute('data-filter') === initial; });
    apply(valid ? initial : 'all');
  }

  /* ---------- Contact letter ---------- */
  var letter = document.querySelector('.letter');
  if (letter) {
    var form = letter.querySelector('form');
    var practice = new URLSearchParams(location.search).get('practice');
    var sel = form.querySelector('select');
    if (practice && sel) { Array.prototype.forEach.call(sel.options, function (o) { if (o.value === practice) sel.value = practice; }); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = f.type === 'checkbox' ? !f.checked : !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.classList.toggle('field-error', bad);
        f.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) return;
      var name = form.querySelector('#f-name').value.trim();
      var out = letter.querySelector('[data-thanks-name]');
      if (out) out.textContent = name;
      letter.classList.add('is-sent');
      var t = letter.querySelector('.letter__thanks');
      if (t) { t.setAttribute('tabindex', '-1'); t.focus(); }
    });
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('field-error'); f.removeAttribute('aria-invalid'); });
    });
  }

  /* ---------- Film: pause when off-screen / reduced motion ---------- */
  document.querySelectorAll('video[autoplay]').forEach(function (v) {
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); return; }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); } });
      }).observe(v);
    }
  });
})();
