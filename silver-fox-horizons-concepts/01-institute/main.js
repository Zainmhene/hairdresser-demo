/* Silver Fox Horizons — Concept 01 "Institute" */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var animate = hasGsap && !reduced;

  if (!animate) root.classList.add('no-anim');

  /* ---------- Header state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  var lenis = null;
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && document.body.classList.contains('menu-open')) setMenu(false);
    });
  }

  /* ---------- Videos: pause toggle + reduced motion ---------- */
  document.querySelectorAll('[data-video-toggle]').forEach(function (btn) {
    var v = document.getElementById(btn.getAttribute('data-video-toggle'));
    if (!v) return;
    function sync() {
      var paused = v.paused;
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    }
    btn.addEventListener('click', function () { v.paused ? v.play() : v.pause(); });
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    if (reduced) { v.removeAttribute('autoplay'); v.pause(); }
    sync();
  });

  /* ---------- Split statement into words ---------- */
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var html = '';
    el.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          html += /^\s+$/.test(t) ? t : '<span class="w">' + t + '</span>';
        });
      } else if (node.nodeType === 1) {
        var cls = node.getAttribute('data-w') === 'amber' ? 'w w--amber' : 'w';
        node.textContent.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          html += /^\s+$/.test(t) ? t : '<span class="' + cls + '">' + t + '</span>';
        });
      }
    });
    el.innerHTML = html;
  });

  /* ---------- Fit the footer wordmark to its container ---------- */
  var big = document.querySelector('.footer__big');
  function fitBig() {
    if (!big) return;
    var box = big.parentNode.clientWidth - parseFloat(getComputedStyle(big.parentNode).paddingLeft) - parseFloat(getComputedStyle(big.parentNode).paddingRight);
    big.style.fontSize = '100px';
    var w = big.scrollWidth;
    if (w > 0) big.style.fontSize = (100 * box / w) + 'px';
  }
  fitBig();
  window.addEventListener('resize', fitBig);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitBig);

  /* ---------- Count-up formatting ---------- */
  function setCount(el, val) {
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    el.textContent = val.toFixed(dec);
  }

  /* ---------- Insights filter ---------- */
  var chips = document.querySelectorAll('.chip[data-filter]');
  if (chips.length) {
    var cards = document.querySelectorAll('.list-grid .card');
    var countEl = document.querySelector('[data-count-out]');
    var emptyEl = document.querySelector('.empty');
    var applyFilter = function (f, fromClick) {
      var n = 0;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filter') === f ? 'true' : 'false'); });
      cards.forEach(function (card) {
        var show = f === 'all' || card.getAttribute('data-cat') === f;
        card.classList.toggle('is-hidden', !show);
        if (show) n++;
      });
      if (countEl) countEl.textContent = 'Showing ' + n + (n === 1 ? ' piece' : ' pieces');
      if (emptyEl) emptyEl.style.display = n ? 'none' : 'block';
      if (fromClick && animate) {
        var vis = Array.prototype.filter.call(cards, function (c) { return !c.classList.contains('is-hidden'); });
        gsap.fromTo(vis, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .06, overwrite: true });
        ScrollTrigger.refresh();
      }
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () { applyFilter(c.getAttribute('data-filter'), true); });
    });
    applyFilter('all', false);
    if (location.hash) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t && t.classList.contains('card')) t.classList.add('is-target');
    }
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector('form[data-demo-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var valid = input.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) : input.value.trim().length > 0;
        if (input.type === 'checkbox') valid = input.checked;
        if (field) field.classList.toggle('is-invalid', !valid);
        input.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (!valid && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;
      var success = document.querySelector('.form-success');
      form.style.display = 'none';
      if (success) { success.classList.add('is-on'); success.focus(); }
    });
    form.querySelectorAll('input, textarea').forEach(function (i) {
      i.addEventListener('input', function () { var f = i.closest('.field'); if (f) f.classList.remove('is-invalid'); });
    });
  }
  var sub = document.querySelector('form[data-demo-subscribe]');
  if (sub) {
    sub.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = sub.parentNode.querySelector('.form-note');
      if (note) note.textContent = 'Thank you. This is a demo, so no subscription has been created yet.';
    });
  }

  /* ---------- Expertise: active side nav (no GSAP needed) ---------- */
  var xpLinks = document.querySelectorAll('.xp__nav a[href^="#"]');
  if (xpLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    xpLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          xpLinks.forEach(function (a) { a.classList.remove('is-active'); });
          var a = map[en.target.id]; if (a) a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Without animation: fill numbers and stop ---------- */
  if (!animate) {
    document.querySelectorAll('[data-count]').forEach(function (el) { setCount(el, parseFloat(el.getAttribute('data-count'))); });
    return;
  }

  /* ======================================================================
     Motion (GSAP + ScrollTrigger + Lenis)
     ====================================================================== */
  gsap.registerPlugin(ScrollTrigger);

  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var land = target.classList.contains('xp-sec') ? (target.querySelector('.xp-sec__n') || target) : target;
        lenis.scrollTo(land, { offset: -120, duration: 1.4 });
        history.replaceState(null, '', id);
      });
    });
  }

  /* Hero headline: masked line reveal */
  var heroLines = document.querySelectorAll('[data-hero] .line > span');
  var tl = gsap.timeline({ delay: .15 });
  if (heroLines.length) {
    tl.to(heroLines, { y: 0, yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: .11 });
  }
  var heroFades = document.querySelectorAll('[data-hero] [data-fade]');
  if (heroFades.length) tl.to(heroFades, { opacity: 1, duration: 1.2, ease: 'power2.out', stagger: .08 }, '-=1.1');

  /* Masked lines elsewhere (page titles below the fold) */
  document.querySelectorAll('[data-lines]').forEach(function (el) {
    if (el.closest('[data-hero]')) return;
    gsap.to(el.querySelectorAll('.line > span'), {
      y: 0, yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: .1,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* Generic reveal */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    if (el.closest('[data-hero]')) {
      tl.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=1.05');
      return;
    }
    var d = parseFloat(el.getAttribute('data-reveal')) || 0;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: d,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });
  gsap.utils.toArray('[data-fade]').forEach(function (el) {
    if (el.closest('[data-hero]')) return;
    gsap.to(el, { opacity: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* Reel: rounded card expands to full-bleed */
  var reel = document.querySelector('.reel');
  if (reel) {
    var media = reel.querySelector('.reel__media');
    var vid = reel.querySelector('video');
    var insetPx = function () {
      var w = document.querySelector('.wrap');
      return w ? parseFloat(getComputedStyle(w).paddingLeft) + Math.max(0, (window.innerWidth - w.getBoundingClientRect().width) / 2) : 24;
    };
    gsap.fromTo(media,
      { clipPath: function () { return 'inset(0px ' + insetPx() + 'px 0px ' + insetPx() + 'px round ' + (window.innerWidth < 640 ? 14 : 20) + 'px)'; } },
      {
        clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'none',
        scrollTrigger: { trigger: reel, start: 'top 85%', end: 'top 5%', scrub: .6, invalidateOnRefresh: true }
      });
    if (vid) {
      gsap.fromTo(vid, { scale: 1.14 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: reel, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
    var cap = reel.querySelector('.reel__caption');
    if (cap) gsap.fromTo(cap, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out', scrollTrigger: { trigger: reel, start: 'top 40%', end: 'top 0%', scrub: .6 } });
  }

  /* Statement: words light up as you scroll */
  document.querySelectorAll('[data-words]').forEach(function (el) {
    // Words light up with scroll and stay lit once read (progress only moves forward).
    var tw = gsap.to(el.querySelectorAll('.w'), { opacity: 1, ease: 'none', stagger: .06, paused: true });
    var maxP = 0;
    ScrollTrigger.create({
      trigger: el, start: 'top 78%', end: 'bottom 45%',
      onUpdate: function (self) {
        if (self.progress <= maxP) return;
        maxP = self.progress;
        gsap.to(tw, { progress: maxP, duration: .6, ease: 'power2.out', overwrite: true });
      }
    });
  });

  /* Count-up */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var from = parseFloat(el.getAttribute('data-from') || '0');
    var o = { v: from };
    setCount(el, from);
    gsap.to(o, {
      v: target, duration: 2.2, ease: 'power3.out',
      onUpdate: function () { setCount(el, o.v); },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* Horizon rules draw in */
  gsap.utils.toArray('[data-rule]').forEach(function (el) {
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  /* Image parallax */
  gsap.utils.toArray('[data-parallax]').forEach(function (wrap) {
    var img = wrap.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Expertise progress bar */
  var bar = document.querySelector('.xp__nav .bar i');
  var xpMain = document.querySelector('.xp__main');
  if (bar && xpMain) {
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: xpMain, start: 'top 40%', end: 'bottom 60%', scrub: true } });
  }

  /* Practices: cursor-following image (desktop, fine pointer) */
  var list = document.querySelector('.practices');
  var cm = document.querySelector('.cursor-media');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
  if (list && cm && fine.matches) {
    var imgs = cm.querySelectorAll('img');
    var xTo = gsap.quickTo(cm, 'x', { duration: .7, ease: 'power3.out' });
    var yTo = gsap.quickTo(cm, 'y', { duration: .7, ease: 'power3.out' });
    var rTo = gsap.quickTo(cm, 'rotation', { duration: .9, ease: 'power3.out' });
    var lastX = 0;
    var w = function () { return cm.offsetWidth; };
    var h = function () { return cm.offsetHeight; };
    gsap.set(cm, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    list.addEventListener('mousemove', function (e) {
      xTo(e.clientX - w() / 2 + 40);
      yTo(e.clientY - h() / 2);
      var dx = e.clientX - lastX; lastX = e.clientX;
      rTo(gsap.utils.clamp(-3.5, 3.5, dx * .25));
    });
    list.querySelectorAll('.practice').forEach(function (row, i) {
      row.addEventListener('mouseenter', function (e) {
        if (!cm.classList.contains('is-live')) {
          gsap.set(cm, { x: e.clientX - w() / 2 + 40, y: e.clientY - h() / 2 });
        }
        cm.classList.add('is-live');
        cm.style.visibility = 'visible';
        list.classList.add('is-hovering');
        list.querySelectorAll('.practice').forEach(function (r) { r.classList.toggle('is-active', r === row); });
        imgs.forEach(function (im, j) { im.classList.toggle('is-on', j === i); im.style.zIndex = j === i ? 2 : 1; });
      });
    });
    list.addEventListener('mouseleave', function () {
      list.classList.remove('is-hovering');
      list.querySelectorAll('.practice').forEach(function (r) { r.classList.remove('is-active'); });
      imgs.forEach(function (im) { im.classList.remove('is-on'); });
      cm.classList.remove('is-live');
      setTimeout(function () { if (!cm.classList.contains('is-live')) cm.style.visibility = 'hidden'; }, 800);
    });
  }

  /* Re-measure once media has loaded */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
