# Déploiement GitHub Pages (domaine)

> Dernière mise à jour : 2026-07-14

## Rôle
Publie le site statique de l'arcade sur GitHub Pages afin de disposer d'une
URL de test publique reflétant toujours l'état de la branche `main`.

URL publique : `https://manidrim.github.io/hero-game/`

## Fonctionnement
Le déploiement est automatisé par un workflow GitHub Actions, et non par le mode
« deploy from a branch ». Aucun dossier de build n'est committé : le contenu du
dépôt (racine) est publié tel quel.

Déclencheurs du workflow :
- `push` sur `main` — republie le site à chaque merge/commit sur `main` ;
- `workflow_dispatch` — déclenchement manuel depuis l'onglet Actions.

Étapes du job `deploy` (runner `ubuntu-latest`) :
1. `actions/checkout@v4` — récupère le dépôt.
2. `actions/configure-pages@v5` — prépare l'environnement Pages.
3. `actions/upload-pages-artifact@v3` avec `path: .` — empaquette la racine
   (le site est servi depuis la racine : `index.html`, `assets/`, `games/`).
4. `actions/deploy-pages@v4` — publie l'artefact sur Pages.

Réglages clés :
- Permissions : `pages: write` et `id-token: write` (déploiement OIDC).
- `concurrency: pages` avec `cancel-in-progress: true` — un seul déploiement à
  la fois, le plus récent l'emporte.

## Activation (une seule fois)
Le workflow ne suffit pas seul : il faut activer Pages côté dépôt.
- GitHub → **Settings** → **Pages** → *Build and deployment* →
  **Source : GitHub Actions**.

## Fichiers concernés
- `.github/workflows/deploy-pages.yml` — définition du workflow de déploiement.

## Points d'attention
- Le workflow ne se déclenche que depuis `main` : une branche de travail doit
  être fusionnée dans `main` pour être publiée.
- Le site étant servi sous le sous-chemin `/hero-game/`, éviter les chemins
  absolus commençant par `/` dans le HTML/CSS/JS ; privilégier les chemins
  relatifs (déjà le cas dans `index.html`).
