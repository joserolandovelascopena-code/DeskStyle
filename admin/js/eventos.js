import { escoparHTML } from "../../public/js/security/sanitizarInputs.js";
import { Dashboard } from "./dashboard.js";
import { mostrarToast } from "./utils/toast.js";
import { manejadorIMGs } from "../../public/js/utils/manejadorArchivos.js";
import { validarGlobalInput } from "./utils/utils_dashboard.js";

let listaGlobal = {};

document.addEventListener("DOMContentLoaded", () => {
  initListaGlobal();
});

export async function initListaGlobal() {
  listaGlobal = await Dashboard.enMemoriaDatos();
}

const imgProducto = new manejadorIMGs("imgPrincipal", ".previsualizarIMG", {
  maxTamano: 5 * 1024 * 1024,
});

const imgCategoria = new manejadorIMGs(
  "subirIMg_Categ",
  ".privisualizarImgCatgoria",
  {
    maxTamano: 5 * 1024 * 1024,
  },
);

const imgEditCategoria = new manejadorIMGs("edit_img", ".previ_imgEdit_categ", {
  maxTamano: 5 * 1024 * 1024,
});

const imgEditProduct = new manejadorIMGs(
  "editImgProduct",
  ".edit_preview_box",
  {
    maxTamano: 5 * 1024 * 1024,
  },
);

const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".layout_toggle");
const logoBtn = document.querySelector(".open_sidebar");

function abrirCerrarSidebar() {
  const estado = localStorage.getItem("estadoSidebar");

  if (estado === "cerrado") {
    sidebar.classList.add("active");
  } else {
    sidebar.classList.remove("active");
  }
}

function preferenciaSidebar(estado) {
  localStorage.setItem("estadoSidebar", estado);
  abrirCerrarSidebar();
}

abrirCerrarSidebar();

toggleBtn.addEventListener("click", () => {
  preferenciaSidebar("cerrado");
});

logoBtn.addEventListener("click", () => {
  preferenciaSidebar("abierto");
});

/* Logica para abrir pantallas*/

const pantallaPrincipal = document.querySelector(".content");
const pantallaProductos = document.querySelector(".interfaz_productos");
const pantallaCategorias = document.querySelector(".interfaz_categorias");
const pantallaPedidos = document.querySelector(".interfaz_pedidos");
const pantallaVerProductos = document.querySelector(".interfaz_productView");
const pantallaClientes = document.querySelector(".interfaz_clientes");

const btn_abrirPrincipal = document.querySelector(".inicioPag");
const btn_abrirProductos = document.querySelector(".productosPag");
const btn_abrirCategoria = document.querySelector(".categoriaPag");
const btn_abrirPedidos = document.querySelector(".pedidosPag");
const btn_abrirViewProduct = document.querySelector(".inventarioPag");
const btn_abrirClientes = document.querySelector(".clientesPag");
const btnVerUsuarios = document.querySelector(".btn_ver_usuarios");
const btn_abrirConfiguracion = document.querySelector(".configuracionPag");

const btnAbrirProductos = document.querySelectorAll(".btn_ver_productos");
const btnAbrirGlobalProducto = document.querySelectorAll(
  ".agregarProductGlobal",
);
const btnAbrirGlobalCateg = document.querySelectorAll(".globalAbrirCateg");

btn_abrirPrincipal.addEventListener("click", () => {
  abrirPantalla("principal");
});

btn_abrirProductos.addEventListener("click", () => {
  abrirPantalla("agregar");
});

btn_abrirCategoria.addEventListener("click", () => {
  abrirPantalla("categorias");
});

btn_abrirPedidos.addEventListener("click", () => {
  abrirPantalla("pedidos");
});

btn_abrirViewProduct.addEventListener("click", () => {
  abrirPantalla("verProduct");
});

btn_abrirClientes.addEventListener("click", () => {
  abrirPantalla("clientes");
  Dashboard.cargarUsuarios();
});

btnVerUsuarios?.addEventListener("click", () => {
  abrirPantalla("clientes");
  Dashboard.cargarUsuarios();
});

