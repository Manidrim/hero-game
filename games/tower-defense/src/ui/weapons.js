import { WEAPONS, WEAPON_SWITCH_COOLDOWN } from "../config/weapons.js";

// Met à jour l'état des boutons d'arme : possédée (niveau) ou à acheter (prix),
// équipée, abordable, en rechargement.
export function updateWeaponUI(el, state) {
  const h = state.hero;
  const cdRatio = h.switchCd / WEAPON_SWITCH_COOLDOWN;
  for (const btn of el.weaponButtons) {
    const key = btn.dataset.weapon;
    const def = WEAPONS[key];
    const w = h.weapons[key];
    const active = key === h.weapon;
    const affordable = state.gold >= def.cost;
    btn.classList.toggle("active", active);
    btn.classList.toggle("locked", !w.owned);
    btn.classList.toggle("affordable", !w.owned && affordable);
    btn.disabled = w.owned ? active || h.switchCd > 0 : !affordable;
    btn.querySelector(".wp-lvl").textContent = w.owned ? "Niv. " + w.level : def.cost + " 💰";
    const cd = btn.querySelector(".wp-cd");
    cd.style.transform =
      w.owned && !active && h.switchCd > 0 ? "scaleY(" + cdRatio + ")" : "scaleY(0)";
  }
}
