import { WEAPONS, WEAPON_SWITCH_COOLDOWN } from "../config/weapons.js";

// Met à jour l'état visuel des boutons d'arme (actif / verrouillé / cooldown).
export function updateWeaponUI(el, state) {
  const h = state.hero;
  const cdRatio = h.switchCd / WEAPON_SWITCH_COOLDOWN;
  for (const btn of el.weaponButtons) {
    const key = btn.dataset.weapon;
    const w = WEAPONS[key];
    const locked = h.level < w.unlockLevel;
    const active = key === h.weapon;
    btn.classList.toggle("locked", locked);
    btn.classList.toggle("active", active);
    btn.disabled = locked || active || h.switchCd > 0;
    const cd = btn.querySelector(".wp-cd");
    // Voile de rechargement sur les armes disponibles non équipées.
    cd.style.transform =
      !active && !locked && h.switchCd > 0 ? "scaleY(" + cdRatio + ")" : "scaleY(0)";
  }
}
