// Définition des types de tours constructibles.
export const TOWER_TYPES = {
  arrow: {
    name: "Archers", cost: 50, range: 120, damage: 8, fireRate: 0.55,
    color: "#4dabf7", bullet: "#a5d8ff", splash: 0, slow: 0, emoji: "🏹",
  },
  cannon: {
    name: "Canon", cost: 100, range: 110, damage: 22, fireRate: 1.3,
    color: "#e8863c", bullet: "#ffd8a8", splash: 45, slow: 0, emoji: "💣",
  },
  frost: {
    name: "Givre", cost: 75, range: 100, damage: 4, fireRate: 0.8,
    color: "#63e6be", bullet: "#c3fae8", splash: 0, slow: 0.5, emoji: "❄️",
  },
};

export const MAX_TOWER_LEVEL = 10;
export const UPGRADE_RADIUS = 110; // distance héros→tour pour pouvoir améliorer
