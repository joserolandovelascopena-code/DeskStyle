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
      pantallaProductos.classList.add("show");

      btn_abrirPrincipal.classList.remove("select");
      btn_abrirCategoria.classList.remove("select");
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

const btnCancelarProduct = document.querySelector(".btnCancelar");
const btnGuardarProduct = document.querySelector(".btnGuardar");

btnGuardarProduct.onclick = () => {
  const tituloProduct = document.getElementById("titulo").value.trim();
  const precioVenta = document.getElementById("precio").value.trim();
  const marcaProduct = document.getElementById("marca_product").value.trim();
  const precioOriginal = document.getElementById("precioOriginal").value.trim();
  const id_producto = document.getElementById("id_product").value.trim();
  const descripconProduct = document.getElementById("descripcion");
  validarFormatoInputs(
    tituloProduct,
    precioVenta,
    marcaProduct,
    precioOriginal,
    id_producto,
    descripconProduct,
  );
};

let hayError = false;

function validarFormatoInputs(titulo, precio, marca, orginalPrecio, id) {
  if (titulo.length < 5) {
    hayError = true;
    alert("Titulo demasiado corto");
    return false;
  }

  if (precio.length < 1) {
    hayError = true;
    alert("Precio demasiado corto");
    return false;
  }

  if (orginalPrecio.length < 1) {
    hayError = true;
    alert("Precio original demasiado corto");
    return false;
  }

  if (id.length < 1) {
    hayError = true;
    alert("ID demasiado corto");
    return false;
  }

  return true;
}

abrirPantalla("pedidos");
abrirCerrarSidebar();
