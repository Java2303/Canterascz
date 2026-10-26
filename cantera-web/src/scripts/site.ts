// Movimiento del sitio con Motion: revelado, menú, header, brillo del cursor, parallax y lightbox.
import { animate, inView } from 'motion';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = [0.32, 0.72, 0, 1] as const;

// 1. Revelado al entrar en pantalla (data-reveal, con data-delay en ms)
document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
  if (reduceMotion) {
    el.style.opacity = '1';
    return;
  }
  inView(
    el,
    () => {
      const delay = Number(el.dataset.delay ?? 0) / 1000;
      animate(
        el,
        { opacity: [0, 1], transform: ['translateY(32px)', 'translateY(0px)'] },
        { duration: 0.9, delay, ease: EASE }
      ).finished.then(() => {
        el.style.opacity = '1';
        el.style.transform = '';
      });
    },
    { amount: 0.12 }
  );
});

// 2. Header: sombra al hacer scroll
const header = document.querySelector<HTMLElement>('[data-site-header]');
if (header) {
  const update = () => header.setAttribute('data-scrolled', String(window.scrollY > 8));
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// 3. Menú móvil con entrada en muelle y links escalonados
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.getElementById('main-menu');
if (toggle && menu) {
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('hidden', !open);
    menu.classList.toggle('flex', open);
    if (open && !reduceMotion) {
      animate(menu, { opacity: [0, 1], transform: ['translateY(-10px)', 'translateY(0px)'] }, { duration: 0.5, ease: SPRING });
      animate(
        menu.querySelectorAll('li'),
        { opacity: [0, 1], transform: ['translateY(-8px)', 'translateY(0px)'] },
        { duration: 0.45, delay: (i: number) => 0.05 + i * 0.05, ease: EASE }
      );
    }
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  // Escape cierra el menú y devuelve el foco al botón
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}

// 4. Brillo que sigue al cursor en tarjetas .spot (solo con mouse)
if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
  document.addEventListener(
    'pointermove',
    (e) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.spot');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    },
    { passive: true }
  );
}

// 5. Parallax suave en imágenes con data-parallax
const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
if (!reduceMotion && parallaxEls.length) {
  let frame = 0;
  const apply = () => {
    frame = 0;
    parallaxEls.forEach((el) => {
      const r = el.parentElement!.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, r.top / window.innerHeight));
      el.style.transform = `translate3d(0, ${(progress * -40).toFixed(1)}px, 0) scale(1.1)`;
    });
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(apply); }, { passive: true });
  apply();
}

// 6. Lightbox nativo para imágenes con data-lightbox-src
const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
if (dialog) {
  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  document.querySelectorAll<HTMLElement>('[data-lightbox-src]').forEach((trigger) => {
    const open = () => {
      img.src = trigger.dataset.lightboxSrc!;
      img.alt = trigger.dataset.lightboxTitle ?? '';
      caption.textContent = trigger.dataset.lightboxTitle ?? '';
      dialog.showModal();
    };
    // Disparadores enfocables y accionables con teclado
    trigger.tabIndex = 0;
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-label', `Ampliar: ${trigger.dataset.lightboxTitle ?? 'imagen'}`);
    trigger.addEventListener('click', open);
    trigger.addEventListener('keydown', (e) => {
      if (e.target !== trigger) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
}
