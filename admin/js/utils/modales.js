function contenedorModales(selector, estado = false) {
  const modal = document.querySelector(selector);

  if (!modal) return;

  modal.classList.toggle("show", estado);
}

export { contenedorModales };
