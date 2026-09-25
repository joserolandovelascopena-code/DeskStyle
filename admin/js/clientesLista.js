const lista = {
  datos: [],
  pagina: 1,
  consulta: "",
  rol: "",
  tamano: 10,
  inicializada: false,
};

const normalizar = (valor) =>
  String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase();

function inicializar() {
  if (lista.inicializada) return true;
  const busqueda = document.querySelector(".buscar_lista_clientes");
  const filtroRol = document.querySelector(".filtro_lista_rol_clientes");
  const tamano = document.querySelector(".tamano_clientes");
  const tabla = document.querySelector(".tabla_clientes");
  if (!busqueda || !filtroRol || !tamano || !tabla) return false;

  lista.inicializada = true;
  busqueda.addEventListener("input", () => {
    lista.consulta = normalizar(busqueda.value);
    lista.pagina = 1;
    renderizar();
  });
  filtroRol.addEventListener("change", () => {
    lista.rol = filtroRol.value;
    lista.pagina = 1;
    renderizar();
  });
  tamano.addEventListener("change", () => {
    lista.tamano = Number(tamano.value) === 20 ? 20 : 10;
    lista.pagina = 1;
    renderizar();
  });
  tabla.querySelector("tfoot").addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-pagina]");
    if (boton && !boton.disabled) {
      lista.pagina = Number(boton.dataset.pagina);
      renderizar();
    }
  });
  return true;
}

function crearCelda(texto, clase = "") {
  const celda = document.createElement("td");
  if (clase) celda.className = clase;
  celda.textContent = texto || "—";
  return celda;
}

