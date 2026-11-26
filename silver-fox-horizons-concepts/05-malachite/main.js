/* Silver Fox Horizons — Concept 05 "Malachite" */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var lenis = null;

  /* ---------- Header state ---------- */
  var header = $('[data-header]');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle');
  var nav = $('#site-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Menu';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && nav.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ---------- Video: respect reduced motion ---------- */
  if (reduce) {
    $$('video[autoplay]').forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); });
  }

  /* ---------- Insights filter ---------- */
  var grid = $('[data-insight-grid]');
  if (grid) {
    var words = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var cards = $$('.insight-card', grid);
    var label = $('[data-count-label]');
    var empty = $('[data-empty]');
    var btns = $$('[data-filter]');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        btns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        var shown = [];
        cards.forEach(function (c) {
          var match = f === 'all' || c.getAttribute('data-cat') === f;
          c.hidden = !match;
          c.classList.remove('is-target');
          if (match) shown.push(c);
        });
        var n = shown.length;
        if (label) {
          label.textContent = f === 'all'
            ? 'Showing all ' + words[n] + ' perspectives'
            : 'Showing ' + (words[n] || n) + ' ' + (n === 1 ? 'perspective' : 'perspectives') + ' in ' + btn.textContent;
        }
        if (empty) empty.classList.toggle('is-visible', n === 0);
        if (window.gsap && !reduce) {
          window.gsap.fromTo(shown, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .07, overwrite: true });
        }
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
    if (location.hash) {
      var t = document.getElementById(location.hash.slice(1));
      if (t && t.classList.contains('insight-card')) t.classList.add('is-target');
    }
  }

  /* ---------- Contact form (demo) ---------- */
  var form = $('[data-form]');
  if (form) {
    var status = $('[data-status]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      status.textContent = 'Thank you. This is a demonstration, so your message has not been sent.';
      form.reset();
    });
  }

  /* ---------- Motion ---------- */
  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    doc.classList.add('has-motion');

    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    var EASE = 'expo.out';

    /* Hero intro */
    var tl = gsap.timeline({ defaults: { ease: EASE } });
    var lines = $$('.hero-title .line > span');
    if (lines.length) tl.from(lines, { yPercent: 115, duration: 1.6, stagger: .11 }, .15);
    var heroArch = $$('[data-hero-arch]');
    if (heroArch.length) {
      tl.fromTo(heroArch, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'expo.inOut' }, 0);
      tl.from($$('video, img', heroArch[0]), { scale: 1.3, duration: 2.6, ease: 'expo.out' }, .3);
    }
    var outlines = $$('[data-hero-outline], .about-hero-arch .arch-outline');
    if (outlines.length) tl.from(outlines, { opacity: 0, duration: 1.8, ease: 'power2.out' }, 1.1);
    var items = $$('[data-hero-item]');
    if (items.length) tl.from(items, { y: 26, opacity: 0, duration: 1.4, stagger: .1 }, lines.length ? .55 : .2);
    var kp = $$('.keystone, .hero-visual .medallion-mini');
    if (kp.length) tl.from(kp, { scale: 0, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', stagger: .15 }, 1.3);

    /* Slow spin for mini medallions */
    $$('[data-spin]').forEach(function (el) {
      gsap.to(el, { rotation: 360, duration: 140, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
    });

    /* Generic reveals */
    $$('[data-reveal]').forEach(function (el) {
      gsap.from(el, { y: 30, opacity: 0, duration: 1.4, ease: EASE, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    ST.batch('[data-reveal-stagger]', {
      start: 'top 90%', once: true,
      onEnter: function (batch) { gsap.from(batch, { y: 40, opacity: 0, duration: 1.4, ease: EASE, stagger: .14, overwrite: true }); }
    });

    /* Arch masks open */
    $$('[data-arch]').forEach(function (el) {
      var media = el.querySelector('img, video');
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' })
        .from(media, { scale: 1.32, duration: 2.4, ease: EASE, clearProps: 'transform' }, .2);
    });

    /* Framed images wipe in */
    $$('[data-clip]').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });

    /* Medallion: lines draw, then the whole turns slowly with scroll */
    $$('[data-medallion]').forEach(function (svg) {
      var strokes = $$('.d', svg), dots = $$('.dot', svg);
      gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(dots, { opacity: 0 });
      gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 80%', once: true } })
        .to(strokes, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut', stagger: { each: .018, from: 'end' } })
        .to(dots, { opacity: 1, duration: .8, stagger: .006 }, 1.4);
      gsap.fromTo(svg, { rotation: -20 }, { rotation: 25, ease: 'none', transformOrigin: '50% 50%',
        scrollTrigger: { trigger: svg, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    });

    /* Approach icons & line draw */
    $$('[data-draw-icon]').forEach(function (icon) {
      var s = $$('.d', icon);
      gsap.set(s, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(s, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: .12, scrollTrigger: { trigger: icon, start: 'top 88%', once: true } });
    });
    $$('[data-line]').forEach(function (l) {
      gsap.fromTo(l, { scaleX: 0 }, { scaleX: 1, duration: 2.8, ease: 'power2.inOut', scrollTrigger: { trigger: l.parentNode, start: 'top 80%', once: true } });
    });

    /* Counters */
    $$('[data-count]').forEach(function (el) {
      var end = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var o = { v: 0 };
      gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: function () { el.textContent = o.v.toFixed(dec); } });
    });

    /* Gentle parallax */
    var hv = $('.hero-visual');
    if (hv) gsap.to(hv, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    var hc = $('.hero-copy');
    if (hc) gsap.to(hc, { yPercent: -6, opacity: .35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    window.addEventListener('load', function () { ST.refresh(); });
  }

  if (!reduce && window.gsap && window.ScrollTrigger) {
    try { initMotion(); } catch (err) { /* content stays visible without motion */ }
  }
})();
