import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Spinner, Card, Badge, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import './MisCandidaturas.styles.css'
import defaultLogo from "../../assets/images/Imagen Landing Busqueda.png";
import techNovaLogo from "../../assets/images/technovaLogo.png";
import cloudsyLogo from "../../assets/images/cloudsyLogo.png";
import bytewayLogo from "../../assets/images/bytewayLogo.png";
import codifylabLogo from "../../assets/images/codifylabLogo.png";
import devsparckLogo from "../../assets/images/devsparckLogo.png";

const MisCandidaturas = () => {
  const { usuario } = useContext(UserContext);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPostulaciones = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/postulaciones/candidato/${usuario.id}`
        );
        setPostulaciones(res.data);
      } catch (err) {
        toast.error("Error al cargar tus candidaturas");
        console.error(err)
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.id) cargarPostulaciones();
  }, [usuario]);

  const companyLogos = {
    'TechNova': techNovaLogo,
    'DevSpark': devsparckLogo,
    'CodifyLab': codifylabLogo,
    'ByteWay': bytewayLogo,
    'Cloudsy': cloudsyLogo
  };

  const getCompanyLogo = (companyName) => {
    return companyLogos[companyName] || defaultLogo;
  };

  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case "ACEPTADA":
        return <Badge pill bg="success" className="status-badge">Aceptada</Badge>;
      case "DESCARTADA":
        return <Badge pill bg="danger" className="status-badge">Descartada</Badge>;
      default:
        return <Badge pill bg="warning" text="dark" className="status-badge">Pendiente</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 loading-text">Cargando tus candidaturas...</p>
      </div>
    );
  }

  if (postulaciones.length === 0) {
    return (
      <div className="container mt-5 empty-state">
        <h2 className="page-title">Mis Candidaturas</h2>
        <div className="empty-card">
          <p className="empty-text">Aún no te has postulado a ninguna oferta.</p>
          <Button as={Link} to="/ofertas" variant="primary" className="explore-button">
            Explorar ofertas disponibles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="page-title">Mis Candidaturas</h2>

      <div className="applications-container">
        {postulaciones.map((postulacion) => (
          <Card key={postulacion.id} className="application-card">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="title-container-offer">
                  <img
                    src={getCompanyLogo(postulacion.oferta.empresa?.nombre)}
                    alt={`Logo de ${postulacion.oferta.empresa?.nombre || "empresa"}`}
                    className="company-logo"
                  />
                  <div>

                    <h4 className="job-title mb-1">{postulacion.oferta.titulo}</h4>
                    <p className="job-company mb-2">
                      {postulacion.oferta.empresa?.nombre || "Empresa no especificada"}
                    </p>
                  </div>
                </div>
                {renderEstadoBadge(postulacion.estado)}
              </div>

              <div className="job-details mb-3">
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="bi bi-geo-alt-fill text-muted me-1"></i>
                    Ubicación:
                  </span>
                  <span>{postulacion.oferta.ubicacion}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">
                    <i className="bi bi-briefcase-fill text-muted me-1"></i>
                    Tipo:
                  </span>
                  <span>{postulacion.oferta.tipoContrato || "No especificado"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">
                    <i className="bi bi-calendar-check text-muted me-1"></i>
                    Postulación:
                  </span>
                  <span>{new Date(postulacion.fechaPostulacion).toLocaleDateString()}</span>
                </div>
              </div>

              <Button
                as={Link}
                to={`/oferta/${postulacion.oferta.id}`}
                variant="outline-primary"
                className="w-100 details-button"
              >
                Ver detalles de la oferta
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MisCandidaturas;