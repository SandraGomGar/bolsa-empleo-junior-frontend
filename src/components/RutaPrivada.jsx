import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// Requiere login y tipo específico (si se pasa)
const RutaPrivada = ({ tipoRequerido }) => {
  const { usuario } = useContext(UserContext);

  // Si no hay usuario → redirigir al login
  if (!usuario) {
    return <Navigate to="/login" />;
  }

  // Si hay usuario pero no es del tipo requerido → redirigir a /ofertas
  if (tipoRequerido && usuario.tipo !== tipoRequerido) {
    return <Navigate to="/ofertas" />;
  }

  return <Outlet />;
};

export default RutaPrivada;