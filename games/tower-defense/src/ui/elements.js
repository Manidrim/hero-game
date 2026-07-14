import { WEAPON_ORDER } from "../config/weapons.js";

// Références vers les nœuds DOM du HUD et des panneaux latéraux.
export function queryElements() {
  return {
    gold: document.getElementById("gold"),
    lives: document.getElementById("lives"),
    wave: document.getElementById("wave"),
    heroKills: document.getElementById("hero-kills"),
    killCounts: Object.fromEntries(
      WEAPON_ORDER.map((key) => [key, document.getElementById("kills-" + key)]),
    ),
    heroLevel: document.getElementById("hero-level"),
    heroXpFill: document.getElementById("hero-xpfill"),
    heroDmg: document.getElementById("hero-dmg"),
    heroRange: document.getElementById("hero-range"),
    heroHp: document.getElementById("hero-hp"),
    startWave: document.getElementById("start-wave"),
    reset: document.getElementById("reset"),
    nearbyTowers: document.getElementById("nearby-towers"),
    nearbyHint: document.getElementById("nearby-hint"),
    overlay: document.getElementById("overlay"),
    overlayTitle: document.getElementById("overlay-title"),
    overlayText: document.getElementById("overlay-text"),
    overlayBtn: document.getElementById("overlay-btn"),
    buildButtons: Array.from(document.querySelectorAll(".build-btn")),
    weaponButtons: Array.from(document.querySelectorAll(".weapon-btn")),
    weaponDetail: document.getElementById("weapon-detail"),
    wdName: document.getElementById("wd-name"),
    wdLevel: document.getElementById("wd-level"),
    wdXpFill: document.getElementById("wd-xpfill"),
    wdMult: document.getElementById("wd-mult"),
    wdRate: document.getElementById("wd-rate"),
    wdPoints: document.getElementById("wd-points"),
    allocMult: document.getElementById("alloc-mult"),
    allocSpeed: document.getElementById("alloc-speed"),
    wdHeroPoints: document.getElementById("wd-hero-points"),
    grantLevel: document.getElementById("grant-level"),
  };
}
