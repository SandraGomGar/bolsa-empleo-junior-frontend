import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Card, Button, Spinner, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import './OfertasPublicadas.styles.css'

const OfertasPublicadas = () => {
  const { usuario } = useContext(UserContext);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const [ofertaAEliminar, setOfertaAEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/ofertas/empresa/${usuario.id}`);
        setOfertas(res.data);
      } catch (error) {
        toast.error(`Error al cargar ofertas, ${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.id) {
      cargarOfertas();
    }
  }, [usuario]);

  const confirmarEliminacion = (ofertaId) => {
    setOfertaAEliminar(ofertaId);
    setMostrarModal(true);
  };

  const handleEliminarConfirmado = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/ofertas/${ofertaAEliminar}?usuarioId=${usuario.id}`);
      setOfertas((prev) => prev.filter((oferta) => oferta.id !== ofertaAEliminar));
      toast.success("Oferta eliminada correctamente ✅");
    } catch (error) {
      toast.error(`Error al eliminar la oferta ❌, ${error}`);
    } finally {
      setMostrarModal(false);
      setOfertaAEliminar(null);
    }
  };

  const handleEditar = (oferta) => {
    setEditandoId(oferta.id);
    setFormData({ ...oferta });
  };

  const handleGuardar = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8081/api/ofertas/${editandoId}?usuarioId=${usuario.id}`,
        formData
      );
      setOfertas((prev) =>
        prev.map((o) => (o.id === editandoId ? res.data.oferta : o))
      );
      toast.success("Oferta actualizada ✅");
      setEditandoId(null);
    } catch (err) {
      toast.error(`Error al actualizar la oferta ❌, ${err}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (


    <div className="container mt-5">
      <h2 className="page-title mb-5">Ofertas Publicadas</h2>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : ofertas.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">No tienes ofertas publicadas todavía.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/empresa/crear-oferta')}
            className="create-offer-btn"
          >
            Crear nueva oferta
          </Button>
        </div>
      ) : (
        <div className="ofertas-list">
          {ofertas.map((oferta) => (
            <Card key={oferta.id} className="oferta-card Card">
              <Card.Body className="p-3">
                {editandoId === oferta.id ? (
                  <div className="edit-form">
                    <Form.Group className="mb-2">
                      <Form.Label>Título</Form.Label>
                      <Form.Control
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Ubicación</Form.Label>
                      <Form.Control
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Vacantes</Form.Label>
                      <Form.Control
                        name="vacantes"
                        type="number"
                        value={formData.vacantes}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Funciones</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="funciones"
                        value={formData.funciones}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Requisitos</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="requisitos"
                        value={formData.requisitos}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Tipo de contrato</Form.Label>
                      <Form.Control
                        name="tipoContrato"
                        value={formData.tipoContrato}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Sueldo</Form.Label>
                      <Form.Control
                        name="sueldo"
                        value={formData.sueldo}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Modalidad</Form.Label>
                      <Form.Control
                        name="modalidad"
                        value={formData.modalidad}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleGuardar}
                        className="save- details-button"
                      >
                        Guardar cambios
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setEditandoId(null)}
                        className="cancel-btn"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                
                    <div className="oferta-header">
                      <h3 className="oferta-title">{oferta.titulo}</h3>

                    </div>

                    <div className="mini-cards-container mb-5">
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
                        <label>Ubicación</label>
                        <p>{oferta.ubicacion || "No especificado"}</p>
                      </Card>
                    </div>

                    {oferta.mostrarDetalles && (
                      <div className="oferta-more-details">
                        <div className="mt-4 mb-5">
                          <p><strong>Funciones:</strong><br />{oferta.funciones}</p>
                          <p><strong>Requisitos:</strong><br />{oferta.requisitos}</p>
                        </div>
                      </div>
                    )}

                    <div className="oferta-actions">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          setOfertas(prev => prev.map(o =>
                            o.id === oferta.id
                              ? { ...o, mostrarDetalles: !o.mostrarDetalles }
                              : o
                          ))
                        }
                        className="toggle-btn"
                      >
                        {oferta.mostrarDetalles ? "Ocultar detalles" : "Ver detalles"}
                      </Button>

                      <div className="action-buttons">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => navigate(`/empresa/oferta/${oferta.id}/candidatos`)}
                          className="action-btn alert-info-custom"
                        >
                          Candidatos
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditar(oferta)}
                          className="action-btn details-button"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => confirmarEliminacion(oferta.id)}
                          className="action-btn"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}


      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta oferta? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarConfirmado}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OfertasPublicadas;
