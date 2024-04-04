import axios from "axios";
import { show_alert } from "../../Functions";

const urlLog = "http://localhost:7284/api/authentication/login";
const urlRefresh = "http://localhost:7284/api/authentication/refresh";

let accessToken = "";
let refreshToken = "";

const InicioSesion = async (username, password) => {
  try {
    const response = await axios.post(urlLog, {
      Username: username,
      Password: password,
    });

    const { data, status } = response;

    accessToken = data?.accessToken;
    refreshToken = data?.refreshToken;

    if (!accessToken || !refreshToken) {
      throw new Error(
        "No se recibió un token de acceso o un token de actualización"
      );
    }

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error:", error);
    show_alert("Datos de acceso inválidos");
    throw error;
  }
};

const RefreshToken = async () => {
  try {
    const response = await axios.post(urlRefresh, {
      accessToken,
      refreshToken,
    });

    const { data, status } = response;

    accessToken = data?.accessToken;

    if (!accessToken) {
      throw new Error("No se recibió un nuevo token de acceso al refrescar");
    }

    return accessToken;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    show_alert("Error al refrescar el token");
    throw error;
  }
};

export { InicioSesion, RefreshToken };
