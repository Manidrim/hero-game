// Termine la partie (victoire ou défaite). Ne touche qu'à l'état : la couche UI
// observe `state.gameOver` pour afficher l'overlay de fin.
export function endGame(state, won) {
  state.gameOver = true;
  state.waveActive = false;
  state.won = won;
}
