// Modale générique : ouverture avec un titre et un corps construit par `build`.
export function openModal(el, title, build) {
  el["modal-title"].textContent = title;
  el["modal-body"].innerHTML = "";
  build(el["modal-body"]);
  el["modal-backdrop"].classList.remove("hidden");
}

export function closeModal(el) {
  el["modal-backdrop"].classList.add("hidden");
}

export function isModalOpen(el) {
  return !el["modal-backdrop"].classList.contains("hidden");
}
