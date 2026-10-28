<p align="center">
  <img src="docs/banner.svg" alt="Capítulo Cantera #75024 — banner animado" width="100%" />
</p>

<h1 align="center">Capítulo Cantera #75024</h1>

<p align="center">
  <em>Formando líderes, forjando hermanos.</em><br/>
  Sitio oficial del Capítulo Cantera de la Orden DeMolay en Santa Cruz de la Sierra, Bolivia.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-7-FF5D01?logo=astro&logoColor=white" alt="Astro 7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Motion-14-111111?logo=framer&logoColor=white" alt="Motion 14" />
  <img src="https://img.shields.io/badge/Lucide-icons-F56565" alt="Lucide icons" />
  <img src="https://img.shields.io/badge/accesibilidad-reduced--motion-2EA44F" alt="Soporte de reduced motion" />
</p>

---

## Características

| | Qué incluye |
| :-- | :-- |
| **Movimiento con intención** | Revelado escalonado al hacer scroll, portada con parallax suave y menú móvil con entrada en muelle. |
| **Cabecera de vidrio** | Fondo translúcido con blur que se oscurece al desplazarse y subrayado animado en la navegación. |
| **Carruseles pulidos** | Escala de profundidad, barra de progreso, puntos, contador y teclado (flechas izquierda y derecha). |
| **Tarjetas con brillo** | El brillo sigue al cursor y los íconos reaccionan al pasar el mouse. |
| **Lightbox accesible** | Ampliación de fotos con `<dialog>` nativo; se abre con mouse, Enter o Espacio y se cierra con Escape. |
| **Accesibilidad** | Respeta `prefers-reduced-motion` y `prefers-reduced-transparency`, con foco visible y contraste revisado. |
| **Responsivo** | Menú hamburguesa hasta 1280 px, carruseles deslizables en móvil y cuadrícula en escritorio. |

## Stack

- **[Astro](https://astro.build)** para generar un sitio estático rápido, con componentes y datos separados.
- **[Tailwind CSS v4](https://tailwindcss.com)** con tokens de marca definidos en `src/styles/global.css`.
- **[Motion](https://motion.dev)** para las animaciones de revelado, menú y parallax.
- **[Lucide](https://lucide.dev)** para íconos de trazo consistentes.
- Tipografía **Plus Jakarta Sans** (títulos) y **Manrope** (texto), vía Google Fonts.

## Estructura

```text
.github/workflows/deploy.yml  # Build y despliegue automático a GitHub Pages
docs/banner.svg               # Banner de este README
cantera-web/                  # El sitio (única fuente)
├── public/img/          # Fotos y logos (se sirven tal cual)
├── src/
│   ├── components/      # Header, Footer, Carousel, PageHero, Icon…
│   ├── data/site.ts     # Contenido: líderes, honoríficos, virtudes, enlaces
│   ├── layouts/Base.astro
│   ├── pages/           # index, quienes-somos, actividades, galeria, futbol7, ubicacion, contacto
│   ├── scripts/         # carousel.ts y site.ts (movimiento e interacción)
│   └── styles/global.css
└── astro.config.mjs     # base '/Canterascz' para GitHub Pages
```

## Despliegue

Cada push a `main` ejecuta [`deploy.yml`](.github/workflows/deploy.yml): instala dependencias, corre `npm run build` dentro de `cantera-web/` y publica `dist/` en **https://java2303.github.io/Canterascz/**. GitHub Pages está configurado con *Source: GitHub Actions*.

No subas `dist/` ni `.astro/` al repositorio: se generan en cada build y ya están en `.gitignore`.

## Cómo ejecutarlo

Requisitos: Node.js 22.22 o superior (ver `cantera-web/.nvmrc`).

```bash
cd cantera-web
npm install
npm run dev       # desarrollo en http://localhost:4321/Canterascz/
npm run build     # genera dist/ con las 7 páginas
npm run preview   # sirve dist/ localmente
```

## Revisiones realizadas

- Build sin errores: 7 páginas estáticas.
- Carruseles verificados: en móvil avanzan de 1 a 3 y el botón "siguiente" se desactiva al final; en escritorio muestran las tres tarjetas en cuadrícula.
- Todos los nombres de íconos existen en `lucide-astro`; todas las rutas de imágenes apuntan a archivos existentes.

## Desarrolladores

<table>
  <tr>
    <td align="center" width="50%">
      <a href="https://github.com/invertilo">
        <img src="https://github.com/invertilo.png?size=160" width="110" alt="invertilo" style="border-radius:50%" /><br/>
        <sub><b>invertilo</b></sub>
      </a><br/>
      <sub>Rediseño, animaciones y sistema de componentes</sub>
    </td>
    <td align="center" width="50%">
      <a href="https://github.com/Java2303">
        <img src="https://github.com/Java2303.png?size=160" width="110" alt="Java2303" style="border-radius:50%" /><br/>
        <sub><b>Java2303</b></sub>
      </a><br/>
      <sub>Desarrollo original del sitio y del repositorio</sub>
    </td>
  </tr>
</table>

## Licencia

Contenido e imágenes © Capítulo Cantera #75024 · Orden DeMolay. Uso del código sujeto a acuerdo con los desarrolladores.