btnAbrirProductos.forEach((boton) => {
  boton.addEventListener("click", () => {
    abrirPantalla("verProduct");
  });
});

btnAbrirGlobalProducto.forEach((boton) => {
  boton.addEventListener("click", () => {
    abrirPantalla("agregar");
  });
});

btnAbrirGlobalCateg.forEach((boton) => {
  boton.addEventListener("click", () => {
    abrirPantalla("categorias");
  });
});

function abrirPantalla(pantalla) {
  pantallaPrincipal.classList.remove("show");
  pantallaCategorias.classList.remove("show");
  pantallaPedidos.classList.remove("show");
  pantallaVerProductos.classList.remove("show");
  pantallaProductos.classList.remove("show");
  pantallaClientes.classList.remove("show");

  btn_abrirPrincipal.classList.remove("select");
  btn_abrirProductos.classList.remove("select");
  btn_abrirPedidos.classList.remove("select");
  btn_abrirViewProduct.classList.remove("select");
  btn_abrirCategoria.classList.remove("select");
  btn_abrirClientes.classList.remove("select");

  switch (pantalla) {
    case "agregar":
      pantallaProductos.classList.add("show");
      btn_abrirProductos.classList.add("select");
      break;

    case "categorias":
      pantallaCategorias.classList.add("show");
      btn_abrirCategoria.classList.add("select");
      break;

    case "pedidos":
      pantallaPedidos.classList.add("show");
      btn_abrirPedidos.classList.add("select");
      break;

    case "verProduct":
      pantallaVerProductos.classList.add("show");
      btn_abrirViewProduct.classList.add("select");
      break;
    case "clientes":
      pantallaClientes.classList.add("show");
      btn_abrirClientes.classList.add("select");
      break;
    default:
      pantallaPrincipal.classList.add("show");
      btn_abrirPrincipal.classList.add("select");
      break;
  }
}

function formarFormatoNumero(input) {
  let numeroValor = input.replace(/[^0-9.]/g, "");
  numeroValor = escoparHTML(numeroValor);

  let partes = numeroValor.split(".");

  if (partes.length > 2) {
    numeroValor = partes[0] + "." + partes.slice(1).join("");
  }

  if (
    numeroValor.startsWith("0") &&
    numeroValor.length > 1 &&
    !numeroValor.startsWith("0.")
  ) {
    numeroValor = numeroValor.substring(1);
  }

  return numeroValor;
}

class selectorGlobal {
  constructor(elemento) {
    this.select = document.querySelector(elemento);
  }

  obtenerEvaluador() {
    return this.select.value;
  }

  obtenerTexto() {
    const index = this.select.selectedIndex;
    return this.select.options[index].text;
  }

  esValido() {
    return this.obtenerEvaluador() !== "" ? true : false;
  }
}

class estadoProduct {
  constructor(select) {
    this.select = document.querySelector(select);
  }

  obtenerEvaluador() {
    return this.select.value;
  }
}

// Capturas las referencias a los nodos HTML globales
const btnCancelarProduct = document.querySelector(".btnCancelar");
const btnGuardarProduct = document.querySelector(".btnGuardar");

const tituloProduct1 = document.getElementById("titulo");
const precioVenta1 = document.getElementById("precio");
const marcaProduct1 = document.getElementById("marca_product");
const precioOriginal1 = document.getElementById("precioOriginal");
const descripconProduct1 = document.getElementById("descripcionProduct");

const stockProduct1 = document.getElementById("stockProduct");
const pesoProduct1 = document.getElementById("pesoProduct");
const materialProduct1 = document.getElementById("materialProduct");

const largoProduct1 = document.getElementById("largo");
const anchoProduct1 = document.getElementById("ancho");
const altoProduct1 = document.getElementById("alto");

let categoriaSelect = new selectorGlobal(".select_Categoria");
let estadoProductoSelect = new estadoProduct(".selecEstado_Producto");

const categSelectEdit_P = new selectorGlobal(".editCateg_product");
const estadoProductoSelectEdit_P = new estadoProduct(".editEstadoProduct");

