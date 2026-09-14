function renderizarCategorias(contenedor, data) {
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

function renderizarListaCategorias(contenedor, data) {
  const cuerpoTabla = document.querySelector(contenedor);

  if (!cuerpoTabla || !Array.isArray(data)) {
    return;
  }

  cuerpoTabla.innerHTML = "";

  let colorFilaPedidos = true;

  data.forEach((categoria) => {
    const fila = document.createElement("tr");

    fila.className = "fila_listaCateg";

    // Guardamos el ID de la categoría en la fila
    fila.dataset.idCategoria = categoria.id_categoria;

    colorFilaPedidos = !colorFilaPedidos;

    if (!colorFilaPedidos) {
      fila.classList.add("fila_color");
    }

    const imagen =
      categoria.publicUrl || "../public/icons/Images_web/poster.jpg";

    const nombre = categoria.nombre || "Ninguno";

    const descripcion = categoria.descripcion
      ? categoria.descripcion.slice(0, 20) + "..."
      : "Ninguna";

    fila.innerHTML = `
      <td class="nombre_categ">
        <img 
          src="${imagen}" 
          alt="${nombre}"
        />

        <p>${nombre}</p>
      </td>

      <td class="descripcion_categ">
        <p>${descripcion}</p>
      </td>

      <td class="catidad_prouct">
        <p>0</p>
      </td>

      <td>
        <div class="btnsAcciones_categ">
          <button class="btnEdit_categ">
            <span class="material-symbols-outlined">edit</span>
          </button>

          <button class="btnElimi_categ">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    `;

    cuerpoTabla.appendChild(fila);
  });
}

export { renderizarCategorias, renderizarListaCategorias };
