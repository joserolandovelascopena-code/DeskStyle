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

  return data.user;
}

//LOGIN
export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
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
}

export async function authWithGoogle() {
  const redirectTo = new URL("../index.html", import.meta.url).href;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) throw error;
}

export async function createProfile(userId, email) {
  const { error } = await supabaseClient.from("profiles").insert({
    id: userId,
    email,
    nombre: null,
    foto_url: null,
  });

  if (error) throw error;
}

export async function logout() {
  await supabaseClient.auth.signOut();
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
  const { error } = await supabaseClient.auth.updateUser({ password: newPass });
  if (error) throw error;
}
