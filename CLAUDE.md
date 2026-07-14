# hero-game — règles du projet

Arcade de petits jeux en **HTML / CSS / JavaScript vanilla**, servie en statique
sur GitHub Pages. **Sans bundler ni dépendance d'exécution** : le navigateur
charge directement les modules ES (`<script type="module">`). Les seules
dépendances sont des outils de **dev** (ESLint, Vitest).

## Priorité n°1 : clean code

Le code doit **rester propre** à chaque changement. Cette exigence prime sur la
rapidité de livraison. Concrètement, tout code ajouté ou modifié respecte :

- **Une responsabilité par fichier / par fonction.** Un fichier fait une seule
  chose ; on découpe dès qu'il en fait plusieurs.
- **Fichiers courts : viser ≤ 50 lignes** par module (souple si le découper
  nuirait à la lisibilité, mais c'est la cible par défaut).
- **Séparation des couches** (voir l'architecture ci-dessous) : la logique de jeu
  ne touche **jamais** au DOM ni au canvas.
- **État passé explicitement** en argument (`state` en premier paramètre des
  fonctions du domaine). Pas de variable globale mutable cachée.
- **Constantes nommées**, pas de nombres magiques : les valeurs d'équilibrage
  vivent dans `src/config/`.
- **Noms explicites** en français (domaine du jeu), cohérents avec l'existant.
- **Pas de code mort** ni de champ inutilisé.

## Architecture (jeu Tower Defense)

Code sous `games/tower-defense/src/`, organisé en couches à responsabilité unique :

- `config/` — données & constantes (grille, chemin, tours, armes, équilibrage)
- `math/` — utilitaires réutilisables (géométrie)
- `domain/` — logique de jeu **pure** : mute `state`, aucun DOM/canvas → testable
- `render/` — dessin canvas `(ctx, state)`
- `ui/` — synchro DOM du HUD et des panneaux `(el, state)`
- `input/` — écouteurs clavier/souris → actions du domaine
- `main.js` — câblage + boucle `requestAnimationFrame`

Détails : [`docs/domaine/tower-defense/architecture-modules.md`](docs/domaine/tower-defense/architecture-modules.md).
En ajoutant une couche/concept, respecte ce découpage ; ne réintroduis pas de
fichier monolithique.

## Qualité — obligatoire avant tout commit

Toute modification de code doit passer le lint et les tests :

```bash
npm run lint        # ESLint (flat config, règles clean code)
npm run test:run    # Vitest — tests du domaine
```

- La **logique du domaine** (`src/domain/`) doit être **couverte par des tests**
  Vitest (`games/tower-defense/tests/`). Un nouveau comportement de jeu = un test.
- Ne pas casser le comportement existant : un refacto est à comportement constant.

## Documentation

Le projet tient une doc vivante sous `docs/` (skill `documentation-projet`).
Mets-la à jour quand tu ajoutes/modifies une règle métier ou un composant
technique. Aucun fichier de doc > 500 lignes.

## Déploiement

Push sur `main` → déploiement GitHub Pages automatique (racine du dépôt servie).
Ne rien introduire qui exige une étape de build pour faire tourner le jeu.
