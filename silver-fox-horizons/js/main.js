/* ==========================================================================
   Silver Fox Horizons — main.js
   Preloader · Lenis smooth scroll · header · mobile menu · hero sequence
   ========================================================================== */
(() => {
  'use strict';

  const doc = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const preloader = $('[data-preloader]');

  // If the animation libraries fail to load, show the page plainly.
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) {
    doc.classList.remove('js', 'is-loading');
    doc.classList.add('no-js');
    preloader && preloader.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  let EASE = 'expo.out';
  if (window.CustomEase) {
    gsap.registerPlugin(CustomEase);
    EASE = CustomEase.create('sfh', '.16,1,.3,1');
  }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileMQ = matchMedia('(max-width: 767px)');

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  doc.classList.add('is-loading');
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ------------------------------------------------------------------------
     Lenis smooth scroll
     ------------------------------------------------------------------------ */
  let lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* ------------------------------------------------------------------------
     Header
     ------------------------------------------------------------------------ */
  const header = $('[data-header]');
  gsap.set(header, { autoAlpha: 0, y: -14 });
  ScrollTrigger.create({
    start: 48,
    end: 'max',
    onToggle: (self) => header.classList.toggle('is-scrolled', self.isActive),
  });

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */
  const menu = $('[data-menu]');
  const menuToggle = $('[data-menu-toggle]');
  const menuLabel = $('[data-menu-label]');
  let menuOpen = false;

  const menuTl = gsap.timeline({ paused: true })
    .to(menu, { autoAlpha: 1, duration: 0.7, ease: 'power2.out' })
    .fromTo($$('.menu__text', menu), { yPercent: 115 }, { yPercent: 0, duration: 1.3, ease: EASE, stagger: 0.08 }, 0.1)
    .fromTo($$('.menu__index, .menu__foot > *', menu), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE, stagger: 0.06 }, 0.3);

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    doc.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuLabel.textContent = 'Close';
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    lenis && lenis.stop();
    menuTl.timeScale(1).play();
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    doc.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuLabel.textContent = 'Menu';
    menu.setAttribute('inert', '');
    menu.setAttribute('aria-hidden', 'true');
    lenis && lenis.start();
    menuTl.timeScale(1.8).reverse();
  }

  menuToggle.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && closeMenu());

  /* ------------------------------------------------------------------------
     In-page links (smooth with Lenis; sections not built yet are ignored)
     ------------------------------------------------------------------------ */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (hash.length < 2) return;
      const target = hash === '#top' ? 0 : document.querySelector(hash);
      e.preventDefault();
      closeMenu();
      if (target === null) return;
      if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else if (target === 0) window.scrollTo(0, 0);
      else target.scrollIntoView();
    });
  });

  /* ------------------------------------------------------------------------
     Hero: elements
     ------------------------------------------------------------------------ */
  const hero = $('[data-hero]');
  const canvas = $('[data-hero-canvas]');
  const video = $('[data-hero-video]');
  const titleMain = $('[data-hero-main]');
  const titleAccent = $('[data-hero-accent]');
  const ledeEls = $$('[data-hero-lede]');
  const label = $('[data-hero-label]');
  const rule = $('[data-hero-rule]');
  const cue = $('[data-scroll-cue]');

  /* ------------------------------------------------------------------------
     Hero: text phases. Each phase is a paused timeline that plays forward
     when its scroll threshold is crossed and reverses when you scroll back.
     ------------------------------------------------------------------------ */
  const phases = {};
  let introDone = false;

  function setPhase(key, on, instant = false) {
    const p = phases[key];
    if (!p || p.on === on) return;
    p.on = on;
    if (instant) { p.tl.pause().progress(on ? 1 : 0); return; }
    if (on) p.tl.timeScale(1).play();
    else p.tl.timeScale(1.75).reverse();
  }

  phases.label = {
    on: false,
    tl: gsap.timeline({ paused: true })
      .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: EASE })
      .fromTo(label, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.4, ease: EASE }, 0.15)
      .fromTo(cue, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, ease: EASE }, 0.35),
  };

  phases.lede = {
    on: false,
    tl: gsap.timeline({ paused: true })
      .fromTo(ledeEls, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.4, ease: EASE, stagger: 0.08 }),
  };

  phases.cue = {
    on: false,
    tl: gsap.timeline({ paused: true })
      .fromTo(cue.children, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 10, duration: 1, ease: 'power2.out' }),
  };

  // Headline lines: masked, line by line. autoSplit re-splits on resize / font swap.
  function splitLines(el, key) {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      aria: 'none',
      autoSplit: true,
      onSplit(self) {
        const prev = phases[key];
        if (prev) prev.tl.kill();
        const tl = gsap.timeline({ paused: true })
          .fromTo(self.lines, { yPercent: 112 }, { yPercent: 0, duration: 1.5, ease: EASE, stagger: 0.08 });
        const on = prev ? prev.on : false;
        tl.progress(on ? 1 : 0);
        phases[key] = { on, tl };
      },
    });
  }

  // Scroll thresholds for the pinned desktop sequence (0 → 1 across 300vh).
  function syncPhases(p) {
    setPhase('label', true);
    setPhase('main', p >= 0.2);
    setPhase('accent', p >= 0.3);
    setPhase('lede', p >= 0.55);
    setPhase('cue', p >= 0.8);
  }

  /* ------------------------------------------------------------------------
     Hero: canvas frame sequence (desktop)
     ------------------------------------------------------------------------ */
  const FRAME_COUNT = parseInt(canvas.dataset.frameCount, 10) || 0;
  const frameSrc = (i) => canvas.dataset.frameSrc.replace('{n}', String(i + 1).padStart(3, '0'));
  const frames = new Array(FRAME_COUNT);
  const ctx = canvas.getContext('2d', { alpha: false });
  const seq = { progress: 0, frame: 0, drawn: null, raf: 0 };
  let onFrameProgress = null;
  let framesPromise = null;

  function loadFrames(indices) {
    if (framesPromise) return framesPromise;
    framesPromise = new Promise((resolve) => {
      let settled = 0;
      const total = indices.length;
      const settle = () => {
        settled += 1;
        onFrameProgress && onFrameProgress(settled / total);
        if (settled === total) resolve();
      };
      indices.forEach((i) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          frames[i] = img;
          if (!seq.drawn || i === seq.frame) requestDraw();
          settle();
        };
        img.onerror = settle;
        img.src = frameSrc(i);
      });
    });
    return framesPromise;
  }

  function nearestFrame(i) {
    if (frames[i]) return frames[i];
    for (let d = 1; d < FRAME_COUNT; d += 1) {
      if (frames[i - d]) return frames[i - d];
      if (frames[i + d]) return frames[i + d];
    }
    return null;
  }

  function draw() {
    seq.raf = 0;
    const img = nearestFrame(seq.frame);
    if (!img || img === seq.drawn) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    seq.drawn = img;
  }

  function requestDraw() {
    if (!seq.raf) seq.raf = requestAnimationFrame(draw);
  }

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    seq.drawn = null;
    requestDraw();
  }

  const setCanvasScale = gsap.quickSetter(canvas, 'scale');

  function updateSequence(p) {
    seq.progress = p;
    seq.frame = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
    requestDraw();
    setCanvasScale(1 + p * 0.06); // slow push-in
    if (introDone) syncPhases(p);
  }

  /* ------------------------------------------------------------------------
     Hero: mobile video
     ------------------------------------------------------------------------ */
  function videoReady() {
    if (reduceMotion) return Promise.resolve(); // poster only, no autoplay
    if (!video.getAttribute('src')) {
      video.muted = true;
      video.preload = 'auto';
      video.src = video.dataset.src;
    }
    const ready = new Promise((r) => {
      if (video.readyState >= 3) r();
      video.addEventListener('canplay', r, { once: true });
      video.addEventListener('error', r, { once: true });
    });
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
    return ready;
  }

  /* ------------------------------------------------------------------------
     Responsive set-up: pinned frames ≥768px, looping film below
     ------------------------------------------------------------------------ */
  const mm = gsap.matchMedia();
  let mediaReady = Promise.resolve();
  let ro = null;

  mm.add('(min-width: 768px)', () => {
    sizeCanvas();
    ro = new ResizeObserver(sizeCanvas);
    ro.observe(canvas);

    if (reduceMotion) {
      mediaReady = loadFrames([0]);
      return () => { ro.disconnect(); };
    }

    const all = Array.from({ length: FRAME_COUNT }, (_, i) => i);
    mediaReady = loadFrames(all);

    const st = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: () => '+=' + window.innerHeight * 3,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => updateSequence(self.progress),
    });
    updateSequence(st.progress);

    return () => {
      ro.disconnect();
      gsap.set(canvas, { clearProps: 'transform' });
    };
  });

  mm.add('(max-width: 767px)', () => {
    mediaReady = videoReady();
    if (introDone) mobileIntro();

    const st = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => introDone && setPhase('cue', self.progress > 0.06),
    });

    return () => { st.kill(); video.pause(); };
  });

  function mobileIntro() {
    if (reduceMotion) return allPhasesOn();
    setPhase('label', true);
    gsap.delayedCall(0.3, () => setPhase('main', true));
    gsap.delayedCall(0.55, () => setPhase('accent', true));
    gsap.delayedCall(1.0, () => setPhase('lede', true));
  }

  function allPhasesOn() {
    ['label', 'main', 'accent', 'lede'].forEach((k) => setPhase(k, true, true));
  }

  /* ------------------------------------------------------------------------
     Preloader → intro
     ------------------------------------------------------------------------ */
  const plLogo = $('[data-preloader-logo]');
  const plFill = $('[data-preloader-fill]');
  const fillTo = gsap.quickTo(plFill, 'scaleX', { duration: 0.8, ease: 'power3.out' });

  gsap.to(plLogo, { autoAlpha: 1, duration: reduceMotion ? 0.2 : 1.4, ease: 'power2.out', delay: 0.1 });

  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(3000)])
    .then(() => {
      splitLines(titleMain, 'main');
      splitLines(titleAccent, 'accent');
    });

  if (mobileMQ.matches || reduceMotion) {
    fontsReady.then(() => fillTo(0.5));
  } else {
    onFrameProgress = (r) => fillTo(r);
  }

  Promise.all([
    wait(reduceMotion ? 300 : 1500),
    fontsReady,
    Promise.race([mediaReady, wait(mobileMQ.matches ? 4000 : 12000)]),
  ]).then(revealSite);

  function revealSite() {
    onFrameProgress = null;
    fillTo(1);
    doc.classList.add('is-ready');

    const tl = gsap.timeline({ delay: reduceMotion ? 0.1 : 0.7 });
    tl.to(plLogo, { autoAlpha: 0, duration: 0.6, ease: 'power2.in' })
      .to(preloader, { autoAlpha: 0, duration: reduceMotion ? 0.3 : 1.1, ease: 'power2.inOut' }, '-=0.15')
      .add(() => {
        doc.classList.remove('is-loading');
        lenis && lenis.start();
        ScrollTrigger.refresh();
        introDone = true;
        if (reduceMotion) allPhasesOn();
        else if (mobileMQ.matches) mobileIntro();
        else syncPhases(seq.progress);
      }, '-=0.6')
      .to(header, { autoAlpha: 1, y: 0, duration: 1.4, ease: EASE }, '<')
      .add(() => preloader.remove());
  }
})();
