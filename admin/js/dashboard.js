import { request } from "../../public/js/repositories/request.js";
import { mostrarToast } from "./utils/toast.js";
import { renderizarCategorias } from "./utils/crearHTML.js";

const init_Dashboard = {
  async cargarCategorias() {
    try {
      const categorias = await request.cargarCategorias();
      renderizarCategorias("selectCategoria", categorias);
    } catch (error) {
      mostrarToast(
        "No se pudieron cargar los productos: ",
        error,
        "error",
        6000,
      );
    }
  },
};

init_Dashboard.cargarCategorias();

let agrgando = false;
function agregarProduct(
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
  categoria,
  estado,
) {
  agrgando = true;
  console.log(`Categoría: ${categoria}`);
  console.log(`Estado: ${estado}`);
}

export { agregarProduct };
