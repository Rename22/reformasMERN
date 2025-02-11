import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import $ from 'jquery'; // Importa jQuery
import 'datatables.net-bs5'; // Importa DataTables para Bootstrap 5
import 'datatables.net-buttons-bs5'; // Importa los botones de DataTables para Bootstrap 5
import 'datatables.net-buttons/js/buttons.html5.mjs'; // Botones de exportación (CSV, Excel, etc.)
import 'datatables.net-buttons/js/buttons.print.mjs'; // Botón de impresión

// Importa los estilos de DataTables y Bootstrap 5
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';

const ListViviendas = () => {
  const [viviendas, setViviendas] = useState([]);
  const tableRef = useRef(null);
  const dataTableInstance = useRef(null); // Referencia para la instancia de DataTables

  // Obtener las viviendas desde la API
  useEffect(() => {
    const fetchViviendas = async () => {
      try {
        const response = await axios.get("https://reformasmern-backend.onrender.com/api/viviendas");
        setViviendas(response.data);
      } catch (error) {
        console.log("Error al obtener los datos", error);
      }
    };
    fetchViviendas();
  }, []);

  // Configurar DataTables después de que los datos se carguen
  useEffect(() => {
    if (viviendas.length > 0 && tableRef.current) {
      // Destruir la instancia existente de DataTables si existe
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
        dataTableInstance.current = null;
      }

      // Inicializar DataTables
      dataTableInstance.current = $(tableRef.current).DataTable({
        dom: 'Bfrtip',
        buttons: [
          'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        responsive: true,
        autoWidth: false,
      });
    }
  }, [viviendas]);

  // Limpiar DataTables cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
        dataTableInstance.current = null;
      }
    };
  }, []);

  // Eliminar una vivienda
  const deleteVivienda = async (viviendaId) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar esta vivienda?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`https://reformasmern-backend.onrender.com/api/delete/vivienda/${viviendaId}`);
      setViviendas(prev => prev.filter(vivienda => vivienda._id !== viviendaId));
      toast.success("Vivienda eliminada exitosamente", { position: "top-right" });
    } catch (error) {
      console.log("Error al eliminar la vivienda", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <Link to="/add-vivienda" className="btn btn-success">
          <i className="fa-solid fa-home"></i> Agregar Vivienda
        </Link>
      </div>

      <div className="table-responsive">
        <table
          ref={tableRef}
          className="table table-striped table-bordered table-hover"
          style={{ width: '100%' }}
        >
          <thead className="thead-dark">
            <tr>
              <th>No.</th>
              <th>Dirección</th>
              <th>Tipo</th>
              <th>Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {viviendas.map((vivienda, index) => {
              return (
                <tr key={vivienda._id}>
                  <td>{index + 1}</td>
                  <td>{vivienda.direccion}</td>
                  <td>{vivienda.tipo}</td>
                  <td>{vivienda.id_cliente ? vivienda.id_cliente.nombre : "N/A"}</td>
                  <td className="actionButtons">
                    <Link
                      to={`/update-vivienda/${vivienda._id}`}
                      className="btn btn-warning mx-2"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    <button
                      onClick={() => deleteVivienda(vivienda._id)}
                      className="btn btn-danger"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListViviendas;
