//SIGN UP

import { supabase } from "./supabase.js";

export async function signup(fullName, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "https://joserolandovelascopena-code.github.io/DeskStyle/public/pages/auth/verify.html",
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    if (error.message.includes("Email not confirmed")) {
      throw new Error(
        "Debes confirmar tu correo electrónico antes de ingresar.",
      );
    }
    if (error.message.includes("Too many requests")) {
      throw new Error("Demasiados intentos fallidos. Intenta más tarde.");
    }

    throw new Error("Ocurrió un error al iniciar sesión. Inténtalo de nuevo.");
  }

  const user = data.user;

  const { data: perfil, error: perfilError } = await supabase
    .from("perfil")
    .select("id_perfil")
    .eq("id_auth", user.id)
    .maybeSingle();

  if (perfilError) {
    console.error("Error al consultar perfil:", perfilError.message);
  }

  if (!perfil) {
    const nombreUsuario =
      user.user_metadata?.fullName ||
      user.user_metadata?.full_name ||
      user.email.split("@")[0];

    const { error: insertError } = await supabase.from("perfil").insert({
      id_auth: user.id,
      nombre: nombreUsuario,
      correo: user.email,
    });
  }

  return data;
}

export async function authWithGoogle() {
  const redirectTo = new URL("../index.html", import.meta.url).href;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) throw error;
}

export async function recoverPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      "https://joserolandovelascopena-code.github.io/DeskStyle/public/pages/auth/new_pass.html",
  });

  if (error) {
    const msg = error.message.toLowerCase();

    if (
      msg.includes("rate limit") ||
      msg.includes("over_email_send_rate_limit")
    ) {
      throw new Error(
        "Has realizado demasiadas solicitudes. Espera un momento antes de reintentar.",
      );
    }

    if (msg.includes("user not found") || msg.includes("invalid email")) {
      throw new Error(
        "No existe ninguna cuenta vinculada a este correo electrónico.",
      );
    }

    if (msg.includes("network") || msg.includes("failed to fetch")) {
      throw new Error("Error de conexión. Revisa tu red e inténtalo de nuevo.");
    }

    throw new Error(
      "No se pudo enviar el correo de recuperación. Inténtalo más tarde.",
    );
  }
}

export async function updatePassword(newPass) {
  if (!newPass || newPass.trim().length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPass,
  });

  if (error) {
    const msg = error.message.toLowerCase();

    if (msg.includes("same_password")) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior.");
    }

    throw new Error(
      "Ocurrió un error al actualizar la contraseña. Inténtalo más tarde.",
    );
  }

  return data;
}

export async function loginAdmin(email, password) {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    throw new Error("Credenciales incorrectas.");
  }

  const userId = authData.user.id;

  const { data: perfil, error: perfilError } = await supabase
    .from("perfil")
    .select("rol")
    .eq("id_auth", userId)
    .maybeSingle();

  if (perfilError || !perfil || perfil.rol !== "admin") {
    await supabase.auth.signOut();
    throw new Error("Acceso denegado: No tienes permisos de administrador");
  }

  return authData;
}
