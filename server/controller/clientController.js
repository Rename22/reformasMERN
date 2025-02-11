import Client from "../model/clientModel.js";

// Crear un nuevo cliente
export const create = async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const { email } = newClient;

    // Verificar si el cliente ya existe usando el email
    const clientExist = await Client.findOne({ email });
    if (clientExist) {
      return res.status(400).json({ message: "Cliente ya existe." });
    }
    const savedData = await newClient.save();
    res.status(200).json({ message: "Cliente creado exitosamente." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Obtener todos los clientes
export const getAllClients = async (req, res) => {
  try {
    const clientData = await Client.find();
    if (!clientData || clientData.length === 0) {
      return res.status(404).json({ message: "No se encontraron clientes." });
    }
    res.status(200).json(clientData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Obtener un cliente por su id
export const getClientById = async (req, res) => {
  try {
    const id = req.params.id;
    const clientExist = await Client.findById(id);
    if (!clientExist) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }
    res.status(200).json(clientExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Actualizar un cliente
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const clientExist = await Client.findById(id);
    if (!clientExist) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }
    const updatedData = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Cliente actualizado exitosamente." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Eliminar un cliente
export const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    const clientExist = await Client.findById(id);
    if (!clientExist) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }
    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: "Cliente eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
