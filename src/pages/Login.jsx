import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Swal from "sweetalert2";
import "./RegisterLogin.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);

      if (result.exito) {
        if (result.rol === "admin") {
          navigate("/admin/board");
        } else {
          navigate("/carrito");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: result.mensaje,
        });
      }
    } catch (error) {
      console.error("Error de login:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con el servidor.",
      });
    }
  };

  return (
    <div className="formulario-seccion">
      <h2>Iniciar Sesión</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="form-actions">
          <button className="boton-verde" type="submit">
            Ingresar
          </button>
        </div>
      </form>
      <p className="link-text">¿No estás registrado?</p>
      <button className="boton-azul">
        <Link to="/register">Registrate</Link>
      </button>
    </div>
  );
};

export default Login;
