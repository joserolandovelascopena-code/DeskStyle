import { validarCorreo, createLoader } from "../utils/utils.js";
import { recoverPassword } from "../../../db/auth.js";

// Instancia del validador de correo
const validator = new validarCorreo(
  "recover_correo",
  ".info_erro",
  ".borderFocus",
);

const loaderSytem = new createLoader(".loader");
loaderSytem.crear();

const btnRecuperar = document.querySelector(".btn_recover");
const inputCorreo = document.getElementById("recover_correo");
const modalConfir = document.querySelector(".dialogConfirm");
const btnCerrar = document.querySelectorAll(".btnCerrar");
const correoConfirmacion = document.getElementById("correoConfirmacion");
const infoError = document.querySelector(".info_erro");

// Función para abrir modal
function abrirModal(emailText) {
  if (correoConfirmacion && emailText) {
    correoConfirmacion.textContent = emailText;
  }
  modalConfir.classList.add("show");
}

function cerrarModal() {
  modalConfir.classList.remove("show");
}

btnRecuperar?.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const esValido = validator.validar();
    if (!esValido) return;

    loaderSytem.textLoader(
      "Procesando solicitud",
      "Enviando enlace de recuperación...",
    );
    loaderSytem.mostrarLoder();

    const emailIngresado = inputCorreo ? inputCorreo.value.trim() : "";

    await recoverPassword(emailIngresado);

    abrirModal(emailIngresado);

    if (inputCorreo) inputCorreo.value = "";
    if (infoError) {
      infoError.textContent = "";
      infoError.classList.remove("show");
    }
  } catch (error) {
    if (infoError) {
      infoError.textContent = error.message;
      infoError.classList.add("show");
    }
  } finally {
    loaderSytem.ocultarLoder();
  }
});

btnCerrar.forEach((btn) => {
  btn.addEventListener("click", cerrarModal);
});

modalConfir?.addEventListener("click", (e) => {
  if (e.target === modalConfir) {
    cerrarModal();
  }
});
