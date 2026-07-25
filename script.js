/* ===== VELVET — Interactions ===== */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Header scroll state --- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Mobile menu --- */
  const toggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const openMenu = () => {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-label', 'Menu sluiten');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-label', 'Menu openen');
    document.body.style.overflow = '';
  };
  let menuOpen = false;
  toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuOpen ? openMenu() : closeMenu();
  });
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => { menuOpen = false; closeMenu(); })
  );
  // Sluit menu met Escape en herstel bij draaien naar desktop
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { menuOpen = false; closeMenu(); } });
  window.addEventListener('resize', () => { if (window.innerWidth >= 1024 && menuOpen) { menuOpen = false; closeMenu(); } });

  /* --- Scroll reveal --- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  /* --- Reviews slider --- */
  const track = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('sliderDots');
  if (track) {
    const slides = track.children.length;
    let current = 0;

    for (let i = 0; i < slides; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Review ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.children;

    function goTo(i) {
      current = (i + slides) % slides;
      track.style.transform = `translateX(-${current * 100}%)`;
      [...dots].forEach((d, idx) => d.classList.toggle('active', idx === current));
    }

    let auto = setInterval(() => goTo(current + 1), 6000);
    const slider = document.querySelector('.slider');
    const restart = () => { clearInterval(auto); auto = setInterval(() => goTo(current + 1), 6000); };
    slider.addEventListener('mouseenter', () => clearInterval(auto));
    slider.addEventListener('mouseleave', restart);

    // Swipe / veeg op touch
    let startX = 0, startY = 0, swiping = false;
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY; swiping = true; clearInterval(auto);
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      if (!swiping) return;
      swiping = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        goTo(current + (dx < 0 ? 1 : -1));
      }
      restart();
    }, { passive: true });
  }

  /* --- Galerij: Bekijk meer / minder --- */
  const moreBtn = document.getElementById('galleryMore');
  const masonry = document.querySelector('.masonry');
  if (moreBtn && masonry) {
    moreBtn.addEventListener('click', () => {
      const showing = masonry.classList.toggle('show-all');
      moreBtn.textContent = showing ? 'Bekijk minder' : 'Bekijk meer';
      moreBtn.setAttribute('aria-expanded', showing ? 'true' : 'false');
      if (!showing) document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* --- Footer year --- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
});
