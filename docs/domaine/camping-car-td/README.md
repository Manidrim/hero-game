# Camping-Car TD — documentation technique (domaine)

> Dernière mise à jour : 2026-11-12

Jeu de tower defense où les tours sont des véhicules de camping, sous
`games/camping-car-td/`. Même architecture en couches que le Tower Defense :
`src/config/` (données), `src/math/`, `src/domain/` (logique pure, testée),
`src/render/`, `src/ui/`, `src/input/`, `src/main.js`.

## Pages

- [Cartes et chemins](cartes.md) — `config/maps.js`, `domain/maps.js` :
  définition des 3 cartes, `pathSet` / `waypoints`, décor déterministe.
- [Vagues et équilibrage](vagues-et-equilibrage.md) — `config/waves.js`,
  `domain/waves.js` : files d'apparition, PV super-linéaires, boss, mode
  infini, économie.
- [Méta-progression persistante](progression-meta.md) — `domain/meta.js`,
  `domain/persistence.js` : XP/niveaux, talents, succès, records,
  sauvegarde `localStorage`.
