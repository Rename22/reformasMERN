import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componentes//Navbar";  // Importamos la barra de navegación


import AddClients from "./clientes/addClients";
import ListClients from "./clientes/listClients";
import UpdateClients from "./clientes/updateClients";

import AddViviendas from "./viviendas/addVivienda";
import ListViviendas from "./viviendas/listVivienda";
import UpdateViviendas from "./viviendas/updateVivienda";

import AddProyectos from "./proyectos/addProyecto";
import ListProyectos from "./proyectos/listProyecto";
import UpdateProyectos from "./proyectos/updateProyecto";

import AddMateriales from "./materiales/addMaterial";
import ListMateriales from "./materiales/listMaterial";
import UpdateMateriales from "./materiales/updateMaterial";


function App() {
  return (
    <Router>
      <Navbar />  
      <div className="App">
        <Routes>
          <Route path="/" element={<ListClients />} />
          <Route path="/clients" element={<ListClients />} />
          <Route path="/add-clients" element={<AddClients />} />
          <Route path="/update-clients/:id" element={<UpdateClients />} />
          <Route path="/viviendas" element={<ListViviendas />} />
          <Route path="/add-vivienda" element={<AddViviendas />} />
          <Route path="/update-vivienda/:id" element={<UpdateViviendas />} />
          <Route path="/proyectos" element={<ListProyectos />} />
          <Route path="/add-proyecto" element={<AddProyectos />} />
          <Route path="/update-proyecto/:id" element={<UpdateProyectos />} />

          
          <Route path="/materiales" element={<ListMateriales />} />
          <Route path="/add-material" element={<AddMateriales />} />
          <Route path="/update-material/:id" element={<UpdateMateriales />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
