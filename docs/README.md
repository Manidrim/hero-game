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
│   ├── deploiement/
│   │   └── github-pages.md                # déploiement du site sur GitHub Pages
│   └── tower-defense/
│       ├── architecture-modules.md        # découpage en modules ES (couches, flux de frame)
│       ├── armes-du-heros.md              # système d'armes du héros (WEAPONS, switchWeapon)
│       └── deplacement-du-heros.md        # entrées clavier/souris, moveHero
└── metier/                                # documentation fonctionnelle
    └── tower-defense/
        ├── armes-du-heros.md              # armes du héros (mitraillette/bazooka/sniper)
        └── controles.md                   # contrôles du jeu (ZQSD/WASD/flèches, souris)
```

## Pages

### Domaine (technique)

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

### Métier (fonctionnel)

- [`tower-defense/armes-du-heros.md`](metier/tower-defense/armes-du-heros.md)
  — armes du héros du point de vue du joueur : mitraillette (base), bazooka
  (niveau 5), sniper (niveau 10) et changement d'arme.
- [`tower-defense/controles.md`](metier/tower-defense/controles.md)
  — contrôles du jeu du point de vue du joueur : déplacement ZQSD/WASD/flèches/souris
  et raccourcis clavier.
