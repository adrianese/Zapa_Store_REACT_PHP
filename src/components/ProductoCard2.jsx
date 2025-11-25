import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProductoCard.css";

const ProductoCard = ({ producto, onToggleCarrito }) => {
  const [talle, setTalle] = useState("");

  return (
    <div className="producto">
      <div className="encabezado-card"></div>

      <div className="anuncio">
        
        <img src={`/uploads/productos/${producto.imagen}`}
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

          <div className="selector-talle">
            <label
              htmlFor={`talle-${producto.id_producto}`}
              className="label-talle"
            >
              Talle
            </label>
            <select
              className="select-talle"
              id={`talle-${producto.id_producto}`}
              value={talle}
              onChange={(e) => setTalle(e.target.value)}
            >
              <option value="" disabled hidden>
                Seleccione Talle
              </option>

              {producto.talles && producto.talles.length > 0 ? (
                [
                  ...new Map(producto.talles.map((t) => [t.talle, t])).values(),
                ].map((t) => (
                  <option
                    key={t.talle}
                    value={t.talle}
                    disabled={t.stock === 0}
                  >
                    {t.talle}{" "}
                    {t.stock === 0 ? "(Agotado)" : `(Stock: ${t.stock})`}
                  </option>
                ))
              ) : (
                <option disabled>No hay talles</option>
              )}
            </select>
          </div>

          <button
            className="boton-naranja"
            onClick={() => {
              onToggleCarrito(producto, talle);
              setTalle(""); // Reinicia el selector
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
