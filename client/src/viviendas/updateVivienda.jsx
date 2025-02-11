import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateVivienda = () => {
  const viviendaInitial = {
    direccion: "",
    tipo: "",
    id_cliente: "",
  };

  const [vivienda, setVivienda] = useState(viviendaInitial);
  const [clients, setClients] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el id de la vivienda desde los parámetros de la URL

  // Obtener los clientes para el campo select
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/clients");
        setClients(response.data);
      } catch (error) {
        console.log("Error al obtener los clientes", error);
      }
    };
    fetchClients();
  }, []);

  // Maneja los cambios en los inputs
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setVivienda({ ...vivienda, [name]: value });
    validateField(name, value); // Validación en tiempo real
  };

  // Validación en tiempo real de los campos
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    if (fieldName === "direccion" && value === "") {
      newErrors.direccion = "La dirección es obligatoria";
    } else {
      delete newErrors.direccion;
    }

    if (fieldName === "tipo" && value === "") {
      newErrors.tipo = "El tipo es obligatorio";
    } else {
      delete newErrors.tipo;
    }

    if (fieldName === "id_cliente" && value === "") {
      newErrors.id_cliente = "El cliente es obligatorio";
    } else {
      delete newErrors.id_cliente;
    }

    setErrors(newErrors); // Actualizamos los errores
  };

  // Validación completa del formulario
  const validateForm = () => {
    const newErrors = {};

    if (vivienda.direccion === "") {
      newErrors.direccion = "La dirección es obligatoria";
    }

    if (vivienda.tipo === "") {
      newErrors.tipo = "El tipo es obligatorio";
    }

    if (vivienda.id_cliente === "") {
      newErrors.id_cliente = "El cliente es obligatorio";
    }

    setErrors(newErrors); // Actualizamos los errores

    return Object.keys(newErrors).length === 0; // Si no hay errores, retorna true
  };

  // Función para enviar el formulario
  const submitForm = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de enviarlo
    const isValid = validateForm();

    if (!isValid) {
      return; // Si hay errores, no enviar el formulario
    }

    // Enviar los datos si no hay errores
    await axios
      .put(`http://localhost:8000/api/update/vivienda/${id}`, vivienda)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/viviendas"); // Redirige a la lista de viviendas después de actualizar
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Cargar los datos de la vivienda cuando se monta el componente
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/vivienda/${id}`)
      .then((response) => {
        setVivienda(response.data); // Establecer los datos de la vivienda
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <div className="container mt-5">
      <Link to="/viviendas" className="btn btn-secondary mb-4">
        <i className="fa-solid fa-backward"></i> Regresar
      </Link>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3>Actualizar Vivienda</h3>
        </div>
        <div className="card-body">
          <form className="updateViviendaForm" onSubmit={submitForm}>
            <div className="form-group mb-3">
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="direccion"
                autoComplete="off"
                placeholder="Ingresa la Dirección de la Vivienda"
                value={vivienda.direccion}
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
                placeholder="Ingresa el Tipo de Vivienda"
                value={vivienda.tipo}
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
                className={`form-control ${errors.id_cliente ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="id_cliente"
                value={vivienda.id_cliente}
              >
                <option value="">Selecciona un Cliente</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.nombre} {client.apellido}
                  </option>
                ))}
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

export default UpdateVivienda;
