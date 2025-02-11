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

const ListProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const tableRef = useRef(null);
  const dataTableInstance = useRef(null); // Referencia para la instancia de DataTables

  // Obtener los proyectos desde la API
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/proyectos");
        setProyectos(response.data);
      } catch (error) {
        console.log("Error al obtener los datos", error);
      }
    };
    fetchProyectos();
  }, []);

  // Configurar DataTables después de que los datos se carguen
  useEffect(() => {
    if (proyectos.length > 0 && tableRef.current) {
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
  }, [proyectos]);

  // Limpiar DataTables cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
        dataTableInstance.current = null;
      }
    };
  }, []);

  // Eliminar un proyecto
  const deleteProyecto = async (proyectoId) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este proyecto?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/delete/proyecto/${proyectoId}`);
      setProyectos(prev => prev.filter(proyecto => proyecto._id !== proyectoId));
      toast.success("Proyecto eliminado exitosamente", { position: "top-right" });
    } catch (error) {
      console.log("Error al eliminar el proyecto", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <Link to="/add-proyecto" className="btn btn-success">
          <i className="fa-solid fa-plus"></i> Agregar Proyecto
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
              <th>Descripción</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Finalización</th>
              <th>Estado</th>
              <th>Vivienda</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.map((proyecto, index) => {
              return (
                <tr key={proyecto._id}>
                  <td>{index + 1}</td>
                  <td>{proyecto.descripcion}</td>
                  <td>{new Date(proyecto.fecha_inicio).toLocaleDateString()}</td>
                  <td>{new Date(proyecto.fecha_fin).toLocaleDateString()}</td>
                  <td>{proyecto.estado}</td>
                  <td>{proyecto.id_vivienda ? proyecto.id_vivienda.direccion : "N/A"}</td>
                  <td className="actionButtons">
                    <Link
                      to={`/update-proyecto/${proyecto._id}`}
                      className="btn btn-warning mx-2"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    <button
                      onClick={() => deleteProyecto(proyecto._id)}
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

export default ListProyectos;
