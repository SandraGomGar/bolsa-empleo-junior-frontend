import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const BuscadorOfertas = ({ filtros, setFiltros, onBuscar }) => {
  const handleChange = (e) => {
    setFiltros((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Form onSubmit={onBuscar} className="mb-4">
      <Row className="g-2">
        <Col md={6}>
          <Form.Control
            type="text"
            name="palabraClave"
            size="lg"
            placeholder="Buscar por palabra clave (ej: frontend, marketing...)"
            value={filtros.palabraClave}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            name="lugar"
            size="lg"
            placeholder="Lugar (ej: Madrid, remoto...)"
            value={filtros.lugar}
            onChange={handleChange}
          />
        </Col>
        <Col md={2}>
          <Button type="submit" variant="primary" size="lg" className="w-100 buttonForm">
          🔍 Buscar 
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default BuscadorOfertas;
