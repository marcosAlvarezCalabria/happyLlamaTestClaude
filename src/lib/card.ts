import { ACCESSORIES, LIMITS, LLAMAS, SCENES, type Slot } from './config';

/** Datos de una tarjeta. Viajan en el enlace; no hay servidor. */
export interface Card {
  id: string;
  message: string;
  from: string;
  scene: number;
  llama: number;
}

export type Outfit = Partial<Record<Slot, string>>;

const index = (raw: string | null, length: number) => {
  const n = Number.parseInt(raw ?? '', 10);
  return Number.isInteger(n) && n >= 0 && n < length ? n : 0;
};

export const isViewerUrl = (search: string) => {
  const p = new URLSearchParams(search);
  return p.has('t') || p.has('id');
};

export function parseCard(search: string): Card {
  const p = new URLSearchParams(search);
  return {
    id: (p.get('id') ?? '').replace(/[^a-z0-9]/gi, '').slice(0, 12),
    message: (p.get('t') ?? '').trim().slice(0, LIMITS.message + 20),
    from: (p.get('f') ?? '').trim().slice(0, LIMITS.from + 10),
    scene: index(p.get('b'), SCENES.length),
    llama: index(p.get('l'), LLAMAS.length),
  };
}

export function buildLink(base: string, card: Card): string {
  const p = new URLSearchParams();
  p.set('id', card.id);
  p.set('t', card.message);
  if (card.from) p.set('f', card.from);
  p.set('b', String(card.scene));
  p.set('l', String(card.llama));
  // encodeURIComponent-style (%20) en vez de "+": más robusto al grabar en NFC.
  return `${base}?${p.toString().replace(/\+/g, '%20')}`;
}

export function newId(length = 5): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

const outfitKey = (id: string) => `hl-outfit:${id || 'default'}`;

export function loadOutfit(id: string): Outfit {
  try {
    const raw = JSON.parse(localStorage.getItem(outfitKey(id)) ?? '{}');
    const outfit: Outfit = {};
    for (const acc of ACCESSORIES) {
      if (raw?.[acc.slot] === acc.id) outfit[acc.slot] = acc.id;
    }
    return outfit;
  } catch {
    return {};
  }
}

export function saveOutfit(id: string, outfit: Outfit): void {
  try {
    localStorage.setItem(outfitKey(id), JSON.stringify(outfit));
  } catch {
    // Modo privado o almacenamiento bloqueado: se puede vestir igual, solo no se recuerda.
  }
}
