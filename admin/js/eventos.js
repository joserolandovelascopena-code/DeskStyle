import { escoparHTML } from "../../public/js/security/sanitizarInputs.js";
import { Dashboard } from "./dashboard.js";
import { mostrarToast } from "./utils/toast.js";
import { manejadorIMGs } from "../../public/js/utils/manejadorArchivos.js";
import { validarGlobalInput } from "./utils/utils_dashboard.js";
import { cargarUI } from "./dahboard_datas.js";

let listaGlobal = {};

document.addEventListener("DOMContentLoaded", async () => {
  listaGlobal = await cargarUI.enMemoriaDatos();
});

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

const btn_abrirPrincipal = document.querySelector(".inicioPag");
const btn_abrirProductos = document.querySelector(".productosPag");
const btn_abrirCategoria = document.querySelector(".categoriaPag");
const btn_abrirPedidos = document.querySelector(".pedidosPag");
const btn_abrirViewProduct = document.querySelector(".inventarioPag");
const btn_abrirClientes = document.querySelector(".clientesPag");
const btn_abrirConfiguracion = document.querySelector(".configuracionPag");

const btnAbrirProductos = document.querySelectorAll(".btn_ver_productos");
const btnAbrirGlobalProducto = document.querySelectorAll(
  ".agregarProductGlobal",
);

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

function abrirPantalla(pantalla) {
  pantallaPrincipal.classList.remove("show");
  pantallaCategorias.classList.remove("show");
  pantallaPedidos.classList.remove("show");
  pantallaVerProductos.classList.remove("show");
  pantallaProductos.classList.remove("show");

  btn_abrirPrincipal.classList.remove("select");
  btn_abrirProductos.classList.remove("select");
  btn_abrirPedidos.classList.remove("select");
  btn_abrirViewProduct.classList.remove("select");
  btn_abrirCategoria.classList.remove("select");

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
  constructor() {
    this.select = document.querySelector(".selecEstado_Producto");
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
let estadoProductoSelect = new estadoProduct();

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
) {
  let textoInput = escoparHTML(titulo);
  if (textoInput.length < 5) {
    tituloProduct1.focus();
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
    precioVenta1.focus();
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
    precioOriginal1.focus();
    mostrarToast(
      "Precio original requerido",
      "Ingresa el precio original o de lista del producto.",
      "error",
      5000,
    );
    return false;
  }

  let esSeleccion = categoriaSelect.esValido();
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

  textoInput = escoparHTML(marca);
  if (textoInput.length < 3) {
    marcaProduct1.focus();
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
    descripconProduct1.focus();
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
    stockProduct1.focus();
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
    pesoProduct1.focus();
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
    materialProduct1.focus();
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
    largoProduct1.focus();
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
    anchoProduct1.focus();
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
    altoProduct1.focus();
    mostrarToast(
      "Dimensiones incompletas",
      "Indica el alto del producto.",
      "error",
      5000,
    );
    return false;
  }

  let img = imgProducto.archivoObtnido();

  if (!img) {
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

const cuerpoTabla = document.querySelector(".existente_categ");
let id_categ = null;

cuerpoTabla.addEventListener("click", (event) => {
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

  Dashboard.editarCategoria(id_categ, nombre, descripcion, imgNueva);
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

abrirPantalla("verProduct");
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
