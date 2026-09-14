import { request } from "../../public/js/repositories/request.js";
import { mostrarToast } from "./utils/toast.js";
import {
  renderizarCategorias,
  renderizarListaCategorias,
} from "./utils/crearHTML.js";

const Dashboard = {
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

  async cargarCategoriasExistentes() {
    try {
      const listaCategorias = await request.cargarListaCategorias();

      renderizarListaCategorias(".existente_categ", listaCategorias);
      console.log(listaCategorias);
    } catch (error) {
      mostrarToast(
        "Error al cargar las categorías",
        `Ocurrió un error al obtener las categorías: ${error.message || error}`,
        "error",
        6000,
      );
    }
  },

  async agregarCategoria(nombre, descripcion, imgURL) {
    try {
      const objetoCategoria = {
        nombre: nombre,
        descripcion: descripcion || "Sin descripción.",
        imagen: imgURL,
      };

      await request.nuevaCategoria(objetoCategoria);

      this.cargarCategoriasExistentes();

      mostrarToast(
        "Categoría agregada",
        "La categoría se ha guardado correctamente.",
        "exito",
        5000,
      );
    } catch (error) {
      mostrarToast(
        "No se pudo agregar la categoria",
        `Error: ${error.message || error}`,
        "error",
        5000,
      );
    }
  },

  init() {
    this.cargarCategorias();
    this.cargarCategoriasExistentes();
  },
};

Dashboard.init();

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

export { agregarProduct, Dashboard };
