// src/pages/MisCandidaturas/MisCandidaturas.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Spinner, Card, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

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
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Error al cargar tus candidaturas 😢");
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.id) cargarPostulaciones();
  }, [usuario]);

  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case "ACEPTADA":
        return <Badge bg="success">Aceptada</Badge>;
      case "DESCARTADA":
        return <Badge bg="danger">Descartada</Badge>;
      default:
        return <Badge bg="secondary">Pendiente</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando tus candidaturas...</p>
      </div>
    );
  }

  if (postulaciones.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Mis Candidaturas</h2>
        <p>Aún no te has postulado a ninguna oferta.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Mis Candidaturas</h2>
      {postulaciones.map((postulacion) => (
        <Card key={postulacion.id} className="mb-3">
          <Card.Body>
            <Card.Title>{postulacion.oferta.titulo}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {postulacion.oferta.ubicacion} • {postulacion.oferta.modalidad}
            </Card.Subtitle>
            <Card.Text>
              <strong>Empresa:</strong> {postulacion.oferta.empresa?.nombre}<br />
              <strong>Tipo de contrato:</strong> {postulacion.oferta.tipoContrato}<br />
              <strong>Fecha de postulación:</strong> {postulacion.fechaPostulacion}<br />
              <strong>Estado:</strong> {renderEstadoBadge(postulacion.estado)}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default MisCandidaturas;
