# Cartes et chemins (domaine)

> Dernière mise à jour : 2026-11-12

## Rôle

Les ennemis suivent un chemin défini par carte ; les véhicules se posent sur
les cases d'herbe libres. Le tout est porté par `state.pathSet` (cases du
chemin) et `state.waypoints` (points de passage en pixels).

## Définition (`src/config/maps.js`)

- `MAPS` : 3 cartes (`prairie`, `foret`, `montagne`), chacune avec un `id`,
  un `emoji`, un niveau de déblocage `unlock`, une description et `cells`, la
  liste des points de passage en coordonnées grille. Les extrémités hors grille
  (ex. `[-1, 6]` → `[21, 4]`) simulent l'entrée et la sortie du terrain.
- `buildPathSet(cells)` : ensemble des cases traversées (`"c,r"`), non
  constructibles. Les segments sont horizontaux/verticaux.
- `buildWaypoints(cells)` : mêmes points convertis en pixels (centres de
  cases), utilisés par le déplacement des ennemis.
- `findMap(id)` : repli sur la première carte si l'id est inconnu.

## Sélection (`src/domain/maps.js`)

`selectMap(state, mapId)` renseigne `state.mapId`, `state.pathSet`,
`state.waypoints`, `state.deco` (décor d'arbres/fleurs, généré de façon
déterministe via `mulberry32` pour rester stable d'une partie à l'autre), et
met à jour `state.meta.currentMap` (sauvegardé).

`listMaps(state)` expose chaque carte avec son cadenas (`locked`) selon le
niveau de la méta ; l'UI s'en sert pour la modale de choix de carte.

## Règles

- On ne peut poser un véhicule que sur une case dans la grille, hors chemin et
  non occupée (`canPlaceAt` dans `domain/vehicles-build.js`).
- Changer de carte via la modale 🗺️ réinitialise la partie courante
  (`resetState`) sur la nouvelle carte, méta conservée.
