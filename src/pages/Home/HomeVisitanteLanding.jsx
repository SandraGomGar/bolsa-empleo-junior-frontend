// src/pages/Home/HomeVisitanteLanding.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import "./HomeVisitanteLanding.css";

import ImagenLanding from "../../assets/images/Imagen Landing Busqueda.png";
import techNovaLogo from "../../assets/images/technovaLogo.png";
import cloudsyLogo from "../../assets/images/cloudsyLogo.png";
import bytewayLogo from "../../assets/images/bytewayLogo.png";
import codifylabLogo from "../../assets/images/codifylabLogo.png";
import devsparckLogo from "../../assets/images/devsparckLogo.png";


const HomeVisitanteLanding = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    palabraClave: "",
    lugar: "",
  });

  const handleBuscar = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (filtros.palabraClave) query.append("palabraClave", filtros.palabraClave);
    if (filtros.lugar) query.append("lugar", filtros.lugar);
    navigate(`/ofertas?${query.toString()}`);
  };

  const employeers = [
    {
      name: 'TechNova',
      img: techNovaLogo,
      description:'Innovación y desarrollo tecnológico enfocado en soluciones de inteligencia artificial para empresas emergentes.'
    },
    {
      name: 'DevSpark',
      img:devsparckLogo,
      description:'Start-up especializada en desarrollo ágil de aplicaciones y microservicios con tecnologías web modernas.'
    },
    {
      name: 'CodifyLab',
      img:codifylabLogo,
      description:'Laboratorio digital centrado en experimentación con código, soluciones educativas y automatización de procesos.'
    },
    {
      name: 'ByteWay',
      img:bytewayLogo,
      description:'Consultora tecnológica experta en arquitectura de software y soluciones escalables basadas en microservicios.'
    },
    {
      name: 'Cloudsy',
      img:cloudsyLogo,
      description:'Proveedor de soluciones cloud centrado en plataformas escalables, almacenamiento seguro y servicios DevOps para empresas digitales.'
    },
  ]

  return (
    <div className="landing-container">
      <section className="hero-section">
        <Container className="custom-container">
          <div className="hero-text">
            <h1>
              Encuentra tu primer empleo con <span className="marca">JRJob</span>
            </h1>
            <p>
              Encuentra oportunidades para comenzar tu carrera en tecnología con empresas
              que buscan talento junior como tú.
            </p>
            <Form className="d-flex gap-2 buscador-form" onSubmit={handleBuscar}>
              <Form.Control
                type="text"
                size="lg"
                placeholder="Puesto, empresa..."
                value={filtros.palabraClave}
                onChange={(e) => setFiltros({ ...filtros, palabraClave: e.target.value })}
              />
              <Form.Control
                type="text"
                size="lg"
                placeholder="Ubicación"
                value={filtros.lugar}
                onChange={(e) => setFiltros({ ...filtros, lugar: e.target.value })}
              />
              <Button type="submit" variant="primary" size="lg" className="buttonForm">
                Buscar empleo
              </Button>
            </Form>
          </div>
          <div className="hero-image">
            <img src={ImagenLanding} alt="Búsqueda de empleo" />
          </div>
        </Container>
      </section>

      <section className="como-funciona mt-5 text-center">
        <h2 className="mb-4">¿Cómo funciona?</h2>
        <div className="pasos d-flex justify-content-center gap-5 flex-wrap">
          <div className="paso-card">
            <h5>📝 Regístrate</h5>
            <p>Crea tu perfil como candidato junior o empresa.</p>
          </div>
          <div className="paso-card">
            <h5>🔍 Busca ofertas</h5>
            <p>Filtra por ciudad, tecnología o tipo de contrato.</p>
          </div>
          <div className="paso-card">
            <h5>📩 Postúlate</h5>
            <p>Inscríbete en las ofertas que te interesen en un clic.</p>
          </div>
        </div>
      </section>

      <section className="empresas-destacadas mt-5 text-center">
        <h2 className="mb-4">Empresas que ya confían en JRJob</h2>

        <div className="d-flex justify-content-center flex-wrap gap-3">
          {employeers.map((employee)=>
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={employee.img} />
            <Card.Body>
              {/* <Card.Title>{employee.name}</Card.Title> */}
              <Card.Text>
               {employee.description}
              </Card.Text>
            </Card.Body>
          </Card>)}
        </div>
      </section>
    </div>
  );
};

export default HomeVisitanteLanding;
