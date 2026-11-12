# Documentation du projet

Documentation vivante générée et maintenue via le skill
[`documentation-projet`](../.claude/skills/documentation-projet/SKILL.md).

Elle est organisée en deux familles, de façon **arborescente** (sous-dossiers
thématiques), avec **aucun fichier de plus de 500 lignes** :

- **Domaine** (`docs/domaine/`) — le « comment » technique : architecture,
  composants, structures de données, flux de code.
- **Métier** (`docs/metier/`) — le « quoi » fonctionnel : règles de gestion,
  parcours utilisateur, vocabulaire du domaine.

## Arborescence

```
docs/
├── README.md                              # ce fichier : vue d'ensemble
├── domaine/                               # documentation technique
│   ├── arcade/
│   │   └── accueil-menu.md                # menu d'accueil de l'arcade (cartes de jeux)
│   ├── camping-car-td/
│   │   ├── README.md                      # index local du jeu
│   │   ├── cartes.md                      # cartes, chemins (pathSet/waypoints), sélecteur
│   │   ├── vagues-et-equilibrage.md        # files de vagues, PV, boss, mode infini, économie
│   │   └── progression-meta.md            # XP/niveaux, talents, succès, records, localStorage
│   ├── deploiement/
│   │   └── github-pages.md                # déploiement du site sur GitHub Pages
│   └── tower-defense/
│       ├── architecture-modules.md        # découpage en modules ES (couches, flux de frame)
│       ├── armes-du-heros.md              # système d'armes du héros (WEAPONS, switchWeapon)
│       ├── deplacement-du-heros.md        # entrées clavier/souris, moveHero
│       └── statistiques-du-heros.md       # suivi des éliminations du héros (total et par arme)
└── metier/                                # documentation fonctionnelle
    ├── camping-car-td/
    │   ├── README.md                      # index local du jeu
    │   ├── regles-du-jeu.md               # règles : véhicules, ennemis, vagues, contrôles
    │   └── progression.md                 # progression du joueur (XP, talents, succès, records)
    └── tower-defense/
        ├── armes-du-heros.md              # armes du héros (mitraillette/bazooka/sniper)
        └── controles.md                   # contrôles du jeu (ZQSD/WASD/flèches, souris)
```

## Pages

### Domaine (technique)

- [`arcade/accueil-menu.md`](domaine/arcade/accueil-menu.md)
  — menu d'accueil de l'arcade : cartes de jeux dans `index.html` racine,
  vignettes dans `assets/home.css`, lien vers `games/<jeu>/index.html`.
- [`camping-car-td/cartes.md`](domaine/camping-car-td/cartes.md)
  — les 3 cartes du Camping-Car TD : définition des chemins, `pathSet` /
  `waypoints`, décor déterministe, sélecteur de carte.
- [`camping-car-td/vagues-et-equilibrage.md`](domaine/camping-car-td/vagues-et-equilibrage.md)
  — système de vagues : file d'apparition, multiplicateur de PV
  super-linéaire, boss tous les 10 vagues, mode infini, économie.
- [`camping-car-td/progression-meta.md`](domaine/camping-car-td/progression-meta.md)
  — méta-progression persistante : XP/niveaux, arbre de talents, succès et
  bonus, records par carte, sauvegarde `localStorage`.
- [`tower-defense/architecture-modules.md`](domaine/tower-defense/architecture-modules.md)
  — organisation du code en modules ES (couches config / domaine / rendu / UI /
  entrées), flux d'une frame, conventions et tests.
- [`deploiement/github-pages.md`](domaine/deploiement/github-pages.md)
  — déploiement automatique du site sur GitHub Pages via GitHub Actions
  (URL de test publique reflétant `main`).
- [`tower-defense/armes-du-heros.md`](domaine/tower-defense/armes-du-heros.md)
  — système d'armes du héros : table `WEAPONS`, statistiques effectives,
  déblocage par niveau et changement d'arme avec cooldown.
- [`tower-defense/deplacement-du-heros.md`](domaine/tower-defense/deplacement-du-heros.md)
  — déplacement du héros : gestion des entrées clavier (via `event.code`,
  compatible AZERTY/QWERTY) et souris.
- [`tower-defense/statistiques-du-heros.md`](domaine/tower-defense/statistiques-du-heros.md)
  — suivi des éliminations du héros : attribution via la `source` du projectile,
  compteurs total et par arme, affichage dans le panneau de gauche.

### Métier (fonctionnel)

- [`camping-car-td/regles-du-jeu.md`](metier/camping-car-td/regles-du-jeu.md)
  — règles du Camping-Car TD du point de vue du joueur : objectif, boutique de
  véhicules, ennemis, vagues/boss/mode infini, contrôles.
- [`camping-car-td/progression.md`](metier/camping-car-td/progression.md)
  — progression du joueur : XP et niveaux, talents, succès, cartes à
  débloquer, sauvegarde automatique entre les parties.
- [`tower-defense/armes-du-heros.md`](metier/tower-defense/armes-du-heros.md)
  — armes du héros du point de vue du joueur : mitraillette (base), bazooka
  (niveau 5), sniper (niveau 10) et changement d'arme.
- [`tower-defense/controles.md`](metier/tower-defense/controles.md)
  — contrôles du jeu du point de vue du joueur : déplacement ZQSD/WASD/flèches/souris
  et raccourcis clavier.
