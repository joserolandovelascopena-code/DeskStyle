function seleccionarIcono(tipo) {
  const iconos = {
    exito: "check_circle",
    error: "cancel",
    aviso: "warning",
    info: "info",
  };

  return iconos[tipo] || iconos.info;
}

function eliminarToast(toast) {
  if (!toast || toast.classList.contains("saliendo")) return;

  toast.classList.add("saliendo");

  setTimeout(() => {
    toast.remove();
  }, 260);
}

function mostrarToast(titulo, mensaje, tipo = "info", duracion = 4000) {
  const contenedorToast = document.getElementById("toast_contenedor");

  if (!contenedorToast) return null;

  const esLoader = tipo === "loader";
  const icono = seleccionarIcono(tipo);

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;

  toast.innerHTML = `
    <div class="infoToast">

      <div class="icono_Toast">
        ${
          esLoader
            ? `<div class="spinner_toast"></div>`
            : `
              <span class="material-symbols-outlined icono_span">
                ${icono}
              </span>
            `
        }
      </div>

      <div class="text_toast">
        <h5 class="tituloToast">${titulo}</h5>
        <p class="descripcionToast">${mensaje}</p>
      </div>

    </div>

    <button class="cerrarToast">
      <span class="material-symbols-outlined">
        close_small
      </span>
    </button>
  `;

  contenedorToast.appendChild(toast);

  let temporizador = null;

  if (!esLoader && duracion > 0) {
    temporizador = setTimeout(() => {
      eliminarToast(toast);
    }, duracion);
  }

  toast.querySelector(".cerrarToast").addEventListener("click", () => {
    if (temporizador) {
      clearTimeout(temporizador);
    }

    eliminarToast(toast);
  });

  return toast;
}

function ocultarToast(toast) {
  if (!toast) return;

  eliminarToast(toast);
}

export { mostrarToast, ocultarToast };
