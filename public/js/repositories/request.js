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
      .select("*");

    if (categoriaError) {
      throw new Error(categoriaError.message);
    }

    const listaCategorias = categoriaData.map((categoria) => {
      const { data } = supabase.storage
        .from("categorias")
        .getPublicUrl(categoria.url_image);

      return {
        ...categoria,
        publicUrl: data.publicUrl,
      };
    });

    return listaCategorias;
  },

  async nuevaCategoria(nuevaCategoria) {
    // Crear categoría
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

    // Crear ruta única
    const extension = nuevaCategoria.imagen.name.split(".").pop();

    const rutaImagen = `${categoria.id_categoria}/imagen.${extension}`;

    // Subir imagen
    const { error: storageError } = await supabase.storage
      .from("categorias")
      .upload(rutaImagen, nuevaCategoria.imagen, {
        upsert: true,
        contentType: nuevaCategoria.imagen.type,
      });

    if (storageError) {
      throw new Error(storageError.message);
    }

    // Guardar referencia
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
};

export { request };
