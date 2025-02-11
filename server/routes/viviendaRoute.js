import express from "express";
import {
  createVivienda,
  getAllViviendas,
  getViviendaById,
  updateVivienda,
  deleteVivienda,
} from "../controller/viviendaController.js";

const route = express.Router();

// Rutas para viviendas
route.post("/vivienda", createVivienda);
route.get("/viviendas", getAllViviendas);
route.get("/vivienda/:id", getViviendaById);
route.put("/update/vivienda/:id", updateVivienda);
route.delete("/delete/vivienda/:id", deleteVivienda);

export default route;
