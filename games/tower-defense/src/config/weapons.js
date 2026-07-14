// Armes du héros, débloquées en montant de niveau. Chaque arme applique des
// multiplicateurs sur les statistiques de base du héros (dégâts / portée /
// cadence) et peut ajouter des dégâts de zone. `fireRateMul` agit sur le délai
// entre deux tirs : > 1 = plus lent.
export const WEAPONS = {
  smg: {
    name: "Mitraillette", emoji: "🔫", unlockLevel: 1,
    damageMul: 1, rangeMul: 1, fireRateMul: 0.8, splash: 0,
    bullet: "#ffe066", bulletSpeed: 520,
    desc: "Tir rapide, dégâts modérés.",
  },
  bazooka: {
    name: "Bazooka", emoji: "🚀", unlockLevel: 5,
    damageMul: 2.4, rangeMul: 1, fireRateMul: 3, splash: 60,
    bullet: "#ffa94d", bulletSpeed: 340,
    desc: "Dégâts de zone, cadence lente.",
  },
  sniper: {
    name: "Sniper", emoji: "🎯", unlockLevel: 10,
    damageMul: 4, rangeMul: 2, fireRateMul: 3.5, splash: 0,
    bullet: "#74c0fc", bulletSpeed: 1000,
    desc: "Dégâts et portée énormes, cadence très lente.",
  },
};

// Ordre d'affichage / de défilement des armes.
export const WEAPON_ORDER = ["smg", "bazooka", "sniper"];
// Délai (secondes) avant de pouvoir changer à nouveau d'arme.
export const WEAPON_SWITCH_COOLDOWN = 3.5;
