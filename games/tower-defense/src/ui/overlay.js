// Affiche ou masque l'overlay de fin de partie selon l'état.
export function syncOverlay(el, state) {
  if (!state.gameOver) {
    el.overlay.classList.add("hidden");
    return;
  }
  el.overlay.classList.remove("hidden");
  if (state.won) {
    el.overlayTitle.textContent = "Victoire !";
    el.overlayText.textContent = "Tu as tenu bon.";
  } else {
    el.overlayTitle.textContent = "Défaite";
    el.overlayText.textContent =
      "Ta base est tombée à la vague " + state.wave + ". Héros niveau " + state.hero.level + ".";
  }
  el.overlayBtn.textContent = "Rejouer";
}
