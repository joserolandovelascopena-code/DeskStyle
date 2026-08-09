function seleccionarIcono(tipo) {
  const iconos = {
    suceso: "check_circle",
    error: "cancel",
    aviso: "warning",
    info: "info",
  };

  return iconos[tipo] || iconos.info;
}

function eliminarToast(toast) {
  if (toast.classList.contains("saliendo")) return;
  toast.classList.add("saliendo");
  setTimeout(() => {
    toast.remove();
  }, 300);
}

function mostrarToast(titulo, mensaje, tipo = "info", duracion = 4000) {
  const contenedorToast = document.getElementById("toast_contenedor");
  if (!contenedorToast) return;

  const icono = seleccionarIcono(tipo);
  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;

  toast.innerHTML = `
    <div class="infoToast">
      <div class="icono_Toast">
        <div>
          <span class="material-symbols-outlined icono_span">
            ${icono}
          </span>
        </div>
      </div>
      <div class="text_toast">
        <h5 class="tituloToast">${titulo}</h5>
        <p class="descripcionToast">${mensaje}</p>
      </div>
    </div>
    <button class="cerrarToast">
      <span class="material-symbols-outlined">close_small</span>
    </button>
  `;

  contenedorToast.appendChild(toast);

  const temporizador = setTimeout(() => {
    eliminarToast(toast);
  }, duracion);

  toast.querySelector(".cerrarToast").addEventListener("click", () => {
    clearTimeout(temporizador);
    eliminarToast(toast);
  });
}

export { mostrarToast };
