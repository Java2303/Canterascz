import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// build.format "file" genera quienes-somos.html, galeria.html, etc.: las mismas URLs del sitio anterior
export default defineConfig({
  site: 'https://java2303.github.io/Canterascz/',
  build: { format: 'file' },
  vite: { plugins: [tailwindcss()] },
});
