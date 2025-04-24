import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PerfilEmpresa = () => {
  const { usuario, login } = useContext(UserContext);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    identificacionFiscal: "",
    descripcion: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (usuario && usuario.tipo === "EMPRESA") {
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        identificacionFiscal: usuario.identificacionFiscal || "",
        descripcion: usuario.descripcion || "",
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`http://localhost:8081/auth/empresa/${usuario.id}`, formData);
      login(res.data.usuario); // Actualiza los datos en el contexto
      toast.success("Perfil actualizado correctamente 🎉");
      setModoEdicion(false);
    } catch (err) {
      toast.error("Error al actualizar perfil");
      console.error(err);
    }
  };

  const handleCrearOferta = () => {
    navigate("/empresa/crear-oferta");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Mi perfil - Empresa</h2>
        <Button variant="success" size="lg" className="details-button" onClick={handleCrearOferta}>
          + Crear oferta
        </Button>
      </div>

      <Card className="Card">
        <Card.Body>
          <Form onSubmit={handleGuardar}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la empresa</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={!modoEdicion}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                disabled={!modoEdicion}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Identificación Fiscal</Form.Label>
              <Form.Control
                type="text"
                name="identificacionFiscal"
                value={formData.identificacionFiscal}
                onChange={handleChange}
                disabled={!modoEdicion}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={!modoEdicion}
                required
              />
            </Form.Group>

            {modoEdicion ? (
              <div className="d-flex justify-content-between">
                <Button className="alert-info-custom" type="submit" variant="primary">
                  💾 Guardar cambios
                </Button>
                <Button variant="secondary" onClick={() => setModoEdicion(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button className="alert-info-custom" variant="outline-primary" onClick={() => setModoEdicion(true)}>
                ✏️ Editar
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PerfilEmpresa;
