var agrgando = false;
function agregarProduct(
  titulo,
  precio,
  marca,
  orginalPrecio,
  id,
  descrip,
  stock,
  peso,
  material,
  largo,
  ancho,
  alto,
  categoria,
  estado,
) {
  agrgando = true;
  console.log(`Categoría: ${categoria}`);
  console.log(`Estado: ${estado}`);
}

export { agregarProduct };
