import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const RutaPrivada = ({ tipoRequerido }) => {
  const { usuario, cargandoUsuario } = useContext(UserContext);

  if (cargandoUsuario) {
    return <div className="container mt-5">Cargando sesión...</div>; // ✅ Mostramos mientras carga
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (tipoRequerido && usuario.tipo !== tipoRequerido) {
    return <Navigate to="/ofertas" />;
  }

  return <Outlet />;
};

export default RutaPrivada;
