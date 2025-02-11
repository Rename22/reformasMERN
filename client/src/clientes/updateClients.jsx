import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateClient = () => {
  const clientInitial = {
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  };

  const [client, setClient] = useState(clientInitial);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();  // Obtener el id del cliente desde los parámetros de la URL

  // Maneja los cambios en los inputs
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
    validateField(name, value);  // Validación en tiempo real
  };

  // Validación en tiempo real de los campos
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    if (fieldName === "nombre" && value === "") {
      newErrors.nombre = "El nombre es obligatorio";
    } else {
      delete newErrors.nombre;
    }

    if (fieldName === "apellido" && value === "") {
      newErrors.apellido = "El apellido es obligatorio";
    } else {
      delete newErrors.apellido;
    }

    if (fieldName === "telefono") {
      if (value === "") {
        newErrors.telefono = "El teléfono es obligatorio";
      } else if (!/^[0-9]{10}$/.test(value)) {
        newErrors.telefono = "El teléfono debe ser un número de 10 dígitos";
      } else {
        delete newErrors.telefono;
      }
    }

    if (fieldName === "email") {
      if (value === "") {
        newErrors.email = "El email es obligatorio";
      } else {
        delete newErrors.email;
      }
    }

    setErrors(newErrors);  // Actualizar los errores
  };

  // Validación completa del formulario
  const validateForm = () => {
    const newErrors = {};

    if (client.nombre === "") {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (client.apellido === "") {
      newErrors.apellido = "El apellido es obligatorio";
    }

    if (client.telefono === "") {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^[0-9]{10}$/.test(client.telefono)) {
      newErrors.telefono = "El teléfono debe ser un número de 10 dígitos";
    }

    if (client.email === "") {
      newErrors.email = "El email es obligatorio";
    }

    setErrors(newErrors);  // Actualizar los errores

    return Object.keys(newErrors).length === 0;  // Si no hay errores, retorna true
  };

  // Función para enviar el formulario
  const submitForm = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de enviarlo
    const isValid = validateForm();

    if (!isValid) {
      return;  // Si hay errores, no enviar el formulario
    }

    // Enviar los datos si no hay errores
    await axios
      .put(`http://localhost:8000/api/update/client/${id}`, client)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/clients");  // Redirige a la lista de clientes después de actualizar
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Cargar los datos del cliente cuando se monta el componente
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/client/${id}`)
      .then((response) => {
        setClient(response.data);  // Establecer los datos del cliente
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <div className="container mt-5">
      <Link to="/clients" className="btn btn-secondary mb-4">
        <i className="fa-solid fa-backward"></i> Regresar
      </Link>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3>Actualizar Cliente</h3>
        </div>
        <div className="card-body">
          <form className="updateClientForm" onSubmit={submitForm}>
            <div className="form-group mb-3">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="nombre"
                autoComplete="off"
                placeholder="Ingresa el Nombre"
                value={client.nombre}
              />
              {errors.nombre && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.nombre}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="apellido"
                autoComplete="off"
                placeholder="Ingresa el Apellido"
                value={client.apellido}
              />
              {errors.apellido && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.apellido}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="telefono">Teléfono:</label>
              <input
                type="text"
                id="telefono"
                className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="telefono"
                autoComplete="off"
                placeholder="Ingresa el Teléfono"
                value={client.telefono}
              />
              {errors.telefono && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.telefono}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="email"
                autoComplete="off"
                placeholder="Ingresa el Email"
                value={client.email}
              />
              {errors.email && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.email}
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

export default UpdateClient;
