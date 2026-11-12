import { ENEMY_TYPES } from "./enemies.js";

// Vague de boss tous les 10 niveaux.
export const isBossWave = (wave) => wave > 0 && wave % 10 === 0;

// Multiplicateur de PV selon la vague (super-linéaire pour un vrai mode infini).
export function hpMultiplier(wave) {
  const w = wave - 1;
  return 1 + 0.16 * w + 0.004 * w * w;
}

// Prime d'un ennemi à une vague donnée.
export function bountyFor(def, wave) {
  return Math.round(def.bounty * (1 + 0.03 * (wave - 1)));
}

// Prime de fin de vague.
export const waveReward = (wave) => 20 + wave * 3;

const WEIGHTS = { touriste: 5, cycliste: 4, randonneur: 3, vanRival: 2.5, famille: 2 };

// File d'apparition d'une vague : [{kind, at}] avec `at` en secondes relatives.
export function waveQueue(wave) {
  const queue = [];
  const count = Math.min(60, 6 + wave * 2);
  const interval = Math.max(0.28, 1.15 - wave * 0.028);
  const kinds = Object.keys(ENEMY_TYPES).filter(
    (k) => !ENEMY_TYPES[k].boss && ENEMY_TYPES[k].unlock <= wave
  );
  let t = 0.5;
  for (let i = 0; i < count; i++) {
    queue.push({ kind: pickKind(kinds), at: t });
    t += interval * (0.7 + Math.random() * 0.6);
  }
  if (isBossWave(wave)) {
    const bosses = 1 + Math.floor(wave / 30);
    for (let b = 0; b < bosses; b++) queue.push({ kind: "boss", at: 2 + b * 6 });
    queue.sort((a, b) => a.at - b.at);
  }
  return queue;
}

// Tirage pondéré parmi les types d'ennemis débloqués à cette vague.
function pickKind(kinds) {
  const total = kinds.reduce((s, k) => s + WEIGHTS[k], 0);
  let r = Math.random() * total;
  for (const k of kinds) {
    r -= WEIGHTS[k];
    if (r <= 0) return k;
  }
  return kinds[0];
}

// Aperçu des effectifs d'une vague (pour le panneau d'info), par type.
export function wavePreview(wave) {
  const counts = {};
  for (const e of waveQueue(wave)) counts[e.kind] = (counts[e.kind] || 0) + 1;
  return counts;
}
