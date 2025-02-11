import Proyecto from "../model/proyectoModel.js";
import Vivienda from "../model/viviendaModel.js";

// Crear un nuevo proyecto
export const createProyecto = async (req, res) => {
  try {
    const { descripcion, fecha_inicio, fecha_fin, estado, id_vivienda } = req.body;

    // Verificar si la vivienda existe
    const viviendaExist = await Vivienda.findById(id_vivienda);
    if (!viviendaExist) {
      return res.status(404).json({ message: "Vivienda not found." });
    }

    const newProyecto = new Proyecto({ descripcion, fecha_inicio, fecha_fin, estado, id_vivienda });
    const savedProyecto = await newProyecto.save();

    res.status(201).json({ message: "Proyecto created successfully.", data: savedProyecto });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Obtener todos los proyectos
export const getAllProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().populate("id_vivienda");
    if (!proyectos || proyectos.length === 0) {
      return res.status(404).json({ message: "No proyectos found." });
    }
    res.status(200).json(proyectos);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Obtener un proyecto por ID
export const getProyectoById = async (req, res) => {
  try {
    const id = req.params.id;
    const proyecto = await Proyecto.findById(id).populate("id_vivienda");

    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto not found." });
    }

    res.status(200).json(proyecto);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Actualizar proyecto
export const updateProyecto = async (req, res) => {
  try {
    const id = req.params.id;
    const { descripcion, fecha_inicio, fecha_fin, estado, id_vivienda } = req.body;

    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto not found." });
    }

    // Verificar si la vivienda existe
    const viviendaExist = await Vivienda.findById(id_vivienda);
    if (!viviendaExist) {
      return res.status(404).json({ message: "Vivienda not found." });
    }

    // Actualizar el proyecto
    const updatedProyecto = await Proyecto.findByIdAndUpdate(
      id,
      { descripcion, fecha_inicio, fecha_fin, estado, id_vivienda },
      { new: true }
    );

    res.status(200).json({ message: "Proyecto updated successfully.", data: updatedProyecto });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Eliminar proyecto
export const deleteProyecto = async (req, res) => {
  try {
    const id = req.params.id;
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto not found." });
    }

    await Proyecto.findByIdAndDelete(id);
    res.status(200).json({ message: "Proyecto deleted successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
