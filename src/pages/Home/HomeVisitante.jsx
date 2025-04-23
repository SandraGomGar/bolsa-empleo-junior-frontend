import React, { useEffect, useState } from "react";
import ListaOfertas from "../../components/ListaOfertas/ListaOfertas";
import BuscadorOfertas from "../../components/BuscadorOfertas/BuscadorOfertas";
import { OfertasService } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const HomeVisitante = () => {
  const [ofertas, setOfertas] = useState([]);
  const [ofertasOriginales, setOfertasOriginales] = useState([]); // ✅ NUEVO
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
      setOfertasOriginales(data); // ✅ Guardamos las originales
    } catch (error) {
      console.error("Error al cargar ofertas:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    const resultados = ofertasOriginales.filter((oferta) => {
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
      <h1 className="text-center mb-4">🎯 JRJob</h1>

      <BuscadorOfertas filtros={filtros} setFiltros={setFiltros} onBuscar={handleBuscar} />
      <ListaOfertas
        ofertas={ofertas}
        loading={loading}
        error={error}
        onVerDetalles={handleVerDetalles}
      />

      {/* Sección Empresas que buscan talento junior */}
      <section className="mt-5">
        <h3 className="text-center mb-4">Empresas que buscan talento junior</h3>
        <div className="d-flex justify-content-center flex-wrap gap-4">
          <div className="empresa-logo border p-3 rounded shadow">TechNova</div>
          <div className="empresa-logo border p-3 rounded shadow">DevSpark</div>
          <div className="empresa-logo border p-3 rounded shadow">CodifyLab</div>
          <div className="empresa-logo border p-3 rounded shadow">ByteWay</div>
          <div className="empresa-logo border p-3 rounded shadow">Cloudsy</div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mt-5 text-center p-4 bg-light rounded">
        <h4>¿Eres empresa?</h4>
        <p>Publica tu primera oferta totalmente gratis y encuentra el mejor talento junior.</p>
        <Button variant="success" onClick={() => navigate("/registro/empresa")}>
          Publicar mi primera oferta
        </Button>
      </section>
    </div>
  );
};

export default HomeVisitante;
