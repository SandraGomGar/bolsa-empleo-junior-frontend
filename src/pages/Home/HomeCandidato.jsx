import React, { useEffect, useState } from "react";
import BuscadorOfertas from "../../components/BuscadorOfertas/BuscadorOfertas";
import ListaOfertas from "../../components/ListaOfertas/ListaOfertas";
import { OfertasService } from "../../services/api";
import { useNavigate } from "react-router-dom";

const HomeCandidato = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filtros, setFiltros] = useState({
    palabraClave: "",
    lugar: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    cargarOfertas();
  }, []);

  const cargarOfertas = async () => {
    try {
      const data = await OfertasService.getAll();
      setOfertas(data);
    } catch (err) {
      console.error("Error al cargar ofertas:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    const resultados = ofertas.filter((oferta) => {
      const coincidePalabra =
        filtros.palabraClave === "" ||
        oferta.titulo.toLowerCase().includes(filtros.palabraClave.toLowerCase());
      const coincideLugar =
        filtros.lugar === "" ||
        oferta.ubicacion.toLowerCase().includes(filtros.lugar.toLowerCase());
      return coincidePalabra && coincideLugar;
    });
    setOfertas(resultados);
  };

  const handleVerDetalles = (id) => {
    navigate(`/oferta/${id}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        Bienvenido/a, aquí puedes encontrar ofertas adaptadas a tu perfil 🎯
      </h2>
      <BuscadorOfertas filtros={filtros} setFiltros={setFiltros} onBuscar={handleBuscar} />
      <ListaOfertas ofertas={ofertas} loading={loading} error={error} onVerDetalles={handleVerDetalles} />
    </div>
  );
};

export default HomeCandidato;
