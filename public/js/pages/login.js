import { login, authWithGoogle } from "../../../db/auth.js";
import { verContraseña, validarCorreo, createLoader } from "../utils/utils.js";

const verPass = new verContraseña("passUser", "bntVisblePass");
const validarEmail = new validarCorreo(
  "correoUser",
  ".error_acceso",
  ".input1",
);

const loaderSytem = new createLoader(".loader");
loaderSytem.crear();

class borderFocus {
  constructor(elementId) {
    this.element = document.querySelector(elementId);
  }

  agregarError() {
    if (this.element) {
      this.element.classList.add("error");
    }
  }

  quitarError() {
    if (this.element) {
      this.element.classList.remove("error");
    }
  }
}

const errorBorderConstrasena = new borderFocus(".input2");

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

  mostrarError(mensaje) {
    if (!this.info) return;
    this.info.textContent = mensaje;
    this.info.classList.add("show");
    errorBorderConstrasena.agregarError();
  }

  limpiarError() {
    if (this.info) this.info.textContent = "";
    this.info.classList.remove("show");
    errorBorderConstrasena.quitarError();
  }
}

const validarPass = new validarContrasena(
  "passUser",
  ".error_acceso",
  ".input2",
);

const btnRegistrarse = document.getElementById("btnRegistrar");

btnRegistrarse.addEventListener("click", async (e) => {
  e.preventDefault();

  const infoError = document.querySelector(".error_acceso");
  if (!validarEmail.validar()) {
    infoError.textContent = "Corrige el correo con un formato válido.";

    return;
  }

  if (!validarPass.validar()) {
    infoError.textContent = "Corrige la contraseña.";
    return;
  }

  const correo = document.getElementById("correoUser").value.trim();
  const contrasena = document.getElementById("passUser").value.trim();

  try {
    loaderSytem.textLoader("Iniciando sesión", "Verificando credenciales...");
    loaderSytem.mostrarLoder();

    await login(correo, contrasena);

    window.location.href = "../../../../index.html";
  } catch (error) {
    infoError.textContent = error.message;
    infoError.classList.add("show");
  } finally {
    loaderSytem.ocultarLoder();
  }
});

const btnGoogle = document.querySelector(".googleProviders");

btnGoogle.onclick = async () => {
  try {
    await authWithGoogle();
  } catch (error) {
    console.error(error);
  }
};
