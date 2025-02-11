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

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const tableRef = useRef(null);
  const dataTableInstance = useRef(null); // Referencia para la instancia de DataTables

  // Obtener los clientes desde la API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/clients");
        setClients(response.data);
      } catch (error) {
        console.log("Error al obtener los datos", error);
      }
    };
    fetchClients();
  }, []);

  // Configurar DataTables después de que los datos se carguen
  useEffect(() => {
    if (clients.length > 0 && tableRef.current) {
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
  }, [clients]);

  // Limpiar DataTables cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
        dataTableInstance.current = null;
      }
    };
  }, []);

  // Eliminar un cliente
  const deleteClient = async (clientId) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/delete/client/${clientId}`);
      setClients(prev => prev.filter(client => client._id !== clientId));
      toast.success("Cliente eliminado exitosamente", { position: "top-right" });
    } catch (error) {
      console.log("Error al eliminar el cliente", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <Link to="/add-clients" className="btn btn-success">
          <i className="fa-solid fa-user-plus"></i> Agregar Cliente
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
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={client._id}>
                <td>{index + 1}</td>
                <td>{client.nombre}</td>
                <td>{client.apellido}</td>
                <td>{client.telefono}</td>
                <td>{client.email}</td>
                <td className="actionButtons">
                  <Link
                    to={`/update-clients/${client._id}`}
                    className="btn btn-warning mx-2"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                  <button
                    onClick={() => deleteClient(client._id)}
                    className="btn btn-danger"
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

export default ListClients;