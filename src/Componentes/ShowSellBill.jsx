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
import TableDetalle from "./Table/indexDetalle";
import { AuthContext, useAuth } from "../assets/js/AuthContext";
import useInput from "./Hooks/useInput";
import TableDetallesFactura from "./Table/indexDetallesFact";

const ShowSellBill = () => {
  const { accessToken, refreshToken } = useAuth(AuthContext);
  const url = "http://localhost:7284/api/facturaVentas";
  const urlUsuario = "http://localhost:7284/api/usuarios";
  const urlProductos = "http://localhost:7284/api/productos";
  const [idToEdit, setidToEdit] = useState(null);
  const urlDetalle = `http://localhost:7284/api/facturaVentas/${idToEdit}/detalleFacturaVentas`;

  const [facturaVentas, setFacturasVenta] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [idUsuarioSeleccionado, setIdUsuarioSeleccionado] = useState("");

  const [productos, setProductos] = useState([]);

  const urlPeti = `http://localhost:7284/api/usuarios/${idUsuarioSeleccionado}/facturaVentas/`;
  const fechaExpedicion = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const fechaGeneracion = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const fechaVencimiento = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const nFactura = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const totalBruto = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const totalIVA = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const totalPago = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const totalRetFuente = useInput({ defaultValue: "", validate: /^[0-9]+$/ });
  const [operation, setOperation] = useState([1]);
  const [title, setTitle] = useState();
  const [idUsuario, setidUsuario] = useState([1]);
  const [filtro, setFiltro] = useState("");

  //Detalles de factura
  const [producto, setProducto] = useState(null);
  const [precioProducto, setPrecioProducto] = useState("");
  const [detFacturaVentas, setDetFacturasVenta] = useState([]);
  const [stockProducto, setStockProducto] = useState("");
  const [ivaProducto, setIVAProducto] = useState("");
  const [descuentoProducto, setDescuentoProducto] = useState("");
  const [idSeleccionado, setIdSeleccionado] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [idToEditDet, setidToEditDet] = useState(null);

  const parametros = {
    valorUnitario: precioProducto,
    cantidad: stockProducto,
    iva: ivaProducto,
    valorDescuento: descuentoProducto,
  };

  useEffect(() => {
    if (idSeleccionado) {
      // Obtener detalles del producto cuando idSeleccionado cambie
      axios
        .get(`http://localhost:7284/api/productos/${idSeleccionado}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Cache-Control": "no-cache",
          },
        })
        .then((response) => {
          const productoSeleccionado = response.data;
          setProducto(productoSeleccionado);
          setPrecioProducto(productoSeleccionado.precio);
          setStockProducto(productoSeleccionado.stock);
          setMaxStock(productoSeleccionado.stock);
        })
        .catch((error) => {
          console.error("Error al obtener los detalles del producto:", error);
        });
    }
    getSellBill();
    getUsers();
  }, [idSeleccionado, detFacturaVentas]);

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
      const respuestaProductos = await axios.get(urlProductos, config);
      setProductos(respuestaProductos.data);
    } catch (error) {
      console.error("Error al obtener los cargos:", error.message);
      // Realiza alguna acción adecuada para manejar el error, como mostrar un mensaje al usuario o redirigirlo a una página de inicio de sesión
    }
  };

  const getSellBill = async () => {
    try {
      if (!accessToken) {
        // Si el token de acceso no está disponible, muestra un mensaje de error o realiza alguna acción adecuada
        throw new Error("No se proporcionó un token de acceso");
      }
      const respuesta = await axios.get(url, config);
      setFacturasVenta(respuesta.data);
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
      const respuesta = await axios.get(urlUsuario, config);
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

  const openModal = (op, facturaVenta) => {
    const fechaDExpedicion = facturaVenta?.fechaExpedicion;
    const fechaDGeneracion = facturaVenta?.fechaGeneracion;
    const fechaDVencimiento = facturaVenta?.fechaVencimiento;
    const numeroFactura = facturaVenta?.nFactura;
    const totBruto = facturaVenta?.totalBruto;
    const totIVA = facturaVenta?.totalIVA;
    const totPago = facturaVenta?.totalPago;
    const totRefuete = facturaVenta?.totalRetFuente;
    const id = facturaVenta?.facturaVentaId;
    const idUsers = facturaVenta?.idUsuario;

    setOperation(op);
    if (op === 1) {
      setTitle("Registrar factura de venta");
      fechaExpedicion.handleChange("");
      fechaGeneracion.handleChange("");
      fechaVencimiento.handleChange("");
      nFactura.handleChange("");
      totalBruto.handleChange("");
      totalIVA.handleChange("");
      totalPago.handleChange("");
      totalRetFuente.handleChange("");
    } else if (op === 2) {
      setTitle("Editar factura de venta");
      fechaExpedicion.handleChange(fechaDExpedicion);
      fechaGeneracion.handleChange(fechaDGeneracion);
      fechaVencimiento.handleChange(fechaDVencimiento);
      nFactura.handleChange(numeroFactura);
      totalBruto.handleChange(totBruto);
      totalIVA.handleChange(totIVA);
      totalPago.handleChange(totPago);
      totalRetFuente.handleChange(totRefuete);
      setidToEdit(id);
      setIdUsuarioSeleccionado(idUsers);
    }
    window.setTimeout(function () {
      document.getElementById("fechaExpedicion").focus();
    }, 500);
  };

  const openModalDet = async (detalle) => {
    getProducts();
    setTitle("Detalles de la factura");
    const idFacturaVenta = detalle?.facturaVentaId; // Obtén el ID de la factura

    // Establece el ID de la factura para editar o ver detalles
    setidToEdit(idFacturaVenta);

    // Llama a la función para establecer el detalle de la factura
    establecerDetalle(idFacturaVenta);
  };

  const openModalADED = (metodo, detalle) => {
    if (metodo === 1) {
      setOperation("POST");
      setTitle("Agregar detalle de factura");
      setPrecioProducto("");
      setIVAProducto("");
      setDescuentoProducto("");
      setStockProducto("");
      setIdSeleccionado("");
    } else if (metodo === 2) {
      setOperation("PUT");
      setidToEditDet(detalle.detalleFacturaVentaId);

      setTitle("Editar detalle de factura");
      setPrecioProducto(detalle.valorUnitario);
      setIVAProducto(detalle.iva);
      setDescuentoProducto(detalle.valorDescuento);
      setStockProducto(detalle.cantidad);
      setIdSeleccionado(detalle.productoId);
    }
  };

  const validar = (id) => {
    var parametros;
    var metodo;

    if (
      fechaExpedicion.input.trim() === "" ||
      fechaGeneracion.input.trim() === "" ||
      fechaVencimiento.input.trim() === "" ||
      nFactura.input === "" ||
      totalBruto.input === "" ||
      totalIVA.input === "" ||
      totalPago.input === "" ||
      totalRetFuente.input === ""
    ) {
      show_alert("error", "Completa todos los campos del formulario");
    } else {
      if (operation === 1) {
        parametros = {
          fechaExpedicion: fechaExpedicion.input,
          fechaGeneracion: fechaGeneracion.input,
          fechaVencimiento: fechaVencimiento.input,
          nFactura: nFactura.input,
          totalBruto: totalBruto.input,
          totalIVA: totalIVA.input,
          totalPago: totalPago.input,
          totalRetFuente: totalRetFuente.input,
          idUsuario: idUsuario.input,
        };
        metodo = "POST";
      } else {
        parametros = {
          fechaExpedicion: fechaExpedicion.input,
          fechaGeneracion: fechaGeneracion.input,
          fechaVencimiento: fechaVencimiento.input,
          nFactura: nFactura.input,
          totalBruto: totalBruto.input,
          totalIVA: totalIVA.input,
          totalPago: totalPago.input,
          totalRetFuente: totalRetFuente.input,
          idUsuario: idUsuario.input,
        };

        metodo = "PUT";
      }

      enviarSolicitud(metodo, parametros, id);
    }
  };

  const enviarSolicitud = async (metodo, parametros, id) => {
    if (metodo === "POST") {
      axios
        .post(`${urlPeti}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Factura creada");
          document.getElementById("btnCerrar").click();
          getSellBill();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    } else if (metodo === "PUT") {
      axios
        .put(`${urlPeti}${id}`, parametros, config)
        .then(function (respuesta) {
          show_alert("success", "Factura editada con exito");
          document.getElementById("btnCerrar").click();
          getSellBill();
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    }
  };

  const deleteFacturaVenta = (facturaVenta) => {
    const id = facturaVenta?.facturaVentaId;
    const name = facturaVenta?.facturaVentaId;
    const idUser = facturaVenta?.idUsuario;

    setidUsuario(idUser);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro quieres eliminar la factura de compra " + name + "?",
      icon: "question",
      text: "No se podra dar marcha atras",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${urlPeti}${id}`, config);
          show_alert("success", "Factura eliminada exitosamente");
          getSellBill();
        } catch (error) {
          show_alert("error", "Error al eliminar la factura de compra");
          console.error(error);
        }
      } else {
        show_alert("info", "La factura de compra no fue eliminada");
      }
    });
  };

  //Detalle de factura

  const urlOPDetalle = `http://localhost:7284/api/facturaVentas/`;
  const urlOPDeleteDetalle = `http://localhost:7284/api/facturaVentas/${idToEdit}/detalleFacturaVentas/`;

  const limpiarCampos = () => {
    setIdSeleccionado("");
    setStockProducto("");
    setPrecioProducto("");
    setIVAProducto("");
    setDescuentoProducto("");
  };

  const establecerDetalle = async (id) => {
    const detalles = await axios.get(
      `${url}/${id}/detalleFacturaVentas`,
      config
    );

    const data = detalles.data;
    data.map((dat) => {
      const tempData = dat;
      delete tempData.facturaVentaId;

      return tempData;
    });

    setDetFacturasVenta(detalles.data);
  };

  const enviarDetalle = (parametros, idToEdit) => {
    if (operation === "POST") {
      axios
        .post(
          `${urlOPDetalle}${idToEdit}/productos/${idSeleccionado}/detalleFacturaVentas`,
          parametros,
          config
        )
        .then(function (respuesta) {
          show_alert("success", "Detalle de factura creado");
          document.getElementById("btnCerrar").click();
          establecerDetalle(idToEdit);
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    } else if (operation === "PUT") {
      axios
        .put(
          `${urlOPDetalle}${idToEdit}/productos/${idSeleccionado}/detalleFacturaVentas/${idToEditDet}`,
          parametros,
          config
        )
        .then(function (respuesta) {
          show_alert("success", "Detalle de factura editado");
          document.getElementById("btnCerrar").click();
          establecerDetalle(idToEdit);
        })
        .catch(function (error) {
          show_alert("error", "Error de solucitud");
        });
    }
  };

  const deleteDetalle = (item) => {
    const name = item.detalleFacturaVentaId;

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro quieres eliminar la factura de compra " + name + "?",
      icon: "question",
      text: "No se podra dar marcha atras",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${urlOPDeleteDetalle}${item.detalleFacturaVentaId}`,
            config
          );
          show_alert("success", "Factura eliminada exitosamente");
          establecerDetalle(idToEdit);
        } catch (error) {
          show_alert("error", "Error al eliminar la factura de compra");
          console.error(error);
        }
      } else {
        show_alert("info", "La factura de compra no fue eliminada");
      }
    });
  };

  const handleProductoChange = (e) => {
    const selectedProductId = e.target.value;
    setIdSeleccionado(selectedProductId);
  };

  const handleStockChange = (e) => {
    let enteredStock = parseInt(e.target.value);
    enteredStock = enteredStock >= 0 ? enteredStock : 0; // Validación para asegurar que no sea negativo
    if (enteredStock > maxStock) {
      setStockProducto(maxStock);
    } else {
      setStockProducto(enteredStock);
    }
  };

  const handleIVAChange = (e) => {
    let enteredIVA = parseInt(e.target.value);
    enteredIVA = enteredIVA >= 0 ? enteredIVA : 0; // Validación para asegurar que no sea negativo
    setIVAProducto(enteredIVA);
  };

  const handleDescuentoChange = (e) => {
    let enteredDescuento = parseInt(e.target.value);
    enteredDescuento = enteredDescuento >= 0 ? enteredDescuento : 0; // Validación para asegurar que no sea negativo
    setDescuentoProducto(enteredDescuento);
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
                      Facturas de venta
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
                          placeholder="Filtrar por fecha de registro"
                          value={filtro}
                          onChange={(e) => setFiltro(e.target.value)}
                          className="form-control"
                        />
                        <button
                          onClick={() => openModal(1)}
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modalFacturasVenta"
                        >
                          <i className="fa-solid fa-circle-plus"></i> Añadir
                          factura de venta
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
                      {facturaVentas.length > 0 && (
                        <TableDetalle
                          header={[
                            ...Object.keys(facturaVentas[0]),
                            "Acciones",
                          ]}
                          data={facturaVentas}
                          onRemove={(item) => deleteFacturaVenta(item)}
                          modalId={"modalFacturasVenta"}
                          modalId2={"modalDetalle"}
                          filtroCampos={["fechaGeneracion"]}
                          filtro={filtro}
                          onUpdate={(payload) => openModal(2, payload)}
                          onView={(payload) => openModalDet(payload)}
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
      <div id="modalFacturasVenta" className="modal fade" aria-hidden="true">
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
              <p>Fecha de generacion</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  type="date"
                  id="fechaGeneracion"
                  className="form-control"
                  value={fechaGeneracion.input.substr(0, 10)}
                  onChange={(e) => fechaGeneracion.handleChange(e.target.value)}
                ></input>
              </div>
              {fechaGeneracion.error && (
                <p className="alert alert-danger">{fechaGeneracion.error}</p>
              )}
              <p>Fecha de vencimiendo</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  type="date"
                  id="fechaVencimiento"
                  className="form-control"
                  value={fechaVencimiento.input.substr(0, 10)}
                  onChange={(e) =>
                    fechaVencimiento.handleChange(e.target.value)
                  }
                ></input>
              </div>
              {fechaVencimiento.error && (
                <p className="alert alert-danger"> {fechaVencimiento.error}</p>
              )}
              <p>Fecha de expedicion</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  type="date"
                  id="fechaExpedicion"
                  className="form-control"
                  value={fechaExpedicion.input.substr(0, 10)}
                  onChange={(e) => fechaExpedicion.handleChange(e.target.value)}
                ></input>
              </div>
              {fechaExpedicion.error && (
                <p className="alert alert-danger">{fechaExpedicion.error}</p>
              )}
              <p>Numero de factura</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-hashtag"></i>
                </span>
                <input
                  type="number"
                  id="nFactura"
                  placeholder="Introduce el numero de factura"
                  className="form-control"
                  value={nFactura.input}
                  onChange={(e) => nFactura.handleChange(e.target.value)}
                ></input>
              </div>
              {nFactura.error && (
                <p className="alert alert-danger">{nFactura.error}</p>
              )}
              <p>Total bruto</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-dollar"></i>
                </span>
                <input
                  type="number"
                  id="totalBruto"
                  placeholder="Introduce el total bruto de la factura"
                  className="form-control"
                  value={totalBruto.input}
                  onChange={(e) => totalBruto.handleChange(e.target.value)}
                ></input>
              </div>
              {totalBruto.error && (
                <p className="alert alert-danger">{totalBruto.error}</p>
              )}
              <p>Total IVA</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-dollar"></i>
                </span>
                <input
                  type="number"
                  id="totalIVA"
                  placeholder="Introduce el total del IVA de la factura"
                  className="form-control"
                  value={totalIVA.input}
                  onChange={(e) => totalIVA.handleChange(e.target.value)}
                ></input>
              </div>
              {totalIVA.error && (
                <p className="alert alert-danger">{totalIVA.error}</p>
              )}
              <p>Total pagado</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-dollar"></i>
                </span>
                <input
                  type="number"
                  id="totalPago"
                  placeholder="Introduce el total pagado de la factura"
                  className="form-control"
                  value={totalPago.input}
                  onChange={(e) => totalPago.handleChange(e.target.value)}
                ></input>
              </div>
              {totalPago.error && (
                <p className="alert alert-danger">{totalPago.error}</p>
              )}
              <p>Total de retefuente</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-dollar"></i>
                </span>
                <input
                  type="number"
                  id="totalRetefuente"
                  placeholder="Introduce el total de retefuente de la factura"
                  className="form-control"
                  value={totalRetFuente.input}
                  onChange={(e) => totalRetFuente.handleChange(e.target.value)}
                ></input>
              </div>
              {totalRetFuente.error && (
                <p className="alert alert-danger">{totalRetFuente.error}</p>
              )}
              <p>Usuario</p>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-user"></i>
                </span>
                <select
                  id="usuario"
                  className="form-control"
                  value={idUsuarioSeleccionado}
                  onChange={(e) => setIdUsuarioSeleccionado(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona un usuario
                  </option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.idUsuario} value={usuario.idUsuario}>
                      {[usuario.primNombre, " ", usuario.primApellido]}
                    </option>
                  ))}
                </select>
              </div>
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
      <div id="modalDetalle" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
              ></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="id" />
              {detFacturaVentas.length > 0 && (
                <TableDetallesFactura
                  data={detFacturaVentas}
                  header={[...Object.keys(detFacturaVentas[0]), "Acciones"]}
                  productos={productos}
                  entidad="productos"
                  idToEdit={idToEdit}
                  modalId="modalEditar"
                  onUpdate={(payload) => openModalADED(2, payload)}
                  onDelete={(payload) => deleteDetalle(payload)}
                />
              )}
            </div>
            <div className="modal-footer d-flex">
              <div className="row w-50">
                <div className="col-md-6 col-6">
                  <button
                    className="btn btn-danger mr-2 w-100"
                    data-bs-target="#modalDetalle"
                    data-bs-toggle="modal"
                  >
                    <i className="fa-solid fa-close"></i> Cerrar
                  </button>
                </div>
                <div className="col-md-6 col-6">
                  <button
                    className="btn btn-success w-100"
                    onClick={() => openModalADED(1)}
                    data-bs-target="#modalEditar"
                    data-bs-toggle="modal"
                  >
                    <i className="fa-solid fa-add"></i> Agregar detalle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="modalEditar" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{title}</h4>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <span>
                    <p>Producto</p>
                  </span>
                  <select
                    id="producto"
                    className="form-control"
                    value={idSeleccionado}
                    onChange={handleProductoChange}
                  >
                    <option value="" disabled>
                      Selecciona un producto
                    </option>
                    {productos.map((producto) => (
                      <option
                        key={producto.productoId}
                        value={producto.productoId}
                      >
                        {producto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <span>
                    <p>Cantidad</p>
                  </span>
                  <input
                    type="number"
                    placeholder="Cantidad"
                    className="form-control mr-2 w-100"
                    value={stockProducto}
                    onChange={handleStockChange}
                    min={1}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <span>
                    <p>Precio del producto</p>
                  </span>
                  <input
                    type="number"
                    id="PriceField"
                    placeholder="Valor unitario"
                    className="form-control"
                    value={precioProducto}
                    onChange={(e) => setPrecioProducto(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <span>
                    <p>IVA</p>
                  </span>
                  <input
                    type="number"
                    placeholder="IVA"
                    className="form-control"
                    value={ivaProducto}
                    onChange={handleIVAChange}
                    min={0}
                  />
                </div>
                <div className="col-md-4">
                  <span>
                    <p>Descuento</p>
                  </span>
                  <input
                    type="number"
                    placeholder="Descuento"
                    className="form-control"
                    value={descuentoProducto}
                    onChange={handleDescuentoChange}
                    min={0}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <button
                    className="btn btn-success mr-2 w-100"
                    onClick={() => enviarDetalle(parametros, idToEdit)}
                    data-bs-target="#modalDetalle"
                    data-bs-toggle="modal"
                    // style={{ fontFamily: "inherit" }}
                  >
                    <i className="fa-solid fa-save"></i> Guardar detalle
                  </button>
                </div>
                <div className="col-md-6">
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => limpiarCampos()}
                    // style={{ fontFamily: "inherit" }}
                  >
                    <i className="fa-solid fa-brush"></i> Limpiar campos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowSellBill;
