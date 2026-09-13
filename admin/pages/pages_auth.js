import { loginAdmin } from "../../db/auth.js";
import {
  verContraseña,
  validarCorreo,
  CreateLoader,
} from "../../public/js/utils/utils.js";

const verPass = new verContraseña("passAdmin", "btnVisiblePass");
const validarEmail = new validarCorreo("correoAdmin", ".textError", ".input1");

const loaderSystem = new CreateLoader(".loader");
loaderSystem.crear();

const btnIniciarSesion = document.getElementById("btnIniciarSesion");
const inputCorreo = document.getElementById("correoAdmin");
const inputPass = document.getElementById("passAdmin");

const textError = document.querySelector(".textError");

class validarContrasena {
  constructor(input, infoInput, borderFocus) {
    this.password = document.getElementById(input);
    this.info = document.querySelector(infoInput);
    this.borderFocus = document.querySelector(borderFocus);

    if (this.password) {
      this.password.addEventListener("input", () => this.validar());
    }
  }

  validar() {
    if (!this.password) return false;

    const validar = this.password.value.trim();

    if (validar === "") {
      this.mostrarError("La contraseña es un campo obligatorio.");
      return false;
    }

    if (validar.length < 8) {
      this.mostrarError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    this.limpiarError();
    return true;
  }

  agregarError() {
    if (this.borderFocus) {
      this.borderFocus.classList.add("error");
    }
  }

  quitarError() {
    if (this.borderFocus) {
      this.borderFocus.classList.remove("error");
    }
  }

  mostrarError(mensaje) {
    if (!this.info) return;
    this.info.textContent = mensaje;
    this.info.classList.add("show");
    this.agregarError();
  }

  limpiarError() {
    if (this.info) this.info.textContent = "";
    this.info.classList.remove("show");
    this.quitarError();
  }
}

const validarPass = new validarContrasena("passAdmin", ".textError", ".input2");

btnIniciarSesion.addEventListener("click", async (e) => {
  e.preventDefault();

  const esValidoCorreo = validarEmail.validar();
  const esValidoPass = validarPass.validar();

  if (!esValidoCorreo) return;

  if (!esValidoPass) return;

  const correo = inputCorreo.value.trim();
  const constrasena = inputPass.value.trim();

  try {
    loaderSystem.textLoader("Iniciando sesión", "Verificando credenciales...");
    loaderSystem.mostrarLoader();

    await loginAdmin(correo, constrasena);
    window.location.href = new URL("../dashboard.html", import.meta.url).href;
  } catch (error) {
    textError.textContent = error.message;
    textError.classList.add("show");
  } finally {
    loaderSystem.ocultarLoader();
  }
});
