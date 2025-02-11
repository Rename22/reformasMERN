import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  nombre_material: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  id_proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyectos", // Relación con la colección de Proyectos
    required: true,
  },
});

export default mongoose.model("Materiales", materialSchema);
