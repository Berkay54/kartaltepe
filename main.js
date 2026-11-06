(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var motion = hasGsap && !reduce;
  var REEL = /[?&]reel=1/.test(location.search); // video kaydı: kaydırma ve zaman dışarıdan yönetilir
  var hd = document.getElementById('hd');
  var lenis = null;

  /* ---------- Temel davranışlar (her durumda) ---------- */

  function onScroll() { hd.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var btn = document.getElementById('menuBtn'), sheet = document.getElementById('sheet');
  function setMenu(open) {
    sheet.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    btn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-list');
    if (lenis) { open ? lenis.stop() : lenis.start(); } else { document.body.style.overflow = open ? 'hidden' : ''; }
  }
  btn.addEventListener('click', function () { setMenu(!sheet.classList.contains('open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) { setMenu(false); btn.focus(); } });

  var sel = document.getElementById('makine');
  document.querySelectorAll('[data-model]').forEach(function (a) {
    a.addEventListener('click', function () { sel.value = a.getAttribute('data-model'); });
  });

  // Teklif formu (demo: sunucuya göndermez)
  var form = document.getElementById('form'), box = document.getElementById('formBox'), send = document.getElementById('send');
  function check(id, ok) {
    var el = document.getElementById(id);
    el.closest('.f').classList.toggle('bad', !ok);
    el.setAttribute('aria-invalid', !ok);
    return ok;
  }
  form.ad.addEventListener('input', function () { if (this.closest('.bad')) check('ad', this.value.trim().length > 1); });
  form.tel.addEventListener('input', function () { if (this.closest('.bad')) check('tel', this.value.replace(/\D/g, '').length >= 10); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var okAd = check('ad', form.ad.value.trim().length > 1);
    var okTel = check('tel', form.tel.value.replace(/\D/g, '').length >= 10);
    if (!okAd || !okTel) { (okAd ? form.tel : form.ad).focus(); return; }
    send.classList.add('loading'); send.setAttribute('aria-busy', 'true');
    setTimeout(function () {
      document.getElementById('doneTitle').textContent = 'Teşekkürler ' + form.ad.value.trim().split(' ')[0] + ', talebiniz bize ulaştı.';
      box.classList.add('sent'); send.classList.remove('loading'); send.removeAttribute('aria-busy');
      if (motion) ScrollTrigger.refresh();
    }, 900);
  });

  // Sayfa içi bağlantılar (Lenis varsa yumuşak)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    var target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    if (sheet.classList.contains('open')) setMenu(false);
    if (lenis) { e.preventDefault(); lenis.scrollTo(target, { offset: target === 0 ? 0 : -hd.offsetHeight, duration: 1.4 }); }
  });

  var vid = document.getElementById('vid');
  if (!motion) return; // Hareket azaltılmışsa ya da GSAP yüklenemediyse: sade, statik sayfa

  /* ---------- Hareket katmanı ---------- */

  gsap.registerPlugin(ScrollTrigger, SplitText);
  var EXPO = 'expo.out';

  // Lenis yumuşak kaydırma, ScrollTrigger ile senkron
  if (typeof Lenis !== 'undefined' && !REEL) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Video yalnızca görünürken oynasın
  ScrollTrigger.create({
    trigger: '#kabul', start: 'top bottom', end: 'bottom top',
    onToggle: function (s) { if (s.isActive) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else { vid.pause(); } }
  });

  // İmleç halkası ve mıknatıslı butonlar (yalnızca fare)
  if (finePointer && !REEL) {
    document.body.classList.add('has-cur');
    var cur = document.querySelector('.cur'), curText = cur.querySelector('span');
    var cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
    var cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', function (e) {
      if (!cur.classList.contains('on')) { gsap.set(cur, { x: e.clientX, y: e.clientY }); cur.classList.add('on'); }
      cx(e.clientX); cy(e.clientY);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { cur.classList.remove('on'); });
    document.addEventListener('pointerover', function (e) {
      var lab = e.target.closest('[data-cursor]');
      var lnk = e.target.closest('a,button,input,select,textarea,label');
      cur.classList.toggle('label', !!lab && !lnk);
      cur.classList.toggle('link', !!lnk);
      curText.textContent = lab && !lnk ? lab.getAttribute('data-cursor') : '';
    });
    document.querySelectorAll('.mag').forEach(function (m) {
      var mx = gsap.quickTo(m, 'x', { duration: 0.4, ease: 'power3' });
      var my = gsap.quickTo(m, 'y', { duration: 0.4, ease: 'power3' });
      m.addEventListener('pointermove', function (e) {
        var r = m.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      m.addEventListener('pointerleave', function () { gsap.to(m, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' }); });
    });
  }

  function countUp(el) {
    var end = +el.getAttribute('data-count'), dots = el.textContent.indexOf('.') > -1, o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: function () {
      var n = Math.round(o.v); el.textContent = dots ? n.toLocaleString('tr-TR') : n;
    } });
  }

  document.fonts.ready.then(function () {

    /* Hero: harf harf başlık, fotoğraf açılışı, kaydırınca genişleme */
    var h1 = new SplitText('#h1', { type: 'lines,chars', mask: 'lines' });
    var heroImg = document.getElementById('heroImg'), heroPic = heroImg.querySelector('img');
    gsap.set(heroPic, { yPercent: -8, scale: 1.18 });
    var intro = gsap.timeline({ defaults: { ease: EXPO } });
    intro.from(h1.chars, { yPercent: 115, duration: 1.2, stagger: 0.018 })
         .from('.hero-side > *', { y: 28, opacity: 0, duration: 1, stagger: 0.1 }, 0.35)
         .fromTo(heroImg, { clipPath: 'inset(26% 4% 0% 4%)' }, { clipPath: 'inset(0% 4% 0% 4%)', duration: 1.6, ease: 'expo.inOut' }, 0.1)
         .to(heroPic, { scale: 1.06, duration: 2.2 }, 0.1);

    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
        .fromTo(heroImg, { clipPath: 'inset(0% 4% 0% 4%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', immediateRender: false }, 0)
        .to(heroPic, { yPercent: 8, scale: 1, ease: 'none' }, 0)
        .to('.hero-top', { y: -90, opacity: 0.25, ease: 'none' }, 0);

    /* Kinetik şerit: satırlar ters yönlere akar */
    document.querySelectorAll('.band-row').forEach(function (row) {
      var dir = +row.getAttribute('data-dir');
      gsap.fromTo(row, { xPercent: dir < 0 ? 0 : -22 }, { xPercent: dir < 0 ? -22 : 0, ease: 'none',
        scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* Bölüm başlıkları: satır satır maskeden */
    document.querySelectorAll('h2[data-split]').forEach(function (h) {
      var s = new SplitText(h, { type: 'lines', mask: 'lines' });
      gsap.from(s.lines, { yPercent: 110, duration: 1.1, ease: EXPO, stagger: 0.08,
        scrollTrigger: { trigger: h, start: 'top 88%' } });
    });

    /* Makineler: masaüstünde sabitlenen yatay vitrin, mobilde dikey */
    var mak = document.querySelector('.mak'), track = document.getElementById('makTrack');
    var progSpans = document.querySelectorAll('.mak-prog span'), progBars = document.querySelectorAll('.mak-prog i');
    var slides = gsap.utils.toArray('.slide');
    var mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', function () {
      mak.classList.add('is-pan');
      track.setAttribute('data-cursor', 'Kaydırın');
      var dist = function () { return track.scrollWidth - window.innerWidth; };
      var pan = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: mak, start: 'top top', end: function () { return '+=' + dist(); },
          pin: true, scrub: 0.8, invalidateOnRefresh: true,
          onUpdate: function (s) {
            var p = s.progress * slides.length;
            progBars.forEach(function (b, i) { gsap.set(b, { scaleX: gsap.utils.clamp(0, 1, p - i) }); });
            var idx = Math.min(slides.length - 1, Math.floor(p));
            progSpans.forEach(function (sp, i) { sp.classList.toggle('on', i === idx); });
          }
        }
      });
      slides.forEach(function (sl) {
        gsap.fromTo(sl.querySelector('.slide-img img'), { xPercent: -7 }, { xPercent: 7, ease: 'none',
          scrollTrigger: { trigger: sl, containerAnimation: pan, start: 'left right', end: 'right left', scrub: true } });
        gsap.from(sl.querySelectorAll('.model, h3, .lead, .specs > div, .lnk'), { y: 30, opacity: 0, duration: 0.9, ease: EXPO, stagger: 0.07,
          scrollTrigger: { trigger: sl, containerAnimation: pan, start: 'left 65%' } });
        ScrollTrigger.create({ trigger: sl, containerAnimation: pan, start: 'left 65%', once: true,
          onEnter: function () { sl.querySelectorAll('[data-count]').forEach(countUp); } });
      });
      return function () { mak.classList.remove('is-pan'); track.removeAttribute('data-cursor'); gsap.set(progBars, { clearProps: 'all' }); };
    });

    mm.add('(max-width: 900px)', function () {
      slides.forEach(function (sl) {
        var img = sl.querySelector('.slide-img');
        gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut',
          scrollTrigger: { trigger: img, start: 'top 85%' } });
        gsap.from(sl.querySelectorAll('.model, h3, .lead, .specs > div, .lnk'), { y: 24, opacity: 0, duration: 0.9, ease: EXPO, stagger: 0.06,
          scrollTrigger: { trigger: sl, start: 'top 60%' } });
        ScrollTrigger.create({ trigger: sl.querySelector('.specs'), start: 'top 85%', once: true,
          onEnter: function () { sl.querySelectorAll('[data-count]').forEach(countUp); } });
      });
    });

    /* Hizmet: panorama paralaksı, çizilen zaman çizelgesi */
    gsap.fromTo('.pano img', { yPercent: -12 }, { yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.pano', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.pano', { clipPath: 'inset(0% 6% 0% 6%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: '.pano', start: 'top bottom', end: 'center center', scrub: true } });

    var stepLis = document.querySelectorAll('.steps li');
    var vertical = window.matchMedia('(max-width: 900px)').matches;
    gsap.fromTo('.steps-line', vertical ? { scaleY: 0, transformOrigin: '0 0' } : { scaleX: 0 }, {
      scaleX: 1, scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '#steps', start: 'top 78%', end: vertical ? 'bottom 60%' : 'top 30%', scrub: true,
        onUpdate: function (s) { stepLis.forEach(function (li, i) { li.classList.toggle('on', s.progress >= i / stepLis.length + 0.02 || (i === 0 && s.progress > 0)); }); } }
    });
    gsap.from('.steps li > *', { y: 24, opacity: 0, duration: 0.9, ease: EXPO, stagger: 0.05,
      scrollTrigger: { trigger: '#steps', start: 'top 82%' } });

    /* Galeri: farklı hızlarda sütunlar, perde gibi açılan kareler */
    document.querySelectorAll('.gal-col').forEach(function (col) {
      var sp = +col.getAttribute('data-speed');
      gsap.fromTo(col, { yPercent: sp * -0.5 }, { yPercent: sp * 0.5, ease: 'none',
        scrollTrigger: { trigger: '#gal', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    document.querySelectorAll('.gal figure').forEach(function (f, i) {
      gsap.fromTo(f, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', delay: (i % 2) * 0.1,
        scrollTrigger: { trigger: f, start: 'top 90%' } });
      gsap.from(f.querySelector('img'), { scale: 1.3, duration: 1.8, ease: EXPO, scrollTrigger: { trigger: f, start: 'top 90%' } });
    });

    /* Kalite: video sabitlenir, cümle kelime kelime yanar */
    var words = new SplitText('#h-kab', { type: 'words' }).words;
    gsap.timeline({ scrollTrigger: { trigger: '#kabul', start: 'top top', end: '+=110%', pin: true, scrub: 0.6 } })
        .fromTo(vid, { scale: 1.18 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo(words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.08, duration: 0.3 }, 0.05)
        .from('#kabul p', { y: 24, opacity: 0, ease: 'none', duration: 0.25 }, '>-0.05');

    /* İletişim ve footer */
    gsap.from('.kanal li', { y: 24, opacity: 0, duration: 0.9, ease: EXPO, stagger: 0.07, scrollTrigger: { trigger: '.kanal', start: 'top 85%' } });
    gsap.from('.form', { y: 48, opacity: 0, duration: 1.1, ease: EXPO, scrollTrigger: { trigger: '.form', start: 'top 88%' } });
    var mark = new SplitText('#ftMark', { type: 'chars' });
    gsap.from(mark.chars, { yPercent: 105, duration: 1.1, ease: EXPO, stagger: 0.035, scrollTrigger: { trigger: '#ftMark', start: 'top 95%' } });

    ScrollTrigger.refresh();
    window.__ready = true;
  });
})();