function crearFila(usuario, indice) {
  const fila = document.createElement("tr");
  fila.className = `fila_cliente${indice % 2 ? " fila_cliente_alterna" : ""}`;
  const celdaUsuario = document.createElement("td");
  const identidad = document.createElement("div");
  identidad.className = "identidad_cliente";
  const nombre = String(usuario.nombre || "Usuario sin nombre").trim();
  const avatar = document.createElement("div");
  avatar.className = "avatar_cliente";
  const urlImagen = String(usuario.url_img || "").trim();
  if (/^(https?:\/\/|\/(?!\/)|\.\/|\.\.\/)/i.test(urlImagen)) {
    const imagen = document.createElement("img");
    imagen.src = urlImagen;
    imagen.alt = "";
    imagen.loading = "lazy";
    imagen.onerror = () => {
      const inicial = document.createElement("span");
      inicial.textContent = nombre.charAt(0).toLocaleUpperCase() || "U";
      avatar.replaceChildren(inicial);
    };
    avatar.append(imagen);
  } else {
    const inicial = document.createElement("span");
    inicial.textContent = nombre.charAt(0).toLocaleUpperCase() || "U";
    avatar.append(inicial);
  }
  const datosNombre = document.createElement("div");
  datosNombre.className = "datos_identidad_cliente";
  const titulo = document.createElement("strong");
  titulo.textContent = nombre;
  const id = document.createElement("small");
  id.textContent = `Perfil #${usuario.id_perfil ?? "—"}`;
  datosNombre.append(titulo, id);
  identidad.append(avatar, datosNombre);
  celdaUsuario.append(identidad);
  fila.append(celdaUsuario);
  fila.append(crearCelda(usuario.correo));
  fila.append(crearCelda(usuario.telefono));

  const rol = String(usuario.rol || "user");
  const celdaRol = document.createElement("td");
  const insignia = document.createElement("span");
  insignia.className = `insignia_rol_cliente${normalizar(rol) === "admin" ? " admin" : ""}`;
  insignia.textContent = rol.charAt(0).toLocaleUpperCase() + rol.slice(1);
  celdaRol.append(insignia);
  fila.append(celdaRol);

  const fecha = usuario.creado ? new Date(`${usuario.creado}T00:00:00`) : null;
  const fechaTexto =
    fecha && !Number.isNaN(fecha.getTime())
      ? new Intl.DateTimeFormat("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(fecha)
      : "—";
  fila.append(crearCelda(fechaTexto));
  return fila;
}

function mostrarVacio(tipo) {
  const cuerpo = document.querySelector(".lista_clientes");
  if (!cuerpo) return;
  const estados = {
    vacio: [
      "group_off",
      "Aún no hay usuarios",
      "Cuando se registren perfiles en tu sistema, aparecerán aquí.",
    ],
    sinCoincidencias: [
      "search_off",
      "No encontramos usuarios",
      "Prueba con otro término o selecciona otro rol.",
    ],
    cargando: [
      "progress_activity",
      "Cargando usuarios",
      "Estamos obteniendo los perfiles registrados.",
    ],
    error: [
      "cloud_off",
      "No se pudieron cargar los usuarios",
      "Comprueba la conexión y vuelve a abrir esta sección.",
    ],
  };
  const [icono, titulo, descripcion] = estados[tipo] || estados.vacio;
  cuerpo.replaceChildren();
  const fila = document.createElement("tr");
  fila.className = "fila_estado_clientes";
  const celda = document.createElement("td");
  celda.colSpan = 5;
  const panel = document.createElement("div");
  panel.className = "estado_vacio_clientes";
  const simbolo = document.createElement("span");
  simbolo.className = `material-symbols-outlined${tipo === "cargando" ? " cargando" : ""}`;
  simbolo.textContent = icono;
  const encabezado = document.createElement("h3");
  encabezado.textContent = titulo;
  const texto = document.createElement("p");
  texto.textContent = descripcion;
  panel.append(simbolo, encabezado, texto);
  celda.append(panel);
  fila.append(celda);
  cuerpo.append(fila);
}

function renderizar() {
  const cuerpo = document.querySelector(".lista_clientes");
  const total = document.querySelector(".total_lista_clientes");
  const resumen = document.querySelector(".resumen_paginacion_clientes");
  const controles = document.querySelector(".controles_pagina_clientes");
  const filtroRol = document.querySelector(".filtro_lista_rol_clientes");
  if (!cuerpo || !total || !resumen || !controles || !filtroRol) return;

  total.textContent = String(lista.datos.length);
  const roles = [
    ...new Set(lista.datos.map((usuario) => String(usuario.rol || "user"))),
  ].sort((a, b) => a.localeCompare(b));
  const rolActual = lista.rol;
  filtroRol.replaceChildren(new Option("Todos los roles", ""));
  roles.forEach((rol) =>
    filtroRol.add(
      new Option(rol.charAt(0).toLocaleUpperCase() + rol.slice(1), rol),
    ),
  );
  if (roles.includes(rolActual)) filtroRol.value = rolActual;
  else lista.rol = "";

  const coincidencias = lista.datos.filter((usuario) => {
    const texto = [
      usuario.nombre,
      usuario.correo,
      usuario.telefono,
      usuario.rol,
      usuario.id_perfil,
    ]
      .map(normalizar)
      .join(" ");
    return (
      (!lista.consulta || texto.includes(lista.consulta)) &&
      (!lista.rol || String(usuario.rol || "user") === lista.rol)
    );
  });
  const paginas = Math.ceil(coincidencias.length / lista.tamano);
  lista.pagina = Math.min(Math.max(lista.pagina, 1), Math.max(paginas, 1));
  const desde = (lista.pagina - 1) * lista.tamano;
  cuerpo.replaceChildren();

  if (!lista.datos.length) mostrarVacio("vacio");
  else if (!coincidencias.length) mostrarVacio("sinCoincidencias");
  else
    coincidencias
      .slice(desde, desde + lista.tamano)
      .forEach((usuario, indice) => cuerpo.append(crearFila(usuario, indice)));

  if (coincidencias.length)
    resumen.textContent = `Mostrando ${desde + 1}–${Math.min(desde + lista.tamano, coincidencias.length)} de ${coincidencias.length} usuarios`;
  else
    resumen.textContent = lista.datos.length
      ? `0 de ${lista.datos.length} usuarios`
      : "0 perfiles registrados";
  controles.replaceChildren();
  controles.hidden = paginas <= 1;
  if (paginas <= 1) return;

  const agregarBoton = (etiqueta, pagina, clase = "") => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = `boton_pagina_cliente ${clase}`;
    boton.dataset.pagina = String(pagina);
    boton.textContent = etiqueta;
    boton.disabled = pagina < 1 || pagina > paginas;
    controles.append(boton);
    return boton;
  };
  agregarBoton("‹", lista.pagina - 1, "flecha").setAttribute(
    "aria-label",
    "Página anterior",
  );
  const primera = Math.max(1, lista.pagina - 2);
  for (
    let pagina = primera;
    pagina <= Math.min(paginas, primera + 4);
    pagina += 1
  ) {
    const boton = agregarBoton(
      String(pagina),
      pagina,
      pagina === lista.pagina ? "activa" : "",
    );
    if (pagina === lista.pagina) boton.setAttribute("aria-current", "page");
    boton.setAttribute("aria-label", `Ir a la página ${pagina}`);
  }
  agregarBoton("›", lista.pagina + 1, "flecha").setAttribute(
    "aria-label",
    "Página siguiente",
  );
}

export function mostrarEstadoClientes(tipo) {
  if (!inicializar()) return;
  mostrarVacio(tipo);
  const controles = document.querySelector(".controles_pagina_clientes");
  if (controles) controles.hidden = true;
  const resumen = document.querySelector(".resumen_paginacion_clientes");
  if (resumen)
    resumen.textContent =
      tipo === "cargando"
        ? "Cargando perfiles…"
        : "No se pudieron obtener los perfiles";
}

export function actualizarListaClientes(usuarios) {
  if (!inicializar()) return;
  lista.datos = Array.isArray(usuarios) ? usuarios : [];
  renderizar();
}
