# Déplacement du héros (domaine)

> Dernière mise à jour : 2026-07-14

## Rôle

Gère la position du héros sur le terrain. Le héros peut être déplacé de deux
manières, combinées dans la même boucle de mise à jour :

- au **clavier** (déplacement continu tant qu'une touche est tenue) ;
- à la **souris** (clic vers une cible, déplacement automatique jusqu'à elle).

Le clavier est prioritaire : tant qu'une touche de direction est tenue, il
prend le pas sur la cible souris.

## Fonctionnement

### Détection de la disposition du clavier (AZERTY / QWERTY)

Le code **ne détecte pas** la disposition du clavier — ce n'est pas nécessaire.
On se base sur `event.code`, qui désigne la **position physique** de la touche,
indépendamment de la disposition :

- `event.key` = le caractère produit (`"z"`, `"q"`…) → dépend de la disposition ;
- `event.code` = la position physique (`"KeyW"`, `"KeyA"`…) → stable.

Les positions physiques `KeyW / KeyA / KeyS / KeyD` correspondent à **ZQSD sur
un clavier AZERTY** et à **WASD sur un QWERTY**. Le même code fonctionne donc
sur les deux dispositions, avec ZQSD naturellement disponible pour l'AZERTY,
sans aucune détection. Les flèches directionnelles sont aussi prises en charge.

### Table de correspondance et suivi des touches

```
MOVE_KEYS = {
  KeyW: [0,-1], KeyS: [0,1], KeyA: [-1,0], KeyD: [1,0],   // ZQSD / WASD
  ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0],
}
```

Chaque entrée associe une touche à un vecteur direction `[dx, dy]`.

La gestion clavier vit dans `src/input/keyboard.js` :

- Un `Set` `pressedKeys` mémorise les codes des touches actuellement tenues.
- `keydown` ajoute le code au `Set` et appelle `preventDefault()` (évite le
  défilement de page avec les flèches).
- `keyup` retire le code du `Set`.
- L'écouteur `blur` sur `window` vide le `Set` : si la fenêtre perd le focus, on
  relâche tout pour éviter un déplacement bloqué.

### Calcul du déplacement

`readMoveVector()` (`src/input/keyboard.js`) additionne les vecteurs des touches
tenues et renvoie `{ x, y }`. Ce vecteur est transmis à chaque frame par la
boucle principale (`src/main.js`) à la simulation.

Dans `moveHero(state, dt, moveVector)` (`src/domain/hero-movement.js`) :

1. Si le vecteur est non nul, le héros se déplace dans cette direction à
   `hero.speed` px/s. Le vecteur est **normalisé** (`Math.hypot`) pour que la
   diagonale ne soit pas plus rapide qu'un axe.
2. La position est **bornée** au terrain (`0 … WIDTH`, `0 … HEIGHT`).
3. La cible souris (`hero.tx`, `hero.ty`) est **synchronisée** sur la position
   courante, sinon le déplacement souris rappellerait le héros dès le relâchement.
4. Si aucune touche n'est tenue, on applique le déplacement souris existant
   (avance vers `hero.tx` / `hero.ty`).

Le déplacement à la souris (clic pour fixer `hero.tx` / `hero.ty`) est câblé
dans `src/input/mouse.js`.

## Fichiers concernés

- `src/input/keyboard.js` — `MOVE_KEYS`, `pressedKeys`, `readMoveVector()`,
  écouteurs `keydown` / `keyup` / `blur`.
- `src/input/mouse.js` — clic de déplacement vers une cible.
- `src/domain/hero-movement.js` — `moveHero(state, dt, moveVector)`.
- `src/main.js` — boucle principale qui relie l'input à la simulation.
- `games/tower-defense/index.html` — aide utilisateur décrivant les contrôles.

(Chemins relatifs à `games/tower-defense/`.)

## Points d'attention

- Le déplacement clavier ne modifie pas la portée d'attaque ni le rayon
  d'amélioration des tours ; seuls les cercles suivent la nouvelle position.
- `preventDefault()` sur les touches de mouvement empêche le défilement de la
  page avec les flèches, mais n'affecte pas les raccourcis existants
  (`Échap`, `Espace`/`Entrée`, `1`/`2`/`3`) qui restent gérés via `event.key`.
- Le `Set` est vidé au `blur` uniquement ; un changement d'onglet sans `blur`
  (rare) pourrait laisser une touche tenue, corrigée dès le prochain `keyup`.
