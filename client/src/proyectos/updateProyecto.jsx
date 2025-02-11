import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateProyecto = () => {
  const proyectoInitial = {
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "Pendiente",
    id_vivienda: "",
  };

  const [proyecto, setProyecto] = useState(proyectoInitial);
  const [viviendas, setViviendas] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el id del proyecto desde los parámetros de la URL

  // Obtener las viviendas para el campo select
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

  // Obtener los datos del proyecto cuando se monta el componente
  useEffect(() => {
    axios
      .get(`https://reformasmern-backend.onrender.com/api/proyecto/${id}`)
      .then((response) => {
        const proyectoData = response.data;
        // Asegurarnos de que las fechas estén en el formato correcto para el input
        proyectoData.fecha_inicio = proyectoData.fecha_inicio.split("T")[0];  // Convierte a 'YYYY-MM-DD'
        proyectoData.fecha_fin = proyectoData.fecha_fin.split("T")[0];  // Convierte a 'YYYY-MM-DD'
        setProyecto(proyectoData); // Establecer los datos del proyecto
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  // Maneja los cambios en los inputs
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setProyecto({ ...proyecto, [name]: value });
    validateField(name, value); // Validación en tiempo real
  };

  // Validación en tiempo real de los campos
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    if (fieldName === "descripcion" && value === "") {
      newErrors.descripcion = "La descripción es obligatoria";
    } else {
      delete newErrors.descripcion;
    }

    if (fieldName === "fecha_inicio" && value === "") {
      newErrors.fecha_inicio = "La fecha de inicio es obligatoria";
    } else {
      delete newErrors.fecha_inicio;
    }

    // Validar "fecha_fin"
    if (fieldName === "fecha_fin" && value === "") {
      newErrors.fecha_fin = "La fecha de finalización es obligatoria";
    } else {
      // Validar si la fecha de finalización es mayor a 10 años a partir de hoy
      const today = new Date();
      const endDate = new Date(value);
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() + 10);

      if (endDate > maxDate) {
        newErrors.fecha_fin = "La fecha de finalización no puede ser mayor a 10 años a partir de hoy";
      } else {
        delete newErrors.fecha_fin;
      }
    }


    if (fieldName === "id_vivienda" && value === "") {
      newErrors.id_vivienda = "La vivienda es obligatoria";
    } else {
      delete newErrors.id_vivienda;
    }

    if (fieldName === "estado" && value === "") {
      newErrors.estado = "El estado es obligatorio";
    } else {
      delete newErrors.estado;
    }

    setErrors(newErrors); // Actualizamos los errores
  };

  // Validación completa del formulario
  // Validación del formulario completo al hacer clic en "Enviar"
  const validateForm = () => {
    const newErrors = {};

    if (proyecto.descripcion === "") {
      newErrors.descripcion = "La descripción es obligatoria";
    }

    if (proyecto.fecha_inicio === "") {
      newErrors.fecha_inicio = "La fecha de inicio es obligatoria";
    }

    if (proyecto.fecha_fin === "") {
      newErrors.fecha_fin = "La fecha de finalización es obligatoria";
    } else {
      const endDate = new Date(proyecto.fecha_fin);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() + 10);

      // Validar si la fecha de finalización es mayor a 10 años a partir de hoy
      if (endDate > maxDate) {
        newErrors.fecha_fin = "La fecha de finalización no puede ser mayor a 10 años a partir de hoy";
      }
    }

    if (proyecto.estado === "") {
      newErrors.estado = "El estado es obligatorio";
    }

    if (proyecto.id_vivienda === "") {
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
      .put(`https://reformasmern-backend.onrender.com/api/update/proyecto/${id}`, proyecto)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/proyectos"); // Redirige a la lista de proyectos después de actualizar
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
          <h3>Actualizar Proyecto</h3>
        </div>
        <div className="card-body">
          <form className="updateProyectoForm" onSubmit={submitForm}>
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
                value={proyecto.descripcion}
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
                value={proyecto.fecha_inicio}
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
                value={proyecto.fecha_fin}
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
                value={proyecto.estado}
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
                value={proyecto.id_vivienda}
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

export default UpdateProyecto;
