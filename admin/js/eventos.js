const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.querySelector(".layout_toggle");
const logoBtn = document.querySelector(".open_sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

logoBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("active")) {
    sidebar.classList.remove("active");
  }
});

/* Logica para abrir pantallas*/

const pantallaPrincipal = document.querySelector(".content");
const pantallaProductos = document.querySelector(".interfaz_productos");

const btn_abrirPrincipal = document.querySelector(".inicioPag");
const btn_abirProductos = document.querySelector(".productosPag");
const btn_abirCategoria = document.querySelector(".categoriaPag");
const btn_abirPedidos = document.querySelector(".pedidosPag");
const btn_abirInventario = document.querySelector(".inventarioPag");
const btn_abirClientes = document.querySelector(".clientesPag");
const btn_abirConfiguracion = document.querySelector(".configuracionPag");

btn_abrirPrincipal.addEventListener("click", () => {
  abrirPantalla("principal");
});

btn_abirProductos.addEventListener("click", () => {
  abrirPantalla("productos");
});

function abrirPantalla(pantalla) {
  switch (pantalla) {
    case "productos":
      pantallaPrincipal.classList.remove("show");
      pantallaProductos.classList.add("show");
      btn_abrirPrincipal.classList.remove("select");
      btn_abirProductos.classList.add("select");

      break;
    default:
      pantallaPrincipal.classList.add("show");
      pantallaProductos.classList.remove("show");
      btn_abirProductos.classList.remove("select");
      btn_abrirPrincipal.classList.add("select");
      break;
  }
}

abrirPantalla("productos");
