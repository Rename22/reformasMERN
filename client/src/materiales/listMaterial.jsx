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

const ListMaterial = () => {
  const [materiales, setMateriales] = useState([]);
  const tableRef = useRef(null);
  const dataTableInstance = useRef(null); // Referencia para la instancia de DataTables

  // Obtener los materiales desde la API
  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/materials");
        setMateriales(response.data);
      } catch (error) {
        console.log("Error al obtener los datos", error);
      }
    };
    fetchMateriales();
  }, []);

  // Configurar DataTables después de que los datos se carguen
  useEffect(() => {
    if (materiales.length > 0 && tableRef.current) {
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
  }, [materiales]);

  // Limpiar DataTables cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
        dataTableInstance.current = null;
      }
    };
  }, []);

  // Eliminar un material
  const deleteMaterial = async (materialId) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este material?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/delete/material/${materialId}`);
      setMateriales(prev => prev.filter(material => material._id !== materialId));
      toast.success("Material eliminado exitosamente", { position: "top-right" });
    } catch (error) {
      console.log("Error al eliminar el material", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <Link to="/add-material" className="btn btn-success">
          <i className="fa-solid fa-plus"></i> Agregar Material
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
              <th>Nombre del Material</th>
              <th>Cantidad</th>
              <th>Proyecto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((material, index) => {
              return (
                <tr key={material._id}>
                  <td>{index + 1}</td>
                  <td>{material.nombre_material}</td>
                  <td>{material.cantidad}</td>
                  <td>{material.id_proyecto ? material.id_proyecto.descripcion : "N/A"}</td>
                  <td className="actionButtons">
                    <Link
                      to={`/update-material/${material._id}`}
                      className="btn btn-warning mx-2"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    <button
                      onClick={() => deleteMaterial(material._id)}
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

export default ListMaterial;
