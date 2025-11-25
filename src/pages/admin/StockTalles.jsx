import React, { useEffect, useState } from "react";
import { FaArrowRight, FaSave, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StockTalles.css";

const StockTalles = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [tallesData, setTallesData] = useState([]);

  // Guardar talles en backend
  const handleSaveTalles = async () => {
    try {
      const response = await fetch(
        "http://localhost/ReactCRUDphp/back/generar_talles.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_producto: selectedProductId, talles: tallesData }),
        }
      );

      const data = await response.json();
      if (data.error) {
        toast.error(`❌ Error: ${data.message}`);
      } else {
        toast.success("✅ Talles actualizados con éxito");
        setShowModal(false);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      toast.error(`❌ Error al guardar talles: ${err.message}`);
    }
  };

  // Obtener productos
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(
          "http://localhost/ReactCRUDphp/back/producto.php"
        );
        if (!response.ok) throw new Error("Error al obtener los datos de stock");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        toast.error(`❌ Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  // Abrir modal con valores actuales
  const handleOpenModal = (product) => {
    setSelectedProductId(product.id_producto);

    if (product.talles && product.talles.length > 0) {
      const tallesMap = new Map(product.talles.map(t => [t.talle, parseInt(t.stock, 10) || 0]));
      const tallesArray = Array.from({ length: 11 }, (_, i) => {
        const talle = 35 + i;
        return { talle, stock: tallesMap.get(talle) ?? 0 };
      });
      setTallesData(tallesArray);
    } else {
      setTallesData(Array.from({ length: 11 }, (_, i) => ({ talle: 35 + i, stock: 0 })));
    }

    setShowModal(true);
  };

  if (loading) return <p className="loading-text">🔄 Cargando stock...</p>;
  if (error) return <p className="error-text">❌ Error: {error}</p>;

  return (
    <div className="stock-container">
      <h2>Stock de Talles por Producto</h2>
      <div className="stock-grid">
        {products.map((product) => (
          <div key={product.id_producto} className="stock-card">
            <img
              src={`/uploads/productos/${product.imagen}`}
              alt={`${product.marca} ${product.modelo}`}
              className="stock-card-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/imagenes/default.png";
              }}
            />
            <div className="stock-card-body">
              <h3>
                {product.marca} - {product.modelo}
              </h3>

              <div className="selector-talle">
                <span className="label-talle">Talles disponibles:</span>
                <div className="talles-grilla">
                  {product.talles && product.talles.length > 0 ? (
                    [...new Map(product.talles.map((t) => [t.talle, t])).values()].map((t, index) => {
                      const stockNum = parseInt(t.stock, 10) || 0;
                      let clases = "talle-boton";
                      let tooltipText = "";

                      if (stockNum === 0) {
                        clases += " agotado";
                        tooltipText = `Talle ${t.talle} : Sin stock`;
                      } else if (stockNum === 1) {
                        clases += " unico";
                        tooltipText = `Talle ${t.talle} : Último disponible`;
                      } else {
                        clases += " disponible";
                        tooltipText = `Talle ${t.talle} : ${stockNum} unidades disponibles`;
                      }

                      return (
                        <button
                          key={index}
                          className={clases}
                          disabled={stockNum === 0}
                          title={tooltipText}
                        >
                          T : {t.talle} <br />({stockNum} u.)
                        </button>
                      );
                    })
                  ) : (
                    <p>❌ No hay talles registrados</p>
                  )}
                </div>
              </div>

              {/* ✅ Link siempre visible al pie */}
              <div className="update-link">
                <strong
                  onClick={() => handleOpenModal(product)}
                  style={{ cursor: "pointer", color: "#497A10" }}
                >
                  <FaArrowRight style={{ marginRight: "6px" }} />
                  Actualizar Productos por Talle
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Actualizar cantidades por talle</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveTalles();
              }}
            >
              <div className="talle-inputs">
                {tallesData.map((t, idx) => (
                  <div key={idx} className="talle-input">
                    <label>Talle {t.talle}:</label>
                    <select
                      value={t.stock}
                      onChange={(e) => {
                        const newData = [...tallesData];
                        newData[idx].stock = parseInt(e.target.value, 10);
                        setTallesData(newData);
                      }}
                    >
                      {Array.from({ length: 11 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button type="submit" className="tab-btn">
                  <FaSave style={{ marginRight: "6px" }} />
                  Guardar
                </button>
                <button type="button" className="tab-btn" onClick={() => setShowModal(false)}>
                  <FaTimes style={{ marginRight: "6px" }} />
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
    </div>
  );
};

export default StockTalles;