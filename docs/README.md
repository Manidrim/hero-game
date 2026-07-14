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
│   └── tower-defense/
│       └── deplacement-du-heros.md        # entrées clavier/souris, updateHero
└── metier/                                # documentation fonctionnelle
    └── tower-defense/
        └── controles.md                   # contrôles du jeu (ZQSD/WASD/flèches, souris)
```

## Pages

### Domaine (technique)

- [`tower-defense/deplacement-du-heros.md`](domaine/tower-defense/deplacement-du-heros.md)
  — déplacement du héros : gestion des entrées clavier (via `event.code`,
  compatible AZERTY/QWERTY) et souris.

### Métier (fonctionnel)

- [`tower-defense/controles.md`](metier/tower-defense/controles.md)
  — contrôles du jeu du point de vue du joueur : déplacement ZQSD/WASD/flèches/souris
  et raccourcis clavier.
