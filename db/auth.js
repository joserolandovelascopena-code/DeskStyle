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
      throw new Error("Correo o contraseña incorrectos");
    }

    throw error;
  }
}

export async function authWithGoogle() {
  const appBase = "/DeskStyle";
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}${appBase}/index.html`,
    },
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

  if (error) throw error;
}

export async function updatePassword(newPass) {
  const { error } = await supabaseClient.auth.updateUser({ password: newPass });
  if (error) throw error;
}