function validarFormatoInputs(
  titulo,
  precio,
  marca,
  orginalPrecio,
  descrip,
  stock,
  peso,
  material,
  largo,
  ancho,
  alto,
  esEditar = false,
) {
  const editNombre_Prod = document.getElementById("editNombreProduct");
  const editPrecio_Prod = document.getElementById("editPrecioP");
  const editMarca_Prod = document.getElementById("editMarcaProduct");
  const editDescrip_Prod = document.getElementById("editProductDescrip");
  const editStock_Prod = document.getElementById("editStockProduct");
  const editPrecioOrg_Prod = document.getElementById("editPrecioOriginal");
  const editMaterial_Prod = document.getElementById("editMaterialProduct");
  const editPeso_Prod = document.getElementById("editPesoProduct");
  const editLargo_Prod = document.getElementById("editLargo");
  const editAncho_Prod = document.getElementById("editAncho");
  const editAlto_Prod = document.getElementById("editAlto");

  let textoInput = escoparHTML(titulo);
  if (textoInput.length < 5) {
    if (!esEditar) {
      tituloProduct1.focus();
    } else {
      editNombre_Prod.focus();
    }

    mostrarToast(
      "Título incompleto",
      "El título del producto debe tener al menos 5 caracteres.",
      "error",
      5000,
    );
    return false;
  }

  let numeroInput = formarFormatoNumero(precio);
  if (numeroInput.length < 1) {
    if (!esEditar) {
      precioVenta1.focus();
    } else {
      editPrecio_Prod.focus();
    }

    mostrarToast(
      "Precio requerido",
      "Por favor, ingresa un precio de venta válido.",
      "error",
      5000,
    );
    return false;
  }

  numeroInput = formarFormatoNumero(orginalPrecio);
  if (numeroInput.length < 1) {
    if (!esEditar) {
      precioOriginal1.focus();
    } else {
      editPrecioOrg_Prod.focus();
    }

    mostrarToast(
      "Precio original requerido",
      "Ingresa el precio original o de lista del producto.",
      "error",
      5000,
    );
    return false;
  }

  let esSeleccion = categoriaSelect.esValido();
  let esCategSelect = categSelectEdit_P.esValido();
  if (!esEditar) {
    if (!esSeleccion) {
      document.querySelector(".select_Categoria").focus();
      mostrarToast(
        "Categoría requerida",
        "Selecciona una categoría adecuada para clasificar el producto.",
        "aviso",
        5000,
      );
      return false;
    }
  } else {
    if (!esCategSelect) {
      document.querySelector(".editCateg_product").focus();
      mostrarToast(
        "Categoría requerida",
        "Selecciona una categoría adecuada para clasificar el producto.",
        "aviso",
        5000,
      );
      return false;
    }
  }

  textoInput = escoparHTML(marca);
  if (textoInput.length < 3) {
    if (!esEditar) {
      marcaProduct1.focus();
    } else {
      editMarca_Prod.focus();
    }

    mostrarToast(
      "Marca no válida",
      "El nombre de la marca debe contener al menos 3 caracteres.",
      "error",
      5000,
    );
    return false;
  }

  textoInput = escoparHTML(descrip);
  if (textoInput.length > 0 && textoInput.length < 125) {
    if (!esEditar) {
      descripconProduct1.focus();
    } else {
      editDescrip_Prod.focus();
    }

    mostrarToast(
      "Descripción insuficiente",
      "La descripción debe incluir al menos 125 caracteres para ser detallada.",
      "aviso",
      5000,
    );
    return false;
  }

  numeroInput = formarFormatoNumero(stock);
  if (numeroInput.length < 1) {
    if (!esEditar) {
      stockProduct1.focus();
    } else {
      editStock_Prod.focus();
    }

    mostrarToast(
      "Stock no válido",
      "Especifica una cantidad de stock disponible mayor a 0.",
      "error",
      5000,
    );
    return false;
  }

  numeroInput = formarFormatoNumero(peso);
  if (numeroInput.length < 1) {
    if (!esEditar) {
      pesoProduct1.focus();
    } else {
      editPeso_Prod.focus();
    }

    mostrarToast(
      "Peso requerido",
      "Ingresa el peso del producto para el cálculo de envío.",
      "error",
      5000,
    );
    return false;
  }

  textoInput = escoparHTML(material);
  if (textoInput.length < 3) {
    if (!esEditar) {
      materialProduct1.focus();
    } else {
      editMaterial_Prod.focus();
    }

    mostrarToast(
      "Material requerido",
      "Especifica el material de fabricación (mínimo 3 caracteres).",
      "error",
      5000,
    );
    return false;
  }

  numeroInput = formarFormatoNumero(largo);
  if (numeroInput.length < 1) {
    if (!esEditar) {
      largoProduct1.focus();
    } else {
      editLargo_Prod.focus();
    }

    mostrarToast(
      "Dimensiones incompletas",
      "Indica el largo del producto.",
      "error",
      5000,
    );
    return false;
  }

  numeroInput = formarFormatoNumero(ancho);
  if (numeroInput.length < 1) {
    if (!esEditar) {
      anchoProduct1.focus();
    } else {
      editAncho_Prod.focus();
    }

    mostrarToast(
      "Dimensiones incompletas",
      "Indica el ancho del producto.",
      "error",
      5000,
    );
    return false;
  }

  numeroInput = formarFormatoNumero(alto);
  if (numeroInput.length < 1) {
    if (!esEditar) {
      altoProduct1.focus();
    } else {
      editAlto_Prod.focus();
    }

    mostrarToast(
      "Dimensiones incompletas",
      "Indica el alto del producto.",
      "error",
      5000,
    );
    return false;
  }

  let img = imgProducto.archivoObtnido();

  if (!esEditar && !img) {
    mostrarToast(
      "Imagen requeridad",
      "Selecciona la imagen del producto",
      "error",
      5000,
    );
    return false;
  }
  return true;
}

