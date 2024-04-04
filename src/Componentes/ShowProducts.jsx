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
import Table2B from "./Table/index2B";
import { AuthContext, useAuth } from "../assets/js/AuthContext";

const ShowProducts = () => {
  const { accessToken, refreshToken } = useAuth(AuthContext);
  const url = "http://localhost:7284/api/productos/";
  const urlc = "http://localhost:7284/api/categorias";

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [idCategoriaSeleccionada, setIdCategoriaSeleccionada] = useState("");
  const nombre = useInput({ defaultValue: "", validate: /^[A-Za-z 0-9]*$/ });
  const precio = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const stock = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const descripcion = useInput({
    defaultValue: "",
    validate: /^[A-Za-z 0-9]*$/,
  });
  const estado = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const color = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const tipo = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const origenMateriaPrima = useInput({
    defaultValue: "",
    validate: /^[A-Za-z ]*$/,
  });
  const [idCategoria, setCategoriaId] = useState([1]);
  const [operation, setOperation] = useState([1]);
  const [title, setTitle] = useState();
  const URL = `http://localhost:7284/api/categorias/${idCategoriaSeleccionada}/productos/`;
  const [idToEdit, SetidToEdit] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const config = {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Cache-Control": "no-cache",
    },
  };

  const getProducts = async () => {
    try {
      if (!accessToken) {
        // Si el token de acceso no está disponible, muestra un mensaje de error o realiza alguna acción adecuada
        throw new Error("No se proporcionó un token de acceso");
      }
      const respuesta = await axios.get(url, config);
      const data = respuesta.data;
      data.map((dat) => {
        const tempData = dat;
        delete tempData.origenMateriaPrima;

        return tempData;
      });
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los cargos:", error.message);
      // Realiza alguna acción adecuada para manejar el error, como mostrar un mensaje al usuario o redirigirlo a una página de inicio de sesión
    }
  };

  const getCategories = async () => {
    const respuestaC = await axios.get(urlc, config);
    setCategorias(respuestaC.data);
  };

  const openModal = (op, producto) => {
    const nombres = producto?.nombre;
    const precios = producto?.precio;
    const stocks = producto?.stock;
    const descripciones = producto?.descripcion;
    const estados = producto?.estado;
    const colores = producto?.color;
    const tipos = producto?.tipo;
    const origenMateriaPrimas = producto?.origenMateriaPrima;
    const id = producto?.productoId;
    const categoriaId = producto?.categoriaId;
    estado.handleChange("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar producto");
      nombre.handleChange("");
      precio.handleChange("");
      stock.handleChange("");
      descripcion.handleChange("");
      estado.handleChange("");
      color.handleChange("");
      tipo.handleChange(1);
      origenMateriaPrima.handleChange("");
      setCategoriaId("");
      setIdCategoriaSeleccionada("");
    } else if (op === 2) {
      setTitle("Editar producto");
      nombre.handleChange(nombres);
      precio.handleChange(precios);
      stock.handleChange(stocks);
      descripcion.handleChange(descripciones);
      estado.handleChange(estados);
      color.handleChange(colores);
      tipo.handleChange(1);
      origenMateriaPrima.handleChange(origenMateriaPrimas);
      SetidToEdit(id);
      setCategoriaId(categoriaId);
      setIdCategoriaSeleccionada(categoriaId);
    }
    window.setTimeout(function () {
      document.getElementById("nombre").focus();
    }, 500);
  };

  const validar = (id) => {
    var parametros;
    var metodo;

    if (nombre.input.trim() === "") {
      show_alert("error", "Escribe el nombre del producto");
    } else if (precio.input === "") {
      show_alert("error", "Escribe el precio del producto");
    } else if (stock.input === "") {
      show_alert("error", "Escribe el stock del producto");
    } else if (descripcion.input === "") {
      show_alert("error", "Escribe la descripcion del producto");
    } else if (estado === "") {
      show_alert("error", "Escribe el estado del producto");
    } else if (color.input === "") {
      show_alert("error", "Escribe el color del producto");
    } else if (tipo === "") {
      show_alert("error", "Escribe el tipo del producto");
    } else {
      if (operation === 1) {
        parametros = {
          nombre: nombre.input,
          precio: precio.input,
          stock: stock.input,
          descripcion: descripcion.input,
          estado: estado.input,
          color: color.input,
          tipo: 1,
          origenMateriaPrima: origenMateriaPrima.input,
          idCategoria: idCategoriaSeleccionada,
        };

        metodo = "POST";
      } else {
        parametros = {
          nombre: nombre.input,
          precio: precio.input,
          stock: stock.input,
          descripcion: descripcion.input,
          estado: estado.input,
          color: color.input,
          tipo: 1,
          origenMateriaPrima: origenMateriaPrima.input,
          idCategoria: idCategoriaSeleccionada,
        };

        metodo = "PUT";
      }

      enviarSolicitud(metodo, parametros, id);
    }
  };

  const enviarSolicitud = async (metodo, parametros, id) => {
    if (metodo === "POST") {
      const duplicados = productos.find((u) => u.nombre === parametros.nombre);

      if (duplicados) {
        show_alert("warning", "Este producto ya existe");
        return;
      }
      axios
        .post(`${URL}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Producto creado");
          document.getElementById("btnCerrar").click();
          getProducts();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    } else if (metodo === "PUT") {
      axios
        .put(`${URL}${id}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Producto editado con exito");
          document.getElementById("btnCerrar").click();
          getProducts();
        })
        .catch(function (error) {
          show_alert("error", "El producto no se edito");
        });
    }
  };

  const deleteProducto = (producto) => {
    const id = producto.productoId;
    const categoriaId = producto.categoriaId; // Obtener el ID de categoría del producto
    const name = producto.nombre;
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro quieres eliminar el producto " + name + "?",
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${urlc}/${categoriaId}/productos/${id}`, config); // Utilizar el ID de categoría obtenido del producto
          show_alert("success", "Producto eliminado exitosamente");
          getProducts();
        } catch (error) {
          show_alert("error", "Error al eliminar el producto");
          console.error(error);
        }
      } else {
        show_alert("info", "El producto no fue eliminado");
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
                      Productos
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
                          placeholder="Filtrar por nombre de producto"
                          value={filtro}
                          onChange={(e) => setFiltro(e.target.value)}
                          className="form-control"
                        />
                        <button
                          onClick={() => openModal(1)}
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modalProducto"
                        >
                          <i className="fa-solid fa-circle-plus"></i> Añadir
                          producto
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
                      {productos.length > 0 && (
                        <Table2B
                          header={[...Object.keys(productos[0]), "Acciones"]}
                          data={productos}
                          onRemove={(item) => deleteProducto(item)}
                          modalId={"modalProducto"}
                          filtroCampos={["nombre"]}
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

      <div id="modalProducto" className="modal fade" aria-hidden="true">
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
              <p>Nombre del producto</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombre.input}
                  onChange={(e) => nombre.handleChange(e.target.value)}
                ></input>
              </div>
              {nombre.error && (
                <p className="alert alert-danger">{nombre.error}</p>
              )}
              <p>Precio</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-credit-card-alt"></i>
                </span>
                <input
                  type="number"
                  id="precio"
                  className="form-control"
                  placeholder="Precio"
                  value={precio.input}
                  onChange={(e) => precio.handleChange(e.target.value)}
                ></input>
              </div>
              {precio.error && (
                <p className="alert alert-danger">{precio.error}</p>
              )}
              <p>Stock</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-truck"></i>
                </span>
                <input
                  type="number"
                  id="stock"
                  className="form-control"
                  placeholder="stock"
                  value={stock.input}
                  onChange={(e) => stock.handleChange(e.target.value)}
                ></input>
              </div>
              {stock.error && (
                <p className="alert alert-danger">{stock.error}</p>
              )}
              <p>Descripción</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-file-text"></i>
                </span>
                <input
                  type="text"
                  id="descripcion"
                  className="form-control"
                  placeholder="descripcion"
                  value={descripcion.input}
                  onChange={(e) => descripcion.handleChange(e.target.value)}
                ></input>
              </div>
              {descripcion.error && (
                <p className="alert alert-danger">{descripcion.error}</p>
              )}
              <p>Estado</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-power-off"></i>
                </span>
                <select
                  className="form-control"
                  id="Estado"
                  value={estado.input}
                  onChange={(e) => estado.handleChange(e.target.value)}
                >
                  <option disabled selected value="">
                    Seleccionar estado
                  </option>
                  <option value="1">Activo</option>
                  <option value="2">Inactivo</option>
                </select>
              </div>
              {estado.error && (
                <p className="alert alert-danger">{estado.error}</p>
              )}
              <p>Color</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-paint-brush"></i>
                </span>
                <input
                  type="text"
                  id="color"
                  className="form-control"
                  placeholder="Color"
                  value={color.input}
                  onChange={(e) => color.handleChange(e.target.value)}
                ></input>
              </div>
              {color.error && (
                <p className="alert alert-danger">{color.error}</p>
              )}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-th-large"></i>
                </span>
                <select
                  id="categoria"
                  className="form-control"
                  value={idCategoriaSeleccionada}
                  onChange={(e) => setIdCategoriaSeleccionada(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-grid col-6 mx-auto">
                <button
                  onClick={() =>
                    validar(idToEdit, nombre, idCategoriaSeleccionada)
                  }
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

export default ShowProducts;
