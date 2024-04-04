import React, { useState, useEffect } from "react";
import Logo from "../../assets/img/Logo.png";
import ImagenBarra from "../../assets/img/sidebar-3.jpg";
import "../../assets/css/EstilosBarra.css";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    setShowSidebar(true); // Mostrar la barra lateral al cargar completamente el componente
  }, []);
  return (
    <div
      className={`sidebar ${showSidebar ? "show" : ""}`}
      data-color="blue"
      data-image
      style={{ backgroundImage: `url(${ImagenBarra})` }}
    >
      <div className="sidebar-wrapper">
        <div className={`logo ${showSidebar ? "expanded" : ""}`}>
          <a className="simple-text" href="/">
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "60px", paddingLeft: "0px" }}
            />
          </a>
        </div>
        <ul className="nav">
          <li>
            <a href="/cargos" style={{ textDecoration: "none" }}>
              <i className="fas fa-briefcase" />
              <p>Cargos</p>
            </a>
          </li>
          <li>
            <a href="/categorias" style={{ textDecoration: "none" }}>
              <i className="fas fa-th-large" />
              <p>Categorías</p>
            </a>
          </li>
          <li>
            <a href="/empleados" style={{ textDecoration: "none" }}>
              <i className="fas fa-user-secret" />
              <p>Empleados</p>
            </a>
          </li>
          <li>
            <a href="/facturas/compras" style={{ textDecoration: "none" }}>
              <i className="fas fa-file-invoice-dollar" />
              <p>Facturas de compra</p>
            </a>
          </li>
          <li>
            <a href="/facturas/ventas" style={{ textDecoration: "none" }}>
              <i className="fas fa-file-invoice" />
              <p>Facturas de venta</p>
            </a>
          </li>
          <li>
            <a href="/perdidas" style={{ textDecoration: "none" }}>
              <i className="fas fa-sort-amount-desc" />
              <p>Pérdidas</p>
            </a>
          </li>
          <li>
            <a href="/productos" style={{ textDecoration: "none" }}>
              <i className="fas fa-shopping-basket" />
              <p>Productos</p>
            </a>
          </li>
          <li>
            <a href="/proveedores" style={{ textDecoration: "none" }}>
              <i className="fas fa-user" />
              <p>Proveedores</p>
            </a>
          </li>
          <li>
            <a href="/usuarios" style={{ textDecoration: "none" }}>
              <i className="fas fa-users" />
              <p>Usuarios</p>
            </a>
          </li>
          <li>
            <a
              href="/"
              onClick={() => localStorage.clear()}
              style={{ textDecoration: "none" }}
            >
              <i className="fas fa-close" />
              <p>Cerrar sesion</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
