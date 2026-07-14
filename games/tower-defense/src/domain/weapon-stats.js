import { WEAPONS } from "../config/weapons.js";

// Statistiques d'attaque effectives du héros selon l'arme équipée.
export function weaponStats(hero) {
  const w = WEAPONS[hero.weapon];
  return {
    damage: hero.damage * w.damageMul,
    range: hero.range * w.rangeMul,
    fireRate: hero.fireRate * w.fireRateMul,
    splash: w.splash,
    bullet: w.bullet,
    bulletSpeed: w.bulletSpeed,
  };
}
