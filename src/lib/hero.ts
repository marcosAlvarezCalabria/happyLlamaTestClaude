import { replay } from './stage';

const SPARKS = ['✨', '💖', '⭐', '🌸', '✨', '💛'];

declare global {
  interface Window {
    /** Hook público: dispara la reacción del héroe del visor. */
    onHeroTap: () => void;
  }
}

/** Reacción alegre: saltito + destellos. */
export function heroTap(stage: HTMLElement | null) {
  if (!stage) return;
  stage.classList.add('is-tapped');
  replay(stage.querySelector('[data-llama]'), 'is-jump');

  const sparks = stage.querySelector<HTMLElement>('[data-sparks]');
  if (!sparks || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  SPARKS.forEach((emoji, i) => {
    const spark = document.createElement('span');
    const angle = (Math.PI * (i + 0.5)) / SPARKS.length; // abanico hacia arriba
    spark.textContent = emoji;
    spark.style.setProperty('--dx', `${Math.cos(angle) * (70 + Math.random() * 50)}px`);
    spark.style.setProperty('--dy', `${-Math.sin(angle) * (80 + Math.random() * 60)}px`);
    spark.addEventListener('animationend', () => spark.remove());
    sparks.append(spark);
  });
}

export function initHero() {
  document.addEventListener('click', (event) => {
    const target = (event.target as Element).closest('[data-hero-tap]');
    if (target) heroTap(target.closest<HTMLElement>('[data-stage]'));
  });

  window.onHeroTap = () =>
    heroTap(document.querySelector<HTMLElement>('[data-view="viewer"] [data-stage]'));

  // Parallax leve del fondo al hacer scroll (solo en el visor).
  const scene = document.querySelector<HTMLElement>('[data-view="viewer"] [data-scene]');
  if (!scene || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;
  addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        scene.style.transform = `translate3d(0, ${Math.min(scrollY, 600) * 0.22}px, 0)`;
        ticking = false;
      });
    },
    { passive: true },
  );
}
