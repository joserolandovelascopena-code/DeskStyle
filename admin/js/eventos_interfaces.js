import { manejadorIMGs } from "../../public/js/utils/manejadorArchivos.js";
import { request } from "../../public/js/repositories/request.js";
import { mostrarToast, ocultarToast } from "./utils/toast.js";

const imgPerfil = new manejadorIMGs("inputFotoPerfil", ".previewFotoPerfil");

const btnSelectFoto_perfil = document.getElementById("selectAvatarImg");
const modalSelectFotoPerfil = document.getElementById("modalFotoPerfil");
const btnCerrarFotoPerfil = document.getElementById("cerrarFotoPerfil");
const btnGuardarFotoPerfil = document.getElementById("guardarFotoPerfil");
const imagenPerfil = document.querySelector(".circuloIconPerfil img");
const fotoPerfilPredeterminada =
  "../public/icons/Images_web/sin_foto_perfil.jpg";

btnSelectFoto_perfil.addEventListener("click", () => {
  modalSelectFotoPerfil.classList.add("mostrar");
});

btnCerrarFotoPerfil.addEventListener("click", () => {
  cerrarModalFotoPerfil();
});

btnGuardarFotoPerfil.addEventListener("click", async () => {
  const archivo = imgPerfil.archivoObtnido();
  if (!archivo) {
    mostrarToast(
      "Selecciona una foto",
      "Elige una imagen antes de guardarla.",
      "error",
      4000,
    );
    return;
  }

  btnGuardarFotoPerfil.disabled = true;

  let loaderToast;
  try {
    loaderToast = mostrarToast(
      "Guardando foto de perfil",
      "Procesando la solicitud...",
      "loader",
    );

    const urlImagen = await request.guardarFotoPerfil(archivo);
    if (imagenPerfil) imagenPerfil.src = urlImagen;
    imgPerfil.limpiarPrevisualizacion(urlImagen);
    cerrarModalFotoPerfil();
    mostrarToast(
      "Foto actualizada",
      "Tu foto de perfil se guardó correctamente.",
      "exito",
      4000,
    );
  } catch (error) {
    mostrarToast("No se pudo guardar la foto", error.message, "error", 5000);
  } finally {
    btnGuardarFotoPerfil.disabled = false;
    ocultarToast(loaderToast);
  }
});

export function cerrarModalFotoPerfil() {
  modalSelectFotoPerfil.classList.remove("mostrar");
  if (imgPerfil.archivoObtnido()) {
    imgPerfil.limpiarPrevisualizacion(
      imagenPerfil?.src || fotoPerfilPredeterminada,
    );
  }
}
