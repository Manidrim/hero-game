import { COLS, ROWS } from "../config/grid.js";
import { MAPS, findMap, buildPathSet, buildWaypoints } from "../config/maps.js";
import { mulberry32 } from "../math/random.js";
import { saveMeta } from "./persistence.js";

const DECO_EMOJIS = ["🌲", "🌼", "🌿", "🍄", "🌷"];

// Sélectionne la carte active : chemin, points de passage, décor, méta courante.
export function selectMap(state, mapId) {
  const map = findMap(mapId);
  state.mapId = map.id;
  state.pathSet = buildPathSet(map.cells);
  state.waypoints = buildWaypoints(map.cells);
  state.deco = buildDeco(map, state.pathSet);
  state.meta.currentMap = map.id;
  saveMeta(state.meta);
}

// Décor fixe par carte (arbres, fleurs) sur les cases libres hors chemin.
function buildDeco(map, pathSet) {
  const rnd = mulberry32(map.id.length * 7919 + map.cells.length * 131);
  const deco = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!pathSet.has(c + "," + r) && rnd() < 0.14) {
        deco.push({ c, r, emoji: DECO_EMOJIS[Math.floor(rnd() * DECO_EMOJIS.length)] });
      }
    }
  }
  return deco;
}

// La carte est-elle débloquée au niveau courant de la méta ?
export function mapUnlocked(state, map) {
  return state.meta.level >= map.unlock;
}

// Liste des cartes avec leur état de déblocage.
export function listMaps(state) {
  return MAPS.map((m) => ({ ...m, locked: !mapUnlocked(state, m) }));
}
