import { WEAPONS, WEAPON_ORDER, WEAPON_XP_BASE } from "../config/weapons.js";

// État de progression d'une arme : possession, niveau/XP propres et points
// répartis dans le multiplicateur de dégâts ou la vitesse d'attaque.
export function createWeapon(key) {
  return {
    owned: WEAPONS[key].cost === 0, // les armes gratuites sont possédées d'emblée
    level: 1, xp: 0, xpNext: WEAPON_XP_BASE,
    points: 0, // points disponibles à répartir
    multiplierPoints: 0, // points investis dans le multiplicateur
    speedPoints: 0, // points investis dans la vitesse d'attaque
  };
}

// Dictionnaire { clé d'arme → état } pour toutes les armes du héros.
export function createWeapons() {
  return Object.fromEntries(WEAPON_ORDER.map((key) => [key, createWeapon(key)]));
}
