import { signup } from "../../../db/auth.js";
import { verContraseña } from "../utils/utils.js";
import { sanitizeInput } from "../security/sanitize.js";

const verPass = new verContraseña("passUser", "bntVisblePass");
