import express from "express";
import { create, getAllClients, getClientById, update, deleteClient } from "../controller/clientController.js";

const route = express.Router();

route.post("/client", create);  // Crear un nuevo cliente
route.get("/clients", getAllClients);  // Obtener todos los clientes
route.get("/client/:id", getClientById);  // Obtener un cliente por ID
route.put("/update/client/:id", update);  // Actualizar un cliente
route.delete("/delete/client/:id", deleteClient);  // Eliminar un cliente

export default route;
