import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Login = ({ tipo }) => {
  const [formData, setFormData] = useState({ email: "", contraseña: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

      // Redirigir según el tipo
      if (usuario.tipo === "CANDIDATO") {
        navigate("/candidato/perfil");
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
    <Card className="mt-4 mx-auto" style={{ maxWidth: "500px" }}>
      <Card.Body>
        <h4 className="mb-4">
          {tipo === "EMPRESA" && "Login para empresas"}
          {tipo === "CANDIDATO" && "Login para candidatos"}
          {!tipo && "Iniciar sesión"}
        </h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </Form>

        <div className="mt-3 text-center">
          <p>¿No tienes cuenta?</p>
          {tipo === "EMPRESA" && (
            <Link to="/registro/empresa" className="btn btn-outline-secondary btn-sm">
              Regístrate como empresa
            </Link>
          )}
          {tipo === "CANDIDATO" && (
            <Link to="/registro/candidato" className="btn btn-outline-secondary btn-sm">
              Regístrate como candidato
            </Link>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Login;
