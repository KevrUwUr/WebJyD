import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alert } from "../Functions";
import "../assets/css/styles.css";
import "../assets/css/DashBoard-light-boostrap-animate.min.css";
import "../assets/css/DashBoard-light-boostrap-demo.css";
import "../assets/css/DashBoard-light-boostrap-pe-icon-7-stroke.css";
import "../assets/css/DashBoard-light-boostrap-light-bootstrap-dashboard.css";
import "../assets/css/Gamanet_Pagination_bs5.css";
import Sidebar from "./Navbar/sidebar";

import useInput from "./Hooks/useInput";
import { AuthContext, useAuth } from "../assets/js/AuthContext";
import Table2B from "./Table/index2B";

const ShowLoses = () => {
  const { accessToken, refreshToken } = useAuth(AuthContext);
  const url = "http://localhost:7284/api/perdidas/";
  const urle = "http://localhost:7284/api/empleados/";
  const [idEmpleadoSeleccionado, setIdEmpleadoSeleccionado] = useState("");
  const URLPOST = `http://localhost:7284/api/empleados/${idEmpleadoSeleccionado}/perdidas/`;
  const [perdidas, SetPerdidas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const fechaPerdida = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const estado = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const total = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const [empleadoId, setIdEmpleado] = useState([1]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [idToEdit, setidToEdit] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    getLoses();
    getEmployees();
  }, []);

  const config = {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Cache-Control": "no-cache",
    },
  };

  const getLoses = async () => {
    try {
      if (!accessToken) {
        // Si el token de acceso no está disponible, muestra un mensaje de error o realiza alguna acción adecuada
        throw new Error("No se proporcionó un token de acceso");
      }
      const respuesta = await axios.get(url, config);
      SetPerdidas(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los cargos:", error.message);
      // Realiza alguna acción adecuada para manejar el error, como mostrar un mensaje al usuario o redirigirlo a una página de inicio de sesión
    }
  };

  const getEmployees = async () => {
    try {
      if (!accessToken) {
        // Si el token de acceso no está disponible, muestra un mensaje de error o realiza alguna acción adecuada
        throw new Error("No se proporcionó un token de acceso");
      }
      const respuesta = await axios.get(urle, config);
      setEmpleados(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los cargos:", error.message);
      // Realiza alguna acción adecuada para manejar el error, como mostrar un mensaje al usuario o redirigirlo a una página de inicio de sesión
    }
  };

  const openModal = (op, perdida) => {
    const fechaP = perdida?.fechaPerdida;
    const estate = perdida?.estado;
    const tot = perdida?.total;
    const id = perdida?.perdidaId;
    setOperation(op);

    if (op === 1) {
      setTitle("Registrar pérdida");
      fechaPerdida.handleChange("");
      estado.handleChange("");
      total.handleChange("");
      setIdEmpleado("");
      setIdEmpleadoSeleccionado("");
    } else if (op === 2) {
      const idEmpleado = perdida.empleadoId;
      setTitle("Editar pérdida");
      fechaPerdida.handleChange(fechaP);
      estado.handleChange(estate);
      total.handleChange(tot);
      setidToEdit(id);
      setIdEmpleado(idEmpleado);
      setIdEmpleadoSeleccionado(idEmpleado);
    }
    window.setTimeout(function () {
      document.getElementById("estado").focus();
    }, 500);
  };

  const validar = (id) => {
    var parametros;
    var metodo;

    if (
      fechaPerdida.input.trim === "" ||
      estado.input.trim === "" ||
      total.input.trim === ""
    ) {
      show_alert("error", "Completa todos los campos del formulario");
    } else {
      if (operation === 1) {
        parametros = {
          fechaPerdida: fechaPerdida.input,
          estado: estado.input,
          total: total.input,
          empleadoId: idEmpleadoSeleccionado,
        };
        metodo = "POST";
      } else {
        parametros = {
          fechaPerdida: fechaPerdida.input,
          estado: estado.input,
          total: total.input,
          empleadoId: empleadoId,
        };

        metodo = "PUT";
      }
      enviarSolicitud(metodo, parametros, id);
    }
  };

  const enviarSolicitud = async (metodo, parametros, id) => {
    if (metodo === "POST") {
      axios
        .post(`${URLPOST}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Perdida creada");
          document.getElementById("btnCerrar").click();
          getLoses();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    } else if (metodo === "PUT") {
      axios
        .put(`${url}${id}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Perdida editada con exito");
          document.getElementById("btnCerrar").click();
          getLoses();
        })
        .catch(function (error) {
          show_alert("error", "Error de solicitud");
        });
    }
  };

  const deletePerdida = (perdida) => {
    const idPerdida = perdida.perdidaId;
    const name = perdida.perdidaId;

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro quieres eliminar la pérdida ${name}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}${idPerdida}`, config);
          show_alert("success", "Pérdida eliminada exitosamente");
          getLoses();
        } catch (error) {
          show_alert("error", "Error al eliminar la pérdida");
          console.error("Error al eliminar la pérdida: ", error);
        }
      } else {
        show_alert("info", "La pérdida no fue eliminada");
      }
    });
  };

  return (
    <div className="App">
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <nav
            style={{ backgroundColor: "white" }}
            className="navbar navbar-expand-md d-xl-flex d-xxl-flex justify-content-xl-center justify-content-xxl-center align-items-xxl-center navbar-light"
          >
            <div className="container-fluid">
              <div
                className="collapse navbar-collapse d-xl-flex d-xxl-flex justify-content-xl-center justify-content-xxl-center align-items-xxl-center"
                id="navcol-1"
              >
                <ul className="navbar-nav d-xl-flex d-xxl-flex justify-content-xl-center justify-content-xxl-center align-items-xxl-center">
                  <li className="nav-item d-xl-flex d-xxl-flex justify-content-xl-center justify-content-xxl-center align-items-xxl-center">
                    <h3 className="d-xl-flex d-xxl-flex justify-content-xl-center justify-content-xxl-center align-items-xxl-center">
                      Perdidas
                    </h3>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="content ">
            <div className="container-fluid" style={{ marginBottom: 50 }}>
              <div
                className="card bg-dark"
                id="TableSorterCard"
                style={{ borderStyle: "none", borderRadius: "10px" }}
              >
                <div className="card-header py-3" style={{ borderWidth: 0 }}>
                  <div className="row table-topper align-items-center">
                    <div
                      className="col-12 col-sm-5 col-md-6 text-start"
                      style={{ margin: 0, padding: "5px 15px" }}
                    >
                      <div className="input-group">
                        <input
                          type="date"
                          placeholder="Filtrar por nombre de cargo"
                          value={filtro}
                          onChange={(e) => setFiltro(e.target.value)}
                          className="form-control"
                        />
                        <hr />
                        <button
                          onClick={() => openModal(1)}
                          className="btn btn-primary mt-3"
                          data-bs-toggle="modal"
                          data-bs-target="#modalPerdidas"
                        >
                          <i className="fa-solid fa-circle-plus"></i>
                          Añadir perdida
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div
                      style={{ borderTopStyle: "none", background: "#171921" }}
                    >
                      {perdidas.length > 0 && (
                        <Table2B
                          header={[...Object.keys(perdidas[0]), "Acciones"]}
                          data={perdidas}
                          onRemove={(item) => deletePerdida(item)}
                          modalId={"modalPerdidas"}
                          filtroCampos={["fechaPerdida"]}
                          filtro={filtro}
                          onUpdate={(payload) => openModal(2, payload)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="modalPerdidas" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{title}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
              ></button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="idPerdida"></input>
              <p>Estado</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-power-off"></i>
                </span>
                <select
                  id="estado"
                  className="form-control"
                  value={estado.input}
                  onChange={(e) => estado.handleChange(e.target.value)}
                >
                  <option selected value="">
                    Selecciona una opcion
                  </option>
                  <option value="1"> Activo </option>
                  <option value="2"> Inactivo </option>
                </select>
                {/* <input
                  type="number"
                  id="estado"
                  className="form-control"
                  placeholder="Estado"
                  value={estado.input}
                  onChange={(e) => estado.handleChange(e.target.value)}
                ></input> */}
              </div>
              {estado.error && (
                <p className="alert alert-danger">{estado.error}</p>
              )}
              <p>Fecha de perdida</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  type="date"
                  id="fechaPerdida"
                  className="form-control"
                  placeholder="Fecha"
                  value={fechaPerdida.input.substr(0, 10)}
                  onChange={(e) => fechaPerdida.handleChange(e.target.value)}
                ></input>
              </div>
              {fechaPerdida.error && (
                <p className="alert alert-danger">{fechaPerdida.error}</p>
              )}
              <p>Total</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-credit-card-alt"></i>
                </span>
                <input
                  type="number"
                  id="total"
                  className="form-control"
                  placeholder="Total"
                  value={total.input}
                  onChange={(e) => total.handleChange(e.target.value)}
                ></input>
              </div>
              {total.error && (
                <p className="alert alert-danger">{total.error}</p>
              )}
              <p>Empleado a cargo</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-user"></i>
                </span>
                <select
                  id="empleado"
                  className="form-control"
                  value={idEmpleadoSeleccionado}
                  onChange={(e) => setIdEmpleadoSeleccionado(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona un empleado
                  </option>
                  {empleados.map((empleado) => (
                    <option
                      key={empleado.empleadoId}
                      value={empleado.empleadoId}
                    >
                      {empleado.nombres}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button
                  onClick={() => validar(idToEdit, idEmpleadoSeleccionado)}
                  className="btn btn-success"
                  id="Boton"
                >
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="btnCerrar"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowLoses;
