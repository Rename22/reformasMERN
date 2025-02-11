import mongoose from "mongoose";

// Definición del esquema para el cliente
const clientSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  // Para asegurar que no se repita el email
    }
});

// Exportación del modelo
export default mongoose.model("Clients", clientSchema);
