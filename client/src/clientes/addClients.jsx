import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import $ from "jquery"; // Importamos jQuery para validación en tiempo real

const AddClients = () => {
  const client = {
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  };
  const [clientData, setClientData] = useState(client);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Función para manejar el cambio de los inputs
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
    validateField(name, value);  // Validación en tiempo real
  };

  // Validación de cada campo en tiempo real
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    // Validar "nombre"
    if (fieldName === "nombre" && value === "") {
      newErrors.nombre = "El nombre es obligatorio";
    } else {
      delete newErrors.nombre;
    }

    // Validar "apellido"
    if (fieldName === "apellido" && value === "") {
      newErrors.apellido = "El apellido es obligatorio";
    } else {
      delete newErrors.apellido;
    }

    // Validar "telefono"
    if (fieldName === "telefono") {
      if (value === "") {
        newErrors.telefono = "El teléfono es obligatorio";
      } else if (!/^[0-9]{10}$/.test(value)) {
        newErrors.telefono = "El teléfono debe ser un número de 10 dígitos";
      } else {
        delete newErrors.telefono;
      }
    }

    // Validar "email"
    if (fieldName === "email") {
      if (value === "") {
        newErrors.email = "El email es obligatorio";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        newErrors.email = "El email no es válido";
      } else {
        delete newErrors.email;
      }
    }

    setErrors(newErrors);
  };

  // Validación del formulario completo al hacer clic en "Enviar"
  const validateForm = () => {
    const newErrors = {};

    if (clientData.nombre === "") {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (clientData.apellido === "") {
      newErrors.apellido = "El apellido es obligatorio";
    }

    if (clientData.telefono === "") {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^[0-9]{10}$/.test(clientData.telefono)) {
      newErrors.telefono = "El teléfono debe ser un número de 10 dígitos";
    }

    if (clientData.email === "") {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(clientData.email)) {
      newErrors.email = "El email no es válido";
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
      .post("http://localhost:8000/api/client", clientData)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/clients"); // Redirige a la lista de clientes después de agregar el nuevo cliente
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Validar el campo en tiempo real usando jQuery
  $(document).ready(function () {
    // Para los campos de nombre, apellido, teléfono y email: validación en tiempo real
    $("#nombre").keyup(function () {
      const value = $(this).val();
      validateField("nombre", value);
    });

    $("#apellido").keyup(function () {
      const value = $(this).val();
      validateField("apellido", value);
    });

    $("#telefono").keyup(function () {
      const value = $(this).val();
      validateField("telefono", value);
    });

    $("#email").keyup(function () {
      const value = $(this).val();
      validateField("email", value);
    });
  });

  return (
    <div className="container mt-5">
      <Link to="/clients" className="btn btn-secondary mb-4">
        <i className="fa-solid fa-backward"></i> Regresar
      </Link>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3>Agregar Nuevo Cliente</h3>
        </div>
        <div className="card-body">
          <form className="addClientForm" onSubmit={submitForm}>
            <div className="form-group mb-3">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="nombre"
                autoComplete="off"
                placeholder="Ingresa el Nombre del Cliente"
                value={clientData.nombre}
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
                placeholder="Ingresa el Apellido del Cliente"
                value={clientData.apellido}
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
                placeholder="Ingresa el Teléfono del Cliente"
                value={clientData.telefono}
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
                placeholder="Ingresa el Email del Cliente"
                value={clientData.email}
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

export default AddClients;
