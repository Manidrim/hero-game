import { selectType } from "../domain/towers-build.js";
import { switchWeapon } from "../domain/weapon-switch.js";
import { buyWeapon } from "../domain/weapon-shop.js";
import { allocateWeaponPoint } from "../domain/weapon-upgrade.js";
import { upgradeTower } from "../domain/towers-upgrade.js";
import { startWave } from "../domain/waves.js";

// Câble les boutons du panneau : construction, armes, améliorations, vague, reset.
export function bindControls(el, state, onReset) {
  el.buildButtons.forEach((b) =>
    b.addEventListener("click", () => selectType(state, b.dataset.type))
  );
  el.weaponButtons.forEach((b) =>
    b.addEventListener("click", () => clickWeapon(state, b.dataset.weapon))
  );
  el.allocMult.addEventListener("click", () =>
    allocateWeaponPoint(state, state.hero.weapon, "multiplier")
  );
  el.allocSpeed.addEventListener("click", () =>
    allocateWeaponPoint(state, state.hero.weapon, "speed")
  );
  el.nearbyTowers.addEventListener("click", (evt) => {
    const btn = evt.target.closest(".tr-up");
    if (!btn || btn.disabled || !btn.dataset.id) return;
    upgradeTower(state, Number(btn.dataset.id));
  });
  el.startWave.addEventListener("click", () => startWave(state));
  el.reset.addEventListener("click", onReset);
  el.overlayBtn.addEventListener("click", onReset);
}

// Un clic sur une arme l'achète si elle n'est pas possédée, sinon l'équipe.
function clickWeapon(state, key) {
  if (state.hero.weapons[key].owned) switchWeapon(state, key);
  else if (buyWeapon(state, key)) switchWeapon(state, key);
}
