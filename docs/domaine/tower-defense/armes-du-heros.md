# Armes du héros (domaine)

> Dernière mise à jour : 2026-07-14

## Rôle

Gère les armes du héros : leur définition, leur **achat** avec de l'or, leur
**progression** propre (niveaux, points répartis), le calcul des statistiques
d'attaque effectives et le changement d'arme avec cooldown. Le héros tire
automatiquement avec l'arme équipée ; l'arme **module** ses statistiques de base.

## Définition des armes

Les armes sont décrites dans la table `WEAPONS` (`src/config/weapons.js`). Chaque
arme porte ses **caractéristiques fixes** ; sa puissance évolue ensuite via ses
points de progression, pas via la table :

```
WEAPONS = {
  smg     : { cost: 0,    rangeMul: 1, baseFireRate: 0.7, splash: 0,  … },
  bazooka : { cost: 1000, rangeMul: 1, baseFireRate: 1.8, splash: 60, … },
  sniper  : { cost: 5000, rangeMul: 2, baseFireRate: 2.2, splash: 0,  … },
}
```

- `cost` : prix d'achat en or (`0` = offerte au départ).
- `rangeMul` : facteur multiplicatif sur `hero.range`.
- `baseFireRate` : **délai** entre deux tirs au niveau 1 (les armes sont lentes
  au départ) ; réduit par les points de vitesse.
- `splash` : rayon des dégâts de zone (0 = cible unique).
- `bullet` / `bulletSpeed` : couleur et vitesse du projectile.
- Constantes de progression : `WEAPON_XP_BASE`, `WEAPON_XP_GROWTH`,
  `MULTIPLIER_STEP` (0.1), `FIRE_RATE_STEP` (0.9), `MIN_FIRE_RATE`.
- `WEAPON_ORDER` fixe l'ordre d'affichage et de défilement (`smg → bazooka →
  sniper`).

## État de progression par arme

`createWeapons()` (`src/domain/weapon-state.js`) crée, pour **chaque** arme, un
état stocké dans `hero.weapons[clé]` :

```
{ owned, level, xp, xpNext, points, multiplierPoints, speedPoints }
```

`owned` vaut `true` d'emblée pour les armes gratuites (`cost === 0`).

## Statistiques effectives

`weaponStats(hero)` (`src/domain/weapon-stats.js`) combine la définition de
l'arme équipée (`hero.weapon`) et son état de progression
(`hero.weapons[hero.weapon]`) :

- `damage = hero.damage × multiplicateur`, où
  `multiplicateur = 1 + 0.1 × multiplierPoints` (`weaponMultiplier`) ;
- `fireRate = max(MIN_FIRE_RATE, baseFireRate × 0.9^speedPoints)`
  (`weaponFireRate`) ;
- `range = hero.range × rangeMul`, plus `splash`, `bullet`, `bulletSpeed`.

