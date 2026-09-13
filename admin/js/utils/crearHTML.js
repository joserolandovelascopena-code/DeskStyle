async function renderizarCategorias(contenedor, data) {
  const select = document.getElementById(contenedor);

  // Validamos que exista el select y que data sea un Array
  if (!select || !Array.isArray(data)) return;

  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Selecciona una categoría";
  select.appendChild(defaultOption);

  data.forEach((c) => {
    const option = document.createElement("option");
    option.value = c.id_categoria;
    option.textContent = c.nombre;
    select.appendChild(option);
  });
}

export { renderizarCategorias };
