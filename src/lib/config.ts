/**
 * Catálogo de la tarjeta: escenas, llamas y accesorios.
 *
 * IMPORTANTE: el índice de cada escena/llama viaja en el enlace grabado en el
 * NFC (`b` y `l`). Añade siempre al FINAL de la lista; no reordenes ni borres,
 * o las tarjetas ya grabadas cambiarían de fondo.
 */

export interface Scene {
  file: string;
  /** Nombre en el creador (español). */
  label: string;
  /** Color de reserva si la imagen no carga. */
  color: string;
  /** Punto focal de la foto (object-position). */
  focus: string;
}

export const SCENES: Scene[] = [
  { file: 'galway.webp', label: 'Galway', color: '#3f8fc4', focus: '50% 60%' },
  { file: 'cusco.webp', label: 'Cusco', color: '#c9b79a', focus: '50% 70%' },
  { file: 'machupicchu.webp', label: 'Machu Picchu', color: '#6f8f5a', focus: '50% 50%' },
  { file: 'andes.webp', label: 'Andes', color: '#8fa7b8', focus: '50% 50%' },
  { file: 'moher.webp', label: 'Cliffs of Moher', color: '#6d8794', focus: '40% 60%' },
  { file: 'rainbow.webp', label: 'Montaña Arcoíris', color: '#e0a07c', focus: '60% 50%' },
  { file: 'causeway.webp', label: "Giant's Causeway", color: '#7c8a86', focus: '50% 50%' },
  { file: 'dublin.webp', label: 'Dublín', color: '#9c8f86', focus: '50% 50%' },
];

/** Punto de anclaje en píxeles de la foto ORIGINAL de la llama (antes del recorte). */
interface Anchor {
  x: number;
  y: number;
  /** Ancho de referencia: cabeza, distancia entre ojos o cuello. */
  w: number;
}

export interface Llama {
  file: string;
  label: string;
  /** Recorte aplicado a la foto original: [x, y, ancho, alto]. */
  crop: [number, number, number, number];
  anchors: {
    /** Punto más alto de la cabeza, centrado. */
    head: Anchor;
    /** Punto medio entre los ojos; w = distancia entre ojos. */
    eyes: Anchor;
    /** Centro del cuello; w = ancho del cuello. */
    neck: Anchor;
  };
}

export const LLAMAS: Llama[] = [
  {
    file: 'brown.webp',
    label: 'Marrón',
    crop: [230, 152, 461, 676],
    anchors: {
      head: { x: 478, y: 166, w: 236 },
      eyes: { x: 471, y: 326, w: 84 },
      neck: { x: 470, y: 430, w: 320 },
    },
  },
  {
    file: 'cream.webp',
    label: 'Crema',
    crop: [261, 130, 349, 657],
    anchors: {
      head: { x: 452, y: 142, w: 226 },
      eyes: { x: 445, y: 285, w: 88 },
      neck: { x: 448, y: 374, w: 226 },
    },
  },
];

export type Slot = 'head' | 'eyes' | 'neck';

export interface Accessory {
  id: string;
  /** Categoría: solo un accesorio puesto por categoría. */
  slot: Slot;
  /** Etiqueta accesible (el visor está en inglés). */
  label: string;
  file: string;
  /** Alto/ancho del viewBox del SVG. */
  ratio: number;
  /** Ancho del accesorio como múltiplo del ancho de referencia del ancla. */
  scale: number;
  /** Punto del SVG (0–1) que se coloca sobre el ancla. */
  ax: number;
  ay: number;
}

export const ACCESSORIES: Accessory[] = [
  { id: 'chullo', slot: 'head', label: 'Peruvian hat', file: 'chullo.svg', ratio: 1, scale: 1.62, ax: 0.5, ay: 0.35 },
  { id: 'flowers', slot: 'head', label: 'Flower crown', file: 'flowers.svg', ratio: 0.4, scale: 1.2, ax: 0.5, ay: 0.3 },
  { id: 'headphones', slot: 'head', label: 'Headphones', file: 'headphones.svg', ratio: 0.8, scale: 1.46, ax: 0.5, ay: 0.14 },
  { id: 'sunglasses', slot: 'eyes', label: 'Sunglasses', file: 'sunglasses.svg', ratio: 0.4, scale: 1.75, ax: 0.5, ay: 0.5 },
  { id: 'hearts', slot: 'eyes', label: 'Heart glasses', file: 'hearts.svg', ratio: 0.4, scale: 1.8, ax: 0.5, ay: 0.5 },
  { id: 'scarf', slot: 'neck', label: 'Scarf', file: 'scarf.svg', ratio: 0.65, scale: 1.2, ax: 0.5, ay: 0.22 },
  { id: 'medallion', slot: 'neck', label: 'Medallion', file: 'medallion.svg', ratio: 0.6, scale: 0.78, ax: 0.5, ay: 0.1 },
  { id: 'bowtie', slot: 'neck', label: 'Bow tie', file: 'bowtie.svg', ratio: 0.6, scale: 0.42, ax: 0.5, ay: 0.5 },
];

/** Orden de apilado: cuello debajo, cabeza encima. */
export const SLOT_ORDER: Slot[] = ['neck', 'eyes', 'head'];

export const LIMITS = { message: 120, from: 40 };

export const ASSETS = {
  llama: '/assets/llama/',
  scenes: '/assets/scenes/',
  accessories: '/assets/accessories/',
};
