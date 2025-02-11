import mongoose from "mongoose";

const viviendaSchema = new mongoose.Schema({
  direccion: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  id_cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients", // Referencia al modelo de Cliente
    required: true,
  },
});

export default mongoose.model("Viviendas", viviendaSchema);
