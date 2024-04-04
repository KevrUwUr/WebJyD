import React from "react";
import "../../assets/css/EstilosTabla.css";

const Table2B = ({
  header,
  data,
  onRemove,
  onUpdate,
  modalId,
  filtroCampos,
  filtro,
}) => {
  const dataFiltrada = data.filter((item) => {
    return filtroCampos.some((campo) => {
      return item[campo].toLowerCase().includes(filtro.toLowerCase());
    });
  });

  const formatDate = (dateTimeString) => {
    // Verificar si la cadena tiene el formato datetime esperado
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (regex.test(dateTimeString)) {
      const dateTime = new Date(dateTimeString);
      // Obtener la fecha en formato DD/MM/YYYY
      const day = dateTime.getDate().toString().padStart(2, "0");
      const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
      const year = dateTime.getFullYear();
      return `${day}/${month}/${year}`;
    } else {
      // Si no tiene el formato esperado, devolver la cadena original
      return dateTimeString;
    }
  };

  return (
    <div className="App">
      <div className="table-container">
        <table
          className="table table-responsive table-dark custom-table"
          id="ipi-table"
        >
          <thead className="fs-6 fw-bold thead-dark ">
            <tr className="">
              {header.map((item, i) => (
                <th key={i}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {dataFiltrada.map((item, idx) => (
              <tr key={idx}>
                {Object.keys(item).map((itemkey, i) => (
                  <td key={i}>
                    {itemkey === "id" ||
                    itemkey === "empleadoId" ||
                    itemkey === "productoId" ||
                    itemkey === "idProveedor" ||
                    itemkey === "perdidaId" ||
                    itemkey === "idUsuario" ||
                    itemkey === "categoriaId" ||
                    itemkey === "facturaCompraId"
                      ? idx + 1
                      : formatDate(item[itemkey])}
                  </td>
                ))}
                <td>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target={`#${modalId}`}
                    onClick={() => onUpdate(item)}
                    className="btn btn-light btn-rect mr-2 w-100"
                    style={{ borderRadius: 0 }}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => onRemove(item)}
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

export default Table2B;
