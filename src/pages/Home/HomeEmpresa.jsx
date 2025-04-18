import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const HomeEmpresa = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-3">👋 Bienvenida empresa</h2>
      <p className="mb-4">Gestiona tus ofertas de empleo fácilmente</p>
      <Button variant="success" onClick={() => navigate("/empresa/perfil")}>
        Ir a mi panel de empresa
      </Button>
    </div>
  );
};

export default HomeEmpresa;
