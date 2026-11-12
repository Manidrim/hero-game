// Câble le clavier : Échap annule, Espace lance la vague, P met en pause.
export function bindKeyboard(state, actions) {
  document.addEventListener("keydown", (evt) => {
    if (evt.code === "Escape") {
      if (actions.isModalOpen()) {
        actions.closeModal();
        return;
      }
      state.placing = null;
      state.selectedId = null;
    } else if (evt.code === "Space") {
      evt.preventDefault();
      if (!state.gameOver && !state.waveActive && !actions.isModalOpen()) actions.startWave();
    } else if (evt.code === "KeyP") {
      if (!state.gameOver) actions.togglePause();
    }
  });
}
