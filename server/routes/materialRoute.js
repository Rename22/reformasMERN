import express from "express";
import {
  createMaterial,
  getAllMaterials,
  getMaterialsByProject,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../controller/materialController.js";

const route = express.Router();

// Rutas para materiales
route.post("/material", createMaterial);
route.get("/materials", getAllMaterials);
route.get("/material/:id", getMaterialById);
route.get("/materials/project/:id", getMaterialsByProject);
route.put("/update/material/:id", updateMaterial);
route.delete("/delete/material/:id", deleteMaterial);

export default route;