btnCancelarProduct.addEventListener("click", () => {
  abrirPantalla("principal");
});

btnGuardarProduct.addEventListener("click", () => {
  const esValido = validarFormatoInputs(
    tituloProduct1.value.trim(),
    precioVenta1.value.trim(),
    marcaProduct1.value.trim(),
    precioOriginal1.value.trim(),
    descripconProduct1.value.trim(),
    stockProduct1.value.trim(),
    pesoProduct1.value.trim(),
    materialProduct1.value.trim(),
    largoProduct1.value.trim(),
    anchoProduct1.value.trim(),
    altoProduct1.value.trim(),
  );

  if (!esValido) return;

  const imgURL = imgProducto.archivoObtnido();

  const tituloProduct = tituloProduct1.value.trim();
  const precioVenta = precioVenta1.value.trim();
  const marcaProduct = marcaProduct1.value.trim();
  const precioOriginal = precioOriginal1.value.trim();
  const descripconProduct = descripconProduct1.value.trim();
  const stockProduct = stockProduct1.value.trim();
  const pesoProduct = pesoProduct1.value.trim();
  const materialProduct = materialProduct1.value.trim();
  const largoProduct = largoProduct1.value.trim();
  const anchoProduct = anchoProduct1.value.trim();
  const altoProduct = altoProduct1.value.trim();

  Dashboard.agregarProducto(
    escoparHTML(tituloProduct),
    formarFormatoNumero(precioVenta),
    escoparHTML(marcaProduct),
    formarFormatoNumero(precioOriginal),
    escoparHTML(descripconProduct),
    stockProduct,
    formarFormatoNumero(pesoProduct),
    escoparHTML(materialProduct),
    formarFormatoNumero(largoProduct),
    formarFormatoNumero(anchoProduct),
    formarFormatoNumero(altoProduct),

    categoriaSelect.obtenerEvaluador(),
    estadoProductoSelect.obtenerEvaluador(),
    imgURL,
  );

  tituloProduct1.value = "";
  precioVenta1.value = "";
  marcaProduct1.value = "";
  precioOriginal1.value = "";
  descripconProduct1.value = "";
  stockProduct1.value = "";
  pesoProduct1.value = "";
  materialProduct1.value = "";
  largoProduct1.value = "";
  anchoProduct1.value = "";
  altoProduct1.value = "";
  imgProducto.limpiarPrevisualizacion(
    "../public/icons/Images_web/image-files.png",
  );
});

