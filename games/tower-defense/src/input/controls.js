import { selectType } from "../domain/towers-build.js";
import { switchWeapon } from "../domain/weapon-switch.js";
import { upgradeTower } from "../domain/towers-upgrade.js";
import { startWave } from "../domain/waves.js";

// Câble les boutons du panneau : construction, armes, améliorations, vague, reset.
export function bindControls(el, state, onReset) {
  el.buildButtons.forEach((b) =>
    b.addEventListener("click", () => selectType(state, b.dataset.type))
  );
  el.weaponButtons.forEach((b) =>
    b.addEventListener("click", () => switchWeapon(state, b.dataset.weapon))
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
