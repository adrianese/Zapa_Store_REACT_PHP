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
    precio: "",
    imagen: "",        // nombre guardado en BD
    imagen_file: null, // objeto File seleccionado
  });
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // 🔎 Cargar datos del producto si estamos editando
  useEffect(() => {
    const fetchProductData = async () => {
      if (id) {
        try {
          const response = await fetch(
            `http://localhost/ReactCRUDphp/back/producto.php?id=${id}`
          );
          if (!response.ok) throw new Error("Error de red");
          const productData = await response.json();

          const formattedProduct = {
            ...productData,
            disponible: productData.disponible === 1 || productData.disponible === true,
          };

          setProduct(formattedProduct);

          // ✅ Preview de imagen actual desde carpeta uploads
          if (formattedProduct.imagen) {
            setPreview(`/uploads/productos/${formattedProduct.imagen}`);
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo cargar el producto.", "error");
          navigate("/admin/board");
        }
      }
    };
    fetchProductData();
  }, [id, navigate]);

  // 🔧 Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // 🔧 Manejo de archivo de imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({ ...prev, imagen_file: file }));
      setPreview(URL.createObjectURL(file)); // preview del nuevo archivo
    } else {
      setProduct((prev) => ({ ...prev, imagen_file: null }));
      setPreview(id && product.imagen ? `/uploads/productos/${product.imagen}` : null);
    }
  };

  // 🔧 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = id
      ? "http://localhost/ReactCRUDphp/back/producto_update.php"
      : "http://localhost/ReactCRUDphp/back/producto_create.php";

    // Validación especial para MARCA
    const isMarca = product.marca.toUpperCase() === "MARCA";
    const modeloRegex = /^MA-\d{4}$/;
    let nombreImagenBD = product.imagen;
    let fileToSend = product.imagen_file;

    if (isMarca && !modeloRegex.test(product.modelo)) {
      Swal.fire(
        "Error",
        "El modelo debe tener el formato MA-XXXX si la marca es MARCA.",
        "error"
      );
      return;
    }

    // Si hay archivo nuevo, definimos nombre final
    if (fileToSend) {
      const extension = fileToSend.name.split(".").pop().toLowerCase();
      nombreImagenBD = `${product.modelo}.${extension}`;
    } else if (!id && !nombreImagenBD) {
      Swal.fire(
        "Error",
        "Debe seleccionar una imagen para crear un producto.",
        "error"
      );
      return;
    }

    // Construcción de FormData
    const formData = new FormData();
    formData.append("id_producto", id || "");
    formData.append("marca", product.marca);
    formData.append("modelo", product.modelo);
    formData.append("actividad", product.actividad);
    formData.append("disponible", product.disponible ? 1 : 0);
    formData.append("precio", product.precio);
    formData.append("imagen_nombre", nombreImagenBD);

    if (fileToSend) {
      formData.append("imagen_file", fileToSend, nombreImagenBD);
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.message || "Error en la operación");
      }

      Swal.fire("Éxito", result.message, "success");
      navigate("/admin/board");
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire(
        "Error",
        error.message || "Hubo un problema al enviar los datos.",
        "error"
      );
    }
  };

  return (
    <div className="product-form-container">
      <h2>{id ? "Editar Producto" : "Crear Producto"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Marca</label>
          <input
            type="text"
            name="marca"
            value={product.marca}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Modelo (Ej: MA-1234 si Marca es MARCA)</label>
          <input
            type="text"
            name="modelo"
            value={product.modelo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Actividad</label>
          <input
            type="text"
            name="actividad"
            value={product.actividad}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Precio</label>
          <input
            type="number"
            name="precio"
            value={product.precio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Imagen</label>
          <input
            type="file"
            name="imagen_file"
            onChange={handleFileChange}
            required={!id}
          />
        </div>

        {/* ✅ Preview de imagen actual o nueva */}
        {preview && (
          <div className="previe">
            <p>Vista previa:</p>
            <img className="previe-img" src={preview} alt="Vista previa" />
            <p className="filename-hint">
              {product.imagen_file
                ? `Archivo seleccionado: ${product.imagen_file.name}`
                : `Archivo actual: ${product.imagen}`}
            </p>
          </div>
        )}

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="disponible"
              checked={product.disponible === true}
              onChange={() =>
                setProduct((prev) => ({ ...prev, disponible: true }))
              }
            />
            ✅ Disponible
          </label>
          <label>
            <input
              type="radio"
              name="disponible"
              checked={product.disponible === false}
              onChange={() =>
                setProduct((prev) => ({ ...prev, disponible: false }))
              }
            />
            ❌ Sin stock
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="boton-verde redondeado"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
          <button type="submit" className="boton-verde redondeado">
            {id ? "Actualizar Producto" : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;