const btnAgregarCategoria = document.querySelector(".agregarCateg");

const validarNombreCateg = new validarGlobalInput(
  "nombreCatego",
  "text",
  3,
  100,
);

btnAgregarCategoria.addEventListener("click", async () => {
  // 1. Obtención de elementos y valores del DOM
  const nombreInput = document.getElementById("nombreCatego");
  const descripcionInput = document.getElementById("descripcionCateg");

  const nombre = nombreInput.value.trim();
  const descripcion = descripcionInput.value.trim();
  const imgURL = imgCategoria.archivoObtnido();

  const resultado = validarNombreCateg.validar();

  if (resultado !== true) {
    mostrarToast(resultado.titulo, resultado.subTitulo, "error", 5000);
    return;
  }

  if (descripcion.length > 0 && descripcion.length < 40) {
    descripcionInput.focus();
    mostrarToast(
      "Descripción insuficiente",
      `La descripción debe incluir al menos 40 caracteres para ser detallada.`,
      "aviso",
      5000,
    );
    return;
  }

  if (!imgURL) {
    mostrarToast(
      "Imagen requerida",
      "Debes seleccionar o adjuntar una imagen para la categoría.",
      "aviso",
      5000,
    );
    return;
  }

  Dashboard.agregarCategoria(
    escoparHTML(nombre),
    escoparHTML(descripcion),
    imgURL,
  );

  nombreInput.value = "";
  descripcionInput.value = "";
  imgCategoria.limpiarPrevisualizacion(
    "../public/icons/Images_web/image-files.png",
  );
});

const cuerpoTablaCateg = document.querySelector(".existente_categ");
let id_categ = null;

cuerpoTablaCateg.addEventListener("click", (event) => {
  const btnEdit = event.target.closest(".btnEdit_categ");

  if (btnEdit) {
    const id_categoria = btnEdit.dataset.id;
    id_categ = id_categoria;
    modalEditarCategoria(id_categoria);
    return;
  }

  const btnElim = event.target.closest(".btnElimi_categ");
  if (btnElim) {
    const id_categoria = btnElim.dataset.id;
    modalEliminarCategoria(id_categoria);
    id_categ = id_categoria;
    return;
  }
});

const nombre_edit_categ = document.getElementById("edit_nombre_categ");
const descrip_edit_categ = document.getElementById("edit_descrip_categ");
const img_edit_categ = document.getElementById("img_edit_categ");
const modalEditCategoria = document.querySelector(".edit_modalCateg");

function modalEditarCategoria(idCategoria) {
  const categorias = listaGlobal.listCategorias;

  if (!categorias) {
    mostrarToast(
      "Error de cargado de datos",
      "Las categorías todavía no han sido cargadas.",
      "error",
      7000,
    );

    return;
  }

  const categoria = categorias.find((item) => item.id_categoria == idCategoria);

  if (!categoria) {
    mostrarToast(
      "No se encontró la categoría",
      "La categoría no existe o no se encontró correctamente.",
      "error",
      7000,
    );
    return;
  }

  categoriaSelect = categoria;

  nombre_edit_categ.value = categoria.nombre;
  descrip_edit_categ.value =
    categoria.descripcion === "Sin descripción." ? "" : categoria.descripcion;
  img_edit_categ.src = categoria.publicUrl || "";

  modalEditCategoria.classList.add("mostrar");
}

const cancelarEditCateg = document.querySelectorAll(".btnCerrarCateg");

cancelarEditCateg.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalEditCategoria.classList.remove("mostrar");
  });
});

const btnGuardar_edit_categ = document.querySelector(".btnGuardar_edit_categ");
const validarNombreCateg_Edit = new validarGlobalInput(
  "edit_nombre_categ",
  "text",
  3,
  100,
);

