import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./ProductForm.css";

const ProductForm = () => {
  const [product, setProduct] = useState({
    marca: "",
    modelo: "",
    actividad: "",
    disponible: false,
    precio: 0,
    imagen: "",
    imagen_file: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar datos si estamos editando
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/back/producto.php?id=${id}`);
        const productData = await response.json();

        const formattedProduct = {
          ...productData,
          disponible: productData.disponible === 1 || productData.disponible === true,
        };

        setProduct(formattedProduct);

        if (formattedProduct.imagen) {
          setPreview(`/uploads/productos/${formattedProduct.imagen}?t=${Date.now()}`);
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar el producto.", "error");
        navigate("/admin/board");
      }
    };
    fetchProductData();
  }, [id, navigate]);

  //  Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  //  Manejo de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({ ...prev, imagen_file: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setProduct((prev) => ({ ...prev, imagen_file: null }));
      setPreview(product.imagen ? `/uploads/productos/${product.imagen}` : null);
    }
  };

  //  Validación especial
  const validarProducto = () => {
    const isMarca = product.marca.toUpperCase() === "MARCA";
    const modeloRegex = /^MA-\d{4}$/;
    if (isMarca && !modeloRegex.test(product.modelo)) {
      Swal.fire("Error", "El modelo debe tener formato MA-XXXX si la marca es MARCA.", "error");
      return false;
    }
    if (!id && !product.imagen_file) {
      Swal.fire("Error", "Debe seleccionar una imagen para crear un producto.", "error");
      return false;
    }
    return true;
  };

  //  Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarProducto()) return;

    setLoading(true);

    const url = id ? "/back/producto_update.php" : "/back/producto_create.php";
    const formData = new FormData();

    formData.append("id_producto", id || "");
    formData.append("marca", product.marca);
    formData.append("modelo", product.modelo);
    formData.append("actividad", product.actividad);
    formData.append("disponible", product.disponible ? 1 : 0);
    formData.append("precio", product.precio);

    if (product.imagen_file) {
      formData.append("imagen_file", product.imagen_file);
    }

    try {
      const response = await fetch(url, { method: "POST", body: formData });
      const result = await response.json();

      if (result.error) throw new Error(result.message);

      Swal.fire("Éxito", result.message, "success");
      navigate("/admin/board");
    } catch (error) {
      Swal.fire("Error", error.message || "Hubo un problema al enviar los datos.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{id ? "Editar Producto" : "Crear Producto"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Marca</label>
          <input type="text" name="marca" value={product.marca} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Modelo</label>
          <input type="text" name="modelo" value={product.modelo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Actividad</label>
          <input type="text" name="actividad" value={product.actividad} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Precio</label>
          <input type="number" name="precio" value={product.precio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Imagen</label>
          <input type="file" name="imagen_file" onChange={handleFileChange} required={!id} />
        </div>

        {preview && (
          <div className="preview">
            <p>Vista previa:</p>
            <img className="preview-img" src={preview} alt="Vista previa" />
          </div>
        )}

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="disponible"
              checked={product.disponible === true}
              onChange={() => setProduct((prev) => ({ ...prev, disponible: true }))}
            />
            ✅ Disponible
          </label>
          <label>
            <input
              type="radio"
              name="disponible"
              checked={product.disponible === false}
              onChange={() => setProduct((prev) => ({ ...prev, disponible: false }))}
            />
            ❌ Sin stock
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="boton-verde redondeado" onClick={() => navigate(-1)}>
            Volver
          </button>
          <button type="submit" className="boton-verde redondeado" disabled={loading}>
            {loading ? "Procesando..." : id ? "Actualizar Producto" : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
