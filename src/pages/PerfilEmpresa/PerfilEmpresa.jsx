import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const PerfilEmpresa = () => {
  const navigate = useNavigate();

  const handleCrearOferta = () => {
    navigate("/empresa/crear-oferta"); // ✅ RUTA ACTUALIZADA
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Mi perfil - Empresa</h2>
        <Button variant="success" onClick={handleCrearOferta}>
          + Crear oferta
        </Button>
      </div>
      <p>Información de la empresa registrada.</p>
    </div>
  );
};

export default PerfilEmpresa;