Cette fonction est la **source unique** utilisée par `updateHeroCombat()`
(tir/cible), `syncHud()` (HUD), `updateWeaponDetail()` (panneau d'arme) et
`drawHero()` (cercle de portée, pastille).

## Achat des armes

`buyWeapon(state, key)` (`src/domain/weapon-shop.js`) : si l'arme n'est pas
possédée et que `state.gold >= cost`, débite l'or, passe `owned` à `true` et
renvoie `true`. Sinon affiche « Pas assez d'or » et renvoie `false`. **Le niveau
du héros n'intervient plus** dans la disponibilité des armes.

## Progression des armes

`grantWeaponXp(state, amount)` (`src/domain/weapon-leveling.js`) est appelée
depuis `killEnemy()` (`src/domain/enemy-damage.js`), en parallèle du `grantXp()`
du héros : elle crédite l'XP à l'**arme équipée**, gère les montées de niveau et
octroie **1 point** par niveau (`points++`).

`allocateWeaponPoint(state, key, stat)` (`src/domain/weapon-upgrade.js`) dépense
un point disponible dans `multiplier` (`multiplierPoints++`) ou `speed`
(`speedPoints++`). Sans point disponible ou avec une stat inconnue, l'appel est
sans effet.

### Point de niveau gagné par le héros

À chaque montée de niveau du héros, `levelUp()` (`src/domain/leveling.js`)
incrémente `hero.weaponPoints` : une réserve **partagée** de points à donner en
niveau à une arme. `grantWeaponLevel(state, key)`
(`src/domain/weapon-level-grant.js`) dépense un de ces points pour **donner un
niveau** à une arme possédée en réutilisant `weaponLevelUp(state, w)` (le niveau
gagné octroie donc son `points++` habituel). L'appel est sans effet si
`hero.weaponPoints <= 0` ou si l'arme n'est pas possédée ; il renvoie un booléen.

## Changement d'arme et cooldown

- `hero.weapon` : clé de l'arme équipée (`"smg"` par défaut).
- `hero.switchCd` / `WEAPON_SWITCH_COOLDOWN` (≈ 3,5 s) : cooldown de changement.

`switchWeapon(state, key)` (`src/domain/weapon-switch.js`) n'équipe qu'une arme
**possédée** (`owned`), différente de l'actuelle, cooldown écoulé.
`cycleWeapon(state)` (raccourci **X**) filtre les armes possédées et passe à la
suivante.

## Interface

- HTML : boutons `.weapon-btn` (attribut `data-weapon`) et panneau
  `#weapon-detail` (barre d'XP `.wd-xpbar`, multiplicateur, cadence, points,
  boutons `+ Multiplicateur` / `+ Vitesse`).
- `updateWeaponUI()` (`src/ui/weapons.js`) synchronise les boutons : `active`
  (équipée), `locked` (non possédée, affiche le prix), `affordable` (achat
  possible), voile de rechargement `.wp-cd`.
- `updateWeaponDetail()` (`src/ui/weapon-detail.js`) affiche la progression vers
  le niveau suivant (barre `#wd-xpfill`, ratio `xp / xpNext`), le multiplicateur,
  la cadence (tirs/s), les points d'arme et les **points de niveau du héros**
  (`#wd-hero-points`), et active/désactive les boutons de répartition ainsi que le
  bouton **⬆️ Donner un niveau** (`#grant-level`).
- Routage des clics dans `src/input/controls.js` : un clic sur une arme non
  possédée l'**achète** (`buyWeapon`) puis l'équipe, sinon l'**équipe**
  (`switchWeapon`) ; les boutons de répartition appellent `allocateWeaponPoint`,
  et **⬆️ Donner un niveau** appelle `grantWeaponLevel` sur l'arme équipée.

## Fichiers concernés

- `src/config/weapons.js` — table `WEAPONS` et constantes de progression.
- `src/domain/weapon-state.js` — `createWeapon`, `createWeapons`.
- `src/domain/weapon-stats.js` — `weaponStats`, `weaponMultiplier`, `weaponFireRate`.
- `src/domain/weapon-shop.js` — `buyWeapon`.
- `src/domain/weapon-leveling.js` — `grantWeaponXp`, `weaponLevelUp`.
- `src/domain/weapon-upgrade.js` — `allocateWeaponPoint`.
- `src/domain/weapon-level-grant.js` — `grantWeaponLevel` (point de niveau du héros).
- `src/domain/weapon-switch.js` — `switchWeapon`, `cycleWeapon`.
- `src/ui/weapons.js`, `src/ui/weapon-detail.js` — synchro DOM.
- `src/input/controls.js` — routage achat/équipement/répartition.
- `index.html`, `game.css` — boutons, panneau d'arme et styles.

(Chemins relatifs à `games/tower-defense/`.)

## Points d'attention

- Les points **d'arme** (multiplicateur/vitesse) sont **propres à chaque arme**
  (`hero.weapons[clé]`) : ne pas les globaliser. En revanche, `hero.weaponPoints`
  (points de niveau gagnés par le héros) est **volontairement partagé** et non lié
  à une arme tant qu'il n'est pas dépensé.
- Une arme neuve démarre à **×1.0** et lente : elle n'est pas immédiatement
  supérieure à la mitraillette, elle se construit par les points.
- Le cooldown de changement (`switchCd`) est distinct du cooldown de tir
  (`cooldown`) : ne pas les confondre.
