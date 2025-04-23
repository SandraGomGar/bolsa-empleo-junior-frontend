import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import logoWeb from "../../assets/images/logoWeb.png";
import imagenLogin from "../../assets/images/imagenLogin.png";


import './Login.styles.css'

const Login = ({ tipo }) => {
  const [formData, setFormData] = useState({ email: "", contraseña: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useContext(UserContext);

  useEffect(() => {
    if (!tipo) toast.info("Accede como empresa o como candidato");
  }, [tipo]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8081/auth/login", formData);
      const usuario = res.data.usuario;

      if (tipo && usuario.tipo !== tipo) {
        toast.error(`Este acceso es solo para usuarios tipo ${tipo.toLowerCase()}`);
        setLoading(false);
        return;
      }

      toast.success("Inicio de sesión exitoso 🎉");

      loginContext(usuario);

      if (usuario.tipo === "CANDIDATO") {
        navigate("/candidato/home");
      } else if (usuario.tipo === "EMPRESA") {
        navigate("/empresa/perfil");
      } else {
        navigate("/ofertas");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-container-login">
      <Card className="mt-4 card-left" style={{ minWidth: "500px" }}>
        <Card.Body>
          <div className="container-images">
          <img className="image-card" src={logoWeb} alt="logoWeb" />
          <img className="image-login" src={imagenLogin} alt="imagen-login" />
          </div>
        </Card.Body>
      </Card>

      <Card className="mt-4 card-right" style={{ minWidth: "500px" }}>
        <Card.Body>
          <h4 className="mb-4 title">
            {tipo === "EMPRESA" && "Login para empresas"}
            {tipo === "CANDIDATO" && "Login para candidatos"}
            {!tipo && "Iniciar sesión"}
          </h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control className="form-input-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control className="form-input-control" type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
            </Form.Group>
            <div className="d-grid gap-2">
            <Button className="button-login" variant="primary" type="submit" size="lg" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
            </div>
          </Form>

          <div className="mt-3 text-center">
            <p>¿No tienes cuenta?</p>
            {tipo === "EMPRESA" && (
              <Link cla to="/registro/empresa" className="btn btn-outline-secondary btn-sm registro-btn">
                Regístrate como empresa
              </Link>
            )}
            {tipo === "CANDIDATO" && (
              <Link cla to="/registro/candidato" className="btn btn-outline-secondary btn-sm registro-btn">
                Regístrate como candidato
              </Link>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
