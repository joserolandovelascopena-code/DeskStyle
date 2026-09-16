import { request } from "../../public/js/repositories/request.js";
import { mostrarToast } from "./utils/toast.js";

let list_categoria = {};
let list_product = {};
let perfil = null;

const cargarUI = {
  async cargarUsuario() {
    if (perfil) {
      return perfil;
    }

    perfil = await request.obtenerPerfil();

    return perfil;
  },

  async cargarTotal_Resumen() {
    const resultado = await request.cargarResumen();
    return resultado;
  },

  async enMemoriaDatos() {
    const listProductos = await request.cargarListaProductos();
    const listCategorias = await request.cargarListaCategorias();

    list_product = listProductos;
    list_categoria = listCategorias;
  },
};

function obtenerInicial(nombre) {
  return nombre?.trim().charAt(0).toUpperCase() || "?";
}

function obtenerColorAvatar(nombre) {
  const colores = [
    "#0284c7", // Azul tecnológico
    "#7c3aed", // Morado
    "#db2777", // Rosa
    "#dc2626", // Rojo
    "#ea580c", // Naranja
    "#16a34a", // Verde
    "#0891b2", // Cyan
    "#4f46e5", // Índigo
  ];

  let hash = 0;

  for (const caracter of nombre) {
    hash = caracter.charCodeAt(0) + ((hash << 5) - hash);
  }

  return colores[Math.abs(hash) % colores.length];
}

function obtenerColorTexto(color) {
  const hex = color.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminosidad = (r * 299 + g * 587 + b * 114) / 1000;

  return luminosidad > 150 ? "#1f2937" : "#ffffff";
}

function configurarAvatar(nombre) {
  const avatar = document.getElementById("avatar");
  const inicial = document.querySelector(".inicial_nombre");

  if (!avatar || !inicial) {
    return;
  }

  const colorFondo = obtenerColorAvatar(nombre);
  const colorTexto = obtenerColorTexto(colorFondo);

  inicial.textContent = obtenerInicial(nombre);

  avatar.style.backgroundColor = colorFondo;
  inicial.style.color = colorTexto;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    request.cargarListaProductos();
    const datos_usuario = await cargarUI.cargarUsuario();
    const datos_resumen = await cargarUI.cargarTotal_Resumen();

    const totalProductos = datos_resumen.total_product;
    const totalInventario = datos_resumen.total_inventario;
    const totalUsuarios = datos_resumen.total_usuarios;

    if (!datos_usuario || !datos_resumen) {
      return;
    }

    const nombreUsuario = document.querySelector(".nombre_usuario");
    const totalProduct = document.getElementById("total_productos");
    const totalInven = document.getElementById("total_inventario");
    const totalUsua = document.getElementById("total_usuarios");

    if (nombreUsuario) {
      nombreUsuario.textContent = datos_usuario.nombre;
    }

    if (totalProduct) {
      totalProduct.textContent = totalProductos;
    }

    if (totalInven) {
      totalInven.textContent = totalInventario;
    }

    if (totalUsua) {
      totalUsua.textContent = totalUsuarios;
    }

    configurarAvatar(datos_usuario.nombre);
  } catch (error) {
    mostrarToast(
      "Error al obtener datos",
      "Ocurrio un error al obtner los datos en la DB.",
      "error",
      5000,
    );
  }
});

export { cargarUI };
