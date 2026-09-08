import { supabase } from "../../../db/supabase.js";

const accountOption = document.querySelector(".opccionBar--account");
const accountText = accountOption?.querySelector(".text_oculto");

function renderSession(session) {
  const user = session?.user;

  if (user) {
    const displayName = user.user_metadata?.full_name || user.email || "Mi cuenta";
    accountText.textContent = displayName;
    accountOption.dataset.authenticated = "true";
    accountOption.title = "Sesión iniciada";
    return;
  }

  accountText.textContent = "Iniciar sesión";
  accountOption.dataset.authenticated = "false";
  accountOption.title = "Iniciar sesión";
}

async function initializeSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("No se pudo restaurar la sesión:", error);
  }

  renderSession(data.session);

  // Evita que los tokens del callback de OAuth permanezcan visibles en la URL.
  if (window.location.hash.includes("access_token")) {
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
  }
}

accountOption?.addEventListener("click", () => {
  if (accountOption.dataset.authenticated !== "true") {
    window.location.href = new URL("../../pages/auth/login.html", import.meta.url).href;
  }
});

supabase.auth.onAuthStateChange((_event, session) => renderSession(session));
initializeSession();
