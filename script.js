// Función para inicializar el menú hamburguesa
function setupMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('main-menu');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      menu.classList.toggle('show');
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (menu.classList.contains('show')) {
          menu.classList.remove("show");
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

// Función para actualizar el año del footer
function updateFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// Función para inicializar Lightbox (Modal de imágenes a pantalla completa)
function setupLightbox() {
  let lightbox = document.getElementById('global-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'global-lightbox';
    lightbox.className = 'fixed inset-0 z-[100] bg-black/90 backdrop-blur-md hidden opacity-0 transition-opacity duration-300 flex items-center justify-center p-4 select-none';
    lightbox.innerHTML = `
      <button class="absolute top-5 right-6 text-white/70 hover:text-white text-4xl p-2 focus:outline-none transition-transform hover:scale-110 active:scale-95 z-10" aria-label="Cerrar modal">&times;</button>
      <div class="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center pointer-events-auto">
        <img id="lightbox-img" src="" alt="Vista ampliada" class="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl transition-transform duration-300 scale-95" />
        <p id="lightbox-caption" class="text-stone-300 text-sm md:text-base mt-4 font-body text-center max-w-xl font-medium px-4"></p>
      </div>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('button');
    const imgEl = lightbox.querySelector('#lightbox-img');
    const captionEl = lightbox.querySelector('#lightbox-caption');

    function closeLightbox() {
      lightbox.classList.add('opacity-0');
      imgEl.classList.add('scale-95');
      setTimeout(() => {
        lightbox.classList.add('hidden');
        imgEl.src = '';
      }, 300);
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.id === 'global-lightbox') closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
      }
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-lightbox], .lightbox-trigger');
      if (trigger) {
        e.preventDefault();
        const src = trigger.getAttribute('href') || trigger.getAttribute('data-src') || trigger.querySelector('img')?.src || (trigger.tagName === 'IMG' ? trigger.src : '');
        const title = trigger.getAttribute('data-title') || trigger.getAttribute('alt') || trigger.querySelector('img')?.alt || '';

        if (src) {
          imgEl.src = src;
          captionEl.textContent = title;
          lightbox.classList.remove('hidden');
          setTimeout(() => {
            lightbox.classList.remove('opacity-0');
            imgEl.classList.remove('scale-95');
          }, 10);
        }
      }
    });
  }
}

// Función genérica para carruseles de desplazamiento horizontal con snap, dots y contador
function initSnapCarousel({
  carouselId,
  prevBtnId,
  nextBtnId,
  dotsContainerId,
  counterCurrentId,
  counterTotalId,
  activeDotClass = 'w-6 bg-orange-500',
  inactiveDotClass = 'w-2 bg-stone-700 hover:bg-stone-500',
}) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const items = Array.from(carousel.children);
  const total = items.length;
  if (total === 0) return;

  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const dotsContainer = document.getElementById(dotsContainerId);
  const counterCurrent = document.getElementById(counterCurrentId);
  const counterTotal = document.getElementById(counterTotalId);

  if (counterTotal) {
    counterTotal.textContent = total;
  }

  let currentIndex = 0;

  function updateActiveState(newIndex) {
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= total) newIndex = total - 1;
    currentIndex = newIndex;

    if (counterCurrent) {
      counterCurrent.textContent = currentIndex + 1;
    }

    if (dotsContainer) {
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.className = `h-2.5 rounded-full transition-all duration-300 ${activeDotClass}`;
        } else {
          dot.className = `h-2.5 rounded-full transition-all duration-300 ${inactiveDotClass}`;
        }
      });
    }
  }

  function scrollToIndex(idx) {
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    const target = items[idx];
    if (target) {
      const targetPos = target.offsetLeft - carousel.offsetLeft;
      carousel.scrollTo({ left: targetPos, behavior: 'smooth' });
    }
  }

  // Generar dots dinámicamente
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    items.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir al elemento ${idx + 1}`);
      dot.className = `h-2.5 rounded-full transition-all duration-300 ${idx === 0 ? activeDotClass : inactiveDotClass}`;
      dot.addEventListener('click', () => scrollToIndex(idx));
      dotsContainer.appendChild(dot);
    });
  }

  // Detección en tiempo real de la tarjeta activa por scroll
  let scrollTimeout;
  carousel.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const carouselCenter = carousel.scrollLeft + carousel.offsetWidth / 2;
      let closestIdx = 0;
      let minDistance = Infinity;

      items.forEach((item, idx) => {
        const itemCenter = (item.offsetLeft - carousel.offsetLeft) + item.offsetWidth / 2;
        const distance = Math.abs(carouselCenter - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      updateActiveState(closestIdx);
    }, 30);
  }, { passive: true });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));
  }

  // Inicializar estado activo
  updateActiveState(0);
}

// Inicializar todos los carruseles interactivos
function setupAllCarousels() {
  // 1. Past Maestres Consejeros (galeria.html)
  initSnapCarousel({
    carouselId: 'leaders-carousel',
    prevBtnId: 'leaders-prev-btn',
    nextBtnId: 'leaders-next-btn',
    dotsContainerId: 'leaders-dots',
    counterCurrentId: 'leaders-counter-current',
    counterTotalId: 'leaders-counter-total',
    activeDotClass: 'w-6 bg-orange-500',
    inactiveDotClass: 'w-2.5 bg-stone-700 hover:bg-stone-500',
  });

  // 2. Hermanos Honoríficos (galeria.html)
  initSnapCarousel({
    carouselId: 'honorificos-carousel',
    prevBtnId: 'honorificos-prev-btn',
    nextBtnId: 'honorificos-next-btn',
    dotsContainerId: 'honorificos-dots',
    counterCurrentId: 'honorificos-counter-current',
    counterTotalId: 'honorificos-counter-total',
    activeDotClass: 'w-6 bg-orange-500',
    inactiveDotClass: 'w-2.5 bg-stone-700 hover:bg-stone-500',
  });

  // 3. DeMolay en Santa Cruz (index.html)
  initSnapCarousel({
    carouselId: 'santacruz-carousel',
    prevBtnId: 'santacruz-prev-btn',
    nextBtnId: 'santacruz-next-btn',
    dotsContainerId: 'santacruz-dots',
    counterCurrentId: 'santacruz-counter-current',
    counterTotalId: 'santacruz-counter-total',
    activeDotClass: 'w-6 bg-primary',
    inactiveDotClass: 'w-2.5 bg-stone-300 hover:bg-stone-400',
  });
}

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  updateFooterYear();
  setupLightbox();
  setupAllCarousels();
});
