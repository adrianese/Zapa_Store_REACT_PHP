import React from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import AdminNav from "./AdminPanel";
import "./Header.css";
import { useAuth } from "../../context/AuthProvider";

const Header = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  return (
    // Usaremos un contenedor flexbox principal y un contenedor secundario (header-main)
    <header className="header-admin">
      {/* Fila 1: Título y Elementos de la Derecha */}
      <div className="header-main-row">
        <h1 className="header-title">Panel de Administración</h1>

        {/* Contenedor para alinear Logout y DarkModeToggle a la derecha */}
        <div className="header-controls">
          {/* Mostramos el nombre del usuario si está logueado */}
          {usuario && <span className="user-info">Hola, {usuario.nombre}</span>}


          <button
            className={`logout-btn ${!usuario ? "disabled" : ""}`}
            onClick={() => {
              // Ejecutar logout normal
              logout();
              // Limpiar dark-mode del admin
              localStorage.removeItem("darkModeAdmin"); // si lo guardabas en localStorage
              document.body.classList.remove("dark-mode"); // quita la clase del body
              // Redirigir
              navigate("/");
            }}
            disabled={!usuario}
          >
            Cerrar Sesión
          </button>
          <DarkModeToggle />
        </div>
      </div>

      {/* Fila 2: Navegación de Administración (AdminNav) */}
      <AdminNav className="admin-nav-area" />
    </header>
  );
};

export default Header;
