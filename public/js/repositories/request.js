import { supabase } from "../../../db/supabase.js";

const request = {
  async obtenerPerfil() {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (sessionError || !userId) {
      console.error("No hay sesión activa o hubo un error");
      return null;
    }

    const { data, error } = await supabase
      .from("perfil")
      .select("*")
      .eq("id_auth", userId)
      .maybeSingle();

    if (error) {
      console.error("Error al cargar el perfil:", error.message);
      return null;
    }

    console.log(data);

    return data;
  },
};

export { request };
