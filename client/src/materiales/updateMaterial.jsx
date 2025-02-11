import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateMaterial = () => {
  const materialInitial = {
    nombre_material: "",
    cantidad: "",
    id_proyecto: "",
  };

  const [material, setMaterial] = useState(materialInitial);
  const [proyectos, setProyectos] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el id del material desde los parámetros de la URL

  // Obtener los proyectos para el campo select
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/proyectos");
        setProyectos(response.data);
      } catch (error) {
        console.log("Error al obtener los proyectos", error);
      }
    };
    fetchProyectos();
  }, []);

  // Obtener los datos del material cuando se monta el componente
  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/material/${id}`);
        const materialData = response.data;
        setMaterial({
          nombre_material: materialData.nombre_material,
          cantidad: materialData.cantidad,
          id_proyecto: materialData.id_proyecto._id || materialData.id_proyecto, // Asegúrate de que el ID del proyecto esté correctamente asignado
        });
      } catch (error) {
        console.log("Error al obtener el material", error);
      }
    };
    fetchMaterial();
  }, [id]);

  // Maneja los cambios en los inputs
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: value });
    validateField(name, value); // Validación en tiempo real
  };

  // Validación en tiempo real de los campos
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    if (fieldName === "nombre_material" && value === "") {
      newErrors.nombre_material = "El nombre del material es obligatorio";
    } else {
      delete newErrors.nombre_material;
    }

    if (fieldName === "cantidad" && value === "") {
      newErrors.cantidad = "La cantidad es obligatoria";
    } else {
      delete newErrors.cantidad;
    }

    if (fieldName === "id_proyecto" && value === "") {
      newErrors.id_proyecto = "El proyecto es obligatorio";
    } else {
      delete newErrors.id_proyecto;
    }

    setErrors(newErrors); // Actualizamos los errores
  };

  // Validación completa del formulario
  const validateForm = () => {
    const newErrors = {};

    if (material.nombre_material === "") {
      newErrors.nombre_material = "El nombre del material es obligatorio";
    }

    if (material.cantidad === "") {
      newErrors.cantidad = "La cantidad es obligatoria";
    }

    if (material.id_proyecto === "") {
      newErrors.id_proyecto = "El proyecto es obligatorio";
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
    try {
      const response = await axios.put(
        `http://localhost:8000/api/update/material/${id}`,
        material
      );
      toast.success(response.data.message, { position: "top-right" });
      navigate("/materiales"); // Redirige a la lista de materiales después de actualizar
    } catch (error) {
      console.log("Error al actualizar el material", error);
      toast.error("Error al actualizar el material");
    }
  };

  return (
    <div className="container mt-5">
      <Link to="/materiales" className="btn btn-secondary mb-4">
        <i className="fa-solid fa-backward"></i> Regresar
      </Link>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3>Actualizar Material</h3>
        </div>
        <div className="card-body">
          <form className="updateMaterialForm" onSubmit={submitForm}>
            <div className="form-group mb-3">
              <label htmlFor="nombre_material">Nombre del Material:</label>
              <input
                type="text"
                id="nombre_material"
                className={`form-control ${errors.nombre_material ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="nombre_material"
                autoComplete="off"
                placeholder="Ingresa el nombre del material"
                value={material.nombre_material}
              />
              {errors.nombre_material && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.nombre_material}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="cantidad">Cantidad:</label>
              <input
                type="number"
                id="cantidad"
                className={`form-control ${errors.cantidad ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="cantidad"
                value={material.cantidad}
              />
              {errors.cantidad && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.cantidad}
                </div>
              )}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="id_proyecto">Proyecto:</label>
              <select
                id="id_proyecto"
                name="id_proyecto"
                className={`form-control ${errors.id_proyecto ? "is-invalid" : ""}`}
                onChange={inputHandler}
                value={material.id_proyecto}
              >
                <option value="">Seleccione un Proyecto</option>
                {proyectos.map((proyecto) => (
                  <option key={proyecto._id} value={proyecto._id}>
                    {proyecto.descripcion}
                  </option>
                ))}
              </select>
              {errors.id_proyecto && (
                <div className="invalid-feedback" style={{ color: "red" }}>
                  {errors.id_proyecto}
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

export default UpdateMaterial;