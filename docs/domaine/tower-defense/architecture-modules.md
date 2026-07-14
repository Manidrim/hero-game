# Architecture en modules (domaine)

> Dernière mise à jour : 2026-07-14

## Rôle

Décrit l'organisation du code du Tower Defense après le passage d'un unique
fichier `game.js` (monolithique) à un ensemble de **modules ES natifs** courts,
chacun avec une responsabilité claire. Le jeu reste **sans build ni bundler** :
le navigateur charge directement le graphe de modules via
`<script type="module" src="src/main.js">`.

## Principe : quatre couches

Le code est séparé en couches, avec un **état passé explicitement** en argument
(pas de variable globale cachée). Cela rend la logique **pure et testable**.

| Couche       | Dossier        | Rôle                                             | Dépend du DOM ? |
| ------------ | -------------- | ------------------------------------------------ | --------------- |
| Configuration | `src/config/` | Données et constantes (grille, chemin, tours, armes, équilibrage) | non |
| Maths        | `src/math/`    | Utilitaires géométriques réutilisables           | non             |
| Domaine      | `src/domain/`  | Logique de jeu : mute `state`, aucun DOM/canvas  | non             |
| Rendu        | `src/render/`  | Dessin sur le canvas `(ctx, state)`              | canvas          |
| Interface    | `src/ui/`      | Synchro DOM du HUD et des panneaux `(el, state)` | oui             |
| Entrées      | `src/input/`   | Écouteurs clavier/souris → actions du domaine    | oui             |

`src/main.js` câble le tout : il crée l'état, sélectionne les nœuds DOM, branche
les entrées et fait tourner la boucle `requestAnimationFrame`.

## Flux d'une frame

Dans `src/main.js`, chaque frame :

1. `update(state, dt, readMoveVector())` — `src/domain/tick.js` avance la
   simulation (apparitions, ennemis, héros, tours, projectiles, textes flottants,
   fin de vague).
2. `draw(ctx, state)` — `src/render/scene.js` redessine la scène.
3. `syncUI()` — met à jour HUD, boutons d'arme, panneau d'amélioration, boutons
   de construction et overlay depuis l'état.

## Conventions

- **État explicite** : toutes les fonctions du domaine reçoivent `state` en
  premier argument et le mutent. `createState()` (`src/domain/state.js`) fabrique
  un état neuf ; `resetState(state)` le réinitialise **sans changer la référence**
  (les écouteurs et la boucle continuent de pointer sur le même objet).
- **Pas de synchro DOM dans le domaine** : la fin de partie ne fait que poser
  `state.gameOver` / `state.won` (`src/domain/game-over.js`) ; l'overlay est
  affiché par `src/ui/overlay.js` qui observe l'état.
- **Fichiers courts** : viser ≤ 50 lignes par module, en découpant par
  responsabilité (mouvement / combat du héros séparés, etc.).

## Tests

La logique du domaine est couverte par **Vitest** (`games/tower-defense/tests/`),
sans DOM. Voir `tower-stats`, `weapon-stats`, `leveling`, `targeting`,
`towers-build`, `towers-upgrade`, `bullets`, `waves`, `enemy-movement`.
Commandes : `npm run test:run` (tests) et `npm run lint` (ESLint).

## Fichiers concernés

- `games/tower-defense/src/**` — tous les modules du jeu.
- `games/tower-defense/index.html` — charge `src/main.js` en module ES.
- `games/tower-defense/tests/**` — tests unitaires du domaine.
- `package.json`, `eslint.config.js` — outillage de dev (Vitest, ESLint).
