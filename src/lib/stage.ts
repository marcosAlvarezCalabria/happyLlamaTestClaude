import { ACCESSORIES, ASSETS, LLAMAS, SCENES, SLOT_ORDER, type Accessory, type Llama } from './config';
import type { Outfit } from './card';

/**
 * Pinta una "escena" (fondo + llama + accesorios) dentro de un elemento
 * [data-stage]. La usan el héroe del visor y la vista previa del creador.
 */

function place(el: HTMLElement, acc: Accessory, llama: Llama) {
  const [cx, cy, cw, ch] = llama.crop;
  const anchor = llama.anchors[acc.slot];
  const width = anchor.w * acc.scale;
  const height = width * acc.ratio;
  el.style.width = `${(width / cw) * 100}%`;
  el.style.aspectRatio = `1 / ${acc.ratio}`;
  el.style.left = `${((anchor.x - cx - width * acc.ax) / cw) * 100}%`;
  el.style.top = `${((anchor.y - cy - height * acc.ay) / ch) * 100}%`;
}

export function setScene(stage: HTMLElement, sceneIndex: number) {
  const scene = SCENES[sceneIndex] ?? SCENES[0];
  const box = stage.querySelector<HTMLElement>('[data-scene]')!;
  const img = box.querySelector('img')!;
  box.style.backgroundColor = scene.color;
  img.hidden = false;
  img.onerror = () => (img.hidden = true); // sin imagen: queda el color plano
  img.style.objectPosition = scene.focus;
  img.src = ASSETS.scenes + scene.file;
}

export function setLlama(stage: HTMLElement, llamaIndex: number) {
  const llama = LLAMAS[llamaIndex] ?? LLAMAS[0];
  const body = stage.querySelector<HTMLElement>('[data-llama]')!;
  const photo = body.querySelector<HTMLImageElement>('[data-llama-photo]')!;
  const layers = body.querySelector<HTMLElement>('[data-layers]')!;

  body.classList.remove('is-placeholder');
  body.style.aspectRatio = `${llama.crop[2]} / ${llama.crop[3]}`;
  // Sin foto real: llamita SVG de reserva (los accesorios se ocultan por CSS).
  photo.onerror = () => {
    body.classList.add('is-placeholder');
    body.style.aspectRatio = '3 / 4';
  };
  photo.src = ASSETS.llama + llama.file;

  // Todas las capas se crean ya (ocultas) para que vestir funcione sin red.
  layers.replaceChildren(
    ...SLOT_ORDER.flatMap((slot) =>
      ACCESSORIES.filter((a) => a.slot === slot).map((acc) => {
        const layer = document.createElement('img');
        layer.className = 'layer';
        layer.alt = '';
        layer.dataset.acc = acc.id;
        layer.src = ASSETS.accessories + acc.file;
        place(layer, acc, llama);
        return layer;
      }),
    ),
  );
}

export function setOutfit(stage: HTMLElement, outfit: Outfit) {
  const worn = new Set(Object.values(outfit));
  stage.querySelectorAll<HTMLElement>('.layer').forEach((layer) => {
    layer.classList.toggle('is-on', worn.has(layer.dataset.acc!));
  });
}

/** Reinicia una animación CSS de una sola pasada. */
export function replay(el: Element | null, className: string) {
  if (!el) return;
  el.classList.remove(className);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(className);
}
