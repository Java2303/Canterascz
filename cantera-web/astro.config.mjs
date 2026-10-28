import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// build.format "file" genera quienes-somos.html, galeria.html, etc.: las mismas URLs del sitio anterior
export default defineConfig({
  // Netlify sirve en la raíz de su dominio (y define NETLIFY y URL); GitHub Pages en /Canterascz/
  site: process.env.NETLIFY ? process.env.URL : 'https://java2303.github.io',
  base: process.env.NETLIFY ? '/' : '/Canterascz',
  build: { format: 'file' },
  vite: { plugins: [tailwindcss()] },
});
