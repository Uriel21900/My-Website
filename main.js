/* ═══════════════════════════════════════════════════════════════
   AURORA CANVAS BACKGROUND
═══════════════════════════════════════════════════════════════ */
(function initAurora() {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const orbs = [
    { x: 0.25, y: 0.35, r: 0.55, dx: 0.00018, dy: 0.00012, color: [124, 58, 237] },
    { x: 0.75, y: 0.55, r: 0.50, dx:-0.00015, dy: 0.00020, color: [6,  182, 212] },
    { x: 0.50, y: 0.15, r: 0.45, dx: 0.00010, dy:-0.00018, color: [16, 185, 129] },
    { x: 0.80, y: 0.20, r: 0.38, dx:-0.00022, dy: 0.00014, color: [139, 92, 246] },
  ];

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Dark base
    ctx.fillStyle = '#07070f';
    ctx.fillRect(0, 0, W, H);

    // Aurora orbs
    for (const orb of orbs) {
      orb.x += orb.dx * Math.sin(t * 0.7 + orb.dy * 10000);
      orb.y += orb.dy * Math.cos(t * 0.5 + orb.dx * 10000);
      if (orb.x < 0.05 || orb.x > 0.95) orb.dx *= -1;
      if (orb.y < 0.05 || orb.y > 0.95) orb.dy *= -1;

      const cx = orb.x * W;
      const cy = orb.y * H;
      const radius = orb.r * Math.min(W, H);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const [r, g, b] = orb.color;
      grad.addColorStop(0,   `rgba(${r},${g},${b},0.18)`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},0.09)`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // Subtle grid noise overlay
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, 0, W, H);

    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ═══════════════════════════════════════════════════════════════
   TYPEWRITER EFFECT
═══════════════════════════════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Neural Networks',
    'Language Models',
    'Computer Vision',
    'Intelligent Agents',
    'Deep Learning',
    'Data Pipelines',
  ];

  let wordIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const word = words[wordIdx];

    if (!deleting) {
      el.textContent = word.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        setTimeout(() => { deleting = true; tick(); }, 2200);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = word.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 45);
    }
  }
  setTimeout(tick, 800);
})();


/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════════ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(idx * 80, 400));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════════════
   NAVBAR: scroll effect + active link
═══════════════════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  // Scroll: add .scrolled class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }
})();


/* ═══════════════════════════════════════════════════════════════
   PROJECT CARD TILT EFFECT (subtle 3D on hover)
═══════════════════════════════════════════════════════════════ */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   SMOOTH SCROLL for all internal links
═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
