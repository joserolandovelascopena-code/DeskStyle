import { request } from "../../public/js/repositories/request.js";

let perfil = null;

const userStore = {
  async cargar() {
    if (perfil) {
      return perfil;
    }

    perfil = await request.obtenerPerfil();

    return perfil;
  },

  obtener() {
    return perfil;
  },

  limpiar() {
    perfil = null;
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
  const datos_usuario = await userStore.cargar();

  if (!datos_usuario) {
    return;
  }

  const nombreUsuario = document.querySelector(".nombre_usuario");

  if (nombreUsuario) {
    nombreUsuario.textContent = datos_usuario.nombre;
  }

  configurarAvatar(datos_usuario.nombre);
});

export { userStore };
