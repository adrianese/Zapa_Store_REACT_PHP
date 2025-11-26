import React, { useEffect, useState } from "react";
import ProdCard from "../../components/admin/ProdCard";
import { useAuth } from "../../context/AuthProvider";
import Swal from "sweetalert2";
import "./ProductList.css";

const ProductList = () => {
  const { usuario } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Cargar productos al montar
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/back/producto.php");
        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        } else {
          throw new Error("Error al obtener los productos");
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        Swal.fire("Error", "No se pudo cargar la lista de productos.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //  Eliminar producto con confirmación
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch("/back/producto_delete.php", {
        method: "POST", //  InfinityFree no soporta DELETE
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto: id }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.message || "Error al eliminar el producto");
      }

      // Actualizar lista en frontend
      setProducts((prev) => prev.filter((p) => p.id_producto !== id));
      Swal.fire("Éxito", result.message, "success");
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading) return <p className="loading-text">🔄 Cargando productos...</p>;

  return (
    <div className="product-list">
      <h4 className="welcome">Bienvenido, {usuario?.nombre}</h4>
      <h2>Lista de Productos</h2>

      {products.length === 0 ? (
        <p className="empty-text">⚠️ No hay productos cargados.</p>
      ) : (
        <div className="productos-lista">
          {products.map((product) => (
            <ProdCard
              key={product.id_producto}
              producto={product}
              onDelete={() => handleDelete(product.id_producto)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
