import { verContraseña, CreateLoader } from "../utils/utils.js";
import { updatePassword } from "../../../db/auth.js";

const btn_change = document.querySelector(".btn_change");
const nuevaContrasena = document.getElementById("confirm_pass");
const errorActualizar = document.querySelector(".errorActualizar");

const verPass = new verContraseña("change_pass", "bntVisblePass");
const verPassConfirm = new verContraseña("confirm_pass", "bntVisblePassConfir");

const form = document.querySelector(".form_recover");
const loader = document.querySelector(".loader");

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

const loaderSystem = new CreateLoader(".loader");
loaderSystem.crear();

class validarContrasena {
  constructor(password, confirmPassword, textInfo, mensajeConfirmacion) {
    this.password = document.getElementById(password);
    this.confirmPassword = document.getElementById(confirmPassword);
    this.textInfo = document.getElementById(textInfo);
    this.mensajeConfirmacion = document.getElementById(mensajeConfirmacion);
    this.borderPassword = document.getElementById("borderChangePass");
    this.borderConfirmPassword = document.getElementById("borderConfirmPass");

    if (this.password) {
      this.password.addEventListener("input", () => {
        this.validar();
      });
    }

    if (this.confirmPassword) {
      this.confirmPassword.addEventListener("input", () => {
        this.validar();
      });
    }
  }

  validar() {
    const passwordValue = this.password.value;
    const confirmPasswordValue = this.confirmPassword.value;
    const regexMayuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexNumero = /[0-9]/;
    const regexCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (passwordValue.length < 8) {
      this.textInfo.textContent =
        "La contraseña debe tener al menos 8 caracteres.";
      this.estadosInput(false);
      return false;
    }

    if (!regexMayuscula.test(passwordValue)) {
      this.textInfo.textContent =
        "La contraseña debe contener al menos una letra mayúscula.";
      this.estadosInput(false);
      return false;
    }

    if (!regexMinuscula.test(passwordValue)) {
      this.textInfo.textContent =
        "La contraseña debe contener al menos una letra minúscula.";
      this.estadosInput(false);
      return false;
    }

    if (!regexNumero.test(passwordValue)) {
      this.textInfo.textContent =
        "La contraseña debe contener al menos un número.";
      this.estadosInput(false);
      return false;
    }

    if (!regexCaracterEspecial.test(passwordValue)) {
      this.textInfo.textContent =
        "La contraseña debe contener al menos un carácter especial.";
      this.estadosInput(false);
      return false;
    }

    this.textInfo.textContent = "La contraseña es segura.";
    this.estadosInput(true, false);

    if (passwordValue !== confirmPasswordValue) {
      this.mensajeConfirmacion.classList.add("mostrar");
      this.mensajeConfirmacion.textContent = "Las contraseñas no coinciden.";
      this.estadosInput(true, false);
      return false;
    }

    this.mensajeConfirmacion.classList.add("mostrar");
    this.mensajeConfirmacion.textContent = "Las contraseñas coinciden.";
    this.estadosInput(true, true);
    return true;
  }

  estadosInput(isValidoPassword = true, isValidoConfirmPassword = true) {
    if (isValidoPassword) {
      this.borderPassword.classList.add("success");
      this.borderPassword.classList.remove("error");
      this.borderConfirmPassword.classList.add("success");
      this.borderConfirmPassword.classList.remove("error");
      this.textInfo.classList.remove("error");
      this.textInfo.classList.add("success");
    } else {
      this.borderPassword.classList.add("error");
      this.borderPassword.classList.remove("success");
      this.borderConfirmPassword.classList.add("error");
      this.borderConfirmPassword.classList.remove("success");
      this.textInfo.classList.remove("success");
      this.textInfo.classList.add("error");
    }

    if (isValidoConfirmPassword) {
      this.borderConfirmPassword.classList.add("success");
      this.borderConfirmPassword.classList.remove("error");
      this.mensajeConfirmacion.classList.remove("error");
      this.mensajeConfirmacion.classList.add("success");
    } else {
      this.borderConfirmPassword.classList.add("error");
      this.borderConfirmPassword.classList.remove("success");
      this.mensajeConfirmacion.classList.remove("success");
      this.mensajeConfirmacion.classList.add("error");
    }
  }
}

const validar = new validarContrasena(
  "change_pass",
  "confirm_pass",
  "textInfo",
  "mensajeConfirmacion",
);

btn_change.addEventListener("click", async () => {
  const isValido = validar.validar();

  if (!isValido) return;

  const contrasena = nuevaContrasena.value.trim();

  try {
    errorActualizar.classList.remove("mostrar");
    loaderSystem.textLoader(
      "Actualizando contraseña..",
      "Espere un momento...",
    );

    loaderSystem.mostrarLoader();

    await updatePassword(contrasena);
    window.location.href = new URL(
      "../../pages/auth/login.html",
      import.meta.url,
    ).href;
  } catch (error) {
    errorActualizar.textContent = error.message;
    errorActualizar.classList.add("mostrar");
  } finally {
    loaderSystem.ocultarLoader();
  }
});
