import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Spinner, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

const DetalleOferta = () => {
  const { id } = useParams(); // ID de la oferta desde la URL
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [postulando, setPostulando] = useState(false);

  const { usuario } = useContext(UserContext);

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

  const manejarInscripcion = async () => {
    if (!usuario || usuario.tipo !== "CANDIDATO") {
      toast.error("Debes estar logueado como candidato para postularte");
      return;
    }

    setPostulando(true);
    try {
      await axios.post(`http://localhost:8081/api/postulaciones`, null, {
        params: {
          candidatoId: usuario.id,
          ofertaId: id
        }
      });
      toast.success("Te has inscrito correctamente ✅");
    } catch (error) {
      const mensaje = error.response?.data?.message || "Error al inscribirte";
      toast.error(mensaje);
    } finally {
      setPostulando(false);
    }
  };

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

          {/* 🔘 Botón para inscribirse si es candidato */}
          {usuario?.tipo === "CANDIDATO" && (
            <Button
              variant="primary"
              onClick={manejarInscripcion}
              disabled={postulando}
              className="mt-3"
            >
              {postulando ? "Inscribiéndote..." : "Inscribirme a esta oferta"}
            </Button>
          )}

          {/* 🔒 Mostrar mensaje si no está logueado */}
          {!usuario && (
            <div className="alert alert-info mt-4">
              Para poder inscribirte en esta oferta debes <Link to="/registro/candidato">registrarte</Link> o <Link to="/login/candidato">iniciar sesión</Link>.
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DetalleOferta;
