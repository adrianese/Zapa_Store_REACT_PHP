import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import ProductoCard from "../components/ProductoCard";
import Buscador from "../components/Buscador";
import ModalComparacion from "../components/ModalComparacion";
import CarritoModal from "../components/CarritoModal";
import Paginador from "../components/Paginador";

import Swal from "sweetalert2";
import "../components/ProductoCard.css";


const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [mostrarModalComparacion, setMostrarModalComparacion] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1); // estado de página
  const itemsPorPagina = 8; // cantidad de productos por página
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarFlecha, setMostrarFlecha] = useState(false);
  const navigate = useNavigate();
  const { carrito, setCarrito } = useContext(CarritoContext);

  // Scroll para mostrar flecha
  useEffect(() => {
    const handleScroll = () => {
      const umbral = document.documentElement.scrollHeight * 0.35;
      setMostrarFlecha(window.scrollY > umbral);

      const boton = document.getElementById("boton-ver-carrito");
      if (boton) {
        boton.style.opacity = window.scrollY > 300 ? "0" : "1";
        boton.style.pointerEvents = window.scrollY > 300 ? "none" : "auto";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //  Obtener productos desde tu backend PHP
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
       //  const respuesta = await fetch(`http://localhost/ReactCRUDphp/back/producto.php`);
         const respuesta = await fetch(`/back/producto.php`);
        if (!respuesta.ok)
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        const data = await respuesta.json();
        // Normalizar datos: convertir strings a números/boolean
        const productosNormalizados = data.map((p) => ({
          ...p,
          precio: Number(p.precio),
          disponible: Boolean(Number(p.disponible)),
          imagen: `${p.imagen}`,
          talles: p.talles.map((t) => ({
            ...t,
            talle: Number(t.talle),
            stock: Number(t.stock),
          })),
        }));
         setProductos(productosNormalizados);
         setProductosFiltrados(productosNormalizados);
       
      } catch (error) {
        console.error("Error al obtener productos:", error);
        Swal.fire({
          icon: "error",
          title: "Error de carga",
          text: "No se pudieron obtener los productos. Intenta nuevamente más tarde.",
        });
      }
    };
    obtenerProductos();
  }, []);

  //  Agregar producto al carrito
  const toggleCarrito = (producto, talle) => {
    if (!producto.disponible) {
      Swal.fire({
        icon: "error",
        title: "Producto no disponible",
        text: "Este producto no está disponible.",
      });
      return;
    }

    if (!talle) {
      Swal.fire({
        icon: "warning",
        title: "Talle requerido",
        text: "Seleccioná un talle antes de continuar.",
      });
      return;
    }

    const existe = carrito.find(
      (p) => p.id_producto === producto.id_producto && p.talle === talle
    );

    if (existe) {
      Swal.fire({
        icon: "info",
        title: "Ya agregado",
        text: `Este producto en talle ${talle} ya está en el carrito.`,
      });
      return;
    }

    setCarrito([...carrito, { ...producto, talle, cantidad: 1 }]);
    setMostrarCarrito(true);
  };

  const eliminarDelCarrito = (id_producto, talle) => {
    setCarrito(
      carrito.filter(
        (p) => !(p.id_producto === id_producto && p.talle === talle)
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const confirmarCompra = () => {
    navigate("/carrito");
  };

  const productosSeleccionados = productosFiltrados.filter((p) =>
    seleccionados.includes(p.id_producto)
  );

  // Calcular productos visibles según página
  const indexInicio = (paginaActual - 1) * itemsPorPagina;
  const indexFin = indexInicio + itemsPorPagina;
  const productosVisibles = productosFiltrados.slice(indexInicio, indexFin);



  return (
    <div className="seccion">
      <Buscador productos={productos} onFiltrar={setProductosFiltrados} />

   <div className="contenedor-productos">
  {productosVisibles.map((producto) => (
    <ProductoCard
      key={producto.id_producto}
      producto={{
        ...producto,
        imagen: `../../uploads/productos/${producto.imagen}`,
      }}
      seleccionado={seleccionados.includes(producto.id_producto)}
      enCarrito={carrito.some(
        (p) => p.id_producto === producto.id_producto
      )}
      onToggleCarrito={toggleCarrito}
    />
  ))}
</div>
       {/* Paginador */}
      <Paginador
        totalItems={productosFiltrados.length}
        itemsPorPagina={itemsPorPagina}
        paginaActual={paginaActual}
        onPageChange={setPaginaActual}
      />


      {seleccionados.length >= 2 && (
        <button
          className="boton-comparar-flotante"
          onClick={() => setMostrarModalComparacion(true)}
        >
          Comparar Seleccionados
        </button>
      )}

      {mostrarModalComparacion && (
        <ModalComparacion
          productos={productosSeleccionados}
          onCerrar={() => {
            setMostrarModalComparacion(false);
            setSeleccionados([]);
          }}
        />
      )}

      <div
        className={`flotante ${mostrarFlecha ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img src="/imagenes/uparrow.svg" alt="Ir arriba" />
      </div>

      {mostrarCarrito && (
        <CarritoModal
          carrito={carrito}
          setCarrito={setCarrito}
          onEliminar={eliminarDelCarrito}
          onVaciar={vaciarCarrito}
          onCerrar={() => setMostrarCarrito(false)}
          onConfirmar={confirmarCompra}
        />
      )}

      {carrito.length > 0 && (
        <button
          className={`boton-ver-carrito-flotante ${
            mostrarCarrito ? "oculto" : ""
          }`}
          onClick={() => setMostrarCarrito(true)}
          id="boton-ver-carrito"
        >
          🛒 Ver Carrito
        </button>
      )}
    </div>
  );
};

export default Productos;
