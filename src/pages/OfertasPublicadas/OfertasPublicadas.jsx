import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Card, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

const OfertasPublicadas = () => {
  const { usuario } = useContext(UserContext);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/ofertas/empresa/${usuario.id}`);
        setOfertas(res.data);
      } catch (error) {
        toast.error("Error al cargar ofertas");
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.id) {
      cargarOfertas();
    }
  }, [usuario]);

  return (
    <div className="container mt-4">
      <h2>Ofertas Publicadas</h2>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : ofertas.length === 0 ? (
        <p>No tienes ofertas publicadas todavía.</p>
      ) : (
        ofertas.map((oferta) => (
          <Card key={oferta.id} className="mb-3">
            <Card.Body>
              <Card.Title>{oferta.titulo}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {oferta.ubicacion} • {oferta.modalidad}
              </Card.Subtitle>
              <Card.Text>
                <strong>Vacantes:</strong> {oferta.vacantes}<br />
                <strong>Tipo de contrato:</strong> {oferta.tipoContrato}<br />
                <strong>Sueldo:</strong> {oferta.sueldo || "Salario no disponible"}
              </Card.Text>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-primary" size="sm">Editar</Button>
                <Button variant="outline-danger" size="sm">Eliminar</Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default OfertasPublicadas;
