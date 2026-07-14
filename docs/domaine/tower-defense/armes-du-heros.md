# Armes du héros (domaine)

> Dernière mise à jour : 2026-07-14

## Rôle

Gère les différentes armes du héros : leur définition, le calcul des
statistiques d'attaque effectives, le déblocage par niveau et le changement
d'arme avec cooldown. Le héros tire automatiquement avec l'arme équipée ; l'arme
ne fait que **moduler** ses statistiques de base.

## Définition des armes

Les armes sont décrites dans la table `WEAPONS` (`src/config/weapons.js`). Chaque arme applique
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

`weaponStats(hero)` (`src/domain/weapon-stats.js`) combine l'arme équipée
(`hero.weapon`) et les stats de base du héros pour renvoyer
`{ damage, range, fireRate, splash, bullet, bulletSpeed }`. Cette fonction est
la **source unique** utilisée par :

- `updateHeroCombat()` (`src/domain/hero-combat.js`) — pour choisir la cible
  (portée), tirer et fixer le cooldown de tir ;
- `syncHud()` (`src/ui/hud.js`) — pour afficher Dégâts / Portée ;
- `drawHero()` (`src/render/hero.js`) — pour dessiner le cercle de portée et la
  pastille d'arme.

## Déblocage par niveau

Dans `grantXp()` (`src/domain/leveling.js`), à chaque passage de niveau, on
parcourt `WEAPON_ORDER` et, si une arme a `unlockLevel === hero.level`, un texte
flottant « Arme débloquée » apparaît. Aucune arme n'est équipée automatiquement :
le joueur choisit quand basculer.

## Changement d'arme et cooldown

- `hero.weapon` : clé de l'arme équipée (`"smg"` par défaut dans `createState()`).
- `hero.switchCd` : temps restant avant de pouvoir changer à nouveau, décrémenté
  dans `updateHeroCombat()`.
- `WEAPON_SWITCH_COOLDOWN` (≈ 3,5 s) : délai imposé après un changement.

`switchWeapon(state, key)` (`src/domain/weapon-switch.js`) applique les
garde-fous : arme existante et différente de l'actuelle, **niveau suffisant**
(`hero.level >= unlockLevel`), **cooldown écoulé**. En cas de succès, elle met à
jour `hero.weapon`, arme le cooldown de changement et impose un petit délai avant
le prochain tir.

`cycleWeapon(state)` (raccourci **X**) filtre les armes débloquées et passe à la
suivante. Les boutons du panneau appellent directement `switchWeapon()`.

## Interface

- HTML : boutons `.weapon-btn` (attribut `data-weapon`) dans le panneau
  « Héros », chacun contenant un voile `.wp-cd`.
- `updateWeaponUI()` (`src/ui/weapons.js`, appelée chaque frame) synchronise l'état visuel :
  classe `active` (arme équipée), `locked` (niveau insuffisant), attribut
  `disabled`, et met à l'échelle le voile `.wp-cd` (`scaleY`) proportionnellement
  au cooldown restant. Les classes sont togglées à chaque frame (opération peu
  coûteuse, dédupliquée par le navigateur).

## Fichiers concernés

- `src/config/weapons.js` — `WEAPONS`, `WEAPON_ORDER`, `WEAPON_SWITCH_COOLDOWN`.
- `src/domain/weapon-stats.js` — `weaponStats(hero)`.
- `src/domain/weapon-switch.js` — `switchWeapon(state, key)`, `cycleWeapon(state)`.
- `src/domain/hero-combat.js`, `src/domain/leveling.js` — intégrations (tir,
  déblocage par niveau).
- `src/ui/weapons.js` — `updateWeaponUI(el, state)`.
- `src/ui/hud.js`, `src/render/hero.js`, `src/domain/bullets.js` — affichage HUD,
  rendu et projectiles.
- `games/tower-defense/index.html` — boutons `.weapon-btn` et aide utilisateur.
- `games/tower-defense/game.css` — styles `.weapons`, `.weapon-btn`, `.wp-cd`.

(Chemins relatifs à `games/tower-defense/`.)

## Points d'attention

- Les projectiles portent désormais une **vitesse propre** (`spawnBullet(…,
  speed)`), avec une valeur par défaut de `420` conservée pour les tours.
- Les statistiques d'attaque affichées et le cercle de portée dépendent de
  l'arme : ils changent instantanément au changement d'arme.
- Le cooldown de changement (`switchCd`) est distinct du cooldown de tir
  (`cooldown`) : ne pas les confondre.
