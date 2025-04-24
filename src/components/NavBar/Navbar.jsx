
import React, { useContext } from "react";
import { Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import logoWeb from "../../assets/images/logoWeb.png";
import './NavBar.styles.css'

const AppNavbar = () => {
  const { usuario, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (usuario.tipo === 'CANDIDATO') {
      navigate("/login/candidato");
    } else {
      navigate("/login/empresa");
    }
  };

  const navigateTo =
    usuario?.tipo === 'CANDIDATO' ? '/candidato/home' :
      usuario?.tipo === 'EMPRESA'
        ? '/empresa/home' :
        '/';


  const handleLoginCandidatoClick = () => {
    window.location.href = '/login/candidato';
  };
  const handleLoginEmpresaClick = () => {
    window.location.href = '/login/empresa';
  };
  const handleLogoClick = () => {
    window.location.href = navigateTo;
  };

  return (
    <Navbar bg="light" expand="lg" className="custom-navbar">
      <div class='container-fluid custom-container'>
        <Navbar.Brand as={Link} onClick={handleLogoClick} style={{ width: "100px" }}>
          <img

            src={logoWeb}
            alt="JRJob"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!usuario ? (
              <>
              <div className="login-buttons">

                <Button type="submit" onClick={handleLoginCandidatoClick} variant="primary" size="lg" className="details-button button">
                  Login Candidato
                </Button>
                <Button type="submit" onClick={handleLoginEmpresaClick} variant="primary" size="lg" className="details-button button">
                  Login Empresa
                </Button>
              </div>
                {/* <Nav.Link as={Link} to="/login/candidato">Login Candidato</Nav.Link>
                <Nav.Link as={Link} to="/login/empresa">Login Empresa</Nav.Link> */}

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
      </div>
    </Navbar>
  );
};

export default AppNavbar;
