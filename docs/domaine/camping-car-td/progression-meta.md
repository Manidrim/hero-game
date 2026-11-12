# Méta-progression persistante (domaine)

> Dernière mise à jour : 2026-11-12

## Rôle

La progression qui **survit aux parties** (contrairement à l'état de partie,
recréé à chaque lancement) vit dans `state.meta` et est sauvegardée dans
`localStorage` (clé `camping-car-td-meta-v1`) via `domain/persistence.js`.

## Structure de `meta`

`xp`, `level`, `points` (points de talent disponibles), `talents`
(`{talentId: rang}`), `achievements` (ids débloqués), `totalKills`,
`totalEarned`, `best` (`{mapId: record de vague}`), `currentMap`,
`speedIndex` (vitesse de jeu préférée).

## Mécanismes (`src/domain/meta.js`)

- **XP / niveaux** : `addXp(state, n)` crédite l'XP ; chaque passage de niveau
  (`xpForLevel(level) = 80·level^1.55`) rapporte **2 points de talent** et
  pousse une notification `levelup` consommée par l'UI.
- **Talents** (`config/meta.js` → `TALENTS`) : 5 talents à 3 rangs (dégâts
  +12%, portée +10%, cadence +10%, gains +12%, vies max +3), achetés un point
  à la fois via `spendTalentPoint`. Ils s'appliquent dans
  `domain/vehicle-stats.js` (`vehicleStats`) et `gainsMultiplier`.
- **Succès** (`ACHIEVEMENTS`) : débloqués une fois chacun via
  `unlockAchievement` (ex. `first_blood`, paliers de vagues, boss, véhicule
  niveau 5…). Chacun offre des points de talent et/ou un bonus permanent en
  pourcentage (`dmgPct`, `gainsPct`), cumulés par `achievementBonuses`.
- **Records** : `recordBestWave` met à jour `meta.best[mapId]`.

## Déblocages

- Véhicules : `VEHICLE_TYPES[id].unlock` = niveau requis (boutique grisée).
- Cartes : `MAPS[i].unlock` = niveau requis (modale 🗺️, `mapUnlocked`).

## Sauvegarde

`saveMeta` est appelée à chaque changement de méta (niveau, talent, succès,
record, carte, vitesse). Hors navigateur (tests Vitest), `loadMeta` retombe
sur `defaultMeta()` en mémoire. `wipeMeta()` efface la sauvegarde (bouton dans
la modale des cartes, avec confirmation).
