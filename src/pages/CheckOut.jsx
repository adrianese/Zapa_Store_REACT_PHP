// src/pages/Checkout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import Swal from "sweetalert2";

const Checkout = () => {
  const { usuario, isAuthenticated } = useAuth();
  const { carrito, setCarrito } = useContext(CarritoContext);
  const navigate = useNavigate();

  const confirmarCompra = async () => {
    if (!isAuthenticated || !usuario?.id_usuario) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para confirmar tu compra.",
      });
      return;
    }

    const nuevoPedido = {
      id_usuario: usuario.id_usuario,
      total: carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
      productos: carrito,
    };

    try {
      const response = await fetch(
        "/back/pedido_create.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoPedido),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Compra confirmada",
          text: "Tu pedido fue registrado correctamente.",
        });
        setCarrito([]);
        navigate("/mis-compras");
      } else {
        const errorData = await response.json();
        Swal.fire(
          "Error",
          errorData.message || "No se pudo registrar tu pedido.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con el servidor.",
      });
    }
  };

  return (
    <div className="container">
      <h2>Confirmar Compra</h2>
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          <ul>
            {carrito.map((p, i) => (
              <li key={i}>
                {p.nombre} - Talle: {p.talle} - Cantidad: {p.cantidad} - $
                {p.precio.toLocaleString("es-AR")}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total:</strong> $
            {carrito
              .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
              .toLocaleString("es-AR")}
          </p>
          <button className="submit-btn" onClick={confirmarCompra}>
            Confirmar Pedido
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
