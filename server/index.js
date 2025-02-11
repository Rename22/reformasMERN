import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import clienteRoute from "./routes/clientRoute.js";
import viviendaRoute from "./routes/viviendaRoute.js";
import proyectoRoute from "./routes/proyectoRoute.js";
import materialRoute from "./routes/materialRoute.js";

import cors from "cors";

// Cargar las variables de entorno del archivo .env
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Obtener el puerto desde las variables de entorno o usar el puerto 7000 por defecto
const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

// Conectar a MongoDB Atlas usando la URL de conexión desde el .env
mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected successfully.");
    // Iniciar el servidor solo después de conectarse correctamente a la base de datos
    app.listen(PORT, () => {
      console.log(`Server is running on port :${PORT}`);
    });
  })
  .catch((error) => console.log("Error connecting to the database:", error));

// Configurar las rutas de la API
app.use("/api", route);
app.use("/api", clienteRoute);
app.use("/api", viviendaRoute);
app.use("/api", proyectoRoute);
app.use("/api", materialRoute);
