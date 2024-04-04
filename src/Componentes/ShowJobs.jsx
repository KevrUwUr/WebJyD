import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alert } from "../Functions";
import { AuthContext, useAuth } from "../assets/js/AuthContext";
import "../assets/css/styles.css";
import "../assets/css/DashBoard-light-boostrap-animate.min.css";
import "../assets/css/DashBoard-light-boostrap-demo.css";
import "../assets/css/DashBoard-light-boostrap-pe-icon-7-stroke.css";
import "../assets/css/DashBoard-light-boostrap-light-bootstrap-dashboard.css";
import "../assets/css/Gamanet_Pagination_bs5.css";
import Sidebar from "./Navbar/sidebar";
import useInput from "./Hooks/useInput";
import "../assets/css/EstilosShow.css";
import Table2B from "./Table/index2B";

const ShowJobs = () => {
  const { accessToken, refreshToken } = useAuth(AuthContext);

  const url = "http://localhost:7284/api/cargos/";
  const [cargos, setCargos] = useState([]);
  const NombreCargo = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const estado = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const [operation, setOperation] = useState([1]);
  const [title, setTitle] = useState();
  const [idToEdit, setidToEdit] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    getJobs();
  }, []);

  const config = {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Cache-Control": "no-cache",
    },
  };

  const getJobs = async () => {
    try {
      if (!accessToken) {
        // Si el token de acceso no está disponible, muestra un mensaje de error o realiza alguna acción adecuada
        throw new Error("No se proporcionó un token de acceso");
      }

      const respuesta = await axios.get(url, config);
      setCargos(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los cargos:", error.message);
      // Realiza alguna acción adecuada para manejar el error, como mostrar un mensaje al usuario o redirigirlo a una página de inicio de sesión
    }
  };

  const openModal = (op, cargo) => {
    const nombreCargos = cargo?.nombreCargo;
    const estados = cargo?.estado;
    const id = cargo?.id;

    estado.handleChange("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar cargo");
      NombreCargo.handleChange("");
      estado.handleChange("");
    } else if (op === 2) {
      setTitle("Editar cargo");
      NombreCargo.handleChange(nombreCargos);
      estado.handleChange(estados);
      setidToEdit(id);
    }
    window.setTimeout(function () {
      document.getElementById("nombreCargo").focus();
    }, 500);
  };

  const validar = (id) => {
    var parametros;
    var metodo;

    if (NombreCargo.input.trim() === "") {
      show_alert("error", "Escribe el nombre del cargo");
    } else if (estado === "") {
      show_alert("error", "Escribe el estado del cargo");
    } else {
      if (operation === 1) {
        parametros = { NombreCargo: NombreCargo.input, estado: estado.input };
        metodo = "POST";
      } else {
        parametros = { NombreCargo: NombreCargo.input, estado: estado.input };
        metodo = "PUT";
      }

      enviarSolicitud(metodo, parametros, id);
    }
  };

  const enviarSolicitud = async (metodo, parametros, id) => {
    if (metodo === "POST") {
      const duplicados = cargos.find(
        (u) => u.nombreCargo === parametros.NombreCargo
      );

      if (duplicados) {
        show_alert("warning", "Este cargo ya existe");
        return;
      }
      await axios
        .post(url, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Cargo creado");

          document.getElementById("btnCerrar").click();
          getJobs();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    } else if (metodo === "PUT") {
      await axios
        .put(`${url}${id}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Cargo editado con exito");

          document.getElementById("btnCerrar").click();
          getJobs();
        })
        .catch(function (error) {
          show_alert("error", "El cargo no pudo ser editado");
        });
    }
  };

  const deleteCargo = (cargo) => {
    const id = cargo.id;
    const name = cargo.nombreCargo;
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro quieres eliminar el cargo " + name + "?",
      icon: "question",
      text: "No se podra dar marcha atras",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}${id}`, config);
          show_alert("success", "Cargo eliminado exitosamente");
          getJobs();
        } catch (error) {
          show_alert("error", "Error al eliminar el cargo");
          console.error(error);
        }
      } else {
        show_alert("info", "El cargo no fue eliminado");
      }
      getJobs();
    });
  };

  return (
    <div className="App">
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel mt-4">
          <nav
            style={{ backgroundColor: "white", marginTop: "5" }}
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
                      Cargos
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
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          placeholder="Filtrar por nombre de cargo"
                          value={filtro}
                          onChange={(e) => setFiltro(e.target.value)}
                          className="form-control"
                          aria-describedby="filtro-cargo"
                        />
                        <button
                          onClick={() => openModal(1)}
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modalCargos"
                        >
                          <i className="fa-solid fa-circle-plus"></i> Añadir
                          cargo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-12">
                    <div
                      style={{ borderTopStyle: "none", background: "#171921" }}
                    >
                      {cargos.length > 0 && (
                        <Table2B
                          header={[...Object.keys(cargos[0]), "Acciones"]}
                          data={cargos}
                          onRemove={(item) => deleteCargo(item)}
                          modalId={"modalCargos"}
                          filtroCampos={["nombreCargo"]}
                          filtro={filtro}
                          onUpdate={(payload) => openModal(2, payload)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="modalCargos" className="modal fade" aria-hidden="true">
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
              <p>Nombre del cargo</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-user m-0"></i>
                </span>
                <input
                  type="text"
                  id="nombreCargo"
                  className="form-control text"
                  placeholder="Nombre"
                  value={NombreCargo.input}
                  onChange={(e) => NombreCargo.handleChange(e.target.value)}
                ></input>
              </div>
              {NombreCargo.error && (
                <p className="alert alert-danger">{NombreCargo.error}</p>
              )}
              <p>Estado del cargo</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-power-off"></i>
                </span>
                <select
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
                  type="text"
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
              <div className="d-grid col-6 mx-auto">
                <button
                  onClick={() => validar(idToEdit, NombreCargo.input)}
                  className="btn btn-success"
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

export default ShowJobs;
