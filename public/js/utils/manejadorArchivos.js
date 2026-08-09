import { mostrarToast } from "../../../admin/js/utils/toast.js";

export class manejadorIMGs {
  constructor(id_input, vistaPrev, opciones = {}) {
    this.input = document.getElementById(id_input);
    this.vistaPrev = document.querySelector(vistaPrev);

    this.maxTamano = opciones.maxTamano || 2 * 1024 * 1024;
    this.tiposPermitidos = opciones.tiposPermitidos || ["image/"];

    this.input.addEventListener("change", (e) => {
      this.procesarArchivos(e);
      this.archivoObtnido();
    });
  }

  procesarArchivos(e) {
    this.archivoValido;

    const archivo = e.target.files[0];

    if (!archivo) {
      return;
    }

    const tipoValido = this.tiposPermitidos.some((tipo) =>
      archivo.type.startsWith(tipo),
    );

    if (!tipoValido) {
      mostrarToast(
        "Error al cargar IMG",
        `Archivo "${archivo.name}" no es un tipo de archivo válido`,
        "error",
        5000,
      );
      return;
    }

    if (archivo.size > this.maxTamano) {
      mostrarToast(
        "Error al cargar IMG",
        `Archivo "${archivo.name}" excede ${this.maxTamano / 1024 / 1024}MB`,
        "error",
        5000,
      );
      return;
    }

    this.archivoValido = archivo;
    this.crearPrivaluacion(archivo);
  }

  crearPrivaluacion(archivo) {
    const render = new FileReader();

    render.onload = (evento) => {
      const contendorPriew = this.vistaPrev.querySelector("img");

      contendorPriew.src = evento.target.result;
    };

    render.readAsDataURL(archivo);
  }

  archivoObtnido() {
    console.log(this.archivoValido);
    return this.archivoValido;
  }
}
