# Menu d'accueil de l'arcade (domaine)

> Dernière mise à jour : 2026-11-12

## Rôle

La racine du dépôt sert un **menu d'arcade** statique : `index.html` liste les
jeux jouables, chacun menant à `games/<jeu>/index.html`.

## Structure

- `index.html` (racine) : une carte par jeu, `<a class="game-card available"
  href="games/<jeu>/index.html">` avec une vignette `.thumb` (classe dédiée par
  jeu, ex. `.td-thumb`, `.cc-thumb`) et un badge « Jouer → ». Une carte
  `.game-card.soon` annonce les prochains jeux.
- `assets/home.css` : style des cartes, vignettes animées (CSS pur) et thème
  général de l'arcade.
- Chaque jeu a son propre `index.html` + `game.css` et un lien
  `<a class="back" href="../../index.html">← Arcade</a>` pour revenir au menu.

## Ajouter un jeu au menu

1. Créer `games/<jeu>/` (index.html, game.css, src/…).
2. Ajouter une carte `available` dans `index.html` racine pointant vers
   `games/<jeu>/index.html`.
3. Ajouter la vignette `.thumb` et son CSS dans `assets/home.css`.

Aucun build : GitHub Pages sert la racine telle quelle (voir
`docs/domaine/deploiement/github-pages.md` et `vercel.json`).
