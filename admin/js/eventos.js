import { escoparHTML } from "../../public/js/security/sanitizarInputs.js";
import { agregarProduct } from "./dashboard.js";
import { mostrarToast } from "./utils/toast.js";
import { manejadorIMGs } from "../../public/js/utils/manejadorArchivos.js";

const gestor = new manejadorIMGs("imgPrincipal", ".previsualizarIMG", {
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

const btn_abrirPrincipal = document.querySelector(".inicioPag");
const btn_abrirProductos = document.querySelector(".productosPag");
const btn_abrirCategoria = document.querySelector(".categoriaPag");
const btn_abrirPedidos = document.querySelector(".pedidosPag");
const btn_abrirInventario = document.querySelector(".inventarioPag");
const btn_abrirClientes = document.querySelector(".clientesPag");
const btn_abrirConfiguracion = document.querySelector(".configuracionPag");

btn_abrirPrincipal.addEventListener("click", () => {
  abrirPantalla("principal");
});

btn_abrirProductos.addEventListener("click", () => {
  abrirPantalla("productos");
});

btn_abrirCategoria.addEventListener("click", () => {
  abrirPantalla("categorias");
});

btn_abrirPedidos.addEventListener("click", () => {
  abrirPantalla("pedidos");
});

function abrirPantalla(pantalla) {
  switch (pantalla) {
    case "productos":
      pantallaPrincipal.classList.remove("show");
      pantallaCategorias.classList.remove("show");
      pantallaPedidos.classList.remove("show");
      pantallaProductos.classList.add("show");

      btn_abrirPrincipal.classList.remove("select");
      btn_abrirCategoria.classList.remove("select");
      btn_abrirPedidos.classList.remove("select");
      btn_abrirProductos.classList.add("select");
      break;

    case "categorias":
      pantallaPrincipal.classList.remove("show");
      pantallaProductos.classList.remove("show");
      pantallaPedidos.classList.remove("show");
      pantallaCategorias.classList.add("show");

      btn_abrirPrincipal.classList.remove("select");
      btn_abrirProductos.classList.remove("select");
      btn_abrirPedidos.classList.remove("select");
      btn_abrirCategoria.classList.add("select");

      break;

    case "pedidos":
      pantallaPrincipal.classList.remove("show");
      pantallaProductos.classList.remove("show");
      pantallaCategorias.classList.remove("show");
      pantallaPedidos.classList.add("show");

      btn_abrirPrincipal.classList.remove("select");
      btn_abrirProductos.classList.remove("select");
      btn_abrirCategoria.classList.remove("select");
      btn_abrirPedidos.classList.add("select");
      break;
    default:
      pantallaProductos.classList.remove("show");
      pantallaCategorias.classList.remove("show");
      pantallaPedidos.classList.remove("show");
      pantallaPrincipal.classList.add("show");

      btn_abrirProductos.classList.remove("select");
      btn_abrirCategoria.classList.remove("select");
      btn_abrirPedidos.classList.remove("select");
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
const id_producto1 = document.getElementById("id_product");
const descripconProduct1 = document.getElementById("descripcionProduct");

const stockProduct1 = document.getElementById("stockProduct");
const pesoProduct1 = document.getElementById("pesoProduct");
const materialProduct1 = document.getElementById("materialProduct");

const largoProduct1 = document.getElementById("largo");
const anchoProduct1 = document.getElementById("ancho");
const altoProduct1 = document.getElementById("alto");

btnGuardarProduct.onclick = () => {
  validarFormatoInputs(
    tituloProduct1.value.trim(),
    precioVenta1.value.trim(),
    marcaProduct1.value.trim(),
    precioOriginal1.value.trim(),
    id_producto1.value.trim(),
    descripconProduct1.value.trim(),
    stockProduct1.value.trim(),
    pesoProduct1.value.trim(),
    materialProduct1.value.trim(),
    largoProduct1.value.trim(),
    anchoProduct1.value.trim(),
    altoProduct1.value.trim(),
  );
};

let elementoSelect = new selectorGlobal(".select_Categoria");
let estadoSelect = new estadoProduct();

let hayError = false;

function validarFormatoInputs(
  titulo,
  precio,
  marca,
  orginalPrecio,
  id,
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
    return;
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
    return;
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
    return;
  }

  let esSeleccion = elementoSelect.esValido();
  if (!esSeleccion) {
    document.querySelector(".select_Categoria").focus();
    mostrarToast(
      "Categoría requerida",
      "Selecciona una categoría adecuada para clasificar el producto.",
      "aviso",
      5000,
    );
    return;
  }

  textoInput = escoparHTML(id);
  if (textoInput.length < 1) {
    id_producto1.focus();
    mostrarToast(
      "Identificador requerido",
      "Ingresa el código ID o SKU del producto.",
      "error",
      5000,
    );
    return;
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
    return;
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
    return;
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
    return;
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
    return;
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
    return;
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
    return;
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
    return;
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
    return;
  }

  let img = gestor.archivoObtnido();

  if (!img) {
    mostrarToast(
      "Imagen requeridad",
      "Selecciona la imagen del producto",
      "error",
      5000,
    );
    return;
  }
  // Si todas las validaciones pasan
  agregarProduct(
    titulo,
    precio,
    marca,
    orginalPrecio,
    id,
    descrip,
    stock,
    peso,
    material,
    largo,
    ancho,
    alto,
    elementoSelect.obtenerEvaluador(),
    estadoSelect.obtenerEvaluador(),
  );

  mostrarToast(
    "Producto guardado",
    "El producto se ha registrado correctamente en el sistema.",
    "suceso",
    4000,
  );

  return true;
}

abrirPantalla("pedidos");
abrirCerrarSidebar();

const listaPedidos = document.querySelector(".list_pedidos");

let colorFila = true;
for (let i = 0; i < 5; i++) {
  colorFila = !colorFila;

  const fila = document.createElement("tr");
  fila.className = `fila_pedidos`;

  if (!colorFila) {
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
