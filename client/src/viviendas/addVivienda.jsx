import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddVivienda = () => {
  const vivienda = {
    direccion: "",
    tipo: "",
    id_cliente: "", // Este es un campo de relación, lo cargamos desde la lista de clientes
  };

  const [viviendaData, setViviendaData] = useState(vivienda);
  const [clientes, setClientes] = useState([]); // Lista de clientes para el select
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Obtener la lista de clientes desde la API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/clients");
        setClientes(response.data);
      } catch (error) {
        console.log("Error al obtener los clientes", error);
      }
    };
    fetchClientes();
  }, []);

  // Función para manejar el cambio de los inputs
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setViviendaData({ ...viviendaData, [name]: value });
    validateField(name, value); // Validación en tiempo real
  };

  // Validación de cada campo en tiempo real
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    // Validar "direccion"
    if (fieldName === "direccion" && value === "") {
      newErrors.direccion = "La dirección es obligatoria";
    } else {
      delete newErrors.direccion;
    }

    // Validar "tipo"
    if (fieldName === "tipo" && value === "") {
      newErrors.tipo = "El tipo es obligatorio";
    } else {
      delete newErrors.tipo;
    }

    // Validar "id_cliente"
    if (fieldName === "id_cliente" && value === "") {
      newErrors.id_cliente = "El cliente es obligatorio";
    } else {
      delete newErrors.id_cliente;
    }

    setErrors(newErrors);
  };

  // Validación del formulario completo al hacer clic en "Enviar"
  const validateForm = () => {
    const newErrors = {};

    if (viviendaData.direccion === "") {
      newErrors.direccion = "La dirección es obligatoria";
    }

    if (viviendaData.tipo === "") {
      newErrors.tipo = "El tipo es obligatorio";
    }

    if (viviendaData.id_cliente === "") {
      newErrors.id_cliente = "El cliente es obligatorio";
    }

    setErrors(newErrors); // Actualizamos los errores

    return Object.keys(newErrors).length === 0; // Si no hay errores, retornamos true
  };

  // Función para enviar el formulario
  const submitForm = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de enviarlo
    const isValid = validateForm();

    if (!isValid) {
      return; // Si hay errores, no enviamos el formulario
    }

    // Enviar los datos si no hay errores
    await axios
      .post("http://localhost:8000/api/vivienda", viviendaData)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/viviendas"); // Redirige a la lista de viviendas después de agregar la nueva vivienda
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container mt-5">
      <Link to="/viviendas" className="btn btn-secondary mb-4">
        <i className="fa-solid fa-backward"></i> Regresar
      </Link>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3>Agregar Nueva Vivienda</h3>
        </div>
        <div className="card-body">
          <form className="addViviendaForm" onSubmit={submitForm}>
            <div className="form-group mb-3">
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="direccion"
                autoComplete="off"
                placeholder="Ingresa la dirección de la vivienda"
                value={viviendaData.direccion}
              />
              {errors.direccion && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.direccion}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="tipo">Tipo:</label>
              <input
                type="text"
                id="tipo"
                className={`form-control ${errors.tipo ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="tipo"
                autoComplete="off"
                placeholder="Ingresa el tipo de la vivienda"
                value={viviendaData.tipo}
              />
              {errors.tipo && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.tipo}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="id_cliente">Cliente:</label>
              <select
                id="id_cliente"
                name="id_cliente"
                className={`form-control ${errors.id_cliente ? "is-invalid" : ""}`}
                onChange={inputHandler}
                value={viviendaData.id_cliente}
              >
                <option value="">Seleccione un cliente</option>
                {clientes.length > 0 ? (
                  clientes.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.nombre} {client.apellido}
                    </option>
                  ))
                ) : (
                  <option value="">No hay clientes disponibles</option>
                )}
              </select>
              {errors.id_cliente && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.id_cliente}
                </div>
              )}
            </div>

            <div className="form-group text-center">
              <button type="submit" className="btn btn-success w-100">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVivienda;
