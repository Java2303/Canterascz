// Función para inicializar el menú hamburguesa
function setupMenu() {
  const menuToggle = document.querySelector('.menu-toggle'); // Selector correcto por clase
  const menu = document.getElementById('main-menu'); // Selector correcto por ID

  if (menuToggle && menu) {
    // Abrir/cerrar con el botón
    menuToggle.addEventListener('click', function() {
      menu.classList.toggle('show');
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Cerrar el menú al hacer clic en un enlace (importante para móviles)
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

// Función para inicializar todos los carruseles de la página
function setupCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.children);
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    let index = 0;

    if (slides.length === 0) return;

    function updateHeight() {
      if (slides[index]) {
        // Pequeño delay para asegurar que el slide es visible antes de medir
        setTimeout(() => {
            if (slides[index]) track.style.height = slides[index].offsetHeight + 'px';
        }, 50);
      }
    }

    function setActive(i) {
      const currentVideo = slides[index]?.querySelector('video');
      if (currentVideo) {
        try { currentVideo.pause(); } catch (e) { console.error("No se pudo pausar el video", e); }
      }

      slides[index]?.classList.remove('active');
      index = (i + slides.length) % slides.length;
      slides[index]?.classList.add('active');

      updateHeight();

      const newVideo = slides[index]?.querySelector('video');
      if (newVideo && (newVideo.autoplay || newVideo.muted)) {
        try { newVideo.play(); } catch (e) { console.error("No se pudo reproducir el video", e); }
      }
    }

    slides.forEach((slide, i) => slide.classList.toggle('active', i === 0));
    
    window.addEventListener('load', updateHeight);

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateHeight);
      slides.forEach(slide => ro.observe(slide));
    } else {
      window.addEventListener('resize', updateHeight);
    }

    prev?.addEventListener('click', () => setActive(index - 1));
    next?.addEventListener('click', () => setActive(index + 1));

    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev?.click(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next?.click(); }
    });
  });
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

// Ejecutar todas las funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  updateFooterYear();
  setupCarousels();
  setupLightbox();
});
