import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Spinner, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import './DetalleOferta.styles.css'
import defaultLogo from "../../assets/images/Imagen Landing Busqueda.png";
import techNovaLogo from "../../assets/images/technovaLogo.png";
import cloudsyLogo from "../../assets/images/cloudsyLogo.png";
import bytewayLogo from "../../assets/images/bytewayLogo.png";
import codifylabLogo from "../../assets/images/codifylabLogo.png";
import devsparckLogo from "../../assets/images/devsparckLogo.png";

const DetalleOferta = () => {
  const { id } = useParams(); // ID de la oferta desde la URL
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [postulando, setPostulando] = useState(false);

  const { usuario } = useContext(UserContext);

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
    <div className="container mt-5  mb-5">
      <Card className="p-4 main-card">
        <Card.Body>
          <div className="d-flex align-items-center mb-4 header-container">
            <img
              src={getCompanyLogo(oferta.empresa?.nombre)}
              alt={`Logo de ${oferta.empresa?.nombre || "empresa"}`}
              className="company-logo"
            />
            <div>
              <h3>{oferta.titulo}</h3>
              <p className="text-muted">{oferta.empresa?.nombre || "Empresa no especificada"}</p>
            </div>
          </div>

          <div className="mini-cards-container">
            <Card className="mini-cards">
              <label>Vacantes</label>
              <p>{oferta.vacantes || "No especificado"}</p>
            </Card>


            <Card className="mini-cards">
              <label>Tipo de contrato</label>
              <p>{oferta.tipoContrato || "No especificado"}</p>
            </Card>

            <Card className="mini-cards">
              <label>Salario</label>
              <p>{oferta.sueldo || "Salario no disponible"}</p>
            </Card>

            <Card className="mini-cards">
              <label>Modalidad</label>
              <p>{oferta.modalidad || "No especificado"}</p>
            </Card>

            <Card className="mini-cards">
              <label>Fecha publicación</label>
              <p>{oferta.fechaPublicacion || "No especificado"}</p>
            </Card>

            <Card className="mini-cards">
              <label>Ubicación</label>
              <p>{oferta.ubicacion || "No especificado"}</p>
            </Card>
          </div>

          <div className="job-section mt-4">
            <h5 className="section-title">Descripción del puesto</h5>
            <p className="job-description">{oferta.descripcion || oferta.funciones}</p>
          </div>

          <div className="job-section mt-4">
            <h5 className="section-title">Responsabilidades</h5>
            <div className="responsibilities">
              <p className="job-description">{oferta.requisitos || oferta.funciones}</p>
            </div>
          </div>


          <div className="mt-4 pt-3 border-top">
          {usuario?.tipo === "CANDIDATO" ? (
            <Button
              variant="primary"
              onClick={manejarInscripcion}
              disabled={postulando}
              className="apply-button"
            >
              {postulando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Procesando...
                </>
              ) : (
                "Inscribirme a esta oferta"
              )}
            </Button>
          ) : (
            <div className="alert alert-info mt-0 mb-0 alert-info-custom">
              Para poder inscribirte en esta oferta debes{' '}
              <Link to="/registro/candidato" className="alert-link">registrarte</Link> o{' '}
              <Link to="/login/candidato" className="alert-link">iniciar sesión</Link>.
            </div>
          )}
        </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DetalleOferta;
