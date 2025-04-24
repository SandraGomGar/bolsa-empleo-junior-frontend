import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegistroEmpresa = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    telefono: "",
    identificacionFiscal: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de longitud de descripción
    if (formData.descripcion.length < 70 || formData.descripcion.length > 2000) {
      toast.error("La descripción debe tener entre 70 y 2000 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8081/auth/registro-empresa", formData);
      console.log('res', res)
      toast.success("Registro de empresa exitoso 🎉");
      navigate("/login/empresa");
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((error) => toast.error(error));
      } else {
        toast.error(err.response?.data?.message || "Error al registrar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-5 mx-auto card-custom-register" style={{ maxWidth: "600px" }}>
      <Card.Body>
        <h4 className="mb-4">Registro de Empresa</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la empresa</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono de contacto</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              placeholder="Ej: 612345678"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Identificación Fiscal (CIF / NIF)</Form.Label>
            <Form.Control
              type="text"
              name="identificacionFiscal"
              value={formData.identificacionFiscal}
              onChange={handleChange}
              required
              placeholder="Ej: B12345678"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción de la empresa</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Entre 70 y 2000 caracteres"
              required
            />
          </Form.Group>

          <Button className="details-button" variant="primary" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse como empresa"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegistroEmpresa;
