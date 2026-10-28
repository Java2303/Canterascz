// Movimiento del sitio con Motion: revelado, pulsación, menú, cabecera, brillo del cursor, parallax y lightbox.
// Todo lo que el usuario puede interrumpir usa springs que parten del valor actual en pantalla.
import { animate, inView } from 'motion';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Springs críticamente amortiguados (sin rebote): la UI responde, no actúa
const SETTLE = { type: 'spring', bounce: 0, visualDuration: 0.4 } as const;
const PRESS_IN = { type: 'spring', bounce: 0, visualDuration: 0.08 } as const;
const PRESS_OUT = { type: 'spring', bounce: 0, visualDuration: 0.3 } as const;
const FADE = { duration: 0.18, ease: 'linear' } as const;

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
      animate(el, { opacity: [0, 1], y: [24, 0] }, { type: 'spring', bounce: 0, visualDuration: 0.7, delay });
    },
    { amount: 0.12 }
  );
});

// 2. Pulsación inmediata en pointer-down: escala 0.97 (o data-press) y vuelta en spring al soltar
const pressed = new Set<HTMLElement>();
const release = () => {
  pressed.forEach((el) => animate(el, { scale: 1 }, PRESS_OUT));
  pressed.clear();
};
document.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-press]');
  if (!el || el.matches(':disabled')) return;
  pressed.add(el);
  animate(el, { scale: Number(el.dataset.press) || 0.97 }, PRESS_IN);
});
['pointerup', 'pointercancel', 'dragstart'].forEach((type) => document.addEventListener(type, release));
document.addEventListener('pointerout', (e) => {
  const el = e.target as HTMLElement;
  if (pressed.has(el) && !el.contains(e.relatedTarget as Node)) {
    pressed.delete(el);
    animate(el, { scale: 1 }, PRESS_OUT);
  }
});

// 3. Cabecera: el material se vuelve más denso al desplazarse
const header = document.querySelector<HTMLElement>('[data-site-header]');
if (header) {
  const update = () => header.setAttribute('data-scrolled', String(window.scrollY > 8));
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// 4. Menú móvil: nace del botón y vuelve a él por el mismo camino, interrumpible en cualquier momento
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.getElementById('main-menu');
if (toggle && menu) {
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) {
      const wasHidden = menu.classList.contains('hidden');
      menu.classList.remove('hidden');
      menu.classList.add('flex');
      const t = toggle.getBoundingClientRect();
      const m = menu.getBoundingClientRect();
      menu.style.transformOrigin = `${t.left + t.width / 2 - m.left}px 0px`;
      if (reduceMotion) {
        if (wasHidden) menu.style.opacity = '0';
        animate(menu, { opacity: 1 }, FADE);
      } else {
        if (wasHidden) animate(menu, { opacity: 0, scale: 0.92, y: -8 }, { duration: 0 });
        animate(menu, { opacity: 1, scale: 1, y: 0 }, SETTLE);
      }
    } else {
      const closing = reduceMotion
        ? animate(menu, { opacity: 0 }, FADE)
        : animate(menu, { opacity: 0, scale: 0.92, y: -8 }, { ...SETTLE, visualDuration: 0.3 });
      closing.finished.then(() => {
        if (isOpen()) return;
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        menu.style.cssText = '';
      });
    }
  };
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  // Escape o un toque fuera cierran el menú; Escape devuelve el foco al botón
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    const target = e.target as Node;
    if (isOpen() && !menu.contains(target) && !toggle.contains(target)) setOpen(false);
  });
}

// 5. Brillo que sigue al cursor en tarjetas .spot (solo con mouse)
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

// 6. Parallax suave en imágenes con data-parallax
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

// 6b. Videos con data-autoplay: arrancan en silencio solo si no se pidió reducir movimiento
if (!reduceMotion) {
  document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]').forEach((v) => v.play().catch(() => {}));
}

// 7. Lightbox nativo: la imagen crece desde su miniatura y vuelve a ella al cerrar
const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
if (dialog) {
  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const closeBtn = dialog.querySelector<HTMLElement>('[data-lightbox-close]')!;
  let source: HTMLElement | null = null;

  // Desplazamiento y escala que llevan la imagen ampliada sobre la miniatura
  const fromSource = () => {
    const thumb = (source?.querySelector('img') ?? source)?.getBoundingClientRect();
    const full = img.getBoundingClientRect();
    if (!thumb || !full.width) return { x: 0, y: 0, scale: 0.9 };
    return {
      x: thumb.left + thumb.width / 2 - (full.left + full.width / 2),
      y: thumb.top + thumb.height / 2 - (full.top + full.height / 2),
      scale: thumb.width / full.width,
    };
  };

  const open = async (trigger: HTMLElement) => {
    source = trigger;
    img.src = trigger.dataset.lightboxSrc!;
    img.alt = trigger.dataset.lightboxTitle ?? '';
    caption.textContent = trigger.dataset.lightboxTitle ?? '';
    delete dialog.dataset.closing;
    img.style.transform = '';
    dialog.showModal();
    await img.decode().catch(() => undefined);
    if (reduceMotion) {
      animate([img, caption, closeBtn], { opacity: [0, 1] }, FADE);
      return;
    }
    const from = fromSource();
    animate(img, { x: [from.x, 0], y: [from.y, 0], scale: [from.scale, 1], opacity: [0, 1] }, { ...SETTLE, opacity: { duration: 0.15 } });
    animate([caption, closeBtn], { opacity: [0, 1] }, { duration: 0.2, delay: 0.15 });
  };

  const close = () => {
    if (!dialog.open || dialog.dataset.closing) return;
    dialog.dataset.closing = 'true';
    let done: Promise<unknown>;
    if (reduceMotion) {
      done = animate([img, caption, closeBtn], { opacity: 0 }, FADE).finished;
    } else {
      // Se mide en reposo para calcular el destino; la animación arranca desde el valor actual
      const current = img.style.transform;
      img.style.transform = '';
      const to = fromSource();
      img.style.transform = current;
      animate([caption, closeBtn], { opacity: 0 }, { duration: 0.12 });
      done = animate(img, { x: to.x, y: to.y, scale: to.scale, opacity: 0 }, { ...SETTLE, visualDuration: 0.32, opacity: { duration: 0.2, delay: 0.12 } }).finished;
    }
    done.then(() => {
      if (dialog.dataset.closing) dialog.close();
    });
  };

  document.querySelectorAll<HTMLElement>('[data-lightbox-src]').forEach((trigger) => {
    // Disparadores enfocables y accionables con teclado
    trigger.tabIndex = 0;
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-label', `Ampliar: ${trigger.dataset.lightboxTitle ?? 'imagen'}`);
    trigger.addEventListener('click', () => open(trigger));
    trigger.addEventListener('keydown', (e) => {
      if (e.target !== trigger) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(trigger); }
    });
  });
  closeBtn.addEventListener('click', close);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dialog.addEventListener('close', () => { delete dialog.dataset.closing; });
}
