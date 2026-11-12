import { STARTING_MONEY, SPEED_LEVELS } from "../config/balance.js";
import { loadMeta } from "./persistence.js";
import { selectMap } from "./maps.js";
import { maxLives } from "./meta.js";

// Fabrique un état de partie neuf (la méta-progression est rechargée depuis
// la sauvegarde et conservée dans `state.meta`).
export function createState() {
  const state = {
    meta: loadMeta(),
    mapId: null,
    pathSet: new Set(),
    waypoints: [],
    deco: [],
    money: STARTING_MONEY,
    lives: 0,
    wave: 0,
    towers: [], // véhicules posés
    enemies: [],
    effects: [], // tracés de tir / explosions temporaires
    floaters: [], // textes flottants
    spawnQueue: [],
    spawnTimer: 0,
    waveActive: false,
    placing: null, // id de véhicule en cours de placement
    selectedId: null, // id du véhicule inspecté
    hoverCell: null,
    paused: false,
    speedIndex: 0,
    auto: false,
    autoTimer: 0,
    gameOver: false,
    victoryNotified: false,
    kills: 0,
    nextTowerId: 1,
    nextEnemyId: 1,
    notifications: [], // événements consommés par la couche UI
  };
  selectMap(state, state.meta.currentMap);
  state.lives = maxLives(state);
  state.speedIndex = state.meta.speedIndex || 0;
  return state;
}

// Réinitialise un état existant (même référence) sur une carte donnée,
// en conservant la méta-progression.
export function resetState(state, mapId) {
  const meta = state.meta;
  Object.assign(state, createState());
  state.meta = meta;
  selectMap(state, mapId || meta.currentMap);
  state.lives = maxLives(state);
  state.speedIndex = meta.speedIndex || 0;
}

// Vitesse de jeu courante (x1, x2, x3).
export function speedOf(state) {
  return SPEED_LEVELS[state.speedIndex];
}
