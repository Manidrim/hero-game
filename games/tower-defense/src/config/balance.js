// Constantes d'équilibrage du gameplay, centralisées pour un réglage facile.

// Ressources de départ.
export const STARTING_GOLD = 200;
export const STARTING_LIVES = 20;

// Apparition et vagues.
export const SPAWN_INTERVAL = 0.7; // délai entre deux apparitions (s)
export const enemyCount = (wave) => 8 + wave * 2;
export const enemyBaseHp = (wave) => 20 + wave * 12;
export const waveReward = (wave) => 40 + wave * 5;

// Projectiles.
export const DEFAULT_BULLET_SPEED = 420;

// Ralentissement (tour de givre).
export const ENEMY_SLOW_FACTOR = 0.5; // vitesse × 0.5 quand l'ennemi est ralenti
export const SLOW_DURATION = 1.5; // durée du ralentissement (s)

// Textes flottants.
export const FLOATER_LIFE = 1; // durée de vie (s)
export const FLOATER_RISE = 24; // vitesse de montée (px/s)
