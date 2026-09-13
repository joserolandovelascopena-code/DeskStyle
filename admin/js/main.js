import { escoparHTML } from "../../public/js/security/sanitizarInputs.js";
import { contenedorModales } from "../js/utils/modales.js";
import "./dashboard.js";
import { mostrarToast } from "./utils/toast.js";
import { manejadorIMGs } from "../../public/js/utils/manejadorArchivos.js";
import { supabase } from "../../db/supabase.js";
import "./dahboard_datas.js";

contenedorModales(".contenedor_modales", false);

// const btn = document.querySelector(".agregarCateg");

// btn.addEventListener("click", () => {
//   contenedorModales(".contenedor_modales", true);
// });