btnGuardar_edit_categ.addEventListener("click", () => {
  const nombreValido = validarNombreCateg_Edit.validar();
  const descripValida = descrip_edit_categ.value.trim();

  const imgValida = imgEditCategoria.archivoObtnido();

  if (nombreValido !== true) {
    mostrarToast(nombreValido.titulo, nombreValido.subTitulo, "error", 5000);
    return;
  }

  if (descripValida.length > 0 && descripValida.length < 40) {
    descrip_edit_categ.focus();

    mostrarToast(
      "Descripción insuficiente",
      "La descripción debe incluir al menos 40 caracteres para ser detallada.",
      "aviso",
      5000,
    );

    return;
  }

  const nombre = nombre_edit_categ.value.trim();
  const descripcion = descripValida;

  let imgNueva = null;

  if (imgValida) {
    imgNueva = imgEditCategoria.archivoObtnido();
  }

  console.log("Imagen nueva:", imgNueva);

  Dashboard.editarCategoria(
    id_categ,
    escoparHTML(nombre),
    escoparHTML(descripcion),
    imgNueva,
  );
});

//Eliminar Categoría

const btnEliminarCategoria = document.getElementById("elim_categ_confirmar");
const btnCerrarElimCateg = document.querySelectorAll(".btnCerrarEliCatg");
const nombreEliminarCateg = document.getElementById("elim_categ_nombre");
const modalEliminarCateg = document.querySelector(".elim_categ_modal");

function modalEliminarCategoria(idCategoria) {
  const categorias = listaGlobal.listCategorias;

  if (!categorias) {
    mostrarToast(
      "Error de cargado de datos",
      "Las categorías todavía no han sido cargadas.",
      "error",
      7000,
    );

    return;
  }

  const categoria = categorias.find((item) => item.id_categoria == idCategoria);

  if (!categoria) {
    mostrarToast(
      "No se encontró la categoría",
      "La categoría no existe o no se encontró correctamente.",
      "error",
      7000,
    );
    return;
  }

  nombreEliminarCateg.textContent = `"${categoria.nombre}"`;

  modalEliminarCateg.classList.add("mostrar");
}

btnCerrarElimCateg.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalEliminarCateg.classList.remove("mostrar");
  });
});

btnEliminarCategoria.addEventListener("click", () => {
  const idCategoria = id_categ;
  if (!idCategoria) return;
  Dashboard.eliminarCategorias(idCategoria);
});

const cuerpoTablaProduct = document.querySelector(".list_productos");
let id_product = null;

cuerpoTablaProduct.addEventListener("click", (event) => {
  const btnEdit = event.target.closest(".btnEdit_product");

  if (btnEdit) {
    const id_producto = btnEdit.dataset.id;
    id_product = id_producto;
    modalEditProducto(id_producto);
    return;
  }

  const btnElim = event.target.closest(".btnEliminarProduct");
  if (btnElim) {
    const id_producto = btnElim.dataset.id;
    id_product = id_producto;

    modalEliminarProduct(id_producto);
    return;
  }
});

const modalEditProductCont = document.querySelector(".edit_product_modal");
const btnGuardarCambios = document.querySelector(".btnGuardarEditProduct");
const btnCerrarEditProduct = document.querySelectorAll(".editCerrarProduct");

const productSelectEdit = document.querySelector(".productSelect");
const ID_SelectProductEdit = document.getElementById("editIdProduct");

const editNombre_Prod = document.getElementById("editNombreProduct");
const editPrecio_Prod = document.getElementById("editPrecioP");
const editMarca_Prod = document.getElementById("editMarcaProduct");
const editDescrip_Prod = document.getElementById("editProductDescrip");
const editStock_Prod = document.getElementById("editStockProduct");
const editPrecioOrg_Prod = document.getElementById("editPrecioOriginal");
const editMaterial_Prod = document.getElementById("editMaterialProduct");
const editPeso_Prod = document.getElementById("editPesoProduct");
const editLargo_Prod = document.getElementById("editLargo");
const editAncho_Prod = document.getElementById("editAncho");
const editAlto_Prod = document.getElementById("editAlto");

const editCategProduct = document.getElementById("editCateg_product");
const editEstadoProduct = document.getElementById("editEstadoProduct");

