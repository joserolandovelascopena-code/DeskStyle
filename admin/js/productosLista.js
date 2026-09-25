import { crearListProductos } from "./utils/crearHTML.js";

const TAMANO_PAGINA = 10;
const lista = {
  datos: [], pagina: 1, busqueda: "", categoria: "", estado: "", stock: "",
  fecha: "", orden: "recientes", tamano: TAMANO_PAGINA, inicializada: false,
};

const normalizar = (valor) => String(valor ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim()
  .toLocaleLowerCase();
const detalleDe = (producto) => Array.isArray(producto?.detalle) ? producto.detalle[0] : producto?.detalle;
const categoriaDe = (producto) => (Array.isArray(producto?.categoria) ? producto.categoria[0] : producto?.categoria)?.nombre || "Sin categoría";
const estadoDe = (producto) => normalizar(detalleDe(producto)?.estadoproduct || "borrador");
const fechaDe = (producto) => {
  const fecha = new Date(producto?.creado || producto?.created_at || producto?.fecha_creacion || NaN);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};
const opcionesOrden = [
  ["recientes", "Fecha: más recientes", "schedule"],
  ["antiguos", "Fecha: más antiguos", "history"],
  ["nombre", "Nombre: A a Z", "sort_by_alpha"],
  ["nombre-desc", "Nombre: Z a A", "sort_by_alpha"],
  ["precio", "Precio: menor a mayor", "south"],
  ["precio-desc", "Precio: mayor a menor", "north"],
  ["stock", "Stock: mayor a menor", "inventory_2"],
  ["stock-asc", "Stock: menor a mayor", "inventory"],
];

function cerrarMenuOrden(boton, menu) {
  menu.hidden = true;
  boton.setAttribute("aria-expanded", "false");
}

function prepararControles() {
  const caja = document.querySelector(".conedor_tabla_products");
  const acciones = caja?.querySelector(".acciones_manipulacionList");
  const pie = caja?.querySelector(".tabla_listProduct tfoot");
  const buscar = acciones?.querySelector('input[type="search"]');
  if (!caja || !acciones || !pie || !buscar) return false;

  let filtros = caja.querySelector(".filtros-lista-productos");
  if (!filtros) {
    filtros = document.createElement("div");
    filtros.className = "filtros-lista-productos";
    filtros.innerHTML = `
      <label>Categoría<select data-filtro="categoria"><option value="">Todas</option></select></label>
      <label>Estado<select data-filtro="estado"><option value="">Todos</option><option value="activo">Activo</option><option value="inactivo">Inactivo</option><option value="borrador">Borrador</option></select></label>
      <label>Stock<select data-filtro="stock"><option value="">Cualquier stock</option><option value="disponible">Disponible</option><option value="bajo">Stock bajo (1–5)</option><option value="agotado">Agotado</option></select></label>
      <label>Fecha<select data-filtro="fecha"><option value="">Cualquier fecha</option><option value="7">Últimos 7 días</option><option value="30">Últimos 30 días</option><option value="90">Últimos 90 días</option></select></label>
      <label>Por página<select data-filtro="tamano"><option value="10">10 por página</option><option value="20">20 por página</option></select></label>`;
    acciones.insertAdjacentElement("afterend", filtros);
  }

  if (!lista.inicializada) {
    lista.inicializada = true;
    buscar.setAttribute("aria-label", "Buscar por nombre, código, categoría o marca");
    const botonOrden = acciones.querySelector(".ordenarProductos");
    if (botonOrden) {
      botonOrden.setAttribute("aria-haspopup", "menu");
      botonOrden.setAttribute("aria-expanded", "false");
      const menuOrden = document.createElement("div");
      menuOrden.className = "menu-orden-productos";
      menuOrden.setAttribute("role", "menu");
      menuOrden.setAttribute("aria-label", "Ordenar productos");
      menuOrden.hidden = true;
      opcionesOrden.forEach(([valor, etiqueta, icono]) => {
        const opcion = document.createElement("button");
        opcion.type = "button";
        opcion.className = "opcion-orden-productos";
        opcion.dataset.orden = valor;
        opcion.setAttribute("role", "menuitemradio");
        opcion.setAttribute("aria-checked", String(lista.orden === valor));
        opcion.innerHTML = `<span class="material-symbols-outlined">${icono}</span><span>${etiqueta}</span><span class="material-symbols-outlined marca-orden-productos">check</span>`;
        menuOrden.append(opcion);
      });
      acciones.append(menuOrden);
      botonOrden.addEventListener("click", () => {
        menuOrden.hidden = !menuOrden.hidden;
        botonOrden.setAttribute("aria-expanded", String(!menuOrden.hidden));
        if (!menuOrden.hidden) menuOrden.querySelector(`[data-orden="${lista.orden}"]`)?.focus();
      });
      menuOrden.addEventListener("click", (evento) => {
        const opcion = evento.target.closest("[data-orden]");
        if (!opcion) return;
        lista.orden = opcion.dataset.orden;
        menuOrden.querySelectorAll("[data-orden]").forEach((elemento) => {
          elemento.setAttribute("aria-checked", String(elemento === opcion));
        });
        cerrarMenuOrden(botonOrden, menuOrden);
        botonOrden.focus();
        renderizar();
      });
      document.addEventListener("click", (evento) => {
        if (!menuOrden.contains(evento.target) && !botonOrden.contains(evento.target) && !menuOrden.hidden) {
          cerrarMenuOrden(botonOrden, menuOrden);
        }
      });
      document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !menuOrden.hidden) {
          cerrarMenuOrden(botonOrden, menuOrden);
          botonOrden.focus();
        }
      });
    }
    buscar.addEventListener("input", () => {
      lista.busqueda = normalizar(buscar.value);
      lista.pagina = 1;
      renderizar();
    });
    filtros.addEventListener("change", (evento) => {
      const control = evento.target.closest("[data-filtro]");
      if (!control) return;
      if (control.dataset.filtro === "tamano") lista.tamano = Number(control.value) || TAMANO_PAGINA;
      else lista[control.dataset.filtro] = control.value;
      lista.pagina = 1;
      renderizar();
    });
    pie.addEventListener("click", (evento) => {
      const boton = evento.target.closest("button[data-pagina]");
      if (boton && !boton.disabled) {
        lista.pagina = Number(boton.dataset.pagina);
        renderizar();
      }
    });
  }
  return true;
}

