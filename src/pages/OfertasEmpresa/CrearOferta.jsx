import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CrearOferta = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    puesto: "",
    lugar: "",
    vacantes: "",
    funciones: "",
    requisitos: "",
    tipoContrato: "",
    sueldo: "",
    modalidad: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones mínimas
    if (formData.puesto.length > 200) {
      toast.error("El puesto no puede superar los 200 caracteres");
      return;
    }
    if (formData.funciones.length < 70 || formData.funciones.length > 2000) {
      toast.error("Funciones debe tener entre 70 y 2000 caracteres");
      return;
    }
    if (formData.requisitos.length < 70 || formData.requisitos.length > 2000) {
      toast.error("Requisitos debe tener entre 70 y 2000 caracteres");
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.tipo !== "EMPRESA") {
      toast.error("Debes estar logueado como empresa para crear una oferta");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8081/api/ofertas?usuarioId=${usuario.id}`, {
        titulo: formData.puesto,
        ubicacion: formData.lugar,
        vacantes: formData.vacantes,
        funciones: formData.funciones,
        requisitos: formData.requisitos,
        tipoContrato: formData.tipoContrato,
        sueldo: formData.sueldo,
        modalidad: formData.modalidad,
      });

      toast.success("Oferta creada correctamente ✅");
      console.log('res' , res)
      navigate("/empresa/ofertas");
    } catch (err) {
      toast.error("Error al crear la oferta 😢");
      console.error(err);
    }
  };

  return (
    <Card className="mt-4 mx-auto Card" style={{ maxWidth: "700px" }}>
      <Card.Body>
        <h4 className="mb-4">Crear Nueva Oferta</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Puesto de trabajo</Form.Label>
            <Form.Control
              type="text"
              name="puesto"
              maxLength={200}
              value={formData.puesto}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lugar</Form.Label>
            <Form.Control
              type="text"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Número de vacantes</Form.Label>
            <Form.Control
              type="number"
              name="vacantes"
              value={formData.vacantes}
              onChange={handleChange}
              min={1}
              max={10000}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Funciones</Form.Label>
            <Form.Control
              as="textarea"
              name="funciones"
              rows={4}
              value={formData.funciones}
              onChange={handleChange}
              placeholder="Entre 70 y 2000 caracteres"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Requisitos</Form.Label>
            <Form.Control
              as="textarea"
              name="requisitos"
              rows={4}
              value={formData.requisitos}
              onChange={handleChange}
              placeholder="Entre 70 y 2000 caracteres"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de contrato</Form.Label>
            <Form.Select
              name="tipoContrato"
              value={formData.tipoContrato}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="indefinido">Indefinido</option>
              <option value="duración determinada">Duración determinada</option>
              <option value="parcial">Parcial</option>
              <option value="formativo">Formativo</option>
              <option value="autónomo">Autónomo</option>
              <option value="otros">Otros contratos</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sueldo (opcional)</Form.Label>
            <Form.Control
              type="text"
              name="sueldo"
              value={formData.sueldo}
              onChange={handleChange}
              placeholder="Salario no disponible si se deja vacío"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Modalidad</Form.Label>
            <Form.Select
              name="modalidad"
              value={formData.modalidad}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="presencial">Presencial</option>
              <option value="híbrido">Híbrido</option>
              <option value="teletrabajo">Teletrabajo</option>
            </Form.Select>
          </Form.Group>

          <Button className="details-button" size="lg" variant="success" type="submit">
            Crear oferta ✅
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CrearOferta;