import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import HomeVisitante from "./HomeVisitante";
import HomeEmpresa from "./HomeEmpresa";
import HomeCandidato from "./HomeCandidato";

const HomeRouter = () => {
  const { usuario } = useContext(UserContext);

  if (!usuario) {
    return <HomeVisitante />;
  }

  if (usuario.tipo === "EMPRESA") {
    return <HomeEmpresa />;
  }

  if (usuario.tipo === "CANDIDATO") {
    return <HomeCandidato />;
  }

  return <HomeVisitante />;
};

export default HomeRouter;
