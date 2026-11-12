# Vagues et équilibrage (domaine)

> Dernière mise à jour : 2026-11-12

## Rôle

`src/config/waves.js` décrit les vagues ; `src/domain/waves.js` les fait vivre
dans l'état (file d'apparition, fin de vague, primes, succès, record).

## Composition des vagues

- `waveQueue(wave)` : file `[{kind, at}]` (`at` en secondes relatives). Le
  nombre d'ennemis vaut `min(60, 6 + vague * 2)`, l'intervalle d'apparition
  diminue avec la vague, et le type est tiré au hasard pondéré parmi les types
  débloqués (`ENEMY_TYPES[k].unlock <= vague`).
- `isBossWave(wave)` : vrai tous les 10 niveaux. La file reçoit alors
  `1 + floor(vague / 30)` boss (`kind: "boss"`).
- `wavePreview(wave)` : effectifs par type, pour le panneau « Vague suivante ».

## Équilibrage

- PV : `hpMultiplier(wave) = 1 + 0.16·w + 0.004·w²` (w = vague−1), super-linéaire
  pour que le **mode infini** finisse toujours par l'emporter. Les boss
  ajoutent `× (1 + 0.3·(vague/10 − 1))`.
- Économie : prime d'ennemi `bounty · (1 + 0.03·(vague−1))`, prime de vague
  `20 + 3·vague`, toutes deux multipliées par `gainsMultiplier(state)` (talent
  « gains » + bonus de succès). Le food truck rapporte `income` €/s.
- Campagne : `FINAL_WAVE = 30` — une notification `victory` est émise une fois
  passée (modale « mode infini »), la partie continue ensuite sans limite.
- Vies : `STARTING_LIVES = 20` + talent « vies » ; un ennemi qui atteint la base
  fait perdre `def.leak` vies (`domain/enemy-movement.js` → `endGame`).
- Vitesse de jeu : `SPEED_LEVELS = [1, 2, 3]`, appliquée dans
  `domain/tick.js` (`dt × vitesse`) ; option « auto » avec `AUTO_WAVE_DELAY`.

## Cycle d'une vague

`startWave` → `advanceSpawns` (apparitions) → ennemis/vehicules bougent dans
`update` (`domain/tick.js`) → `finishWaveIfCleared` quand file et ennemis sont
vides : prime, XP (`vague × 3`), succès de paliers (10/25/50/30), record de
carte, et réarmement du timer auto.
