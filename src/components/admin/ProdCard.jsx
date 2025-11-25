import React from "react";
import "./ProdCard.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProdCard = ({ producto, onDelete }) => {
  const navigate = useNavigate();
  const {
    id_producto,
    marca,
    modelo,
    imagen,
    actividad,
    disponible,
    precio,
  } = producto;

  const handleDelete = () => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este producto?",
      html: `
        <div style="text-align:left;">
          <strong>Marca:</strong> ${marca}<br/>
          <strong>Modelo:</strong> ${modelo}<br/>
          <strong>Actividad:</strong> ${actividad}<br/>
          <strong>Disponible:</strong> ${disponible ? "✅ Sí" : "❌ No"}<br/>
          <strong>Precio:</strong> $${parseFloat(precio).toLocaleString("es-AR")}
        </div>
      `,
      imageUrl: `/imagenes/${imagen}`,
      imageWidth: 200,
      imageAlt: marca,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#999",
      confirmButtonText: "🗑️ Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        if (onDelete) onDelete(id_producto);
      }
    });
  };

  return (
    <div className="prod-card">
      {/* Imagen */}
      <div className="prod-img">
        
        <img src={`/uploads/productos/${imagen}`} 

          alt={marca}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/imagenes/default.png";
          }}
        />
      </div>

      {/* Datos */}
      <div className="prod-info">
        <h3 className="prod-nombre">{marca}</h3>
        <p className="prod-label">
          Modelo: <strong>{modelo}</strong>
        </p>
        <p className="prod-label">Actividad: {actividad}</p>
        <p className="prod-label">
          Disponible:{" "}
          <span
            className={
              String(disponible).toLowerCase() === "true"
                ? "badge-disponible"
                : "badge-agotado"
            }
          >
            {String(disponible).toLowerCase() === "true" ? "✅ Sí" : "❌ No"}
          </span>
        </p>

        <p className="prod-label">
          Precio:{" "}
          <span className="precio-bold">
            ${parseFloat(precio).toLocaleString("es-AR")}
          </span>
        </p>
      </div>

      {/* Botones */}
      <div className="acciones-card">
        <button onClick={() => navigate(`/admin/update/${id_producto}`)}>
          Editar
        </button>
        <button onClick={handleDelete}>Borrar</button>
      </div>
    </div>
  );
};

export default ProdCard;
