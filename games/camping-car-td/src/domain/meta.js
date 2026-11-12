import { TALENTS, ACHIEVEMENTS, xpForLevel } from "../config/meta.js";
import { STARTING_LIVES } from "../config/balance.js";
import { saveMeta } from "./persistence.js";

// Vies max au départ d'une partie (base + talent "vies").
export function maxLives(state) {
  return STARTING_LIVES + 3 * (state.meta.talents.vies || 0);
}

// Ajoute de l'XP à la méta ; monte de niveau si seuil atteint.
// Retourne la liste des nouveaux niveaux atteints.
export function addXp(state, amount) {
  const meta = state.meta;
  meta.xp += amount;
  const gained = [];
  while (meta.xp >= xpForLevel(meta.level)) {
    meta.xp -= xpForLevel(meta.level);
    meta.level++;
    meta.points += 2;
    gained.push(meta.level);
  }
  if (gained.length) {
    saveMeta(meta);
    state.notifications.push({ kind: "levelup", levels: gained });
  }
  return gained;
}

// Dépense un point de talent dans un rang. Retourne true si ça a marché.
export function spendTalentPoint(state, talentId) {
  const meta = state.meta;
  const talent = TALENTS.find((t) => t.id === talentId);
  if (!talent || meta.points <= 0) return false;
  const rank = meta.talents[talentId] || 0;
  if (rank >= talent.max) return false;
  meta.talents[talentId] = rank + 1;
  meta.points--;
  saveMeta(meta);
  return true;
}

// Débloque un succès (une seule fois) ; retourne sa définition ou null.
export function unlockAchievement(state, id) {
  const meta = state.meta;
  if (meta.achievements.includes(id)) return null;
  const def = ACHIEVEMENTS.find((a) => a.id === id);
  if (!def) return null;
  meta.achievements.push(id);
  meta.points += def.points;
  saveMeta(meta);
  state.notifications.push({ kind: "achievement", def });
  return def;
}

// Bonus permanents cumulés des succès débloqués (en pourcentage).
export function achievementBonuses(meta) {
  let dmgPct = 0;
  let gainsPct = 0;
  for (const a of ACHIEVEMENTS) {
    if (meta.achievements.includes(a.id)) {
      dmgPct += a.dmgPct || 0;
      gainsPct += a.gainsPct || 0;
    }
  }
  return { dmgPct, gainsPct };
}

// Multiplicateur de gains (butins, primes de vague, food trucks).
export function gainsMultiplier(state) {
  const bonus = achievementBonuses(state.meta);
  return (1 + 0.12 * (state.meta.talents.gains || 0)) * (1 + bonus.gainsPct / 100);
}

// Enregistre le record de vague de la carte active si battu.
export function recordBestWave(state) {
  const best = state.meta.best[state.mapId] || 0;
  if (state.wave > best) {
    state.meta.best[state.mapId] = state.wave;
    saveMeta(state.meta);
    return true;
  }
  return false;
}
