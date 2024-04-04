import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../assets/js/AuthContext";
import "../assets/css/Index.css";
import "../assets/css/Google-Style-Login-.css";
import { InicioSesion } from "../assets/js/Authorization";
import { show_alert } from "../Functions";
import logo from "../assets/img/Logo.png";
import fondo from "../assets/img/fondo-azul-rojo.jpg";

const LogIn = () => {
  const { setAccessToken, setRefreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const Validar = async (e) => {
    e.preventDefault();
    if (username.trim() === "") {
      show_alert("error", "Escribe el correo electrónico");
    } else if (password.trim() === "") {
      show_alert("error", "Escribe la contraseña");
    } else {
      try {
        const { accessToken, refreshToken } = await InicioSesion(
          username,
          password
        );

        await setAccessToken(accessToken);
        await setRefreshToken(refreshToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        await navigate("/Index");
      } catch (error) {
        show_alert("error", "Error en inicio de sesión");
      }
    }
  };

  return (
    <div className="App">
      <div
        className="wrapper items-center"
        style={{
          display: "grid",
          gridTemplateRows: "2",
          alignContent: "center",
          alignItems: "center",
          justifyItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${fondo})`, // Ajuste aquí
          backgroundSize: "cover", // Ajustar tamaño para cubrir todo el contenedor
        }}
      >
        <div className="container-md pt-4 pb-4 w-70 bg-light bg-opacity-50 border border-5 rounded-3">
          <div
            className="row p-3"
            style={{
              alignContent: "center",
              alignItems: "center",
              justifyItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "30%",
              }}
            />
          </div>
          <div className="row">
            <div className="col-md-12">
              <span>
                <p className="fs-5 fw-semibold text">Usuario</p>
              </span>
              <input
                className="form-control"
                type="text"
                id="inputEmail"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required=""
                placeholder="Usuario"
                autoFocus
              />
            </div>
            <div className="col-md-12" style={{ gap: "5px" }}>
              <span>
                <p className="fs-5 text fw-bold">Contraseña</p>
              </span>
              <input
                className="form-control"
                type="password"
                id="inputPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required=""
                placeholder="Contraseña"
              />
            </div>
            <div
              className="col-md-12"
              style={{ gap: "5px", marginTop: "15px" }}
            >
              <button
                className="btn btn-dark btn-md w-100"
                onClick={(e) => Validar(e)}
                style={{
                  fontFamily: "ABeeZee, sans-serif",
                }}
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