const imgPorductEdit = document.getElementById("editPreviewProduct");
const estadoEditProduct = document.querySelector(".estadoP_headerEdit");

function modalEditProducto(idProducto) {
  const productos = listaGlobal.listaProductos;
  estadoEditProduct.classList.remove("activo", "inactivo", "borrador");

  if (!productos) {
    mostrarToast(
      "Error de cargado de datos",
      "Los productos todavía no han sido cargados.",
      "error",
      7000,
    );
    return;
  }

  const producto = productos.find((item) => item.id_producto == idProducto);

  if (!producto) {
    mostrarToast(
      "No se encontró el producto",
      "El producto no existe o no se encontró correctamente.",
      "error",
      7000,
    );
    return;
  }

  const detalle = Array.isArray(producto.detalle)
    ? producto.detalle[0]
    : producto.detalle || {};

  const categoria = Array.isArray(producto.categoria)
    ? producto.categoria[0]
    : producto.categoria || {};

  const imagen = producto.publicUrl || "../public/icons/Images_web/poster.jpg";
  if (imgPorductEdit) imgPorductEdit.src = imagen;

  if (productSelectEdit)
    productSelectEdit.textContent = producto.nombre || "Sin nombre";
  if (ID_SelectProductEdit)
    ID_SelectProductEdit.textContent = producto.id_producto || "";

  if (editNombre_Prod) editNombre_Prod.value = producto.nombre || "";
  if (editPrecio_Prod) editPrecio_Prod.value = producto.precio ?? "";
  if (editMarca_Prod) editMarca_Prod.value = producto.marca || "";
  if (editDescrip_Prod) editDescrip_Prod.value = producto.descripcion || "";
  if (editStock_Prod) editStock_Prod.value = producto.stock ?? 0;
  if (editPrecioOrg_Prod)
    editPrecioOrg_Prod.value = producto.precio_original ?? "";

  if (editMaterial_Prod) editMaterial_Prod.value = detalle.material || "";
  if (editPeso_Prod) editPeso_Prod.value = detalle.peso ?? "";
  if (editLargo_Prod) editLargo_Prod.value = detalle.largo ?? "";
  if (editAncho_Prod) editAncho_Prod.value = detalle.ancho ?? "";
  if (editAlto_Prod) editAlto_Prod.value = detalle.alto ?? "";

  const estados = {
    activo: "Activo",
    inactivo: "Inactivo",
    borrador: "Borrador",
  };

  if (estadoEditProduct) {
    const estado = detalle.estadoproduct;
    const estadoProductText = estados[estado] ?? "Desconocido";

    estadoEditProduct.textContent = estadoProductText;
    estadoEditProduct.classList.add(estado);
  }

  if (categoria.id_categoria) {
    editCategProduct.value = categoria.id_categoria;
  }

  if (detalle.estadoproduct) {
    editEstadoProduct.value = detalle.estadoproduct;
  }

  modalEditProductCont.classList.add("mostrar");
}

btnCerrarEditProduct.forEach((btn) => {
  btn.addEventListener("click", cerrarModalEditProducto);
});

export function cerrarModalEditProducto() {
  modalEditProductCont.classList.remove("mostrar");
  id_product = null;
  imgEditProduct.limpiarPrevisualizacion(
    "../public/icons/Images_web/image-files.png",
  );
}

