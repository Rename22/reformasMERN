import Vivienda from "../model/viviendaModel.js";
import Client from "../model/clientModel.js";

// Crear una nueva vivienda
export const createVivienda = async (req, res) => {
  try {
    const { direccion, tipo, id_cliente } = req.body;

    // Verificar si el cliente existe
    const clientExist = await Client.findById(id_cliente);
    if (!clientExist) {
      return res.status(404).json({ message: "Client not found." });
    }

    const newVivienda = new Vivienda({ direccion, tipo, id_cliente });
    const savedVivienda = await newVivienda.save();

    res.status(201).json({ message: "Vivienda created successfully.", data: savedVivienda });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Obtener todas las viviendas
export const getAllViviendas = async (req, res) => {
  try {
    const viviendas = await Vivienda.find().populate("id_cliente");
    if (!viviendas || viviendas.length === 0) {
      return res.status(404).json({ message: "No viviendas found." });
    }
    res.status(200).json(viviendas);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Obtener una vivienda por ID
export const getViviendaById = async (req, res) => {
  try {
    const id = req.params.id;
    const vivienda = await Vivienda.findById(id).populate("id_cliente");

    if (!vivienda) {
      return res.status(404).json({ message: "Vivienda not found." });
    }

    res.status(200).json(vivienda);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Actualizar vivienda
export const updateVivienda = async (req, res) => {
  try {
    const id = req.params.id;
    const { direccion, tipo, id_cliente } = req.body;

    const vivienda = await Vivienda.findById(id);
    if (!vivienda) {
      return res.status(404).json({ message: "Vivienda not found." });
    }

    // Verificar si el cliente existe
    const clientExist = await Client.findById(id_cliente);
    if (!clientExist) {
      return res.status(404).json({ message: "Client not found." });
    }

    // Actualizar la vivienda
    const updatedVivienda = await Vivienda.findByIdAndUpdate(
      id,
      { direccion, tipo, id_cliente },
      { new: true }
    );

    res.status(200).json({ message: "Vivienda updated successfully.", data: updatedVivienda });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Eliminar vivienda
export const deleteVivienda = async (req, res) => {
  try {
    const id = req.params.id;
    const vivienda = await Vivienda.findById(id);
    if (!vivienda) {
      return res.status(404).json({ message: "Vivienda not found." });
    }

    await Vivienda.findByIdAndDelete(id);
    res.status(200).json({ message: "Vivienda deleted successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
