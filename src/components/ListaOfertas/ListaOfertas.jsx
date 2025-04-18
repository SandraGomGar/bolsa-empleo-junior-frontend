import React, { useEffect } from "react";
import { Card, ListGroup, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const ListaOfertas = ({ ofertas, loading, error }) => {

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
    <Card className="mt-4">
      <Card.Header as="h5">Ofertas Publicadas</Card.Header>
      <ListGroup variant="flush">
        {ofertas?.map((oferta) => (
          <ListGroup.Item key={oferta.id}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5>{oferta.titulo}</h5>
                <p className="mb-1 text-muted">{oferta.empresa?.nombre || "Empresa"}</p>
                <small className="text-muted">{oferta.ubicacion}</small>
              </div>
              <button className="btn btn-outline-primary btn-sm">
                Ver detalles
              </button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default ListaOfertas;
