import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddProyecto = () => {
  const proyecto = {
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "Pendiente", // Valor por defecto
    id_vivienda: "", // Este es un campo de relación, lo cargamos desde la lista de viviendas
  };

  const [proyectoData, setProyectoData] = useState(proyecto);
  const [viviendas, setViviendas] = useState([]); // Lista de viviendas para el select
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Obtener la lista de viviendas desde la API
  useEffect(() => {
    const fetchViviendas = async () => {
      try {
        const response = await axios.get("https://reformasmern-backend.onrender.com/api/viviendas");
        setViviendas(response.data);
      } catch (error) {
        console.log("Error al obtener las viviendas", error);
      }
    };
    fetchViviendas();
  }, []);

  // Función para manejar el cambio de los inputs
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setProyectoData({ ...proyectoData, [name]: value });
    validateField(name, value); // Validación en tiempo real
  };

  // Validación de cada campo en tiempo real
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    // Validar "descripcion"
    if (fieldName === "descripcion" && value === "") {
      newErrors.descripcion = "La descripción es obligatoria";
    } else {
      delete newErrors.descripcion;
    }

    // Validar "fecha_inicio"
    if (fieldName === "fecha_inicio" && value === "") {
      newErrors.fecha_inicio = "La fecha de inicio es obligatoria";
    } else {
      delete newErrors.fecha_inicio;
    }

    // Validar "fecha_fin"
    if (fieldName === "fecha_fin" && value === "") {
      newErrors.fecha_fin = "La fecha de finalización es obligatoria";
    } else {
      delete newErrors.fecha_fin;
    }

    // Validar "estado"
    if (fieldName === "estado" && value === "") {
      newErrors.estado = "El estado es obligatorio";
    } else {
      delete newErrors.estado;
    }

    // Validar "id_vivienda"
    if (fieldName === "id_vivienda" && value === "") {
      newErrors.id_vivienda = "La vivienda es obligatoria";
    } else {
      delete newErrors.id_vivienda;
    }

    setErrors(newErrors);
  };

  // Validación del formulario completo al hacer clic en "Enviar"
  const validateForm = () => {
    const newErrors = {};

    if (proyectoData.descripcion === "") {
      newErrors.descripcion = "La descripción es obligatoria";
    }

    if (proyectoData.fecha_inicio === "") {
      newErrors.fecha_inicio = "La fecha de inicio es obligatoria";
    }

    if (proyectoData.fecha_fin === "") {
      newErrors.fecha_fin = "La fecha de finalización es obligatoria";
    }

    if (proyectoData.estado === "") {
      newErrors.estado = "El estado es obligatorio";
    }

    if (proyectoData.id_vivienda === "") {
      newErrors.id_vivienda = "La vivienda es obligatoria";
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
      .post("https://reformasmern-backend.onrender.com/api/proyecto", proyectoData)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/proyectos"); // Redirige a la lista de proyectos después de agregar el nuevo proyecto
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container mt-5">
      <Link to="/proyectos" className="btn btn-secondary mb-4">
        <i className="fa-solid fa-backward"></i> Regresar
      </Link>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3>Agregar Nuevo Proyecto</h3>
        </div>
        <div className="card-body">
          <form className="addProyectoForm" onSubmit={submitForm}>
            <div className="form-group mb-3">
              <label htmlFor="descripcion">Descripción:</label>
              <input
                type="text"
                id="descripcion"
                className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="descripcion"
                autoComplete="off"
                placeholder="Ingresa la descripción del proyecto"
                value={proyectoData.descripcion}
              />
              {errors.descripcion && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.descripcion}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="fecha_inicio">Fecha de Inicio:</label>
              <input
                type="date"
                id="fecha_inicio"
                className={`form-control ${errors.fecha_inicio ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="fecha_inicio"
                value={proyectoData.fecha_inicio}
              />
              {errors.fecha_inicio && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.fecha_inicio}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="fecha_fin">Fecha de Finalización:</label>
              <input
                type="date"
                id="fecha_fin"
                className={`form-control ${errors.fecha_fin ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="fecha_fin"
                value={proyectoData.fecha_fin}
              />
              {errors.fecha_fin && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.fecha_fin}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                name="estado"
                className={`form-control ${errors.estado ? "is-invalid" : ""}`}
                onChange={inputHandler}
                value={proyectoData.estado}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Finalizado">Finalizado</option>
              </select>
              {errors.estado && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.estado}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="id_vivienda">Vivienda:</label>
              <select
                id="id_vivienda"
                name="id_vivienda"
                className={`form-control ${errors.id_vivienda ? "is-invalid" : ""}`}
                onChange={inputHandler}
                value={proyectoData.id_vivienda}
              >
                <option value="">Seleccione una vivienda</option>
                {viviendas.map((vivienda) => (
                  <option key={vivienda._id} value={vivienda._id}>
                    {vivienda.direccion}
                  </option>
                ))}
              </select>
              {errors.id_vivienda && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.id_vivienda}
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

export default AddProyecto;