btnGuardarCambios.addEventListener("click", () => {
  const valorNombre = editNombre_Prod.value.trim();
  const valorPrecio = editPrecio_Prod.value.trim();
  const valorMarca = editMarca_Prod.value.trim();
  const valorOrgP = editPrecioOrg_Prod.value.trim();
  const valorDescrip = editDescrip_Prod.value.trim();
  const valorStock = editStock_Prod.value.trim();
  const valorPeso = editPeso_Prod.value.trim();
  const valorMaterial = editMaterial_Prod.value.trim();
  const valorLargo = editLargo_Prod.value.trim();
  const valorAncho = editAncho_Prod.value.trim();
  const valorAlto = editAlto_Prod.value.trim();

  const imgValida = imgEditProduct.archivoObtnido();

  const camposValidos = validarFormatoInputs(
    valorNombre,
    valorPrecio,
    valorMarca,
    valorOrgP,
    valorDescrip,
    valorStock,
    valorPeso,
    valorMaterial,
    valorLargo,
    valorAncho,
    valorAlto,
    true,
  );

  if (!camposValidos) return;

  let imgNueva = null;

  if (imgValida) {
    imgNueva = imgEditProduct.archivoObtnido();
  }

  Dashboard.editarProducto(
    id_product,
    escoparHTML(valorNombre),
    formarFormatoNumero(valorPrecio),
    escoparHTML(valorMarca),
    formarFormatoNumero(valorOrgP),
    escoparHTML(valorDescrip),
    valorStock,
    formarFormatoNumero(valorPeso),
    escoparHTML(valorMaterial),
    formarFormatoNumero(valorLargo),
    formarFormatoNumero(valorAncho),
    formarFormatoNumero(valorAlto),
    categSelectEdit_P.obtenerEvaluador(),
    estadoProductoSelectEdit_P.obtenerEvaluador(),
    imgNueva,
  );
});

const modalElimProduct = document.querySelector(".elim_product_modal");
const nombreProductElim = document.getElementById("elim_product_nombre");
const btnElimProduct = document.getElementById("elim_product_confirmar");
const btnCancelarElimProduct = document.querySelectorAll(
  ".btnCerrarEliProduct",
);

function modalEliminarProduct(idProducto) {
  const productos = listaGlobal.listaProductos;

  if (!productos) {
    mostrarToast(
      "Error de cargado de datos",
      "Los productos todavía no han sido cargadas.",
      "error",
      7000,
    );

    return;
  }

  const producto = productos.find((item) => item.id_producto == idProducto);

  if (!producto) {
    mostrarToast(
      "No se encontró ningún producto",
      "El producto no existe o no se encontró correctamente.",
      "error",
      7000,
    );
    return;
  }

  nombreProductElim.textContent = `"${producto.nombre}"`;

  modalElimProduct.classList.add("mostrar");
}

btnCancelarElimProduct.forEach((btn) => {
  btn.addEventListener("click", cerrarModalElimProducto);
});

export function cerrarModalElimProducto() {
  modalElimProduct.classList.remove("mostrar");
  id_product = null;
}

btnElimProduct.addEventListener("click", () => {
  const idProducto = id_product;
  if (!idProducto) return;
  Dashboard.elimarProducto(idProducto);
});

abrirPantalla("inicio");
abrirCerrarSidebar();

const listaPedidos = document.querySelector(".list_pedidos");
let colorFilaPedidos = true;

for (let i = 0; i < 5; i++) {
  colorFilaPedidos = !colorFilaPedidos;

  const fila = document.createElement("tr");
  fila.className = `fila_pedidos`;

  if (!colorFilaPedidos) {
    fila.classList.add("fila_color");
  }

  fila.innerHTML = `<td class="id_product_pedidos"><h5>${i}</h5></td>
                      <td class="cliente_pedidos">
                        <div>
                          <h5>Rolando Velasco</h5>
                          <p>joserolandovalascopena@gmail.com</p>
                        </div>
                      </td>
                      <td class="fecha_pedido">
                        <h5>1 de jun. 2026</h5>
                        <p>10:45 a.m</p>
                      </td>
                      <td class="estado_pedidos" style="text-align: center">
                        <h5 class="estadoPedido">Finalizado</h5>
                      </td>
                      <td class="total_pedido"><h5>$5.25</h5></td>
                      <td class="pago_pedido"><h5>Efectivo</h5></td>
                      <td class="acciones_pedidos">
                        <div class="btns_acciones_pedidos">
                          <button class="btnVer_pedio">
                            <span class="material-symbols-outlined">
                              visibility
                            </span>
                          </button>
                          <button class="btnEdit_pedido">
                            <span class="material-symbols-outlined">
                              edit
                            </span>
                          </button>
                        </div>
                      </td>`;

  listaPedidos.appendChild(fila);
}
