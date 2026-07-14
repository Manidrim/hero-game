import { WIDTH, HEIGHT } from "../config/grid.js";
import { STARTING_GOLD, STARTING_LIVES } from "../config/balance.js";
import { createWeapons } from "./weapon-state.js";

// Fabrique un état de jeu neuf (nouvelle partie).
export function createState() {
  return {
    gold: STARTING_GOLD,
    lives: STARTING_LIVES,
    wave: 0,
    towers: [],
    enemies: [],
    bullets: [],
    floaters: [], // textes flottants (or gagné, level up…)
    spawnQueue: [],
    spawnTimer: 0,
    waveActive: false,
    selectedType: null, // type de tour choisi pour la construction
    hoverCell: null,
    gameOver: false,
    won: false,
    nextTowerId: 1,
    panelSig: null, // signature du panneau d'amélioration (évite les redraws DOM)
    hero: createHero(),
  };
}

// Réinitialise un état existant en conservant sa référence (pour que les
// écouteurs et la boucle continuent de pointer sur le même objet).
export function resetState(state) {
  Object.assign(state, createState());
}

function createHero() {
  return {
    x: WIDTH / 2, y: HEIGHT / 2,
    tx: WIDTH / 2, ty: HEIGHT / 2,
    speed: 140,
    level: 1, xp: 0, xpNext: 10,
    maxHp: 100, hp: 100,
    damage: 14, range: 90,
    cooldown: 0,
    regen: 2, // PV par seconde
    weapon: "smg", // arme équipée
    weapons: createWeapons(), // état de progression de chaque arme
    switchCd: 0, // temps restant avant de pouvoir changer d'arme
  };
}
