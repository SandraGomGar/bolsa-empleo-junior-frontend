// src/pages/OfertasEmpresa/OfertasPublicadas.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Card, Button, Spinner, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

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
              {editandoId === oferta.id ? (
                <>
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

                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="success" size="sm" onClick={handleGuardar}>
                      Guardar cambios
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditandoId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Card.Title>{oferta.titulo}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {oferta.ubicacion} • {oferta.modalidad}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Vacantes:</strong> {oferta.vacantes}<br />
                    <strong>Tipo de contrato:</strong> {oferta.tipoContrato}<br />
                    <strong>Sueldo:</strong> {oferta.sueldo || "Salario no disponible"}
                  </Card.Text>

                  {/* Detalles opcionales */}
                  {oferta.mostrarDetalles && (
                    <div className="mb-3">
                      <p><strong>Funciones:</strong><br />{oferta.funciones}</p>
                      <p><strong>Requisitos:</strong><br />{oferta.requisitos}</p>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    {/* Botón izquierdo (Ver más) */}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        setOfertas((prev) =>
                          prev.map((o) =>
                            o.id === oferta.id
                              ? { ...o, mostrarDetalles: !o.mostrarDetalles }
                              : o
                          )
                        )
                      }
                    >
                      {oferta.mostrarDetalles ? "➖ Ver menos" : "➕ Ver más"}
                    </Button>

                    {/* Botones derechos */}
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => navigate(`/empresa/oferta/${oferta.id}/candidatos`)}
                      >
                        Ver candidatos
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditar(oferta)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => confirmarEliminacion(oferta.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        ))
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
