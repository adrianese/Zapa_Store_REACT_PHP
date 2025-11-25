import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProductoCard.css";

const ProductoCard = ({ producto, onToggleCarrito }) => {
  const [talle, setTalle] = useState("");

  return (
    <div className="producto">
      <div className="anuncio">
        <img src={`./../uploads/productos/${producto.imagen}`} 
          alt={`${producto.marca} ${producto.modelo}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/imagenes/default.png";
          }}
        />

        <div className="contenido-anuncio">
          <Link
            to={`/producto/${producto.id_producto}`}
            className="boton-detalle"
          >
            Ver Detalles
          </Link>
          <h2 className="producto-nombre">{producto.marca.toUpperCase()}</h2>
          <p className="modelo">modelo: {producto.modelo}</p>
          <p className="precio">$ {producto.precio.toLocaleString("es-AR")}</p>

          {/* Actividad y disponibilidad */}
          <div className="iconos-caracteristicas icono-alinear">
            <div className="icono-actividad">
              <img
                src={`/imagenes/${producto.actividad.replaceAll(" ", "_")}.svg`}
                alt={producto.actividad}
                title={producto.actividad}
              />
              <p className="modelo">{producto.actividad}</p>
            </div>
            <div className="estado-disponible">
              <img
                src={`/imagenes/${producto.disponible ? "true" : "false"}.svg`}
                alt={producto.disponible ? "Disponible" : "Agotado"}
              />
              <p className="modelo">
                {producto.disponible ? "disponible" : "no disponible"}
              </p>
            </div>
          </div>

          {/* Grid de talles */}
          <div className="selector-talle">
            <p className="label-talle">Talles disponibles:</p>
            <div className="talles-grid">
              {producto.talles && producto.talles.length > 0 ? (
                [
                  ...new Map(producto.talles.map((t) => [t.talle, t])).values(),
                ].map((t) => {
                  const stockNum = parseInt(t.stock); // o Number(t.stock)

                  const clases = ["talle-btn"];

                  let tooltip = ""; // ← mensaje contextual

                  if (stockNum === 0) {
                    clases.push("agotado");
                    tooltip = "Sin stock";
                  } else if (stockNum === 1) {
                    clases.push("unico");
                    tooltip = "Último disponible";
                  } else if (stockNum > 1) {
                    clases.push("disponible");
                  }

                  if (talle === t.talle) {
                    clases.push("seleccionado");
                  }

                  return (
                    <button
                      key={t.talle}
                      className={clases.join(" ")}
                      disabled={stockNum === 0}
                      onClick={() => setTalle(t.talle)}
                      title={tooltip} // ← tooltip dinámico
                    >
                      {t.talle}
                    </button>
                  );
                })
              ) : (
                <span>No hay talles</span>
              )}
            </div>
          </div>

          <button
            className="boton-naranja"
            onClick={() => {
              onToggleCarrito(producto, talle);
              setTalle(""); // Reinicia selección
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;
