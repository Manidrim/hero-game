// Armes du héros. La mitraillette est offerte au départ ; les autres s'achètent
// avec de l'or (`cost`). Chaque arme a ses propres caractéristiques fixes
// (portée, cadence de base, zone, projectile) et progresse ensuite via ses
// propres niveaux (voir domain/weapon-leveling.js). `baseFireRate` est le délai
// entre deux tirs au niveau 1 : plus il est grand, plus l'arme est lente.
// `baseMultiplier` est le multiplicateur de dégâts par défaut, avant les points
// investis : les armes lourdes frappent plus fort dès l'acquisition.
export const WEAPONS = {
  smg: {
    name: "Mitraillette", emoji: "🔫", cost: 0,
    rangeMul: 1, baseFireRate: 0.7, splash: 0, baseMultiplier: 1,
    bullet: "#ffe066", bulletSpeed: 520,
  },
  bazooka: {
    name: "Bazooka", emoji: "🚀", cost: 1000,
    rangeMul: 1, baseFireRate: 1.8, splash: 60, baseMultiplier: 3,
    bullet: "#ffa94d", bulletSpeed: 340,
  },
  sniper: {
    name: "Sniper", emoji: "🎯", cost: 5000,
    rangeMul: 2, baseFireRate: 2.2, splash: 0, baseMultiplier: 6,
    bullet: "#74c0fc", bulletSpeed: 1000,
  },
};

// Ordre d'affichage / de défilement des armes.
export const WEAPON_ORDER = ["smg", "bazooka", "sniper"];
// Délai (secondes) avant de pouvoir changer à nouveau d'arme.
export const WEAPON_SWITCH_COOLDOWN = 3.5;

// Progression des armes.
export const WEAPON_XP_BASE = 30; // XP requise pour atteindre le niveau 2
export const WEAPON_XP_GROWTH = 1.6; // croissance du seuil d'XP par niveau
export const MULTIPLIER_STEP = 0.1; // gain de multiplicateur par point (x1.0 → +0.1)
export const FIRE_RATE_STEP = 0.9; // délai de tir × 0.9 par point de vitesse
export const MIN_FIRE_RATE = 0.15; // délai de tir minimum (s)
