// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const AppNavbar = () => {
  const { usuario, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand style={{width:"100%"}} as={Link} to="/">JR Job</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* <Nav className="me-auto">
            <Nav.Link as={Link} to="/ofertas">Ofertas</Nav.Link>
          </Nav> */}

          <Nav>
            {!usuario ? (
              <>
                <Nav.Link as={Link} to="/login/candidato">Login Candidato</Nav.Link>
                <Nav.Link as={Link} to="/login/empresa">Login Empresa</Nav.Link>
              </>
            ) : (
              <NavDropdown title={usuario.nombre || "Usuario"} id="user-dropdown">
                {usuario.tipo === "CANDIDATO" && (
                  <>
                    <NavDropdown.Item as={Link} to="/candidato/perfil">Mi perfil</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/candidato/candidaturas">Mis candidaturas</NavDropdown.Item>
                  </>
                )}
                {usuario.tipo === "EMPRESA" && (
                  <>
                    <NavDropdown.Item as={Link} to="/empresa/perfil">Mi perfil</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/empresa/ofertas">Ofertas publicadas</NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
