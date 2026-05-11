// LOADER
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      document.getElementById('heroBg').classList.add('loaded');
    }, 2200);
  });

  // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%, -50%) scale(1.8)';
      ring.style.borderColor = 'var(--gold)';
      ring.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.opacity = '0.6';
    });
  });

  // NAVBAR SCROLL
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // SCROLL REVEAL
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => observer.observe(el));

  // PARALLAX
  const quoteBg = document.getElementById('quoteBg');
  window.addEventListener('scroll', () => {
    const section = document.getElementById('quote-section');
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.top < vh && rect.bottom > 0) {
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset = (progress - 0.5) * 80;
      quoteBg.style.setProperty('--parallax-y', offset + 'px');
    }
  });

  // SMOOTH ANCHOR SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // COUNTER ANIMATION
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const text = entry.target.textContent;
        if (text.includes('+25')) animateCounter(entry.target, 25, '+');
        else if (text === '11') animateCounter(entry.target, 11, '');
        else if (text === '50') animateCounter(entry.target, 50, '');
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.exp-number').forEach(el => counterObserver.observe(el));