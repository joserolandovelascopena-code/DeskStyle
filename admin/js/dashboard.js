import { request } from "../../public/js/repositories/request.js";
import { mostrarToast, ocultarToast } from "./utils/toast.js";
import {
  initListaGlobal,
  cerrarModalEditProducto,
  cerrarModalElimProducto,
} from "./eventos.js";
import {
  renderizarCategorias,
  renderizarListaCategorias,
  crearListProducResumen,
} from "./utils/crearHTML.js";
import { actualizarListaProductos } from "./productosLista.js";
import { actualizarListaClientes, mostrarEstadoClientes } from "./clientesLista.js";

let agrgandoProduct = false;

const Dashboard = {
  async cargarCategorias() {
    try {
      const categorias = await request.cargarCategorias();
      renderizarCategorias("selectCategoria", categorias);
      renderizarCategorias("editCateg_product", categorias);
    } catch (error) {
      mostrarToast(
        "No se pudieron cargar las categorias: ",
        error,
        "error",
        6000,
      );
    }
  },

  async cargarProductos() {
    try {
      const productos = await request.cargarListaProductos();
      actualizarListaProductos(productos);

      const resumenProductos = await request.remunProductosList();
      crearListProducResumen(".vistaResumenProductos", resumenProductos);
    } catch (error) {
      mostrarToast(
        `No se pudieron cargar los productos:  ${error.message || error} `,
        error,
        "error",
        6000,
      );
    }
  },

  async cargarUsuarios() {
    mostrarEstadoClientes("cargando");
    try {
      const usuarios = await request.cargarUsuarios();
      actualizarListaClientes(usuarios);
    } catch (error) {
      mostrarEstadoClientes("error");
      mostrarToast(
        "No se pudieron cargar los usuarios",
        error.message || error,
        "error",
        6000,
      );
    }
  },

  async cargarCategoriasExistentes() {
    try {
      const listaCategorias = await request.cargarListaCategorias();

      renderizarListaCategorias(".existente_categ", listaCategorias);
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
        "Guardando Categoría",
        "Procesando la solicitud...",
        "loader",
      );

      const objetoCategoria = {
        nombre: nombre,
        descripcion: descripcion || "Sin descripción.",
        imagen: imgURL,
      };

      await request.nuevaCategoria(objetoCategoria);

      this.init();

      mostrarToast(
        "Categoría agregada",
        "La categoría se ha guardado correctamente.",
        "exito",
        6000,
      );
    } catch (error) {
      mostrarToast(
        "No se pudo agregar la categoria",
        `Error: ${error.message || error}`,
        "error",
        6000,
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
        6000,
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

      this.init();

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

  async editarCategoria(id, nombre, descrip, imgNueva) {
    let loaderToast;
    try {
      loaderToast = mostrarToast(
        "Actualizado categoria",
        "Se estan guardando los cambios realizados...",
        "loader",
      );

      const objetoCategoria = {
        nombre: nombre,
        descripcion: descrip,
        imgNueva: imgNueva,
      };

      await request.editarCategoria(id, objetoCategoria);
      this.init();

      mostrarToast(
        "Se han guardo los cambios",
        "Los cambios realizados se han guardado correctamente.",
        "exito",
        6000,
      );
    } catch (error) {
      mostrarToast(
        "Ocurrio un error al actualizar la categoría",
        `Error: ${error.message || error}`,
        "error",
        6000,
      );
    } finally {
      ocultarToast(loaderToast);
    }
  },

  async eliminarCategorias(idCategoria) {
    let loaderToast;
    const modalEliminarCateg = document.querySelector(".elim_categ_modal");
    try {
      loaderToast = mostrarToast(
        "Eliminando categoría",
        "Se está procesando la solicitud...",
        "loader",
      );

      await request.eliminarCategoria(idCategoria);

      mostrarToast(
        "Categoría eliminada",
        "La categoría fue eliminada correctamente.",
        "exito",
        6000,
      );

      this.init();
      modalEliminarCateg.classList.remove("mostrar");
    } catch (error) {
      mostrarToast(
        "Ocurrio un error al eliminar la categoría",
        `Error: ${error.message || error}`,
        "error",
        6000,
      );
    } finally {
      ocultarToast(loaderToast);
    }
  },

  async editarProducto(
    id,
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
    imgNueva,
  ) {
    let loaderToast;
    try {
      loaderToast = mostrarToast(
        "Actualizado producto",
        "Se estan guardando los cambios realizados...",
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
        imgNueva: imgNueva,
      };

      await request.editarProduct(id, objetoProducto);

      mostrarToast(
        "Cambios guardados",
        "Se ha actualizado correctamente el producto.",
        "exito",
        6000,
      );

      cerrarModalEditProducto();
      this.init();
    } catch (error) {
      mostrarToast(
        "Ocurrio un error al editar el producto",
        `Error: ${error.message || error}`,
        "error",
        6000,
      );
    } finally {
      ocultarToast(loaderToast);
    }
  },

  async elimarProducto(idProducto) {
    let loaderToast;
    try {
      loaderToast = mostrarToast(
        "Eliminando producto",
        "Se está procesando la solicitud...",
        "loader",
      );

      await request.eliminarProducto(idProducto);

      mostrarToast(
        "Producto eliminada",
        "La producto fue eliminado correctamente.",
        "exito",
        6000,
      );

      cerrarModalElimProducto();
      this.init();
    } catch (error) {
      mostrarToast(
        "Ocurrio un error al eliminar el producto",
        `Error: ${error.message || error}`,
        "error",
        6000,
      );
    } finally {
      ocultarToast(loaderToast);
    }
  },

  async enMemoriaDatos() {
    const listProductos = await request.cargarListaProductos();
    const listCategorias = await request.cargarListaCategorias();

    const lista = {
      listaProductos: listProductos,
      listCategorias: listCategorias,
    };

    return lista;
  },

  init() {
    this.cargarCategorias();
    this.cargarProductos();
    this.cargarCategoriasExistentes();
    initListaGlobal();
  },
};

Dashboard.init();

export { Dashboard };
