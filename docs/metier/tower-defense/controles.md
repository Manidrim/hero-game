# Contrôles du jeu (métier)

> Dernière mise à jour : 2026-07-14

## Objectif

Permettre au joueur de déplacer son héros et de piloter la partie de la façon
la plus naturelle possible, quelle que soit la disposition de son clavier
(AZERTY ou QWERTY).

## Déplacement du héros

Le héros peut être déplacé de deux façons, au choix et à tout moment :

- **Au clavier** (déplacement continu tant que la touche est maintenue) :
  - **ZQSD** sur un clavier **AZERTY** ;
  - **WASD** sur un clavier **QWERTY** ;
  - **flèches directionnelles** (↑ ↓ ← →) sur tous les claviers.
- **À la souris** : cliquer sur le terrain envoie le héros vers le point cliqué.

Deux touches opposées ou perpendiculaires peuvent être combinées : par exemple
« haut + droite » déplace le héros en **diagonale**.

Le clavier est prioritaire : si le joueur a envoyé le héros vers un point à la
souris puis appuie sur une touche de direction, c'est la direction clavier qui
l'emporte.

## Règles de gestion

- Le héros ne peut pas sortir du terrain : sa position est limitée aux bords.
- La disposition du clavier n'a pas besoin d'être configurée : le jeu se base
  sur la **position physique** des touches, donc ZQSD (AZERTY) et WASD (QWERTY)
  occupent la même place et fonctionnent sans réglage.
- Si la fenêtre du jeu perd le focus (clic ailleurs, changement d'onglet), le
  héros s'arrête : aucune touche ne reste « collée ».

## Autres raccourcis clavier

- **Espace** ou **Entrée** : lancer la vague suivante.
- **1** / **2** / **3** : sélectionner une tour à construire (Archers / Canon /
  Givre).
- **X** : changer l'arme du héros (défile entre les armes débloquées). Voir
  [Armes du héros](armes-du-heros.md).
- **Échap** : annuler la sélection de tour en cours.

## Vocabulaire

- **Héros** : l'unité contrôlée par le joueur, qui attaque automatiquement les
  ennemis à portée et améliore les tours proches.
- **AZERTY / QWERTY** : dispositions de clavier ; le jeu s'adapte aux deux sans
  configuration.
