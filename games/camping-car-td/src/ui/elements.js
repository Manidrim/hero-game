// Références vers les nœuds DOM du HUD, des panneaux et des modales.
export function queryElements() {
  const ids = [
    "money", "lives", "wave", "kills", "level", "xpfill", "points",
    "start-wave", "auto", "speed", "pause", "maps", "talents", "achievements", "help", "reset",
    "shop-list", "shop-hint", "wave-info",
    "inspector", "game", "overlay", "overlay-title", "overlay-text", "overlay-retry", "overlay-maps",
    "banner", "toasts",
    "modal-backdrop", "modal-title", "modal-body", "modal-close",
  ];
  const el = {};
  for (const id of ids) el[id] = document.getElementById(id);
  return el;
}
