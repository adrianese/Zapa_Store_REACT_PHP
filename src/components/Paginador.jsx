// src/components/Paginador.js
import React from "react";
import "./Paginador.css";

const Paginador = ({ totalItems, itemsPorPagina, paginaActual, onPageChange }) => {
  const totalPaginas = Math.ceil(totalItems / itemsPorPagina);
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="paginador">
      {paginas.map((num) => (
        <button
          key={num}
          className={`pagina ${paginaActual === num ? "activo" : ""}`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default Paginador;