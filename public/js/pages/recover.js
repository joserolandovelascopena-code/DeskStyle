import { validarCorreo } from "../utils/utils.js";
import { recoverPassword } from "../../../db/auth.js";

// Instancia del validador de correo
const validator = new validarCorreo(
  "recover_correo",
  ".info_erro",
  ".borderFocus",
);

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

    const emailIngresado = inputCorreo ? inputCorreo.value.trim() : "";

    await recoverPassword(emailIngresado);

    abrirModal(emailIngresado);
    inputCorreo.value = "";
  } catch (error) {
    infoError.textContent = error;
    infoError.classList.add("show");
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
