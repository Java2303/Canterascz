// Iconos SVG de trazo (estilo Lucide). Reemplazan a Material Symbols.
// Uso en HTML: <span class="icon" data-icon="menu" aria-hidden="true"></span>
const ICONS = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  'chevron-left': '<path d="M15 18l-6-6 6-6"/>',
  'chevron-right': '<path d="M9 18l6-6-6-6"/>',
  'check-circle': '<circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
  'map-pin': '<path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9L17 22l-5-3-5 3 1.5-9.1"/>',
  home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  landmark: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l9 5H3z"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',
  'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 17v4M17 19h4"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'move-horizontal': '<path d="M18 8l4 4-4 4M6 8l-4 4 4 4M2 12h20"/>',
  diamond: '<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/>',
  navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
};

// Alias: los nombres de Material Symbols que ya están en el HTML
const ALIASES = {
  groups: 'users',
  group: 'users',
  military_tech: 'award',
  volunteer_activism: 'heart',
  family_restroom: 'home',
  church: 'landmark',
  handshake: 'smile',
  verified_user: 'shield-check',
  clean_hands: 'sparkles',
  check_circle: 'check-circle',
  location_on: 'map-pin',
  chevron_left: 'chevron-left',
  chevron_right: 'chevron-right',
  swipe: 'move-horizontal',
  assistant_navigation: 'navigation',
};

function iconMarkup(name) {
  const key = ICONS[name] ? name : ALIASES[name];
  if (!ICONS[key]) return null;
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[key]}</svg>`;
}

function renderIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    if (el.firstElementChild) return; // ya renderizado
    const markup = iconMarkup(el.dataset.icon);
    if (!markup) return;
    el.innerHTML = markup;
    // Normaliza la longitud del trazo para que la animación de dibujo sea uniforme
    el.querySelectorAll('path, line, circle, rect, polyline, polygon').forEach((shape) => {
      shape.setAttribute('pathLength', '1');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => renderIcons());
