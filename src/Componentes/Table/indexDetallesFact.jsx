import axios from "axios";
import React, { useEffect, useState } from "react";

import { AuthContext, useAuth } from "../../assets/js/AuthContext";
import { show_alert } from "../../Functions";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const TableDetallesFactura = ({
  header,
  entidad,
  idToEdit,
  modalId,
  data,
  onDelete,
  onUpdate,
}) => {
  const { accessToken } = useAuth(AuthContext);
  const [producto, setProducto] = useState(null);
  const [precioProducto, setPrecioProducto] = useState("");
  const [detFacturaVentas, setDetFacturasVenta] = useState([]);
  const [stockProducto, setStockProducto] = useState("");
  const [ivaProducto, setIVAProducto] = useState("");
  const [descuentoProducto, setDescuentoProducto] = useState("");
  const [idSeleccionado, setIdSeleccionado] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const url = "http://localhost:7284/api/facturaVentas";
  const parametros = {
    valorUnitario: precioProducto,
    cantidad: stockProducto,
    iva: ivaProducto,
    valorDescuento: descuentoProducto,
  };

  useEffect(() => {
    if (idSeleccionado) {
      axios
        .get(`http://localhost:7284/api/${entidad}/${idSeleccionado}`, {
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
  }, [idSeleccionado, accessToken, entidad]);
  const config = {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Cache-Control": "no-cache",
    },
  };

  const urlOPDeleteDetalle = `http://localhost:7284/api/facturaVentas/${idToEdit}/detalleFacturaVentas/`;

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
        } catch (error) {
          show_alert("error", "Error al eliminar la factura de compra");
          
        }
      } else {
        show_alert("info", "La factura de compra no fue eliminada");
      }
    });
  };

  return (
    <div className="App">
      <div className="table-container">
        <table className="table table-responsive" id="ipi-table">
          <thead style={{color: '#fff'}}> 
            <tr>
              {header.map((item, i) => (
                <th key={i}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {data.map((item, idx) => (
              <tr key={idx}>
                {Object.keys(item).map((itemkey, i) => (
                  <td key={i}>
                    {itemkey === "productoId" ||
                    itemkey === "detalleFacturaVentaId" ||
                    itemkey === "detalleFacturaCompraId" ||
                    itemkey === "facturaCompraId"
                      ? idx + 1
                      : item[itemkey]}
                  </td>
                ))}
                <td>
                  <button
                    // onClick={() => enviarDetalle("PUT", item, idToEdit)}
                    className="btn btn-light btn-rect mr-2 w-100"
                    style={{ borderRadius: 0 }}
                    onClick={() => onUpdate(item)}
                    data-bs-target={`#${modalId}`}
                    data-bs-toggle="modal"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="btn btn-danger btn-rect w-100"
                    style={{ borderRadius: 0 }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDetallesFactura;
