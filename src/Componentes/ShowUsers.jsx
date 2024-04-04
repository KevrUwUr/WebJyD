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
import Table from "./Table";
import useInput from "./Hooks/useInput";
import { AuthContext, useAuth } from "../assets/js/AuthContext";

const Users = () => {
  const { accessToken, refreshToken } = useAuth(AuthContext);
  const url = "http://localhost:7284/api/usuarios/";

  const [usuarios, setUsuarios] = useState([]);
  const [cargos, setCargos] = useState([]);
  const primNombre = useInput({ defaultValue: "", validate: /^[A-Za-z]*$/ });
  const segNombre = useInput({ defaultValue: "", validate: /^[A-Za-z]*$/ });
  const primApellido = useInput({ defaultValue: "", validate: /^[A-Za-z]*$/ });
  const segApellido = useInput({ defaultValue: "", validate: /^[A-Za-z]*$/ });
  const sexo = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const tipoDocumento = useInput({
    defaultValue: "",
    validate: /^[A-Za-z .]*$/,
  });
  const numDocumento = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const fechaNacimiento = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const estado = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const fechaRegistro = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const tipoUsuario = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const fechaContrato = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const cargo = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const fechaFin = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });

  const [operation, setOperation] = useState([1]);
  const [title, setTitle] = useState();
  const [idToEdit, setidToEdit] = useState(null);
  const [filtro, setFiltro] = useState("");
  //Datos de contacto
  const urlContacto = "http://localhost:7284/api/usuarios/";
  const [contacto, setContactoUsuarios] = useState([]);
  const [contactoId, setContactoUsuarioID] = useState([]);
  const [contactExist, setContactExist] = useState(false);
  const barrio_Localidad = useInput({
    defaultValue: "",
    validate: /^[A-Za-z0-9 ]*$/,
  });
  const ciudad = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const direccion = useInput({
    defaultValue: "",
    validate: /^[a-zA-Z0-9\s.,# -]+$/,
  });
  const email = useInput({
    defaultValue: "",
    validate: /^[^\s@]+@[^\s@]+\.[^\s@]*$/,
  });

  const indicativoCiudad = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const numeroTelefonico = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const tipoTelefono = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });

  useEffect(() => {
    getUsers();
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

  const getUsers = async () => {
    try {
      if (!accessToken) {
        // Si el token de acceso no está disponible, muestra un mensaje de error o realiza alguna acción adecuada
        throw new Error("No se proporcionó un token de acceso");
      }
      const respuesta = await axios.get(url, config);
      const data = respuesta.data;
      data.map((dat) => {
        const tempData = dat;
        delete tempData.contrasena;
        delete tempData.llave;
        return tempData;
      });

      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener los cargos:", error.message);
      // Realiza alguna acción adecuada para manejar el error, como mostrar un mensaje al usuario o redirigirlo a una página de inicio de sesión
    }
  };

  const getUsuariosCont = async (id) => {
    try {
      const respuesta = await axios.get(
        `${urlContacto}${id}/contactoUsuarios`,
        config
      );
      setContactoUsuarios(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener datos de contacto:", error);
      throw error;
    }
  };

  const openModal = (op, usuario) => {
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar usuario");
      primNombre.handleChange("");
      segNombre.handleChange("");
      primApellido.handleChange("");
      segApellido.handleChange("");
      sexo.handleChange("");
      tipoDocumento.handleChange("");
      numDocumento.handleChange("");
      fechaNacimiento.handleChange("");
      estado.handleChange("");
      fechaRegistro.handleChange("");
      tipoUsuario.handleChange("Administrador");
      fechaContrato.handleChange("");
      cargo.handleChange(2);
      fechaFin.handleChange("");
    } else if (op === 2) {
      setTitle("Editar usuario");
      // Llenar campos con datos del usuario seleccionado
      primNombre.handleChange(usuario?.primNombre);
      segNombre.handleChange(usuario?.segNombre);
      primApellido.handleChange(usuario?.primApellido);
      segApellido.handleChange(usuario?.segApellido);
      sexo.handleChange(usuario?.sexo);
      tipoDocumento.handleChange(usuario?.tipoDocumento);
      numDocumento.handleChange(usuario?.numDocumento);
      fechaNacimiento.handleChange(usuario?.fechaNacimiento);
      estado.handleChange(usuario?.estado);
      fechaRegistro.handleChange(usuario?.fechaRegistro);
      tipoUsuario.handleChange("Administrador");
      fechaContrato.handleChange(usuario?.fechaContrato);
      cargo.handleChange(2);
      fechaFin.handleChange(usuario?.fechaFin);
      setidToEdit(usuario?.idUsuario);
    }
    window.setTimeout(function () {
      document.getElementById("pNombre").focus();
    }, 500);
  };

  const openModalCont = async (usuario) => {
    try {
      const contactos = await getUsuariosCont(usuario.idUsuario);

      setidToEdit(usuario?.idUsuario);
      barrio_Localidad.handleChange(contactos[0].barrio_Localidad);
      ciudad.handleChange(contactos[0].ciudad);
      direccion.handleChange(contactos[0].direccion);
      email.handleChange(contactos[0].email);
      indicativoCiudad.handleChange(contactos[0].indicativoCiudad);
      numeroTelefonico.handleChange(contactos[0].numeroTelefonico);
      tipoTelefono.handleChange(contactos[0].tipoTelefono);
      setContactoUsuarioID(contactos[0].contIdUsuario);

      setContactExist(true);
    } catch (error) {
      setContactExist(false);
      console.error("Error al obtener datos de contacto:", error);
    } finally {
      primNombre.handleChange(usuario.primNombre);
      primApellido.handleChange(usuario.primApellido);
    }
  };

  const validar = (id) => {
    var parametros;
    var metodo;

    if (
      primNombre.input.trim() === "" ||
      segNombre.input.trim() === "" ||
      primApellido.input.trim() === "" ||
      segApellido.input.trim() === "" ||
      sexo.input.trim() === "" ||
      tipoDocumento === "" ||
      numDocumento.input === "" ||
      estado.input === "" ||
      fechaNacimiento.input.trim() === "" ||
      fechaRegistro.input.trim() === "" ||
      tipoUsuario.input === "" ||
      fechaContrato.input.trim() === "" ||
      cargo.input === "" ||
      fechaFin.input.trim() === ""
    ) {
      show_alert("error", "Completa todos los campos del formulario");
    } else {
      if (operation === 1) {
        parametros = {
          primNombre: primNombre.input,
          segNombre: segNombre.input,
          primApellido: primApellido.input,
          segApellido: segApellido.input,
          sexo: sexo.input,
          tipoDocumento: tipoDocumento.input,
          numDocumento: numDocumento.input,
          fechaNacimiento: fechaNacimiento.input,
          estado: estado.input,
          fechaRegistro: fechaRegistro.input,
          tipoUsuario: 2,
          fechaContrato: fechaContrato.input,
          cargo: "Administrador",
          fechaFin: fechaFin.input,
        };
        metodo = "POST";
      } else {
        parametros = {
          primNombre: primNombre.input,
          segNombre: segNombre.input,
          primApellido: primApellido.input,
          segApellido: segApellido.input,
          sexo: sexo.input,
          tipoDocumento: tipoDocumento.input,
          numDocumento: numDocumento.input,
          fechaNacimiento: fechaNacimiento.input,
          estado: estado.input,
          fechaRegistro: fechaRegistro.input,
          tipoUsuario: 2,
          fechaContrato: fechaContrato.input,
          cargo: "Administrador",
          fechaFin: fechaFin.input,
        };
        metodo = "PUT";
      }

      enviarSolicitud(metodo, parametros, id);
    }
  };

  const enviarSolicitud = async (metodo, parametros, id) => {
    if (metodo === "POST") {
      const duplicados = usuarios.find(
        (u) => u.numDocumento === parseInt(parametros.numDocumento)
      );

      if (duplicados) {
        show_alert("warning", "Este usuario ya existe");
        return;
      }
      axios
        .post(`${url}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Usuario creado");
          document.getElementById("btnCerrar").click();
          getUsers();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    } else if (metodo === "PUT") {
      axios
        .put(`${url}${id}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Usuario editado con exito");
          document.getElementById("btnCerrar").click();
          getUsers();
        })
        .catch(function (error) {
          show_alert("Error de solucitud", "error");
        });
    }
  };

  const deleteCargo = (usuario) => {
    const id = usuario.idUsuario;
    const name = usuario.primNombre + " " + usuario.primApellido;
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro quieres eliminar el usuario " + name + "?",
      icon: "question",
      text: "No se podra dar marcha atras",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}${id}`, config);
          show_alert("success", "Usuario eliminado exitosamente");
          getUsers();
        } catch (error) {
          show_alert("error", "Error al eliminar el usuario");
          console.error(error);
        }
      } else {
        show_alert("info", "El usuario no fue eliminado");
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
            <div className="container-fluid mt-3">
              <div
                className="collapse navbar-collapse d-xl-flex d-xxl-flex justify-content-xl-center justify-content-xxl-center align-items-xxl-center"
                id="navcol-1"
              >
                <ul className="navbar-nav d-xl-flex d-xxl-flex justify-content-xl-center justify-content-xxl-center align-items-xxl-center">
                  <li className="nav-item d-xl-flex d-xxl-flex justify-content-xl-center justify-content-xxl-center align-items-xxl-center">
                    <h2 className="d-xl-flex d-xxl-flex justify-content-xl-center justify-content-xxl-center align-items-xxl-center">
                      Usuarios
                    </h2>
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
                          placeholder="Filtrar por nombre de usuario"
                          value={filtro}
                          onChange={(e) => setFiltro(e.target.value)}
                          className="form-control"
                        />
                        <button
                          onClick={() => openModal(1)}
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modalUsuarios"
                        >
                          <i className="fa-solid fa-circle-plus"></i> Añadir
                          usuario
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div
                      className="table-responsive"
                      style={{ borderTopStyle: "none", background: "#171921" }}
                    >
                      {usuarios.length > 0 && (
                        <Table
                          header={[...Object.keys(usuarios[0]), "Acciones"]}
                          data={usuarios}
                          onRemove={(item) => deleteCargo(item)}
                          modalId={"modalUsuarios"}
                          modalId2={"modalContactoUsuarios"}
                          filtroCampos={["primNombre"]}
                          filtro={filtro}
                          onUpdate={(payload) => openModal(2, payload)}
                          onView={(payload) => openModalCont(payload)}
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

      <div id="modalUsuarios" className="modal fade" aria-hidden="true">
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
              <p>Primer nombre</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  id="pNombre"
                  className="form-control"
                  placeholder="Primer Nombre"
                  value={primNombre.input}
                  onChange={(e) => primNombre.handleChange(e.target.value)}
                ></input>
              </div>
              {primNombre.error && (
                <p className="alert alert-danger">{primNombre.error}</p>
              )}
              <p>Segundo nombre</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  id="sNombre"
                  className="form-control"
                  placeholder="Segundo Nombre"
                  value={segNombre.input}
                  onChange={(e) => segNombre.handleChange(e.target.value)}
                ></input>
              </div>
              {segNombre.error && (
                <p className="alert alert-danger">{segNombre.error}</p>
              )}
              <p>Primer apellido</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  id="pApellido"
                  className="form-control"
                  placeholder="Primer Apellido"
                  value={primApellido.input}
                  onChange={(e) => primApellido.handleChange(e.target.value)}
                ></input>
              </div>
              {primApellido.error && (
                <p className="alert alert-danger">{primApellido.error}</p>
              )}
              <p>Segundo apellido</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  id="sApellido"
                  className="form-control"
                  placeholder="Segundo Apellido"
                  value={segApellido.input}
                  onChange={(e) => segApellido.handleChange(e.target.value)}
                ></input>
              </div>
              {segApellido.error && (
                <p className="alert alert-danger">{segApellido.error}</p>
              )}
              <p>Sexo</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-venus-mars"></i>
                </span>
                <select
                  className="form-control"
                  id="sexo"
                  value={sexo.input}
                  onChange={(e) => sexo.handleChange(e.target.value)}
                >
                  <option disabled value="">
                    Seleccionar Sexo
                  </option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              {sexo.error && <p className="alert alert-danger">{sexo.error}</p>}
              <p>Tipo de documento</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-id-card"></i>
                </span>
                <select
                  className="form-control"
                  id="tipoDocumento"
                  value={tipoDocumento.input}
                  onChange={(e) => tipoDocumento.handleChange(e.target.value)}
                >
                  <option disabled value="">
                    Seleccionar Tipo de Documento
                  </option>
                  <option value="C.C.">Cedula de ciudadania</option>
                  <option value="T.I.">Tarjeta de identidad</option>
                  <option value="C.E.">Cedula de extrangeria</option>
                  <option value="P.E.P.">
                    Permiso especial de permanencia
                  </option>
                </select>
              </div>
              {tipoDocumento.error && (
                <p className="alert alert-danger">{tipoDocumento.error}</p>
              )}
              <p>Numero de documento</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  id="nDocumento"
                  className="form-control"
                  placeholder="Numero de documento"
                  value={numDocumento.input}
                  onChange={(e) => numDocumento.handleChange(e.target.value)}
                ></input>
              </div>
              {numDocumento.error && (
                <p className="alert alert-danger">{numDocumento.error}</p>
              )}
              <p>Fecha de nacimiento</p>{" "}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  type="date"
                  id="fechaNacimiento"
                  className="form-control"
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
                  <i className="fa fa-id-card"></i>
                </span>
                <select
                  className="form-control"
                  id="Estado"
                  value={estado.input}
                  onChange={(e) => estado.handleChange(e.target.value)}
                >
                  <option selected value="">
                    Seleccionar estado
                  </option>
                  <option value="1">Activo</option>
                  <option value="2">Inactivo</option>
                </select>
              </div>
              {estado.error && (
                <p className="alert alert-danger">{estado.error}</p>
              )}
              <p>Fecha de registro</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  type="date"
                  id="fechaNacimiento"
                  className="form-control"
                  value={fechaRegistro.input.substr(0, 10)}
                  onChange={(e) => fechaRegistro.handleChange(e.target.value)}
                ></input>
              </div>
              {fechaRegistro.error && (
                <p className="alert alert-danger">{fechaRegistro.error}</p>
              )}
              <p>Fecha de contrato</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  type="date"
                  id="fechaContrato"
                  className="form-control"
                  value={fechaContrato.input.substr(0, 10)}
                  onChange={(e) => fechaContrato.handleChange(e.target.value)}
                ></input>
              </div>
              {fechaContrato.error && (
                <p className="alert alert-danger">{fechaContrato.error}</p>
              )}
              <p>Fecha final del usuario</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  type="date"
                  id="fechaFin"
                  className="form-control"
                  value={fechaFin.input.substr(0, 10)}
                  onChange={(e) => fechaFin.handleChange(e.target.value)}
                ></input>
              </div>
              {fechaFin.error && (
                <p className="alert alert-danger">{fechaFin.error}</p>
              )}
              <div className="d-grid col-6 mx-auto">
                <button
                  onClick={() => validar(idToEdit)}
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

      <div id="modalContactoUsuarios" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="container-fluid mt-5">
              <h3 className="text-center mt-3 mb-4">Contacto usuario</h3>
            </div>
            <div className="card text-center shadow m-5">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="contact-info">
                      <h4 className="card-title">
                        {primNombre.input} {primApellido.input}
                      </h4>
                      <h5>Número telefónico:</h5>
                      <p>{`${tipoTelefono.input}: +${indicativoCiudad.input} ${numeroTelefonico.input}`}</p>
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Ciudad:</h5>
                      <p>{ciudad.input}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Barrio / Localidad:</h5>
                      <p>{barrio_Localidad.input}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row m-3">
                <div className="col-md-6 text-center">
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    data-bs-target="#modalContactoUsuarios"
                    onClick={() => {
                      numeroTelefonico.handleChange("");
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
                    data-bs-target="#modalEditarContactoUsuario"
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
        id="modalEditarContactoUsuario"
        className="modal fade"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="container-fluid mt-3">
              <h3 className="text-center">Contacto Usuario</h3>
            </div>
            <div className="card text-center shadow m-5 mt-3">
              <div className="card-body">
                <h4 className="card-title">
                  {primNombre.input} {primApellido.input}
                </h4>
                <div className="row">
                  <div className="col-md-12">
                    <div className="contact-info">
                      <h5>Tipo de Teléfono:</h5>
                      <input
                        className="form-control"
                        placeholder="Introduce el tipo de teléfono"
                        value={tipoTelefono.input}
                        onChange={(e) =>
                          tipoTelefono.handleChange(e.target.value)
                        }
                      ></input>
                      {tipoTelefono.error && (
                        <p className="alert alert-danger mt-2">
                          {tipoTelefono.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Indicativo Ciudad:</h5>
                      <input
                        className="form-control text"
                        placeholder="Introduce el indicativo de la ciudad"
                        value={indicativoCiudad.input}
                        onChange={(e) =>
                          indicativoCiudad.handleChange(e.target.value)
                        }
                      ></input>
                      {indicativoCiudad.error && (
                        <p className="alert alert-danger mt-2">
                          {indicativoCiudad.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Número telefónico:</h5>
                      <input
                        className="form-control"
                        placeholder="Introduce el numero telefonico"
                        value={numeroTelefonico.input}
                        onChange={(e) =>
                          numeroTelefonico.handleChange(e.target.value)
                        }
                      ></input>
                      {numeroTelefonico.error && (
                        <p className="alert alert-danger mt-2">
                          {numeroTelefonico.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Dirección:</h5>
                      <input
                        className="form-control"
                        placeholder="Introduce la dirección"
                        value={direccion.input}
                        onChange={(e) => direccion.handleChange(e.target.value)}
                      ></input>
                      {direccion.error && (
                        <p className="alert alert-danger mt-2">
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
                        placeholder="Introduce tu correo electrónico"
                        value={email.input}
                        onChange={(e) => email.handleChange(e.target.value)}
                      ></input>
                      {email.error && (
                        <p className="alert alert-danger mt-2">{email.error}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Ciudad:</h5>
                      <input
                        className="form-control"
                        placeholder="Introduce la ciudad"
                        value={ciudad.input}
                        onChange={(e) => ciudad.handleChange(e.target.value)}
                      ></input>
                      {ciudad.error && (
                        <p className="alert alert-danger mt-2">
                          {ciudad.error}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="contact-info">
                      <h5>Barrio/Localidad:</h5>
                      <input
                        className="form-control"
                        placeholder="Introduce el barrio o la localidad"
                        value={barrio_Localidad.input}
                        onChange={(e) =>
                          barrio_Localidad.handleChange(e.target.value)
                        }
                      ></input>
                      {barrio_Localidad.error && (
                        <p className="alert alert-danger mt-2">
                          {barrio_Localidad.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row m-3">
                  <div className="col-md-6 text-center">
                    <button
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#modalEditarContactoUsuario"
                    >
                      <i className="fa fa-arrow-left mr-2"></i> Regresar
                    </button>
                  </div>
                  <div className="col-md-6 text-center">
                    <button
                      className="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#modalEditarContactoUsuario"
                      onClick={async () => {
                        numeroTelefonico.handleChange("");
                        direccion.handleChange("");
                        email.handleChange("");
                        if (contactExist) {
                          try {
                            await axios.put(
                              `${urlContacto}${idToEdit}/contactousuarios/${contactoId}`,
                              {
                                direccion: direccion.input,
                                email: email.input,
                                numeroTelefonico: numeroTelefonico.input,
                                indicativoCiudad: indicativoCiudad.input,
                                tipoTelefono: tipoTelefono.input,
                                ciudad: ciudad.input,
                                barrio_Localidad: barrio_Localidad.input,
                                idUsuario: idToEdit,
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
                              `${urlContacto}${idToEdit}/contactousuarios/`,
                              {
                                direccion: direccion.input,
                                email: email.input,
                                numeroTelefonico: numeroTelefonico.input,
                                indicativoCiudad: indicativoCiudad.input,
                                tipoTelefono: tipoTelefono.input,
                                ciudad: ciudad.input,
                                barrio_Localidad: barrio_Localidad.input,
                                idUsuario: idToEdit,
                              },
                              config
                            );
                            show_alert("success", "Contacto credo");
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
    </div>
  );
};

export default Users;
