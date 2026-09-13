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
};

export { request };
