import mongoose from "mongoose";

const proyectoSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  fecha_inicio: {
    type: Date,
    required: true,
  },
  fecha_fin: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'En progreso', 'Finalizado'],
    default: 'Pendiente',
  },
  id_vivienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Viviendas', // Relación con la colección de Viviendas
    required: true,
  },
});

export default mongoose.model("Proyectos", proyectoSchema);
