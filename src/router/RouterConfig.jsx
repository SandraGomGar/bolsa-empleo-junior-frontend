// src/router/RouterConfig.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import HomeRouter from "../pages/Home/HomeRouter";
import Login from "../pages/Login/Login";
import RegistroEmpresa from "../pages/Registro/RegistroEmpresa/RegistroEmpresa";
import RegistroCandidato from "../pages/Registro/RegistroCandidato/RegistroCandidato";
import OfertasPage from "../pages/OfertasPage/OfertasPage";
import DetalleOferta from "../pages/OfertasPage/DetalleOferta";
import PerfilCandidato from "../pages/PerfilCandidato/PerfilCandidato";
import MisCandidaturas from "../pages/MisCandidaturas/MisCandidaturas";
import PerfilEmpresa from "../pages/PerfilEmpresa/PerfilEmpresa";
import OfertasPublicadas from "../pages/OfertasPublicadas/OfertasPublicadas";
import CrearOferta from "../pages/OfertasEmpresa/CrearOferta";
import CandidatosOferta from "../pages/OfertasEmpresa/CandidatosOferta"; // ✅ Nueva vista
import RutaPrivada from "../components/RutaPrivada";

function RouterConfig() {
  return (
    <Routes>
      {/* HOME dinámico según tipo de usuario */}
      <Route path="/" element={<HomeRouter />} />
      <Route path="/ofertas" element={<OfertasPage />} />
      <Route path="/oferta/:id" element={<DetalleOferta />} />

      {/* Login por tipo */}
      <Route path="/login" element={<Login tipo="CANDIDATO" />} />
      <Route path="/login/empresa" element={<Login tipo="EMPRESA" />} />
      <Route path="/login/candidato" element={<Login tipo="CANDIDATO" />} />

      {/* Registro */}
      <Route path="/registro/empresa" element={<RegistroEmpresa />} />
      <Route path="/registro/candidato" element={<RegistroCandidato />} />

      {/* Rutas protegidas para CANDIDATO */}
      <Route element={<RutaPrivada tipoRequerido="CANDIDATO" />}>
        <Route path="/candidato/perfil" element={<PerfilCandidato />} />
        <Route path="/candidato/candidaturas" element={<MisCandidaturas />} />
      </Route>

      {/* Rutas protegidas para EMPRESA */}
      <Route element={<RutaPrivada tipoRequerido="EMPRESA" />}>
        <Route path="/empresa/perfil" element={<PerfilEmpresa />} />
        <Route path="/empresa/ofertas" element={<OfertasPublicadas />} />
        <Route path="/empresa/crear-oferta" element={<CrearOferta />} />
        <Route path="/empresa/oferta/:id/candidatos" element={<CandidatosOferta />} /> {/* ✅ Añadida */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<h2>Página no encontrada</h2>} />
    </Routes>
  );
}

export default RouterConfig;
