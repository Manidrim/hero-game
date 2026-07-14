// Comptabilise les ennemis terminés par le héros : total et détail par arme.
export function recordHeroKill(state, weaponKey) {
  state.hero.kills += 1;
  const weapon = state.hero.weapons[weaponKey];
  if (weapon) weapon.kills += 1;
}
