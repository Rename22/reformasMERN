// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#333" }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Reformas
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/clients">
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/viviendas">
                Viviendas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/proyectos">
                Proyectos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/materiales">
                Materiales
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
