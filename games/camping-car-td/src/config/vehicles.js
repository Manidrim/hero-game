// Définition des véhicules (tours) posables sur l'herbe.
// range est exprimée en cases ; income en euros/seconde ; slow en fraction de
// vitesse retirée (aura de ralentissement).
export const VEHICLE_TYPES = {
  van: {
    name: "Van aménagé", emoji: "🚐", cost: 100,
    damage: 9, range: 2.4, fireRate: 1.0, unlock: 1,
    desc: "Tir rapide et fiable.",
  },
  bivouac: {
    name: "Bivouac", emoji: "⛺", cost: 150,
    range: 2.6, slow: 0.35, unlock: 2,
    desc: "Ralentit les ennemis qui passent à proximité.",
  },
  quad: {
    name: "4x4 Aventure", emoji: "🛻", cost: 220,
    damage: 26, range: 2.0, fireRate: 0.55, unlock: 3,
    desc: "Gros dégâts, cadence lente.",
  },
  profile: {
    name: "Camping-car profilé", emoji: "🚌", cost: 380,
    damage: 14, range: 3.6, fireRate: 1.1, unlock: 4,
    desc: "Longue portée, couvre plusieurs virages.",
  },
  foodtruck: {
    name: "Food truck", emoji: "🚚", cost: 320,
    income: 3, unlock: 5,
    desc: "Ne tire pas, rapporte des euros en continu.",
  },
  rocket: {
    name: "Van fusée", emoji: "🚀", cost: 650,
    damage: 62, range: 3.0, fireRate: 0.35, unlock: 7,
    desc: "Obus dévastateurs, très lent.",
  },
};

// Coût pour passer du niveau `level` au niveau suivant.
export function upgradeCost(def, level) {
  return Math.round(def.cost * 0.8 * Math.pow(level, 1.35));
}
