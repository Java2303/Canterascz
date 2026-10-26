// Contenido del sitio. Todo el texto del sitio anterior vive aquí.
import brand from './brand.json' with { type: 'json' };
import type * as Icons from 'lucide-astro';

export type IconName = keyof typeof Icons;

export const site = {
  name: 'Capítulo Cantera #75024',
  description:
    'Formando líderes y forjando hermanos. Orden DeMolay en Santa Cruz de la Sierra, Bolivia.',
  email: 'capitulocantera75024@gmail.com',
  instagram: 'https://www.instagram.com/cantera.sc?igsh=aXdlanVuZDNvejRv&utm_source=qr',
  whatsapp: 'https://wa.link/hnfulp',
  mapsLink: 'https://maps.app.goo.gl/vC4aSjFeiaXe6bgZ9',
  mapEmbed: brand.mapEmbed,
  brandPaths: { instagram: brand.instagram, whatsapp: brand.whatsapp },
};

export const nav = [
  { href: 'index.html', label: 'Inicio' },
  { href: 'quienes-somos.html', label: 'Quiénes Somos' },
  { href: 'actividades.html', label: 'Actividades' },
  { href: 'galeria.html', label: 'Líderes' },
  { href: 'futbol7.html', label: 'Campeonato' },
  { href: 'ubicacion.html', label: 'Ubicación' },
  { href: 'contacto.html', label: 'Contacto' },
];

export const santaCruzPhotos = [
  { src: 'img/demolay-bolivia-1.jpg', alt: 'Reuniones Formales', title: 'Reuniones Formales' },
  { src: 'img/congreso.jpeg', alt: 'Congresos Nacionales', title: 'Congresos Nacionales' },
  { src: 'img/filantropia.jpg', alt: 'Labor Social Santa Cruz', title: 'Labor Social Santa Cruz' },
];

export const virtues: { name: string; icon: IconName }[] = [
  { name: 'Amor Filial', icon: 'Home' },
  { name: 'Reverencia por las cosas sagradas', icon: 'Landmark' },
  { name: 'Cortesía', icon: 'Smile' },
  { name: 'Compañerismo', icon: 'Users' },
  { name: 'Fidelidad', icon: 'ShieldCheck' },
  { name: 'Pureza', icon: 'Sparkles' },
  { name: 'Patriotismo', icon: 'Flag' },
];

export const leaders = [
  { name: 'Flavio Palma', period: 'Gestión 2012', img: 'img/flavio.png' },
  { name: 'Leonardo Alvarez', period: 'Gestión II/2014', img: 'img/alvarez.png' },
  { name: 'Carlos Viruez', period: 'Gestión II/2015', img: 'img/carlosv.png' },
  { name: 'Ernesto Montecino', period: 'Gestión II/2022', img: 'img/ernesto.png' },
  { name: 'Lucas Vaca Díez', period: 'Gestión I/2023', img: 'img/lucas.png' },
  { name: 'Luis Gabriel Santander', period: 'Gestión I/2024', img: 'img/santander.png' },
  { name: 'Israel Escalante', period: 'Gestión II/2024', img: 'img/israel.png' },
  { name: 'Samuel Parada', period: 'Gestión I/2025', img: 'img/samuel.png' },
  { name: 'Luis Andrés Saucedo', period: 'Gestión II/2025', img: 'img/luigi.png' },
  { name: 'Jose Alberto Vargas', period: 'Gestión I/2026', img: 'img/java.png' },
  { name: 'Nicolás Ballivián', period: 'Gestión II/2026', img: 'img/ballivian.png' },
];

export const honorary = [
  { name: 'Lord. Luis Alberto Cruz', role: 'Corte Chevalier', text: 'Por su mentoría y apoyo constante al Capítulo.', img: 'img/teddy.png' },
  { name: 'Lord Enzo Nicolás Ortiz Peralta', role: 'Corte Chevalier', text: 'Por su incansable labor y dedicación a los principios de la Orden.', img: 'img/nicolas.png' },
  { name: 'Hno. Oscar Mendoza', role: 'Consejo Consultivo Cap. Andrey Vagoluvski', text: 'Por llevar la visión del Capítulo al extranjero.', img: 'img/oscar.png' },
  { name: 'Hno. Bruno Gutierrez', role: 'Consejo Consultivo Cap. Andrey Vagoluvski', text: 'Por llevar la visión del Capítulo al extranjero.', img: 'img/bruno.png' },
];
