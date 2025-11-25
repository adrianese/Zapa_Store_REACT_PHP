import React, { useEffect, useState } from "react";
import "./MisCompras.css";
import { useAuth } from "../context/AuthProvider";
import Swal from "sweetalert2";

const MisCompras = () => {
  const { usuario, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const obtenerPedidos = async () => {
      if (!isAuthenticated || !usuario?.id_usuario) return;

      try {
        const res = await fetch(
          `http://localhost/ReactCRUDphp/back/pedidos.php?id_usuario=${usuario.id_usuario}`
        );
        const data = await res.json();
        setPedidos(data || []);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar tus compras.",
        });
      }
    };

    obtenerPedidos();
  }, [usuario, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="miscompras-container">
        <p className="error-text">Debes iniciar sesión para ver tus compras.</p>
      </div>
    );
  }

  return (
    <div className="miscompras-container">
      <h2 className="miscompras-title">Mis Compras</h2>
      {pedidos.length === 0 ? (
        <p className="loading-text">No tenés compras registradas.</p>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <div key={pedido.id_pedido} className="pedido-card">
              <div className="pedido-top">
                <div className="pedido-left">
                  <p>
                    <strong>ID Pedido:</strong> {pedido.id_pedido}
                  </p>
                  <p>
                    <strong>Factura:</strong> {pedido.factura}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {pedido.fecha}
                  </p>
                </div>
                <div className="pedido-right">
                  <p>
                    <strong>Estado:</strong> {pedido.estado}
                  </p>
                  <p>
                    <strong>Total:</strong> $
                    {parseFloat(pedido.total).toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
              <ul>
                {pedido.productos.map((prod, index) => (
                  <li key={index}>
                    {prod.marca} {prod.modelo} — Talle: {prod.talle} — Cantidad: {prod.cantidad} — $
                    {parseFloat(prod.precio).toLocaleString("es-AR")}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCompras;
