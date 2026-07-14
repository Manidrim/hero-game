import { WEAPONS, MULTIPLIER_STEP, FIRE_RATE_STEP, MIN_FIRE_RATE } from "../config/weapons.js";

// Multiplicateur de dégâts d'une arme : x1.0 de base, +0.1 par point investi.
export function weaponMultiplier(w) {
  return 1 + MULTIPLIER_STEP * w.multiplierPoints;
}

// Délai de tir effectif d'une arme, réduit par les points de vitesse.
export function weaponFireRate(def, w) {
  return Math.max(MIN_FIRE_RATE, def.baseFireRate * Math.pow(FIRE_RATE_STEP, w.speedPoints));
}

// Statistiques d'attaque effectives du héros avec l'arme équipée.
// Dégâts = dégâts du héros × multiplicateur de l'arme.
export function weaponStats(hero) {
  const def = WEAPONS[hero.weapon];
  const w = hero.weapons[hero.weapon];
  const multiplier = weaponMultiplier(w);
  return {
    damage: hero.damage * multiplier,
    range: hero.range * def.rangeMul,
    fireRate: weaponFireRate(def, w),
    splash: def.splash,
    bullet: def.bullet,
    bulletSpeed: def.bulletSpeed,
    multiplier,
  };
}
