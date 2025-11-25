import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Producto.css";

function Producto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [detallesMarca, setDetallesMarca] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await fetch(
          `http://localhost/ReactCRUDphp/back/producto.php?id=${id}`
        );
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setProducto(data);
      } catch (err) {
        console.error("Error al obtener el producto:", err);
        setError(true);
      }
    };

    obtenerProducto();
  }, [id]);
 useEffect(() => {
    if (!producto) return;

    fetch("/detalles.json")
      .then((res) => res.json())
      .then((data) => {
        const detalle = data.productos_deportivos.find(
          (d) => d.marca === producto.marca
        );
        setDetallesMarca(detalle);
      })
      .catch((err) => console.error("Error al obtener detalles:", err));
  }, [producto]);
  if (error) return <div>Producto no encontrado.</div>;
  if (!producto) return <div>Cargando...</div>;

  const { marca, modelo, precio, imagen, actividad, disponible, talles } = producto;

  return (
    <main className="contenedor seccion contenido-principal">
      <div className="producto-detalle">
        <div className="producto-info">
          <h1>{marca.toUpperCase()}</h1>
          <p className="precio">
            $ {parseFloat(precio).toLocaleString("es-AR")}
          </p>
          <p>
            <strong>Modelo:</strong> {modelo}
          </p>
          <div className="producto-inf">
            <p>
              <strong>Actividad:</strong> {actividad}
            </p>
            <p>
              <strong>Disponibilidad:</strong>{" "}
              {disponible ? "En stock" : "Agotado"}
            </p>
            <p>
              <strong>Talles disponibles:</strong>{" "}
              {talles && talles.length > 0
                ? talles.map((t) => t.talle).join(", ")
                : "No hay talles registrados"}
            </p>
          </div>
        </div>

        <div className="producto-contenido">
          <div className="producto-imagen">
            <img src={`/uploads/productos/${imagen}`} 

             alt={marca} />
          </div>
          <div className="producto-descripcion">
            {detallesMarca && (
              <div className="producto-detalles-extra">
                <p>
                  <strong>Actividad más recomendada</strong>
                </p>
                {detallesMarca.actividad_apta.map((texto, index) => (
                  <p className="p-producto" key={`act-${index}`}>
                    {texto}
                  </p>
                ))}
                <p>
                  <strong>Beneficios y materiales</strong>
                </p>
                {detallesMarca.beneficios_materiales.map((texto, index) => (
                  <p className="p-producto" key={`mat-${index}`}>
                    {texto}
                  </p>
                ))}
              </div>
            )}
            <button
              className="boton-verde"
              onClick={() => window.history.back()}
            >
              ← Volver a productos
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Producto;
