export class verContraseña {
  constructor(input, bnt_icono) {
    this.input = document.getElementById(input);
    this.btn = document.getElementById(bnt_icono);

    if (this.btn) {
      this.btn.addEventListener("click", () => {
        this.verPass();
      });
    }
  }

  verPass() {
    const icons = {
      visiblePass: "visibility_off",
      noVisible: "visibility",
    };

    if (this.input.type === "password") {
      this.input.type = "text";
      this.btn.textContent = icons.noVisible;
    } else {
      this.input.type = "password";
      this.btn.textContent = icons.visiblePass;
    }
  }
}

export class validarCorreo {
  constructor(inputId, infoText, borderInput) {
    this.input = document.getElementById(inputId);
    this.regex = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    this.infoText = document.querySelector(infoText);
    this.borderFocus = document.querySelector(borderInput);

    if (this.borderFocus) {
      this.borderInput = this.input;
    }

    if (this.input) {
      this.input.addEventListener("input", () => this.validar());
    }
  }

  validar() {
    if (!this.input) return false;

    const value = this.input.value.trim();

    if (value === "") {
      this.estadoError(
        "El correo es obligatorio. Por favor complete el campo con un correo válido.",
      );
      return false;
    }

    if (!this.regex.test(value)) {
      this.estadoError("Ingrese un correo electrónico válido.");
      return false;
    }

    this.limpiarError();
    return true;
  }

  estadoError(mensaje) {
    if (!this.infoText) return false;
    this.infoText.textContent = mensaje;
    this.infoText.classList.add("show");
    this.estadoBorderError();
  }

  limpiarError() {
    if (!this.infoText) return false;
    this.infoText.textContent = "";
    this.infoText.classList.remove("show");
    this.estadoBorderExito();
  }

  estadoBorderError() {
    if (!this.borderFocus) return false;
    this.borderFocus.classList.remove("exito");
    this.borderFocus.classList.add("error");
    this.borderInput.classList.remove("exito");
    this.borderInput.classList.add("error");
  }

  estadoBorderExito() {
    if (!this.borderFocus) return false;
    this.borderFocus.classList.remove("error");
    this.borderFocus.classList.add("exito");
    this.borderInput.classList.remove("error");
    this.borderInput.classList.add("exito");
  }
}
