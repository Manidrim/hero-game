# Armes du héros (métier)

> Dernière mise à jour : 2026-07-14

## Objectif

Donner de la profondeur au héros en lui offrant **plusieurs armes** aux styles
de jeu différents, que le joueur **achète avec de l'or** puis **fait progresser**
indépendamment, et entre lesquelles il peut **basculer** selon la situation
(essaim d'ennemis, cible unique résistante, ennemi éloigné…).

## Les trois armes

| Arme | Icône | Obtention | Style |
| --- | --- | --- | --- |
| **Mitraillette** | 🔫 | Offerte au départ | Polyvalente, portée standard. |
| **Bazooka** | 🚀 | Achat **1000 💰** | Dégâts de **zone** (touche plusieurs ennemis groupés). |
| **Sniper** | 🎯 | Achat **5000 💰** | **Portée** double sur une cible unique. |

Le héros commence chaque partie équipé de la **mitraillette**. Le bazooka et le
sniper doivent être **achetés** avec l'or amassé : tant que le joueur n'a pas
assez d'or, l'arme reste indisponible (🔒). Dès que l'or suffit, le bouton
affiche un panier (🛒) et un clic déclenche l'achat, qui équipe aussitôt l'arme.
**Aucune arme ne se débloque plus en montant de niveau.**

## Niveaux d'armes et répartition des points

Le **héros** a ses propres niveaux (dégâts, portée, PV). En parallèle, **chaque
arme possède ses propres niveaux** :

- l'arme **équipée** gagne de l'**XP** à chaque ennemi tué (comme le héros) ;
- à chaque niveau d'arme, le joueur reçoit **1 point** à répartir.

Chaque point se place, au choix, dans l'une des deux caractéristiques de l'arme,
via les boutons **+ Multiplicateur** et **+ Vitesse** du panneau de l'arme :

- **Multiplicateur de dégâts** : démarre à **×1.0** et gagne **+0.1 par point**.
- **Vitesse d'attaque** : les armes sont **lentes au départ** ; chaque point les
  rend plus rapides (délai de tir réduit).

L'**attaque totale** d'une arme est **les dégâts du héros × le multiplicateur de
l'arme**. Une arme récemment achetée démarre donc à ×1.0 : elle profite des
dégâts du héros mais doit être améliorée pour dépasser la mitraillette.

## Changer d'arme

Une fois une arme possédée, le joueur l'équipe :

- en **cliquant** dessus dans le panneau « Héros » ;
- avec la touche **X**, qui fait défiler les armes **possédées** les unes après
  les autres.

## Règles de gestion

- On ne peut **acheter** une arme que si l'or est suffisant ; l'achat débite
  l'or et équipe l'arme.
- On ne peut équiper qu'une arme **possédée**.
- Après chaque changement, un **délai de rechargement** (~3,5 s) empêche de
  changer à nouveau immédiatement. Un voile se vide progressivement sur les
  boutons pour indiquer ce délai.
- Les points gagnés sont **propres à chaque arme** : améliorer la mitraillette
  n'améliore pas le bazooka.
- Le changement d'arme n'affecte ni les déplacements, ni les points de vie, ni
  l'amélioration des tours : seules les caractéristiques d'attaque changent.

## Vocabulaire

- **Arme équipée** : celle avec laquelle le héros tire actuellement ; elle est
  mise en évidence dans le panneau et affichée en pastille sur le héros.
- **Multiplicateur** : facteur (×1.0 et plus) appliqué aux dégâts du héros pour
  obtenir l'attaque totale de l'arme.
- **Point d'arme** : ressource gagnée à chaque niveau d'arme, à investir dans le
  multiplicateur ou la vitesse d'attaque.
- **Dégâts de zone (splash)** : dégâts infligés à tous les ennemis proches du
  point d'impact — spécialité du bazooka.
- **Rechargement (cooldown)** : court délai imposé entre deux changements
  d'arme.
