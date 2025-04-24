// src/pages/OfertasEmpresa/CandidatosOferta.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Spinner, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import './CandidatosOferta.styles.css'

const CandidatosOferta = () => {
  const { id } = useParams(); // ID de la oferta desde la URL
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPostulaciones = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/postulaciones/oferta/${id}`);
        setPostulaciones(res.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Error al cargar los candidatos");
      } finally {
        setLoading(false);
      }
    };

    cargarPostulaciones();
  }, [id]);

  const actualizarEstado = async (postulacionId, nuevoEstado) => {
    try {
      await axios.patch(`http://localhost:8081/api/postulaciones/${postulacionId}/estado`, null, {
        params: { estado: nuevoEstado },
      });

      setPostulaciones((prev) =>
        prev.map((p) =>
          p.id === postulacionId ? { ...p, estado: nuevoEstado } : p
        )
      );

      toast.success(`Candidato ${nuevoEstado.toLowerCase()}`);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Error al actualizar el estado");
    }
  };

  const renderEstado = (estado) => {
    switch (estado) {
      case "ACEPTADA":
        return <Badge bg="success">Aceptado</Badge>;
      case "DESCARTADA":
        return <Badge bg="danger">Descartado</Badge>;
      default:
        return <Badge bg="secondary">Pendiente</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando candidatos...</p>
      </div>
    );
  }

  if (postulaciones.length === 0) {
    return (
      <div className="container mt-4">
        <h2>No hay candidatos para esta oferta</h2>
        <p>Aún no se ha postulado ningún candidato.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-5">Candidatos para la oferta</h2>
      {postulaciones.map((p) => (
        <Card key={p.id} className="mb-3 Card">
          <Card.Body>
            <div className="d-flex container-nameBadge">
            <Card.Title>{p.candidato.nombre} ({p.candidato.email})</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {renderEstado(p.estado)}
            </Card.Subtitle>
            </div>

            <div className="job-details mb-3">
              <div className="detail-row">
                <span className="detail-label bold">
                  <i className="bi bi-phone-alt-fill text-muted me-1"></i>
                  Teléfono:
                </span>
                <span>{p.candidato.telefono}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label bold">
                  <i className="bi bi-geo-alt-fill text-muted me-1"></i>
                  Ubicación:
                </span>
                <span>{p.candidato.provincia}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label bold">
                  <i className="bi bi-book-half text-muted me-1"></i>
                  Otros datos:
                </span>
                <span>{p.candidato.otrosDatos || "No especificado"}</span>
              </div>

            </div>

            <Card.Text>
              <strong>Idiomas:</strong>
              {p.candidato.idiomas.length > 0 ? (
                <ul>
                  {p.candidato.idiomas.map((e) => (
                    <li key={e.id}>{e.nivel} en {e.centro}</li>
                  ))}
                </ul>
              ) : (
                <span> No indicados.</span>
              )}
            </Card.Text>

            <Card.Text>
              <strong>Estudios:</strong>
              {p.candidato.estudios.length > 0 ? (
                <ul>
                  {p.candidato.estudios.map((e) => (
                    <li key={e.id}>{e.nivel} en {e.centro}</li>
                  ))}
                </ul>
              ) : (
                <span> No indicados.</span>
              )}
            </Card.Text>

            <Card.Text>
              <strong>Experiencia laboral:</strong>
              {p.candidato.experiencias.length > 0 ? (
                <ul>
                  {p.candidato.experiencias.map((exp) => (
                    <li key={exp.id}>{exp.puesto} en {exp.empresa}</li>
                  ))}
                </ul>
              ) : (
                <span> No indicada.</span>
              )}
            </Card.Text>

            <div className="d-flex gap-2 justify-content-end">
              <Button
              className="details-button"
                variant="success"
                size="sm"
                onClick={() => actualizarEstado(p.id, "ACEPTADA")}
                disabled={p.estado === "ACEPTADA"}
              >
                Aceptar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => actualizarEstado(p.id, "DESCARTADA")}
                disabled={p.estado === "DESCARTADA"}
              >
                Descartar
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default CandidatosOferta;
