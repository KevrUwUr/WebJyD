import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alert } from "../Functions";
import "../assets/css/styles.css";
import Sidebar from "./Navbar/sidebar";
import Table from "./Table";
import useInput from "./Hooks/useInput";
import { AuthContext, useAuth } from "../assets/js/AuthContext";

const ShowJobs = () => {
  const { accessToken, refreshToken } = useAuth(AuthContext);
  const url = "http://localhost:7284/api/empleados/";
  const [empleados, setEmpleados] = useState([]);
  const nombres = useInput({
    defaultValue: "",
    validate: /^[A-Za-záéíóúÁÉÍÓÚ ]*$/,
  });
  const apellidos = useInput({
    defaultValue: "",
    validate: /^[A-Za-záéíóúÁÉÍÓÚ ]*$/,
  });
  const sexo = useInput({ defaultValue: "", validate: /^[A-Za-z]*$/ });
  const fechaNacimiento = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const estado = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const [operation, setOperation] = useState([1]);
  const [title, setTitle] = useState();
  const [idToEdit, setidToEdit] = useState(null);
  const [filtro, setFiltro] = useState("");
  //Datos de contacto
  const urlContacto = "http://localhost:7284/api/empleados/";
  const [contacto, setContactoEmpleados] = useState([]);
  const [contactoId, setContactoEmpleadoID] = useState([]);
  const [contactExist, setContactExist] = useState(false);
  const telefono = useInput({ defaultValue: "", validate: /^\d{10}$/ });
  const direccion = useInput({
    defaultValue: "",
    validate: /^[a-zA-Z0-9\s.,#-]+$/,
  });
  const email = useInput({
    defaultValue: "",
    validate: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  });
  const fechaRegistro = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });

  useEffect(() => {
    getEmployees();
  }, []);

  const config = {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Cache-Control": "no-cache",
    },
  };

  const getEmployees = async () => {
    try {
      if (!accessToken) {
        // Si el token de acceso no está disponible, muestra un mensaje de error o realiza alguna acción adecuada
        throw new Error("No se proporcionó un token de acceso");
      }
      const respuesta = await axios.get(url, config);
      setEmpleados(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los cargos:", error.message);
      // Realiza alguna acción adecuada para manejar el error, como mostrar un mensaje al usuario o redirigirlo a una página de inicio de sesión
    }
  };

  const getEmployeesCont = async (id) => {
    try {
      const respuesta = await axios.get(
        `${urlContacto}${id}/contactoempleados`,
        config
      );
      setContactoEmpleados(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener datos de contacto:", error);
      throw error;
    }
  };

  const openModal = (op, empleado) => {
    const nombre = empleado?.nombres;
    const apellido = empleado?.apellidos;
    const genero = empleado?.sexo;
    const fNacimiento = empleado?.fechaNacimiento;
    const estados = empleado?.estado;
    const empleadoId = empleado?.empleadoId;

    estado.handleChange("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar empleado");
      nombres.handleChange("");
      apellidos.handleChange("");
      sexo.handleChange("");
      fechaNacimiento.handleChange("");
      estado.handleChange("");
    } else if (op === 2) {
      setTitle("Editar empleado");
      nombres.handleChange(nombre);
      apellidos.handleChange(apellido);
      sexo.handleChange(genero);
      fechaNacimiento.handleChange(fNacimiento);
      estado.handleChange(estados);
      setidToEdit(empleadoId);
    }
    window.setTimeout(function () {
      document.getElementById("nombres").focus();
    }, 500);
  };

  const openModalCont = async (empleado) => {
    try {
      nombres.handleChange(empleado.nombres);
      apellidos.handleChange(empleado.apellidos);

      const idEditar = empleado.empleadoId;

      const contactos = await getEmployeesCont(empleado.empleadoId);

      setidToEdit(empleado.empleadoId);
      telefono.handleChange(contactos[0].telefono);
      direccion.handleChange(contactos[0].direccion);
      email.handleChange(contactos[0].email);
      fechaRegistro.handleChange(contactos[0].fechaCreacion);
      setContactoEmpleadoID(contactos[0].contEmpId);
      setContactExist(true);
    } catch (error) {
      setContactExist(false);
      console.error("Error al obtener datos de contacto:", error);
    } finally {
      // Si es necesario, puedes agregar lógica adicional aquí
    }
  };

  const validar = (empleadoId) => {
    var parametros;
    var metodo;

    if (nombres.input.trim() === "") {
      show_alert("error", "Escribe el nombre del empleado");
    } else if (apellidos.input.trim() === "") {
      show_alert("error", "Escribe los apellidos del empleado");
    } else if (sexo.input.trim() === "") {
      show_alert("error", "Escribe el sexo del empleado");
    } else if (fechaNacimiento.input.trim() === "") {
      show_alert("error", "Escribe fecha de nacimiento del empleado");
    } else if (estado === "") {
      show_alert("error", "Escribe el estado del empleado");
    } else {
      if (operation === 1) {
        parametros = {
          nombres: nombres.input,
          apellidos: apellidos.input,
          sexo: sexo.input,
          fechaNacimiento: fechaNacimiento.input,
          estado: estado.input,
        };
        metodo = "POST";
      } else {
        parametros = {
          nombres: nombres.input,
          apellidos: apellidos.input,
          sexo: sexo.input,
          fechaNacimiento: fechaNacimiento.input,
          estado: estado.input,
        };

        metodo = "PUT";
      }

      enviarSolicitud(metodo, parametros, empleadoId);
    }
  };

  const enviarSolicitud = async (metodo, parametros, empleadoId) => {
    if (metodo === "POST") {
      axios
        .post(`${url}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Empleado creado");
          document.getElementById("btnCerrar").click();
          getEmployees();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    } else if (metodo === "PUT") {
      axios
        .put(`${url}${empleadoId}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Empleado editado con exito");
          document.getElementById("btnCerrar").click();
          getEmployees();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    }
  };

  const deleteEmpleado = (empleado) => {
    const empleadoId = empleado?.empleadoId;
    const name = empleado?.nombres + " " + empleado?.apellidos;
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro quieres eliminar el empleado " + name + "?",
      icon: "question",
      text: "No se podra dar marcha atras",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}${empleadoId}`, config);
          show_alert("success", "Empleado eliminado exitosamente");
          getEmployees();
        } catch (error) {
          show_alert("error", "Error al eliminar el empleado");
          console.error(error);
        }
      } else {
        show_alert("info", "El empleado no fue eliminado");
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
                      Empleados
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
                          type="text"
                          placeholder="Filtrar por nombre de empleado"
                          value={filtro}
                          onChange={(e) => setFiltro(e.target.value)}
                          className="form-control"
                        />
                        <button
                          onClick={() => openModal(1)}
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modalEmpleados"
                        >
                          <i className="fa-solid fa-circle-plus"></i> Añadir
                          empleado
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
                      {empleados.length > 0 && (
                        <Table
                          header={[...Object.keys(empleados[0]), "Acciones"]}
                          data={empleados}
                          onRemove={(item) => deleteEmpleado(item)}
                          modalId={"modalEmpleados"}
                          modalId2={"modalContactoEmpleados"}
                          filtroCampos={["nombres"]}
                          filtro={filtro}
                          onUpdate={(payload) => openModal(2, payload)}
                          onView={(payload) => openModalCont(payload)}
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

      <div id="modalEmpleados" className="modal fade" aria-hidden="true">
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
              <input type="hidden" id="id"></input>
              <p>Nombres</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  id="nombres"
                  className="form-control"
                  placeholder="Nombres"
                  value={nombres.input}
                  onChange={(e) => nombres.handleChange(e.target.value)}
                ></input>
              </div>
              {nombres.error && (
                <p className="alert alert-danger">{nombres.error}</p>
              )}
              <p>Apellidos</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  id="apellidos"
                  className="form-control"
                  placeholder="Apellidos"
                  value={apellidos.input}
                  onChange={(e) => apellidos.handleChange(e.target.value)}
                ></input>
              </div>
              {apellidos.error && (
                <p className="alert alert-danger">{apellidos.error}</p>
              )}
              <p>Sexo</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-transgender-alt"></i>
                </span>
                <select
                  className="form-control"
                  id="sexo"
                  value={sexo.input}
                  onChange={(e) => sexo.handleChange(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccionar Sexo
                  </option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              {sexo.error && <p className="alert alert-danger">{sexo.error}</p>}
              <p>Fecha de nacimiento</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-calendar"></i>
                </span>

                <input
                  type="date"
                  id="fechanacimiento"
                  className="form-control"
                  placeholder="Fecha de nacimiento"
                  value={fechaNacimiento.input.substr(0, 10)}
                  onChange={(e) => fechaNacimiento.handleChange(e.target.value)}
                ></input>
              </div>
              {fechaNacimiento.error && (
                <p className="alert alert-danger">{fechaNacimiento.error}</p>
              )}
              <p>Estado</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
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
              <div className="d-grid col-6 mx-auto">
                <button
                  onClick={() => validar(idToEdit, nombres.input)}
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
                {" "}
                Cerrar{" "}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="modalContactoEmpleados"
        className="modal fade"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="container-fluid mt-5">
              <h3 className="text-center mt-3 mb-4">Contacto empleado</h3>
            </div>
            <div className="card text-center shadow m-5">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="contact-info">
                      <h4 className="card-title">
                        {nombres.input} {apellidos.input}
                      </h4>
                      <h5>Número telefónico:</h5>
                      <p>{`${telefono.input}`}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Direccion:</h5>
                      <p>{direccion.input}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Correo electrónico:</h5>
                      <p>{email.input}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row m-3">
                <div className="col-md-6 text-center">
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      telefono.handleChange("");
                      direccion.handleChange("");
                      email.handleChange("");
                    }}
                  >
                    <i className="fa fa-arrow-left mr-2"></i> Regresar
                  </button>
                </div>
                <div className="col-md-6 text-center">
                  <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#modalEditarContactoEmpleado"
                  >
                    <i className="fas fa-pencil-alt mr-2"></i> Editar
                  </button>
                </div>
              </div>

              <div className="text-center mt-4"></div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="modalEditarContactoEmpleado"
        className="modal fade"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="container-fluid mt-5">
              <h3 className="text-center mt-3 mb-4">Contacto empleado</h3>
            </div>
            <div className="card text-center shadow m-5">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="contact-info">
                      <h4 className="card-title">
                        {nombres.input} {apellidos.input}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <h5>Número telefónico:</h5>
                  <input
                    className="form-control w-50 mb-2"
                    placeholder="Introduce el numero telefonico"
                    value={telefono.input}
                    onChange={(e) => telefono.handleChange(e.target.value)}
                  ></input>
                  {telefono.error && (
                    <p className="alert alert-danger w-50 m-1">
                      {telefono.error}
                    </p>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Direccion:</h5>
                      <input
                        className="form-control"
                        placeholder="Introduce la direccion"
                        value={direccion.input}
                        onChange={(e) => direccion.handleChange(e.target.value)}
                      ></input>
                      {direccion.error && (
                        <p className="alert alert-danger mt-3">
                          {direccion.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Correo electrónico:</h5>
                      <input
                        className="form-control"
                        placeholder="Introduce tu correo electronico"
                        value={email.input}
                        onChange={(e) => email.handleChange(e.target.value)}
                      ></input>
                    </div>
                    {email.error && (
                      <p className="alert alert-danger mt-3">{email.error}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="row m-3">
                <div className="col-md-6 text-center">
                  <button
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#modalEditarContactoEmpleado"
                  >
                    <i className="fa fa-arrow-left mr-2"></i> Regresar
                  </button>
                </div>
                <div className="col-md-6 text-center">
                  <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#modalEditarContactoEmpleado"
                    onClick={async () => {
                      telefono.handleChange("");
                      direccion.handleChange("");
                      email.handleChange("");
                      if (contactExist) {
                        try {
                          await axios.put(
                            `${urlContacto}${idToEdit}/contactoempleados/${contactoId}`,
                            {
                              telefono: telefono.input,
                              direccion: direccion.input,
                              email: email.input,
                            },
                            config
                          );
                          show_alert("success", "Contacto actualizado");
                        } catch (error) {
                          show_alert("error", "Contacto no se actualizo");
                        }
                      } else {
                        try {
                          await axios.post(
                            `${urlContacto}${idToEdit}/contactoempleados/`,
                            {
                              telefono: telefono.input,
                              direccion: direccion.input,
                              email: email.input,
                              empleadoId: idToEdit,
                            },
                            config
                          );
                          show_alert("success", "Contacto creado");
                        } catch (error) {
                          show_alert("error", "Contacto no se creo");
                        }
                      }
                    }}
                  >
                    <i className="fas fa-floppy-disk mr-2"></i> Guardar
                  </button>
                </div>
              </div>

              <div className="text-center mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowJobs;
