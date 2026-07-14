// Synchronise la surbrillance des boutons de construction avec l'état.
export function syncBuildButtons(el, state) {
  for (const btn of el.buildButtons) {
    btn.classList.toggle("selected", btn.dataset.type === state.selectedType);
  }
}
