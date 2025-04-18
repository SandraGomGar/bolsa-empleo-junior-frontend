import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spinner, Card } from "react-bootstrap";

const DetalleOferta = () => {
  const { id } = useParams(); // ID de la oferta desde la URL
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cargarOferta = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/ofertas/${id}`);
        setOferta(res.data);
      } catch (err) {
        console.error("Error al cargar la oferta", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    cargarOferta();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-center mt-5 text-danger">Error al cargar la oferta.</div>;
  if (!oferta) return null;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <h3>{oferta.titulo}</h3>
          <p><strong>Ubicación:</strong> {oferta.ubicacion}</p>
          <p><strong>Vacantes:</strong> {oferta.vacantes}</p>
          <p><strong>Funciones:</strong><br /> {oferta.funciones}</p>
          <p><strong>Requisitos:</strong><br /> {oferta.requisitos}</p>
          <p><strong>Tipo de contrato:</strong> {oferta.tipoContrato}</p>
          <p><strong>Modalidad:</strong> {oferta.modalidad}</p>
          <p><strong>Sueldo:</strong> {oferta.sueldo || "Salario no disponible"}</p>
          <p><strong>Fecha de publicación:</strong> {oferta.fechaPublicacion}</p>
          <p><strong>Empresa:</strong> {oferta.empresa?.nombre || "No disponible"}</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DetalleOferta;
