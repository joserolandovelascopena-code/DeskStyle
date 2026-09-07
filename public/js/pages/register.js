import { signup, authWithGoogle } from "../../../db/auth.js";
import { verContraseña } from "../utils/utils.js";

new verContraseña("passUser", "bntVisblePass");

const btnSignup = document.getElementById("btnRegistrar");
const borderNombre = document.querySelector(".nombre");
const borderCorreo = document.querySelector(".correo");
const borderContrasena = document.querySelector(".contrasena");

class ErrorMessage {
  constructor(elementId) {
    this.element = document.querySelector(elementId);
  }

  mostrarMensaje(mensaje) {
    if (this.element) {
      this.element.textContent = mensaje;
      this.element.classList.add("show");
    }
  }

  ocultarMensaje() {
    if (this.element) {
      this.element.textContent = "";
      this.element.classList.remove("show");
    }
  }
}

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

const borderFocusNombre = new borderFocus(".nombre");
const borderFocusCorreo = new borderFocus(".correo");
const borderFocusContrasena = new borderFocus(".contrasena");

class ValidarNombre {
  constructor(nombreId, infoId) {
    this.input = document.getElementById(nombreId);
    this.info = document.querySelector(infoId);

    if (this.input) {
      this.input.addEventListener("input", () => this.validar());
    }
  }

  validar() {
    if (!this.input) return false;
    const value = this.input.value.trim();

    if (value.length < 3) {
      this.mostrarError("El nombre completo debe tener al menos 3 caracteres.");
      return false;
    }

    this.limpiarError();
    return true;
  }

  mostrarError(mensaje) {
    if (this.info) this.info.textContent = mensaje;
    this.info.classList.add("show");
    borderFocusNombre.agregarError();
  }

  limpiarError() {
    if (this.info) this.info.textContent = "";
    this.info.classList.remove("show");
    borderFocusNombre.quitarError();
  }
}

class ValidarEmail {
  constructor(inputId, infoId) {
    this.input = document.getElementById(inputId);
    this.info = document.querySelector(infoId);
    this.regex = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    if (this.input) {
      this.input.addEventListener("input", () => this.validar());
    }
  }

  validar() {
    if (!this.input) return false;
    const value = this.input.value.trim();

    if (value === "") {
      this.mostrarError("El correo es obligatorio.");
      return false;
    }

    if (!this.regex.test(value)) {
      this.mostrarError("Ingresa un correo electrónico válido.");
      return false;
    }

    this.limpiarError();
    return true;
  }

  mostrarError(mensaje) {
    if (this.info) this.info.textContent = mensaje;
    this.info.classList.add("show");
    borderFocusCorreo.agregarError();
  }

  limpiarError() {
    if (this.info) this.info.textContent = "";
    this.info.classList.remove("show");
    borderFocusCorreo.quitarError();
  }
}

class ValidarContrasena {
  constructor(passwordId, infoId) {
    this.password = document.getElementById(passwordId);
    this.textInfo = document.querySelector(infoId);

    if (this.password) {
      this.password.addEventListener("input", () => this.validar());
    }
  }

  validar() {
    if (!this.password) return false;
    const value = this.password.value.trim();

    const regexMayuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexNumero = /[0-9]/;
    const regexCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (value.length < 8) {
      this.mostrarError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    if (!regexMayuscula.test(value)) {
      this.mostrarError("Debe contener al menos una letra mayúscula.");
      return false;
    }

    if (!regexMinuscula.test(value)) {
      this.mostrarError("Debe contener al menos una letra minúscula.");
      return false;
    }

    if (!regexNumero.test(value)) {
      this.mostrarError("Debe contener al menos un número.");
      return false;
    }

    if (!regexCaracterEspecial.test(value)) {
      this.mostrarError("Debe contener al menos un carácter especial.");
      return false;
    }

    this.limpiarError();
    return true;
  }

  mostrarError(mensaje) {
    if (this.textInfo) this.textInfo.textContent = mensaje;
    this.textInfo.classList.add("show");
    borderFocusContrasena.agregarError();
  }

  limpiarError() {
    if (this.textInfo) this.textInfo.textContent = "";
    this.textInfo.classList.remove("show");
    borderFocusContrasena.quitarError();
  }
}

// Instancias de validadores
const mensajeErrorGlobal = new ErrorMessage(".mensaje_error");
const validadorNombre = new ValidarNombre("nombreUser", ".mensaje_error");
const validadorEmail = new ValidarEmail("correoUser", ".mensaje_error");
const validadorPass = new ValidarContrasena("passUser", ".mensaje_error");

if (btnSignup) {
  btnSignup.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const esNombreValido = validadorNombre.validar();
      const esEmailValido = validadorEmail.validar();
      const esPassValida = validadorPass.validar();

      // Enfoca el primer campo que tenga error
      if (!esNombreValido) {
        validadorNombre.input?.focus();
        mensajeErrorGlobal.mostrarMensaje("Verifica el campo de nombre.");
        return;
      }

      if (!esEmailValido) {
        validadorEmail.input?.focus();
        mensajeErrorGlobal.mostrarMensaje("Verifica el campo de correo.");
        return;
      }

      if (!esPassValida) {
        validadorPass.password?.focus();
        mensajeErrorGlobal.mostrarMensaje("Verifica el campo de contraseña.");
        return;
      }

      mensajeErrorGlobal.ocultarMensaje();
      borderNombre?.classList.remove("error");
      borderCorreo?.classList.remove("error");
      borderContrasena?.classList.remove("error");

      const email = document.getElementById("correoUser").value.trim();
      const password = document.getElementById("passUser").value.trim();
      const fullName = document.getElementById("nombreUser").value.trim();

      await signup(fullName, email, password);
    } catch (error) {
      mensajeErrorGlobal.mostrarMensaje("Error al registrar usuario.");
      console.error("Error crítico durante el registro:", error);
    }
  });
}

const btnGoogle = document.querySelector(".googleProviders");

btnGoogle.onclick = () => {
  authWithGoogle();
};
