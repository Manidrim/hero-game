# Statistiques d'éliminations du héros (domaine)

> Dernière mise à jour : 2026-07-14

## Rôle

Décrit le suivi du nombre d'ennemis **terminés par le héros**, au total et par
arme, affiché dans le panneau de statistiques à gauche de la carte.

## Attribution d'une élimination

L'auteur d'un tir est transporté par le projectile via un champ `source` :

- Le héros tire avec `source = { type: "hero", weapon }` (`src/domain/hero-combat.js`).
- Les tours ne renseignent pas de source (`source = null` par défaut dans
  `spawnBullet`, `src/domain/bullets.js`) : leurs éliminations ne sont pas
  comptées pour le héros.

Le `source` circule ensuite du projectile jusqu'à la mort de l'ennemi :
`applyHit` → `damageEnemy(state, index, damage, slow, source)` →
`killEnemy(state, index, source)` (`src/domain/enemy-damage.js`). Quand la source
est le héros, `killEnemy` appelle `recordHeroKill`.

## Comptage

`recordHeroKill(state, weaponKey)` (`src/domain/kill-stats.js`) incrémente :

- `state.hero.kills` — total, toutes armes confondues ;
- `state.hero.weapons[weaponKey].kills` — détail par arme.

Les deux compteurs sont initialisés à `0` (`createHero` dans
`src/domain/state.js`, `createWeapon` dans `src/domain/weapon-state.js`) et remis
à zéro par `resetState`.

## Affichage

`syncHeroKills(el, state)` (`src/ui/hero-kills.js`) écrit le total et chaque
compteur d'arme dans le panneau `panel-left` de `index.html`. La fonction est
appelée à chaque frame par `syncUI` (`src/main.js`).

## Tests

`games/tower-defense/tests/kill-stats.test.js` couvre `recordHeroKill` et
l'attribution par `killEnemy` (héros vs tour vs absence de source).
