// Petits utilitaires géométriques réutilisés dans tout le jeu.

// Distance euclidienne entre deux points.
export const distance = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

// Contraint une valeur dans l'intervalle [min, max].
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
