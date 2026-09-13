export class validarGlobalInput {
  constructor(input, tipoInput = "text", logitudMin = 3, logitudMax = 200) {
    this.input =
      typeof input === "string" ? document.getElementById(input) : input;
    this.tipo = tipoInput;
    this.logitudMin = logitudMin;
    this.logitudMax = logitudMax;
  }

  validar() {
    if (!this.input) {
      return this.mensajeError(
        "Error de referencia",
        "El elemento input no existe en el DOM.",
      );
    }

    const valor = this.input.value.trim();

    if (valor === "") {
      this.input.focus();
      return this.mensajeError(
        "Campo requerido",
        "Por favor complete este campo.",
      );
    }

    if (valor.length < this.logitudMin) {
      this.input.focus();
      return this.mensajeError(
        "Texto muy corto",
        `Debe tener al menos ${this.logitudMin} caracteres.`,
      );
    }

    if (valor.length > this.logitudMax) {
      this.input.focus();
      return this.mensajeError(
        "Texto muy largo",
        `No puede superar los ${this.logitudMax} caracteres.`,
      );
    }

    switch (this.tipo) {
      case "text":
        return true;

      case "email":
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(valor)) {
          this.input.focus();
          return this.mensajeError(
            "Correo inválido",
            "Ingrese una dirección de correo válida.",
          );
        }
        return true;

      case "number":
        if (isNaN(valor)) {
          this.input.focus();
          return this.mensajeError(
            "Número inválido",
            "El valor ingresado debe ser numérico.",
          );
        }
        return true;

      case "phone":
        const regexTelefono = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
        if (!regexTelefono.test(valor)) {
          this.input.focus();
          return this.mensajeError(
            "Teléfono inválido",
            "Ingrese un número telefónico válido.",
          );
        }
        return true;

      case "date":
        if (isNaN(Date.parse(valor))) {
          this.input.focus();
          return this.mensajeError(
            "Fecha inválida",
            "Por favor seleccione una fecha válida.",
          );
        }
        return true;

      default:
        return true;
    }
  }

  mensajeError(titulo = "Mensaje vacío.", subTitulo = "Ninguno") {
    return {
      exito: false,
      titulo: titulo,
      subTitulo: subTitulo,
    };
  }
}