function obtenerResultados() {
  const ahora = Date.now();
  const resultados = lista.datos.filter((producto) => {
    const stock = Number(producto?.stock) || 0;
    const texto = [producto?.nombre, producto?.id_producto, producto?.marca, producto?.descripcion, categoriaDe(producto)].map(normalizar).join(" ");
    if (lista.busqueda && !texto.includes(lista.busqueda)) return false;
    if (lista.categoria && normalizar(categoriaDe(producto)) !== lista.categoria) return false;
    if (lista.estado && estadoDe(producto) !== lista.estado) return false;
    if (lista.stock === "disponible" && stock <= 5) return false;
    if (lista.stock === "bajo" && (stock < 1 || stock > 5)) return false;
    if (lista.stock === "agotado" && stock > 0) return false;
    if (lista.fecha) {
      const fecha = fechaDe(producto);
      if (!fecha || fecha.getTime() < ahora - Number(lista.fecha) * 86400000) return false;
    }
    return true;
  });

  const tiempo = (producto) => fechaDe(producto)?.getTime() || 0;
  return resultados.sort((a, b) => {
    if (lista.orden === "antiguos") return tiempo(a) - tiempo(b);
    if (lista.orden === "nombre") return normalizar(a.nombre).localeCompare(normalizar(b.nombre));
    if (lista.orden === "nombre-desc") return normalizar(b.nombre).localeCompare(normalizar(a.nombre));
    if (lista.orden === "precio") return (Number(a.precio) || 0) - (Number(b.precio) || 0);
    if (lista.orden === "precio-desc") return (Number(b.precio) || 0) - (Number(a.precio) || 0);
    if (lista.orden === "stock") return (Number(b.stock) || 0) - (Number(a.stock) || 0);
    if (lista.orden === "stock-asc") return (Number(a.stock) || 0) - (Number(b.stock) || 0);
    return tiempo(b) - tiempo(a);
  });
}

