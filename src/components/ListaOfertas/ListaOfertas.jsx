import React, { useEffect } from "react";
import { Card,  Spinner, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import './ListaOfertas.styles.css'

import defaultLogo from "../../assets/images/Imagen Landing Busqueda.png";
import techNovaLogo from "../../assets/images/technovaLogo.png";
import cloudsyLogo from "../../assets/images/cloudsyLogo.png";
import bytewayLogo from "../../assets/images/bytewayLogo.png";
import codifylabLogo from "../../assets/images/codifylabLogo.png";
import devsparckLogo from "../../assets/images/devsparckLogo.png";

const ListaOfertas = ({ ofertas, loading, error, onVerDetalles }) => {
  useEffect(() => {
    if (error) {
      toast.error("Error al cargar las ofertas");
    }
  }, [error]);

  useEffect(() => {
    if (!loading && ofertas?.length === 0) {
      toast.info("No hay ofertas disponibles en este momento");
    }
  }, [loading, ofertas]);

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

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando ofertas...</p>
      </div>
    );
  }

  if (ofertas?.length === 0) {
    return (
      <Card className="mt-4">
        <Card.Body>
          <Card.Text>No hay ofertas disponibles en este momento.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (

    <div className="list-cards-container">
      {ofertas?.map((oferta) => (
        <Card className="oferta-card">
          <Card.Body>
            <div className="oferta-container">
              <img 
                src={getCompanyLogo(oferta.empresa?.nombre)} 
                alt={`Logo de ${oferta.empresa?.nombre || "empresa"}`}
                className="company-logo"
              />
              <div className="oferta-title-container">
                <Card.Title>{oferta.titulo}</Card.Title>
                <Card.Text>
                  {oferta.empresa?.nombre || "Empresa"}
                </Card.Text>
              </div>

              <div className="oferta-location-container">
                <Card.Text>
                <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                  {oferta.ubicacion}
                </Card.Text>
              </div>

              <Button
                className="button-details"
                variant="outline-primary"
                size="sm"
                onClick={() => onVerDetalles(oferta.id)}
                aria-label={`Ver detalles de la oferta ${oferta.titulo}`}
              >
                Ver detalles
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
};

export default ListaOfertas;
