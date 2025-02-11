import express from "express";
import {
  createProyecto,
  getAllProyectos,
  getProyectoById,
  updateProyecto,
  deleteProyecto,
} from "../controller/proyectoController.js";

const route = express.Router();

// Rutas para proyectos
route.post("/proyecto", createProyecto);
route.get("/proyectos", getAllProyectos);
route.get("/proyecto/:id", getProyectoById);
route.put("/update/proyecto/:id", updateProyecto);
route.delete("/delete/proyecto/:id", deleteProyecto);

export default route;
