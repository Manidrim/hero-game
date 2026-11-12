import { openModal } from "./modal.js";
import { FINAL_WAVE } from "../config/balance.js";

// Affiche un toast (notification temporaire en bas d'écran).
export function showToast(el, text, cls = "") {
  const box = el.toasts;
  const node = document.createElement("div");
  node.className = "toast " + cls;
  node.textContent = text;
  box.appendChild(node);
  while (box.children.length > 4) box.firstChild.remove();
  window.setTimeout(() => {
    node.classList.add("out");
    window.setTimeout(() => node.remove(), 450);
  }, 2600);
}

// Bandeau d'annonce en haut du plateau (lancement de vague).
let bannerTimer = null;
export function showBanner(el, text) {
  const b = el.banner;
  b.textContent = text;
  b.classList.remove("hidden");
  window.clearTimeout(bannerTimer);
  bannerTimer = window.setTimeout(() => b.classList.add("hidden"), 1700);
}

// Consomme les notifications poussées par le domaine et les affiche.
export function drainNotifications(el, state) {
  for (const n of state.notifications) {
    if (n.kind === "toast") showToast(el, n.text, n.cls || "");
    else if (n.kind === "banner") showBanner(el, n.text);
    else if (n.kind === "levelup") {
      const last = n.levels[n.levels.length - 1];
      showToast(el, "⭐ Niveau " + last + " atteint ! +" + n.levels.length * 2 + " points de talent 🌳", "gold");
    } else if (n.kind === "achievement") {
      showToast(el, "🏆 Succès : " + n.def.name + " (+" + n.def.points + "🌳)", "gold");
    } else if (n.kind === "victory") {
      openModal(el, "🏆 Victoire !", (body) => {
        body.innerHTML =
          "<p>Tu as défendu ton camping jusqu'à la vague <b>" + FINAL_WAVE + "</b> ! " +
          "La campagne est terminée… mais le <b>mode infini</b> commence : les vagues " +
          "continuent de plus en plus fort. Jusqu'où iras-tu ? 👑</p>" +
          '<button class="primary big" data-action="close-modal">▶ Continuer l\'aventure</button>';
      });
    }
  }
  state.notifications.length = 0;
}
