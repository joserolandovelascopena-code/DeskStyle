import { supabase } from "../../../db/supabase.js";

const request = {
  async obtenerPerfil() {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error al obtener la sesión:", sessionError.message);
      return null;
    }

    const user = sessionData?.session?.user;

    if (!user) {
      console.warn("No hay una sesión activa.");
      return null;
    }

    const { data, error } = await supabase
      .from("perfil")
      .select("*")
      .eq("id_auth", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error al cargar el perfil:", error.message);
      return null;
    }

    return data;
  },

  async cargarUsuarios() {
    const { data, error } = await supabase
      .from("perfil")
      .select("id_perfil, nombre, correo, telefono, rol, url_img, creado")
      .order("creado", { ascending: false })
      .order("id_perfil", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async cargarCategorias() {
    const { data: categoriaData, error: categoriaError } = await supabase
      .from("categorias")
      .select("*");

    if (categoriaError) {
      throw new Error(categoriaError.message);
    }

    return categoriaData;
  },

  async cargarListaCategorias() {
    const { data: categoriaData, error: categoriaError } = await supabase
      .from("categorias")
      .select("*")
      .order("actualizado", { ascending: false });

    if (categoriaError) {
      throw new Error(categoriaError.message);
    }

    const listaCategorias = categoriaData.map((categoria) => {
      const { data } = supabase.storage
        .from("categorias")
        .getPublicUrl(categoria.url_image);

      const versionImagen = new Date(categoria.actualizado).getTime();

      return {
        ...categoria,
        publicUrl: `${data.publicUrl}?v=${versionImagen}`,
      };
    });

    return listaCategorias;
  },

  async nuevaCategoria(nuevaCategoria) {
    const { data: categoria, error: categoriaError } = await supabase
      .from("categorias")
      .insert({
        nombre: nuevaCategoria.nombre,
        descripcion: nuevaCategoria.descripcion,
      })
      .select("id_categoria")
      .single();

    if (categoriaError) {
      throw new Error(categoriaError.message);
    }

    const extension = nuevaCategoria.imagen.name.split(".").pop();

    const rutaImagen = `${categoria.id_categoria}/imagen.${extension}`;

    const { error: storageError } = await supabase.storage
      .from("categorias")
      .upload(rutaImagen, nuevaCategoria.imagen, {
        upsert: true,
        contentType: nuevaCategoria.imagen.type,
      });

    if (storageError) {
      throw new Error(storageError.message);
    }

    const { error: actualizarError } = await supabase
      .from("categorias")
      .update({
        url_image: rutaImagen,
      })
      .eq("id_categoria", categoria.id_categoria);

    if (actualizarError) {
      throw new Error(actualizarError.message);
    }

    return categoria;
  },

  async nuevoProducto(nuevoProducto) {
    const { data: producto, error: productoError } = await supabase
      .from("productos")
      .insert({
        id_categoria: nuevoProducto.categoria,
        nombre: nuevoProducto.titulo,
        precio: nuevoProducto.precio,
        precio_original: nuevoProducto.orginalPrecio,
        marca: nuevoProducto.marca,
        descripcion: nuevoProducto.descrip,
        stock: nuevoProducto.stock,
      })
      .select("id_producto")
      .single();

    if (productoError) {
      throw new Error(productoError.message);
    }

    // Crear ruta única
    const extension = nuevoProducto.imagen.name.split(".").pop();
    const rutaImagen = `${producto.id_producto}/imagen.${extension}`;

    // Subir imagen
    const { error: storageError } = await supabase.storage
      .from("productos")
      .upload(rutaImagen, nuevoProducto.imagen, {
        upsert: true,
        contentType: nuevoProducto.imagen.type,
      });

    if (storageError) {
      throw new Error(storageError.message);
    }

    // Guardar referencia
    const { error: modificarError } = await supabase
      .from("productos")
      .update({
        url_img_product: rutaImagen,
      })
      .eq("id_producto", producto.id_producto);

    if (modificarError) {
      throw new Error(modificarError.message);
    }

    const { error: detallesError } = await supabase
      .from("producto_detalle")
      .insert({
        id_producto: producto.id_producto,
        peso: nuevoProducto.peso,
        material: nuevoProducto.material,
        largo: nuevoProducto.largo,
        alto: nuevoProducto.alto,
        ancho: nuevoProducto.ancho,
        estadoproduct: nuevoProducto.estado,
      });

    if (detallesError) {
      throw new Error(detallesError.message);
    }
  },

  async cargarListaProductos() {
    const { data: productos, error: productosError } = await supabase
      .from("productos")
      .select(
        `
    *,
    categoria:categorias!inner(id_categoria, nombre),
    detalle:producto_detalle!inner(
      peso, 
      material, 
      largo, 
      alto, 
      ancho, 
      estadoproduct
    )
    `,
      );

    if (productosError) {
      throw new Error(productosError.message);
    }

    const listaProductos = productos.map((producto) => {
      const { data } = supabase.storage
        .from("productos")
        .getPublicUrl(producto.url_img_product);

      return {
        ...producto,
        publicUrl: `${data.publicUrl}?v=${producto.actualizado}`,
      };
    });

    return listaProductos;
  },

  async remunProductosList() {
    const { data: productos, error: productosError } = await supabase
      .from("productos")
      .select(
        `
    *,
    categoria:categorias!inner(id_categoria, nombre),
    detalle:producto_detalle!inner(
      peso, 
      material, 
      largo, 
      alto, 
      ancho, 
      estadoproduct
    )
    `,
      )
      .limit(5);

    if (productosError) {
      throw new Error(productosError.message);
    }

    const listaProductos = productos.map((producto) => {
      const { data } = supabase.storage
        .from("productos")
        .getPublicUrl(producto.url_img_product);

      return {
        ...producto,
        publicUrl: `${data.publicUrl}?v=${producto.actualizado}`,
      };
    });

    return listaProductos;
  },

  async cargarResumen() {
    const { count: productosTotal, error: totalError } = await supabase
      .from("productos")
      .select("*", { count: "exact", head: true });

    if (totalError) {
      throw new Error(totalError.message);
    }

    const { count: usuariosTotal, error: usuariosError } = await supabase
      .from("perfil")
      .select("*", { count: "exact", head: true });

    if (usuariosError) {
      throw new Error(usuariosError.message);
    }

    const { data: inventarioTotal, error: inventarioTotalError } =
      await supabase.rpc("total_inventario");

    if (inventarioTotalError) {
      throw new Error(inventarioTotalError.message);
    }

    const resumenDashboard = {
      total_product: productosTotal,
      total_inventario: inventarioTotal,
      total_usuarios: usuariosTotal,
    };

    return resumenDashboard;
  },

  async editarCategoria(idCategoria, cambiosCategoria) {
    const { data: categoria, error: categoriaError } = await supabase
      .from("categorias")
      .update({
        nombre: cambiosCategoria.nombre,
        descripcion: cambiosCategoria.descripcion || "Sin descripción.",
      })
      .eq("id_categoria", idCategoria)
      .select("id_categoria, url_image")
      .single();

    if (categoriaError) {
      throw new Error(categoriaError.message);
    }

    if (!cambiosCategoria.imgNueva) {
      return categoria;
    }

    console.log("Imagen nueva:", cambiosCategoria.imgNueva);
    console.log("Ruta actual:", categoria.url_image);

    const { error: storageError } = await supabase.storage
      .from("categorias")
      .upload(categoria.url_image, cambiosCategoria.imgNueva, {
        cacheControl: "0",
        upsert: true,
        contentType: cambiosCategoria.imgNueva.type,
      });

    if (storageError) {
      throw new Error(storageError.message);
    }

    console.log("Imagen reemplazada correctamente.");

    return categoria;
  },

  async eliminarCategoria(idCategoria) {
    // 1. Obtener la información de la categoría
    const { data: categoria, error: consultaError } = await supabase
      .from("categorias")
      .select("id_categoria, url_image")
      .eq("id_categoria", idCategoria)
      .single();

    if (consultaError) {
      throw new Error(consultaError.message);
    }

    const { error: categoriaError } = await supabase
      .from("categorias")
      .delete()
      .eq("id_categoria", idCategoria);

    if (categoriaError) {
      throw new Error(categoriaError.message);
    }

    if (categoria.url_image) {
      const { error: storageError } = await supabase.storage
        .from("categorias")
        .remove([categoria.url_image]);

      if (storageError) {
        throw new Error(storageError.message);
      }
    }

    return true;
  },

  async editarProduct(idProducto, cambiosProducto) {
    const { data: producto, error: productoError } = await supabase
      .from("productos")
      .update({
        id_categoria: cambiosProducto.categoria,
        nombre: cambiosProducto.titulo,
        precio: cambiosProducto.precio,
        precio_original: cambiosProducto.orginalPrecio,
        marca: cambiosProducto.marca,
        descripcion: cambiosProducto.descrip,
        stock: cambiosProducto.stock || 1,
      })
      .eq("id_producto", idProducto)
      .select("id_producto, url_img_product")
      .single();

    if (productoError) {
      throw new Error(productoError.message);
    }

    const { error: detalleError } = await supabase
      .from("producto_detalle")
      .update({
        peso: cambiosProducto.peso,
        material: cambiosProducto.material,
        largo: cambiosProducto.largo,
        alto: cambiosProducto.alto,
        ancho: cambiosProducto.ancho,
        estadoproduct: cambiosProducto.estado,
      })
      .eq("id_producto", idProducto);

    if (detalleError) {
      throw new Error(detalleError.message);
    }
    if (cambiosProducto.imgNueva) {
      if (!producto.url_img_product) {
        throw new Error("El producto no tiene una ruta de imagen registrada.");
      }

      const { error: storageError } = await supabase.storage
        .from("productos")
        .upload(producto.url_img_product, cambiosProducto.imgNueva, {
          cacheControl: "31536000",
          upsert: true,
          contentType: cambiosProducto.imgNueva.type,
        });

      if (storageError) {
        throw new Error(storageError.message);
      }

      const { error: versionError } = await supabase
        .from("productos")
        .update({
          actualizado: new Date().toISOString(),
        })
        .eq("id_producto", idProducto);

      if (versionError) {
        throw new Error(versionError.message);
      }
    }

    return producto;
  },

  async eliminarProducto(idProducto) {
    const { data: producto, error: consultaError } = await supabase
      .from("productos")
      .select("id_producto, url_img_product")
      .eq("id_producto", idProducto)
      .single();

    if (consultaError) {
      throw new Error(consultaError.message);
    }

    const { error: detalleError } = await supabase
      .from("producto_detalle")
      .delete()
      .eq("id_producto", idProducto);

    if (detalleError) {
      throw new Error(detalleError.message);
    }

    const { error: productoError } = await supabase
      .from("productos")
      .delete()
      .eq("id_producto", idProducto);

    if (productoError) {
      throw new Error(productoError.message);
    }

    if (producto.url_img_product) {
      const { error: storageError } = await supabase.storage
        .from("productos")
        .remove([producto.url_img_product]);

      if (storageError) {
        throw new Error(storageError.message);
      }
    }

    return true;
  },
};

export { request };
