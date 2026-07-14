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

## 2. Nommer le fichier

- Un fichier par sujet cohérent, nom en `kebab-case` explicite et en français.
- Réutilise un fichier existant si le sujet y correspond — vérifie d'abord le
  contenu de `docs/domaine/` et `docs/metier/` avant d'en créer un nouveau.

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
