import { FINAL_WAVE } from "../config/balance.js";
import { openModal } from "./modal.js";

// Modale d'aide : règles du jeu et raccourcis.
export function renderHelpModal(el) {
  openModal(el, "❓ Comment jouer", (body) => {
    body.innerHTML =
      '<div class="help">' +
      "<p>🎯 <b>Objectif</b> : empêcher les vacanciers d'atteindre ta maison 🏠 à l'autre bout du chemin.</p>" +
      "<p>🛒 <b>Boutique</b> (à gauche) : clique un véhicule, puis clique sur l'herbe pour le poser. Clic droit ou Échap pour annuler.</p>" +
      "<p>⚔️ Clique un véhicule posé pour l'<b>améliorer</b> (niveau 5 max) ou le <b>revendre</b>.</p>" +
      "<p>🌊 Lance les vagues avec <b>▶</b> ou <b>Espace</b> (ou coche « auto »). Tous les 10 vagues, un <b>boss</b> 🚌 débarque. Après la vague " + FINAL_WAVE + ", le <b>mode infini</b> continue.</p>" +
      "<p>💰 Les éliminations et primes de vague rapportent des euros ; le food truck 🚚 rapporte en continu.</p>" +
      "<p>⭐ <b>Progression</b> : XP et niveaux (barre en haut), déblocage de véhicules et de cartes 🗺️.</p>" +
      "<p>🌳 <b>Talents</b> : dépense tes points (dégâts, portée, cadence, gains, vies).</p>" +
      "<p>🏆 <b>Succès</b> : des défis qui offrent des bonus permanents.</p>" +
      "<p>💾 Ta progression (niveau, talents, succès, records) est <b>sauvegardée automatiquement</b> dans le navigateur.</p>" +
      "<p>⌨️ Raccourcis : <b>Espace</b> = lancer la vague, <b>P</b> = pause, <b>Échap</b> = annuler.</p>" +
      "</div>";
  });
}
