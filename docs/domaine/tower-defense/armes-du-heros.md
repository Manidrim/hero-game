# Armes du héros (domaine)

> Dernière mise à jour : 2026-07-14

## Rôle

Gère les différentes armes du héros : leur définition, le calcul des
statistiques d'attaque effectives, le déblocage par niveau et le changement
d'arme avec cooldown. Le héros tire automatiquement avec l'arme équipée ; l'arme
ne fait que **moduler** ses statistiques de base.

## Définition des armes

Les armes sont décrites dans la table `WEAPONS` (`game.js`). Chaque arme applique
des **multiplicateurs** sur les statistiques de base du héros plutôt que des
valeurs absolues, afin de continuer à bénéficier de la montée en niveau :

```
WEAPONS = {
  smg     : { unlockLevel: 1,  damageMul: 1,   rangeMul: 1, fireRateMul: 0.8, splash: 0,  … },
  bazooka : { unlockLevel: 5,  damageMul: 2.4, rangeMul: 1, fireRateMul: 3,   splash: 60, … },
  sniper  : { unlockLevel: 10, damageMul: 4,   rangeMul: 2, fireRateMul: 3.5, splash: 0,  … },
}
```

- `damageMul` / `rangeMul` : facteurs multiplicatifs sur `hero.damage` /
  `hero.range`.
- `fireRateMul` : facteur sur le **délai** entre deux tirs (`hero.fireRate`).
  Une valeur `> 1` rend l'arme **plus lente** ; `0.8` rend la mitraillette plus
  rapide que la cadence de base.
- `splash` : rayon des dégâts de zone (0 = cible unique).
- `bullet` / `bulletSpeed` : couleur et vitesse du projectile.
- `WEAPON_ORDER` fixe l'ordre d'affichage et de défilement (`smg → bazooka →
  sniper`).

### Statistiques effectives

`weaponStats()` combine l'arme équipée (`hero.weapon`) et les stats de base du
héros pour renvoyer `{ damage, range, fireRate, splash, bullet, bulletSpeed }`.
Cette fonction est la **source unique** utilisée par :

- `updateHero()` — pour choisir la cible (portée), tirer et fixer le cooldown de
  tir ;
- `syncHud()` — pour afficher Dégâts / Portée ;
- `drawHero()` — pour dessiner le cercle de portée et la pastille d'arme.

## Déblocage par niveau

Dans `grantXp()`, à chaque passage de niveau, on parcourt `WEAPON_ORDER` et, si
une arme a `unlockLevel === hero.level`, un texte flottant « Arme débloquée »
apparaît. Aucune arme n'est équipée automatiquement : le joueur choisit quand
basculer.

## Changement d'arme et cooldown

- `hero.weapon` : clé de l'arme équipée (`"smg"` par défaut dans `newState()`).
- `hero.switchCd` : temps restant avant de pouvoir changer à nouveau, décrémenté
  dans `updateHero()`.
- `WEAPON_SWITCH_COOLDOWN` (≈ 3,5 s) : délai imposé après un changement.

`switchWeapon(key)` applique les garde-fous : arme existante et différente de
l'actuelle, **niveau suffisant** (`hero.level >= unlockLevel`), **cooldown
écoulé**. En cas de succès, elle met à jour `hero.weapon`, arme le cooldown de
changement et impose un petit délai avant le prochain tir.

`cycleWeapon()` (raccourci **X**) filtre les armes débloquées et passe à la
suivante. Les boutons du panneau appellent directement `switchWeapon()`.

## Interface

- HTML : boutons `.weapon-btn` (attribut `data-weapon`) dans le panneau
  « Héros », chacun contenant un voile `.wp-cd`.
- `updateWeaponUI()` (appelée chaque frame) synchronise l'état visuel :
  classe `active` (arme équipée), `locked` (niveau insuffisant), attribut
  `disabled`, et met à l'échelle le voile `.wp-cd` (`scaleY`) proportionnellement
  au cooldown restant. Les classes sont togglées à chaque frame (opération peu
  coûteuse, dédupliquée par le navigateur).

## Fichiers concernés

- `games/tower-defense/game.js` — `WEAPONS`, `WEAPON_ORDER`,
  `WEAPON_SWITCH_COOLDOWN`, `weaponStats()`, `switchWeapon()`, `cycleWeapon()`,
  `updateWeaponUI()`, et les intégrations dans `updateHero()`, `grantXp()`,
  `syncHud()`, `drawHero()`, `spawnBullet()`.
- `games/tower-defense/index.html` — boutons `.weapon-btn` et aide utilisateur.
- `games/tower-defense/game.css` — styles `.weapons`, `.weapon-btn`, `.wp-cd`.

## Points d'attention

- Les projectiles portent désormais une **vitesse propre** (`spawnBullet(…,
  speed)`), avec une valeur par défaut de `420` conservée pour les tours.
- Les statistiques d'attaque affichées et le cercle de portée dépendent de
  l'arme : ils changent instantanément au changement d'arme.
- Le cooldown de changement (`switchCd`) est distinct du cooldown de tir
  (`cooldown`) : ne pas les confondre.
