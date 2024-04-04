import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alert } from "../Functions";
import "../assets/css/styles.css";
import Sidebar from "./Navbar/sidebar";
import useInput from "./Hooks/useInput";
import Table2B from "./Table/index2B";
import { AuthContext, useAuth } from "../assets/js/AuthContext";

const ShowCategories = () => {
  const { accessToken, refreshToken } = useAuth(AuthContext);
  const url = "http://localhost:7284/api/categorias/";
  const [categorias, setCategorias] = useState([]);
  const nombre = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const estado = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const [operation, setOperation] = useState([1]);
  const [title, setTitle] = useState();
  const [idToEdit, setidToEdit] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const config = {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Cache-Control": "no-cache",
    },
  };

  const getCategories = async () => {
    try {
      if (!accessToken) {
        throw new Error("No se proporciono un token de acceso");
      }

      const respuesta = await axios.get(url, config);
      setCategorias(respuesta.data);
    } catch (error) {
      console.error("Error al obtener las categorias: ", error.message);
    }
  };

  const openModal = (op, categoria) => {
    const nombres = categoria?.nombre;
    const estados = categoria?.estado;
    const id = categoria?.id;

    estado.handleChange("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar categoria");
      nombre.handleChange("");
      estado.handleChange("");
    } else if (op === 2) {
      setTitle("Editar categoria");
      nombre.handleChange(nombres);
      estado.handleChange(estados);
      setidToEdit(id);
    }
    window.setTimeout(function () {
      document.getElementById("nombreCategoria").focus();
    }, 500);
  };

  const validar = (id) => {
    var parametros;
    var metodo;

    if (nombre.input.trim() === "") {
      show_alert("error", "Escribe el nombre del categoria");
    } else if (estado === "") {
      show_alert("error", "Escribe el estado del categoria");
    } else {
      if (operation === 1) {
        parametros = { nombre: nombre.input, estado: estado.input };
        metodo = "POST";
      } else {
        parametros = { nombre: nombre.input, estado: estado.input };

        metodo = "PUT";
      }

      enviarSolicitud(metodo, parametros, id);
    }
  };

  const enviarSolicitud = async (metodo, parametros, id) => {
    if (metodo === "POST") {
      const duplicados = categorias.find((u) => u.nombre === parametros.nombre);

      if (duplicados) {
        show_alert("warning", "Esta categoria ya existe");
        return;
      }
      axios
        .post(`${url}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Categoria creado");
          document.getElementById("btnCerrar").click();
          getCategories();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    } else if (metodo === "PUT") {
      axios
        .put(`${url}${id}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Categoria editado con exito");
          document.getElementById("btnCerrar").click();
          getCategories();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    }
  };

  const deleteCategoria = (categoria) => {
    const categoriaId = categoria.id;
    const name = categoria.nombre;
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro quieres eliminar la categoria " + name + "?",
      icon: "question",
      text: "No se podra dar marcha atras",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}${categoriaId}`, config);
          show_alert("success", "Categoria eliminada exitosamente");
          getCategories();
        } catch (error) {
          show_alert("error", "Error al eliminar la categoria");
          console.error(error);
        }
      } else {
        show_alert("info", "La categoria no fue eliminada");
      }
    });
  };

  return (
    <div className="App">
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel m-3">
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
                      Categorias
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
                          placeholder="Filtrar por nombre de categoria"
                          value={filtro}
                          onChange={(e) => setFiltro(e.target.value)}
                          className="form-control"
                        />
                        <button
                          onClick={() => openModal(1)}
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modalCategorias"
                        >
                          <i className="fa-solid fa-circle-plus"></i> Añadir
                          categoria
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
                      {categorias.length > 0 && (
                        <Table2B
                          header={[...Object.keys(categorias[0]), "Acciones"]}
                          data={categorias}
                          onRemove={(item) => deleteCategoria(item)}
                          modalId={"modalCategorias"}
                          filtroCampos={["nombre"]}
                          filtro={filtro}
                          onUpdate={(payload) => openModal(2, payload)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-12 col-sm-6 col-md-6 text-end d-xl-flex justify-content-xl-center align-items-xl-center"
                    style={{ marginBottom: 30 }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="modalCategorias" className="modal fade" aria-hidden="true">
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
              <p>Nombre de la categoria</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  id="nombreCategoria"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombre.input}
                  onChange={(e) => nombre.handleChange(e.target.value)}
                ></input>
              </div>
              {nombre.error && (
                <p className="alert alert-danger">{nombre.error}</p>
              )}
              <p>Estado de la categoria</p>
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
                  onClick={() => validar(idToEdit, nombre.input)}
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

export default ShowCategories;
