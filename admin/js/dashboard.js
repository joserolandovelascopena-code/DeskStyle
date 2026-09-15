import { request } from "../../public/js/repositories/request.js";
import { mostrarToast, ocultarToast } from "./utils/toast.js";
import {
  renderizarCategorias,
  renderizarListaCategorias,
} from "./utils/crearHTML.js";

let agrgandoProduct = false;

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
    let loaderToast;
    try {
      loaderToast = mostrarToast(
        "Guardando Categoria",
        "Procesando la solicitud...",
        "loader",
      );

      const objetoCategoria = {
        nombre: nombre,
        descripcion: descripcion || "Sin descripción.",
        imagen: imgURL,
      };

      await request.nuevaCategoria(objetoCategoria);

      this.cargarCategoriasExistentes();
      this.cargarCategorias();

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
    } finally {
      ocultarToast(loaderToast);
    }
  },

  async agregarProducto(
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
    categoria,
    estado,
    imageURL,
  ) {
    let loaderToast;
    if (agrgandoProduct) {
      mostrarToast(
        "Acción denegada",
        `Se encuentra agregando un producto en este momento.`,
        "aviso",
        5000,
      );
      return;
    }

    try {
      loaderToast = mostrarToast(
        "Guardando producto",
        "Procesando datos y solicitud...",
        "loader",
      );

      const objetoProducto = {
        titulo: titulo,
        precio: precio,
        marca: marca,
        orginalPrecio: orginalPrecio,
        descrip: descrip,
        stock: stock || 1,
        peso: peso,
        material: material,
        largo: largo,
        ancho: ancho,
        alto: alto,
        categoria: categoria,
        estado: estado,
        imagen: imageURL,
      };

      await request.nuevoProducto(objetoProducto);

      mostrarToast(
        "Producto creado",
        "El producto se ha creado correctamente.",
        "exito",
        5000,
      );
    } catch (error) {
      mostrarToast(
        "No se pudo agregar el producto",
        `Error: ${error.message || error}`,
        "error",
        5000,
      );
    } finally {
      ocultarToast(loaderToast);
      agrgandoProduct = false;
    }
  },

  init() {
    this.cargarCategorias();
    this.cargarCategoriasExistentes();
  },
};

Dashboard.init();

export { Dashboard };
