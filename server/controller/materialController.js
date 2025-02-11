import Material from "../model/materialModel.js";
import Proyecto from "../model/proyectoModel.js";

// Crear un nuevo material
export const createMaterial = async (req, res) => {
  try {
    const { nombre_material, cantidad, id_proyecto } = req.body;

    // Verificar si el proyecto existe
    const proyectoExist = await Proyecto.findById(id_proyecto);
    if (!proyectoExist) {
      return res.status(404).json({ message: "Proyecto not found." });
    }

    const newMaterial = new Material({ nombre_material, cantidad, id_proyecto });
    const savedMaterial = await newMaterial.save();

    res.status(201).json({ message: "Material created successfully.", data: savedMaterial });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Obtener todos los materiales
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().populate("id_proyecto");
    if (!materials || materials.length === 0) {
      return res.status(404).json({ message: "No materials found." });
    }
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Obtener materiales por Proyecto
export const getMaterialsByProject = async (req, res) => {
  try {
    const id_proyecto = req.params.id;
    const materials = await Material.find({ id_proyecto }).populate("id_proyecto");
    if (!materials || materials.length === 0) {
      return res.status(404).json({ message: "No materials found for this project." });
    }
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Obtener un material por ID
export const getMaterialById = async (req, res) => {
  try {
    const id = req.params.id;
    const material = await Material.findById(id).populate("id_proyecto");

    if (!material) {
      return res.status(404).json({ message: "Material not found." });
    }

    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Actualizar material
export const updateMaterial = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre_material, cantidad, id_proyecto } = req.body;

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found." });
    }

    // Verificar si el proyecto existe
    const proyectoExist = await Proyecto.findById(id_proyecto);
    if (!proyectoExist) {
      return res.status(404).json({ message: "Proyecto not found." });
    }

    const updatedMaterial = await Material.findByIdAndUpdate(
      id,
      { nombre_material, cantidad, id_proyecto },
      { new: true }
    );

    res.status(200).json({ message: "Material updated successfully.", data: updatedMaterial });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Eliminar material
export const deleteMaterial = async (req, res) => {
  try {
    const id = req.params.id;
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found." });
    }

    await Material.findByIdAndDelete(id);
    res.status(200).json({ message: "Material deleted successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
