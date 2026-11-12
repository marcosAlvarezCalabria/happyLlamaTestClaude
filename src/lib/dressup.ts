import { loadOutfit, saveOutfit, type Outfit } from './card';
import { ACCESSORIES } from './config';
import { replay, setOutfit } from './stage';

/**
 * Vestir la llama: cada botón de la bandeja pone/quita un accesorio.
 * Solo uno por categoría; el conjunto se guarda en localStorage por tarjeta.
 */
export function initDressup(stage: HTMLElement, tray: HTMLElement, cardId: string) {
  let outfit: Outfit = loadOutfit(cardId);

  const render = () => {
    setOutfit(stage, outfit);
    tray.querySelectorAll<HTMLButtonElement>('button[data-acc]').forEach((button) => {
      const acc = ACCESSORIES.find((a) => a.id === button.dataset.acc)!;
      button.setAttribute('aria-pressed', String(outfit[acc.slot] === acc.id));
    });
    const clear = tray.querySelector<HTMLButtonElement>('[data-clear]');
    if (clear) clear.disabled = Object.keys(outfit).length === 0;
  };

  tray.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button');
    if (!button) return;

    if (button.dataset.clear !== undefined) {
      outfit = {};
    } else {
      const acc = ACCESSORIES.find((a) => a.id === button.dataset.acc);
      if (!acc) return;
      if (outfit[acc.slot] === acc.id) {
        delete outfit[acc.slot];
      } else {
        outfit[acc.slot] = acc.id;
        replay(stage.querySelector('[data-llama]'), 'is-boop');
        replay(button, 'is-boop');
      }
    }
    saveOutfit(cardId, outfit);
    render();
  });

  render();
}
