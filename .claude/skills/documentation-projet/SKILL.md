---
name: documentation-projet
description: >-
  Crée et maintient la documentation du projet, qu'elle soit « domaine »
  (technique : architecture, composants, concepts, flux de code) ou « métier »
  (fonctionnelle : règles de gestion, parcours utilisateur, vocabulaire du
  domaine). À utiliser dès qu'une fonctionnalité, un concept, une règle métier
  ou un composant technique est ajouté/modifié et doit être documenté, ou
  quand l'utilisateur demande de documenter le projet. Range la documentation
  sous docs/domaine/ et docs/metier/ et tient un index à jour.
---

# Documentation du projet (domaine & métier)

Ce skill produit et met à jour une documentation vivante, rangée en deux
familles. Il **crée le fichier s'il n'existe pas** pour le sujet traité, sinon
il **met à jour** l'existant sans le réécrire inutilement.

## 1. Choisir la famille : domaine ou métier

Pose-toi la question « à qui sert cette page ? » :

| Famille | Emplacement | Contenu | Exemples |
|---------|-------------|---------|----------|
| **Domaine** (technique) | `docs/domaine/` | Comment c'est construit : architecture, composants, structures de données, algorithmes, flux de code, dépendances | `boucle-de-jeu.md`, `systeme-de-vagues.md`, `structure-du-projet.md` |
| **Métier** (fonctionnel) | `docs/metier/` | Ce que ça fait pour l'utilisateur : règles de gestion, parcours, vocabulaire métier, comportements attendus | `regles-tower-defense.md`, `progression-du-heros.md`, `glossaire.md` |

Un même sujet peut avoir **une page dans chaque famille** (le « quoi » côté
métier, le « comment » côté domaine). Ne mélange pas les deux dans un seul
fichier.

## 2. Nommer et découper les fichiers

- Un fichier par sujet cohérent, nom en `kebab-case` explicite et en français.
- Réutilise un fichier existant si le sujet y correspond — vérifie d'abord le
  contenu de `docs/domaine/` et `docs/metier/` avant d'en créer un nouveau.
- **Aucun fichier de documentation ne doit dépasser 500 lignes.** Si une page
  s'en approche, **découpe-la** en plusieurs fichiers plus ciblés (par
  sous-sujet) et relie-les entre eux + depuis l'index. Un fichier long est un
  signal qu'il couvre plusieurs sujets : sépare-les.

## 2 bis. Arborescence obligatoire

La documentation doit rester **arborescente**, pas plate :

- Organise les pages en **sous-dossiers thématiques** sous `docs/domaine/` et
  `docs/metier/` dès qu'un thème regroupe plusieurs pages
  (ex. `docs/domaine/tower-defense/boucle-de-jeu.md`,
  `docs/domaine/tower-defense/systeme-de-vagues.md`).
- Chaque sous-dossier contenant plusieurs pages a son propre `README.md`
  d'index local.
- L'index racine `docs/README.md` présente **l'arborescence complète**
  (un arbre de dossiers/fichiers) pour donner une vue d'ensemble immédiate.
- Maintiens l'arbre à jour à chaque ajout, déplacement ou découpe de fichier.

## 3. Workflow

1. **Identifier le(s) sujet(s)** réellement traité(s) dans la tâche/le diff.
2. Pour chaque sujet, **déterminer la famille** (domaine et/ou métier).
3. **Chercher un fichier existant** correspondant (parcours les deux dossiers).
4. **Créer ou mettre à jour** le fichier avec le gabarit ci-dessous.
   - Mise à jour : modifie seulement les sections concernées, conserve le reste,
     et actualise la date + la ligne « Dernière mise à jour ».
5. **Mettre à jour l'index** `docs/README.md` (crée-le s'il manque) : une entrée
   par page, groupée par famille.
6. Ne documente **que ce qui a changé**. Si aucune mise à jour n'est pertinente,
   ne crée rien.

## 4. Gabarits

### Page « domaine » (`docs/domaine/<sujet>.md`)

```markdown
# <Titre du sujet> (domaine)

> Dernière mise à jour : AAAA-MM-JJ

## Rôle
Ce que ce composant/concept technique fait dans le système.

## Fonctionnement
Architecture, flux, structures de données, algorithmes clés.

## Fichiers concernés
- `chemin/vers/fichier` — rôle

## Points d'attention
Contraintes, pièges, dettes techniques connues.
```

### Page « métier » (`docs/metier/<sujet>.md`)

```markdown
# <Titre du sujet> (métier)

> Dernière mise à jour : AAAA-MM-JJ

## Objectif
Le besoin fonctionnel couvert, du point de vue de l'utilisateur.

## Règles de gestion
- Règle 1
- Règle 2

## Parcours / comportement attendu
Étapes ou scénarios visibles par l'utilisateur.

## Vocabulaire
Termes métier employés et leur définition.
```

## 5. Principes de rédaction

- Français clair, phrases courtes, pas de remplissage.
- Décris l'état **actuel** du projet, pas l'historique des changements.
- Renvoie vers les fichiers de code par chemin (`games/tower-defense/game.js`).
- La documentation doit rester **synchronisée avec le code** : si le code
  contredit une page existante, corrige la page.
- Respecte la limite de **500 lignes par fichier** et l'arborescence (§2, §2 bis).

## 6. Créer des skills dédiés quand c'est utile

Documenter ne suffit pas toujours : quand un domaine du projet a des règles,
conventions ou procédures récurrentes, **crée aussi un skill dédié** pour que
l'agent comprenne et applique mieux ce domaine à l'avenir.

Crée un skill (sous `.claude/skills/<nom>/SKILL.md`) dès que tu identifies :

- un **domaine récurrent** avec ses propres conventions (ex. « ajouter un
  nouveau jeu à l'arcade », « équilibrage des vagues ») ;
- une **procédure réutilisable** (build, tests, ajout d'un composant type) ;
- des **règles métier** structurantes qu'un agent devrait suivre à chaque fois.

Règles pour ces skills :

- Frontmatter YAML avec `name` et une `description` riche en déclencheurs
  (quand l'utiliser), comme ce skill.
- Contenu actionnable et concis ; renvoie vers les pages de `docs/` plutôt que
  de dupliquer le contenu.
- Applique-leur les mêmes contraintes : **≤ 500 lignes**, découpe si besoin en
  fichiers de référence dans le dossier du skill.
- Référence les nouveaux skills depuis l'index `docs/README.md`.
