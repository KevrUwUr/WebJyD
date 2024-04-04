import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/IndexAdm.css";
import Sidebar from "./Navbar/sidebar";

const IndexAdm = () => {
  const navigate = useNavigate();
  return (
    <div className="App">
      <div className="wrapper flex items-center">
        <Sidebar />

        <div
          style={{
            display: "grid",
            gridTemplateRows: "2",
            alignContent: "center",
            alignItems: "center",
            justifyItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div className="mb-8">
            <h1 className="fs-1 text fw-bold text-blue-700">
              ¡Bienvenido a SGI Muebles JyD!
            </h1>
          </div>
          <hr style={{ width: "100%", borderColor: "black" }} />
          <div className="mb-12">
            <p className="fs-3 text fw-lighter text-gray-700">
              Para comenzar, dirija el mouse a la parte izquierda de la ventana
              y seleccione una sección.
            </p>
          </div>
        </div>
      </div>

      {/* <section className="main-section">
        <div className="row justify-content-center">
          <div className="text-center">
            <h1 className="title">Control de Inventarios y Ventas</h1>
            <h3 className="subtitle">Seleccione la opción deseada</h3>
            <div className="btn-group-vertical">
              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/cargos")}
              >
                Cargos
              </button>
              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/Categorias")}
              >
                Categorías
              </button>
              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/Empleados")}
              >
                Empleados
              </button>
              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/Facturas/Compras")}
              >
                Facturas de compra
              </button>
              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/Facturas/Ventas")}
              >
                Facturas de venta
              </button>
              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/Perdidas")}
              >
                Pérdidas
              </button>
              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/Productos")}
              >
                Productos
              </button>
              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/Proveedores")}
              >
                Proveedores
              </button>
              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/Usuarios")}
              >
                Usuarios
              </button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default IndexAdm;