function renderizar() {
  const cuerpo = document.querySelector(".list_productos");
  const textoPie = document.querySelector(".tabla_listProduct tfoot p");
  const controles = document.querySelector(".btn_mover_pagina_productos");
  if (!cuerpo || !textoPie || !controles) return;

  const resultados = obtenerResultados();
  const totalPaginas = Math.ceil(resultados.length / lista.tamano);
  lista.pagina = Math.min(Math.max(lista.pagina, 1), Math.max(totalPaginas, 1));
  const desde = (lista.pagina - 1) * lista.tamano;
  const visibles = resultados.slice(desde, desde + lista.tamano);

  if (!lista.datos.length || !resultados.length) {
    const vacio = lista.datos.length === 0;
    cuerpo.innerHTML = `<tr class="fila-vacia-productos"><td colspan="7"><div class="estado-vacio-productos"><span class="material-symbols-outlined">${vacio ? "inventory_2" : "search_off"}</span><h3>${vacio ? "Aún no hay productos" : "No encontramos productos"}</h3><p>${vacio ? "Cuando agregues productos a tu tienda, aparecerán aquí para que puedas gestionarlos." : "Prueba con otra búsqueda o cambia los filtros para ver más resultados."}</p>${vacio ? "" : '<button type="button" class="limpiar-filtros-productos">Limpiar filtros</button>'}</div></td></tr>`;
    cuerpo.querySelector(".limpiar-filtros-productos")?.addEventListener("click", () => {
      lista.busqueda = lista.categoria = lista.estado = lista.stock = lista.fecha = "";
      lista.pagina = 1;
      document.querySelector('.inputProductosBuscar input').value = "";
      document.querySelectorAll(".filtros-lista-productos select").forEach((select) => {
        select.value = select.dataset.filtro === "tamano" ? String(lista.tamano) : "";
      });
      renderizar();
    });
  } else {
    crearListProductos(".list_productos", visibles);
  }

  textoPie.textContent = resultados.length
    ? `Mostrando ${desde + 1}–${Math.min(desde + lista.tamano, resultados.length)} de ${resultados.length} productos`
    : `0 de ${lista.datos.length} productos`;
  const anterior = controles.querySelector(".atrasProductos");
  const siguiente = controles.querySelector(".sguienteProductos");
  controles.hidden = totalPaginas <= 1;
  controles.querySelectorAll(".numero-pagina-productos").forEach((boton) => boton.remove());
  if (totalPaginas > 1) {
    const primera = Math.max(1, lista.pagina - 2);
    for (let pagina = primera; pagina <= Math.min(totalPaginas, primera + 4); pagina += 1) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = `numero-pagina-productos${pagina === lista.pagina ? " activa" : ""}`;
      boton.dataset.pagina = String(pagina);
      boton.textContent = String(pagina);
      boton.setAttribute("aria-label", `Ir a la página ${pagina}`);
      if (pagina === lista.pagina) boton.setAttribute("aria-current", "page");
      controles.insertBefore(boton, siguiente);
    }
  }
  anterior.disabled = lista.pagina <= 1 || totalPaginas <= 1;
  siguiente.disabled = lista.pagina >= totalPaginas || totalPaginas <= 1;
  anterior.dataset.pagina = String(Math.max(1, lista.pagina - 1));
  siguiente.dataset.pagina = String(Math.min(totalPaginas || 1, lista.pagina + 1));
}

export function actualizarListaProductos(productos) {
  lista.datos = Array.isArray(productos) ? productos : [];
  if (!prepararControles()) return;
  const select = document.querySelector('.filtros-lista-productos [data-filtro="categoria"]');
  const seleccion = lista.categoria;
  const categorias = [...new Set(lista.datos.map(categoriaDe).filter((categoria) => categoria !== "Sin categoría"))].sort((a, b) => a.localeCompare(b));
  if (seleccion && !categorias.some((categoria) => normalizar(categoria) === seleccion)) {
    lista.categoria = "";
  }
  select.innerHTML = '<option value="">Todas</option>';
  categorias.forEach((nombre) => {
    const opcion = document.createElement("option");
    opcion.value = normalizar(nombre);
    opcion.textContent = nombre;
    select.append(opcion);
  });
  select.value = lista.categoria;
  renderizar();
}
