import React, { useEffect, useState } from "react";

import ProdCard from "../../components/admin/ProdCard";
import { useAuth } from "../../context/AuthProvider";
import "./ProductList.css";


const ProductList = () => {
 
  const { usuario } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost/ReactCRUDphp/back/producto.php"
        );
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        "http://localhost/ReactCRUDphp/back/producto_delete.php",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_producto: id }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      setProducts((prev) => prev.filter((p) => p.id_producto !== id));
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      setError(err.message);
    }
  };

  if (loading) return <p className="loading-text">🔄 Cargando productos...</p>;
  if (error) return <p className="error-text">❌ Error: {error}</p>;

  return (
    <div className="product-list">
      <h4 className="welcome">
        Bienvenido, {usuario?.nombre}
      </h4>

      <h2>Lista de Productos</h2>
      <div className="productos-lista">
        {products.map((product) => (
          <ProdCard
            key={product.id_producto}
            producto={product}
            onDelete={() => handleDelete(product.id_producto)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
