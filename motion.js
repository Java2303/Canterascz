// Movimiento de interfaz: revelado al hacer scroll, estado del header y parallax suave.
// Todo se desactiva si el usuario pide menos movimiento.
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Marca los bloques de cada sección para que aparezcan en cascada
  function markReveals() {
    document.querySelectorAll('main > section').forEach((section) => {
      const root = section.firstElementChild;
      if (!root) return;

      Array.from(root.children).forEach((block) => {
        // Si el bloque tiene un único contenedor interno (p. ej. la portada), animamos sus hijos
        let items = [block];
        if (block.children.length === 1 && block.firstElementChild.children.length > 1) {
          items = Array.from(block.firstElementChild.children);
        } else if (block.matches('.grid, .flex, .space-y-4, ul')) {
          items = Array.from(block.children);
        }

        items.forEach((el, i) => {
          el.setAttribute('data-reveal', '');
          el.style.setProperty('--i', i);
        });
      });
    });
  }

  // Revela cada elemento la primera vez que entra en pantalla
  function observeReveals() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    targets.forEach((el) => io.observe(el));
  }

  // Header: sombra al empezar a desplazar
  function setupHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // Parallax muy leve en la imagen de portada
  function setupParallax() {
    if (reduceMotion.matches) return;
    const heroImg = document.querySelector('main > section:first-child img');
    if (!heroImg) return;

    let ticking = false;
    const apply = () => {
      const y = Math.min(window.scrollY, window.innerHeight) * 0.25;
      heroImg.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(1.08)`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    }, { passive: true });
  }

  // Carruseles: la tarjeta centrada crece y las laterales se atenúan
  function setupCarouselDepth() {
    if (reduceMotion.matches) return;
    document.querySelectorAll('#santacruz-carousel, #leaders-carousel, #honorificos-carousel').forEach((track) => {
      const items = Array.from(track.children);
      let frame = 0;

      const apply = () => {
        frame = 0;
        // Solo en carruseles que de verdad se desplazan (en escritorio la galería es una cuadrícula)
        const scrollable = track.scrollWidth > track.clientWidth + 4;
        const rect = track.getBoundingClientRect();
        const mid = rect.left + rect.width / 2;
        items.forEach((el) => {
          if (!scrollable) {
            el.style.transform = '';
            el.style.opacity = '';
            return;
          }
          const r = el.getBoundingClientRect();
          const d = Math.min(1, Math.abs(r.left + r.width / 2 - mid) / (rect.width / 2));
          el.style.transform = `scale(${(1 - d * 0.06).toFixed(3)})`;
          el.style.opacity = (1 - d * 0.35).toFixed(3);
        });
      };

      const request = () => {
        if (!frame) frame = requestAnimationFrame(apply);
      };
      track.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request);
      apply();
    });
  }

  // Brillo que sigue al cursor sobre las tarjetas con clase .spot
  function setupSpotlight() {
    if (reduceMotion.matches || !window.matchMedia('(hover: hover)').matches) return;
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest && e.target.closest('.spot');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    markReveals();
    observeReveals();
    setupHeader();
    setupParallax();
    setupCarouselDepth();
    setupSpotlight();
  });
})();
