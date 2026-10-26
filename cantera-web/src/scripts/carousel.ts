// Carrusel con scroll-snap: dots, contador, flechas, teclado y escala de profundidad.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const items = Array.from(track.children) as HTMLElement[];
  const total = items.length;
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const dots = root.querySelector<HTMLElement>('[data-dots]')!;
  const current = root.querySelector<HTMLElement>('[data-current]')!;
  const progress = root.querySelector<HTMLElement>('[data-progress]');
  const totalEl = root.querySelector<HTMLElement>('[data-total]')!;

  totalEl.textContent = String(total);
  items.forEach((el) => el.classList.add('snap-start', 'shrink-0', 'depth-item'));

  // Puntos de navegación
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir al elemento ${i + 1}`);
    dot.className = 'h-2 rounded-full bg-current/30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-current/60';
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });

  // Posición de cada tarjeta relativa al inicio del track (snap-start)
  const startOf = (el: HTMLElement) =>
    el.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;

  const isScrollable = () => track.scrollWidth > track.clientWidth + 4;

  function render(index: number) {
    const dotEls = Array.from(dots.children) as HTMLElement[];
    dotEls.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('w-7', active);
      dot.classList.toggle('bg-brand-500', active);
      dot.classList.toggle('w-2', !active);
      dot.classList.toggle('opacity-100', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
    current.textContent = String(index + 1);
    if (progress) progress.style.width = `${((index + 1) / total) * 100}%`;
    prev.disabled = index === 0;
    next.disabled = index === total - 1;
    prev.classList.toggle('opacity-35', index === 0);
    next.classList.toggle('opacity-35', index === total - 1);
  }

  function goTo(i: number) {
    // Sin desplazamiento (cuadrícula de escritorio) no hay nada que mover ni contar
    if (!isScrollable()) return;
    const target = Math.max(0, Math.min(total - 1, i));
    track.scrollTo({ left: startOf(items[target]), behavior: reduceMotion ? 'auto' : 'smooth' });
    render(target);
  }

  // Índice activo: la tarjeta pegada al borde izquierdo; en los extremos, la primera o la última
  let index = 0;
  let timer: number | undefined;
  function detect() {
    if (!isScrollable()) { index = 0; render(0); return; }
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (track.scrollLeft <= 4) index = 0;
    else if (atEnd) index = total - 1;
    else {
      let best = 0;
      let min = Infinity;
      items.forEach((el, i) => {
        const d = Math.abs(track.scrollLeft - startOf(el));
        if (d < min) { min = d; best = i; }
      });
      index = best;
    }
    render(index);
  }

  // Escala de profundidad: la tarjeta centrada crece, las laterales se atenúan
  let frame = 0;
  function depth() {
    frame = 0;
    if (reduceMotion || !isScrollable()) {
      items.forEach((el) => { el.style.transform = ''; el.style.opacity = ''; });
      return;
    }
    const rect = track.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      const d = Math.min(1, Math.abs(r.left + r.width / 2 - mid) / (rect.width / 2));
      el.style.transform = `scale(${(1 - d * 0.05).toFixed(3)})`;
      el.style.opacity = (1 - d * 0.3).toFixed(3);
    });
  }

  track.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(depth);
    window.clearTimeout(timer);
    timer = window.setTimeout(detect, 40);
  }, { passive: true });
  window.addEventListener('resize', () => { depth(); detect(); });

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  // Teclado: flechas izquierda y derecha cuando el track tiene foco
  track.tabIndex = 0;
  track.setAttribute('aria-roledescription', 'carrusel');
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
  });

  depth();
  detect();
});
