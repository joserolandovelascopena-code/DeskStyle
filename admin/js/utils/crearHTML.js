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
  if (!cuerpoTabla || !Array.isArray(data)) return;

  cuerpoTabla.innerHTML = "";
  const fragmento = document.createDocumentFragment();

  data.forEach((categoria, index) => {
    const fila = document.createElement("tr");
    fila.className = `fila_listaCateg ${index % 2 !== 0 ? "fila_color" : ""}`;

    const id = categoria.id_categoria;
    const imagen =
      categoria.publicUrl || "../public/icons/Images_web/poster.jpg";
    const nombre = categoria.nombre || "Ninguno";
    const descripcion = categoria.descripcion
      ? categoria.descripcion.slice(0, 20) + "..."
      : "Ninguna";

    fila.innerHTML = `
      <td class="nombre_categ">
        <img src="${imagen}" alt="${nombre}" />
        <p>${nombre}</p>
      </td>
      <td class="descripcion_categ"><p>${descripcion}</p></td>
      <td class="catidad_prouct"><p>0</p></td>
      <td>
        <div class="btnsAcciones_categ">
          <button class="btnEdit_categ" data-id="${id}"><span class="material-symbols-outlined">edit</span></button>
          <button class="btnElimi_categ"  data-id="${id}"><span class="material-symbols-outlined">delete</span></button>
        </div>
      </td>
    `;

    fragmento.appendChild(fila);
  });

  cuerpoTabla.appendChild(fragmento);
}

function crearListProducResumen(contenedor, data) {
  const contenedorList = document.querySelector(contenedor);

  if (!contenedorList || !Array.isArray(data)) {
    return;
  }

  contenedorList.innerHTML = "";
  const fragmento = document.createDocumentFragment();

  data.forEach((producto) => {
    const filaList = document.createElement("div");
    filaList.className = "fila_listProduc";

    const id = producto.id_producto;
    const nombre = producto.nombre || "Ninguno";
    const imagen =
      producto.publicUrl || "../public/icons/Images_web/poster.jpg";
    const stock = producto.stock || 0;

    filaList.innerHTML = `
      <div class="info_produc_stock">
        <img src="${imagen}" alt="${nombre}" />
        <div class="text_info_product">
          <h5>${nombre}</h5>
          <div style="display: flex; gap: 4px">
            <p>Stock:</p>
            <p class="cantidad_stock">${stock} unidades</p>
          </div>
        </div>
      </div>
      <button class="abril_stock"  data-id="${id}">
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
    `;

    fragmento.appendChild(filaList);
  });

  contenedorList.appendChild(fragmento);
}

function crearListProductos(contenedor, data) {
  const cuerpoTabla = document.querySelector(contenedor);

  if (!cuerpoTabla || !Array.isArray(data)) return;

  cuerpoTabla.innerHTML = "";
  const fragmento = document.createDocumentFragment();

  data.forEach((producto, index) => {
    const fila = document.createElement("tr");
    fila.className = `fila_product ${index % 2 !== 0 ? "fila_color" : ""}`;

    const categoria = Array.isArray(producto.categoria)
      ? producto.categoria[0]
      : producto.categoria;
    const nombreCategoria = categoria?.nombre || "Sin categoría";

    const detalle = Array.isArray(producto.detalle)
      ? producto.detalle[0]
      : producto.detalle;
    const estadoOriginal = String(detalle?.estadoproduct || "borrador");
    const estado = ["activo", "inactivo", "borrador"].includes(estadoOriginal.toLowerCase())
      ? estadoOriginal.toLowerCase()
      : "borrador";

    // 3. Variables base
    const nombre = producto.nombre || "Sin nombre";
    const imagen =
      producto.publicUrl || "../public/icons/Images_web/poster.jpg";
    const idProducto = producto.id_producto || "PRO-00";
    const precioNumerico = Number(producto.precio);
    const precio = Number.isFinite(precioNumerico)
      ? precioNumerico.toFixed(2)
      : "0.00";
    const stock = producto.stock ?? 0;
    const creado = producto.creado || "N/A";

    fila.innerHTML = `
      <td>
        <div class="infoProduct_list">
          <div class="img_product_list">
            <img src="${imagen}" alt="${nombre}" />
          </div>
          <div style="display: flex; flex-direction: column; justify-content: center;">
            <h5>${nombre}</h5>
            <p>ID del producto: ${idProducto}</p>
          </div>
        </div>
      </td>
      <td>
        <div style="text-align: center">
          <h5 class="categ_ProductList">${nombreCategoria}</h5>
        </div>
      </td>
      <td>
        <h5>$${precio}</h5>
      </td>
      <td><h5> ${stock}</h5></td>
      <td>
        <h5 class="estadoProduct ${estado}">
          ${estado.charAt(0).toUpperCase() + estado.slice(1)}
        </h5>
      </td>
      <td>
        <h5>${creado}</h5>
      </td>
      <td>
        <div class="btns_acciones_pedidos">
          <button class="btnEdit_product" data-id="${idProducto}">
            <span class="material-symbols-outlined"> edit </span>
          </button>
          <button class="btnEliminarProduct" data-id="${idProducto}">
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </div>
      </td>
    `;

    fragmento.appendChild(fila);
  });

  cuerpoTabla.appendChild(fragmento);
}

export {
  renderizarCategorias,
  renderizarListaCategorias,
  crearListProducResumen,
  crearListProductos,
};
