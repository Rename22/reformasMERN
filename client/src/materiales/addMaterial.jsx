import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddMaterial = () => {
  const material = {
    nombre_material: "",
    cantidad: "",
    id_proyecto: "", // Este es un campo de relación, lo cargamos desde la lista de proyectos
  };

  const [materialData, setMaterialData] = useState(material);
  const [proyectos, setProyectos] = useState([]); // Lista de proyectos para el select
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Obtener la lista de proyectos desde la API
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await axios.get("https://reformasmern-backend.onrender.com/api/proyectos");
        setProyectos(response.data);
      } catch (error) {
        console.log("Error al obtener los proyectos", error);
      }
    };
    fetchProyectos();
  }, []);

  // Función para manejar el cambio de los inputs
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setMaterialData({ ...materialData, [name]: value });
    validateField(name, value); // Validación en tiempo real
  };

  // Validación de cada campo en tiempo real
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    // Validar "nombre_material"
    if (fieldName === "nombre_material" && value === "") {
      newErrors.nombre_material = "El nombre del material es obligatorio";
    } else {
      delete newErrors.nombre_material;
    }

    // Validar "cantidad"
    if (fieldName === "cantidad" && value === "") {
      newErrors.cantidad = "La cantidad es obligatoria";
    } else if (fieldName === "cantidad" && isNaN(value)) {
      newErrors.cantidad = "La cantidad debe ser un número";
    } else {
      delete newErrors.cantidad;
    }

    // Validar "id_proyecto"
    if (fieldName === "id_proyecto" && value === "") {
      newErrors.id_proyecto = "El proyecto es obligatorio";
    } else {
      delete newErrors.id_proyecto;
    }

    setErrors(newErrors); // Actualizamos los errores
  };

  // Validación del formulario completo al hacer clic en "Enviar"
  const validateForm = () => {
    const newErrors = {};

    if (materialData.nombre_material === "") {
      newErrors.nombre_material = "El nombre del material es obligatorio";
    }

    if (materialData.cantidad === "") {
      newErrors.cantidad = "La cantidad es obligatoria";
    } else if (isNaN(materialData.cantidad)) {
      newErrors.cantidad = "La cantidad debe ser un número";
    }

    if (materialData.id_proyecto === "") {
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
    await axios
      .post("https://reformasmern-backend.onrender.com/api/material", materialData)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/materiales"); // Redirige a la lista de materiales después de agregar el nuevo material
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container mt-5">
      <Link to="/materiales" className="btn btn-secondary mb-4">
        <i className="fa-solid fa-backward"></i> Regresar
      </Link>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3>Agregar Nuevo Material</h3>
        </div>
        <div className="card-body">
          <form className="addMaterialForm" onSubmit={submitForm}>
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
                value={materialData.nombre_material}
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
                type="text"
                id="cantidad"
                className={`form-control ${errors.cantidad ? "is-invalid" : ""}`}
                onChange={inputHandler}
                name="cantidad"
                autoComplete="off"
                placeholder="Ingresa la cantidad del material"
                value={materialData.cantidad}
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
                value={materialData.id_proyecto}
              >
                <option value="">Seleccione un Proyecto</option>
                {proyectos.map((proyecto) => (
                  <option key={proyecto._id} value={proyecto._id}>
                    {proyecto.descripcion} ({proyecto.estado})
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

export default AddMaterial;
