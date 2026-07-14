// Références vers les nœuds DOM du HUD et des panneaux latéraux.
export function queryElements() {
  return {
    gold: document.getElementById("gold"),
    lives: document.getElementById("lives"),
    wave: document.getElementById("wave"),
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
  };
}
