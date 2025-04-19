// src/pages/PerfilCandidato/PerfilCandidato.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";

const PerfilCandidato = () => {
  const { usuario } = useContext(UserContext);

  const [detalles, setDetalles] = useState(null);
  const [formData, setFormData] = useState(null);

  const [experiencias, setExperiencias] = useState([]);
  const [editingExp, setEditingExp] = useState({});
  const [estudios, setEstudios] = useState([]);
  const [editingEst, setEditingEst] = useState({});

  // 1. Carga inicial
  useEffect(() => {
    if (!usuario?.id) return;
    axios
      .get(`http://localhost:8081/usuarios/candidato/${usuario.id}`)
      .then(({ data }) => {
        const perfil = data; // UsuarioController devuelve directamente el Usuario
        setDetalles(perfil);

        // Datos personales
        setFormData({
          nombre: perfil.nombre || "",
          email: perfil.email || "",
          telefono: perfil.telefono || "",
          fechaNacimiento: perfil.fechaNacimiento || "",
          viveEnEspaña: perfil.viveEnEspaña || "",
          provincia: perfil.provincia || "",
          poblacion: perfil.poblacion || "",
          pais: perfil.pais || "",
          idiomas: perfil.idiomas || [],
          nuevoIdioma: "",
          nuevoNivel: "",
          otrosDatos: perfil.otrosDatos || "",
        });

        // Experiencias y estudios
        setExperiencias(perfil.experiencias || []);
        setEstudios(perfil.estudios || []);

        // Inicializar flags de edición
        setEditingExp(
          (perfil.experiencias || []).reduce((acc, _, i) => {
            acc[i] = false;
            return acc;
          }, {})
        );
        setEditingEst(
          (perfil.estudios || []).reduce((acc, _, i) => {
            acc[i] = false;
            return acc;
          }, {})
        );
      })
      .catch((err) => {
        console.error("Error al cargar perfil:", err);
        toast.error("No se pudo cargar el perfil");
      });
  }, [usuario]);

  // 2. Cambios en datos personales / ubicación / otros
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleGuardarCambios = () => {
    axios
      .put(`http://localhost:8081/usuarios/actualizar/${usuario.id}`, formData)
      .then(({ data }) => {
        toast.success("✅ Perfil actualizado");
        setDetalles(data);
      })
      .catch(() => toast.error("❌ Error al actualizar perfil"));
  };

  // 3. Funciones para Idiomas
  const añadirIdioma = () => {
    const { nuevoIdioma, nuevoNivel, idiomas } = formData;
    if (!nuevoIdioma || !nuevoNivel) {
      return toast.warning("Rellena idioma y nivel antes de añadir");
    }
    setFormData((prev) => ({
      ...prev,
      idiomas: [...idiomas, { nombre: nuevoIdioma, nivel: nuevoNivel }],
      nuevoIdioma: "",
      nuevoNivel: "",
    }));
  };

  // 4. Funciones Experiencia
  const handleEditarExp = (i) =>
    setEditingExp((prev) => ({ ...prev, [i]: true }));
  const handleChangeExp = (i, field, value) => {
    setExperiencias((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e))
    );
  };
  const guardarExp = (i) => {
    const exp = experiencias[i];
    const url = exp.id
      ? `http://localhost:8081/usuarios/experiencia/${exp.id}` // PUT si ya existe
      : `http://localhost:8081/usuarios/${usuario.id}/experiencia`; // POST si es nueva
  
    const method = exp.id ? axios.put : axios.post;
  
    method(url, exp)
      .then(({ data }) => {
        const nuevasExperiencias = [...experiencias];
        nuevasExperiencias[i] = data;
        setExperiencias(nuevasExperiencias);
        setEditingExp((prev) => ({ ...prev, [i]: false }));
        toast.success("✅ Experiencia guardada");
      })
      .catch(() => toast.error("❌ Error al guardar experiencia"));
  };
  const cancelarEdicionExp = (i) =>
    setEditingExp((prev) => ({ ...prev, [i]: false }));
  const eliminarExp = (i) => {
    const exp = experiencias[i];
    if (exp.id) {
      // si existe en BBDD, pedir confirmación y luego:
      // axios.delete(`/experiencia/${exp.id}`).then(...)
    }
    setExperiencias((prev) => prev.filter((_, idx) => idx !== i));
    setEditingExp((prev) => {
      const copy = { ...prev };
      delete copy[i];
      return copy;
    });
    toast.info("🗑️ Experiencia eliminada");
  };
  const añadirNuevaExp = () => {
    setExperiencias((prev) => [
      ...prev,
      {
        id: null,
        empresa: "",
        puesto: "",
        descripcion: "",
        habilidades: "",
        fechaInicioMes: "",
        fechaInicioAnio: "",
        fechaFin: "",
      },
    ]);
    const newIndex = experiencias.length;
    setEditingExp((prev) => ({ ...prev, [newIndex]: true }));
  };

  // 5. Funciones Estudios (análogas)
  const handleEditarEst = (i) =>
    setEditingEst((prev) => ({ ...prev, [i]: true }));
  const handleChangeEst = (i, field, value) => {
    setEstudios((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e))
    );
  };
  const guardarEst = (i) => {
    const est = estudios[i];
    const url = est.id
      ? `http://localhost:8081/usuarios/estudio/${est.id}` // PUT si ya existe
      : `http://localhost:8081/usuarios/${usuario.id}/estudio`; // POST si es nuevo
  
    const method = est.id ? axios.put : axios.post;
  
    method(url, est)
      .then(({ data }) => {
        const nuevosEstudios = [...estudios];
        nuevosEstudios[i] = data;
        setEstudios(nuevosEstudios);
        setEditingEst((prev) => ({ ...prev, [i]: false }));
        toast.success("✅ Estudio guardado");
      })
      .catch(() => toast.error("❌ Error al guardar estudio"));
  };
  const cancelarEst = (i) =>
    setEditingEst((prev) => ({ ...prev, [i]: false }));
  const eliminarEst = (i) => {
    setEstudios((prev) => prev.filter((_, idx) => idx !== i));
    setEditingEst((prev) => {
      const copy = { ...prev };
      delete copy[i];
      return copy;
    });
    toast.info("🗑️ Estudio eliminado");
  };
  const añadirNuevoEst = () => {
    setEstudios((prev) => [
      ...prev,
      {
        id: null,
        nivel: "",
        centro: "",
        fechaInicioMes: "",
        fechaInicioAnio: "",
        fechaFinMes: "",
        fechaFinAnio: "",
        cursandoActualmente: false,
      },
    ]);
    const newIndex = estudios.length;
    setEditingEst((prev) => ({ ...prev, [newIndex]: true }));
  };

  if (!formData) return <div className="container mt-4">Cargando perfil...</div>;

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">👤 Mi perfil - Candidato</h2>

      {/* 🗂️ Datos personales */}
      <Card className="mb-5 p-3">
        <h5>🗂️ Datos personales</h5>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control value={formData.email} disabled />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control
              value={formData.fechaNacimiento}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>¿Vives en España?</Form.Label>
            <Form.Select
              name="viveEnEspaña"
              value={formData.viveEnEspaña}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              <option value="sí">Sí</option>
              <option value="no">No</option>
            </Form.Select>
          </Form.Group>
          {formData.viveEnEspaña === "sí" ? (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Población</Form.Label>
                <Form.Control
                  name="poblacion"
                  value={formData.poblacion}
                  onChange={handleChange}
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group className="mb-2">
              <Form.Label>País</Form.Label>
              <Form.Control
                name="pais"
                value={formData.pais}
                onChange={handleChange}
              />
            </Form.Group>
          )}
        </Form>
      </Card>

      {/* 💼 Experiencia laboral */}
      <Card className="mb-5 p-3">
        <h5>💼 Experiencia laboral</h5>
        {experiencias.map((exp, i) => (
          <Card key={i} className="mb-3 p-3">
            {editingExp[i] ? (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Empresa</Form.Label>
                  <Form.Control
                    value={exp.empresa}
                    onChange={(e) =>
                      handleChangeExp(i, "empresa", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Puesto</Form.Label>
                  <Form.Control
                    value={exp.puesto}
                    onChange={(e) =>
                      handleChangeExp(i, "puesto", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={exp.descripcion}
                    onChange={(e) =>
                      handleChangeExp(i, "descripcion", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Habilidades</Form.Label>
                  <Form.Control
                    value={exp.habilidades}
                    onChange={(e) =>
                      handleChangeExp(i, "habilidades", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="d-flex gap-2 mb-2">
                  <Form.Control
                    placeholder="MM"
                    value={exp.fechaInicioMes}
                    onChange={(e) =>
                      handleChangeExp(i, "fechaInicioMes", e.target.value)
                    }
                  />
                  <Form.Control
                    placeholder="AAAA"
                    value={exp.fechaInicioAnio}
                    onChange={(e) =>
                      handleChangeExp(i, "fechaInicioAnio", e.target.value)
                    }
                  />
                  <Form.Control
                    placeholder="MM/AAAA"
                    value={exp.fechaFin}
                    onChange={(e) =>
                      handleChangeExp(i, "fechaFin", e.target.value)
                    }
                  />
                </Form.Group>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button size="sm" onClick={() => guardarExp(i)}>
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => cancelarEdicionExp(i)}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>{exp.puesto}</strong> en <strong>{exp.empresa}</strong>
                </p>
                <p>{exp.descripcion}</p>
                <small>Habilidades: {exp.habilidades}</small>
                <p>
                  {exp.fechaInicioMes}/{exp.fechaInicioAnio} — {exp.fechaFin}
                </p>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleEditarExp(i)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => eliminarExp(i)}
                  >
                    Eliminar
                  </Button>
                </div>
              </>
            )}
          </Card>
        ))}
        <div className="text-end">
          <Button variant="primary" size="sm" onClick={añadirNuevaExp}>
            ➕ Añadir experiencia
          </Button>
        </div>
      </Card>

      {/* 🎓 Estudios */}
      <Card className="mb-5 p-3">
        <h5>🎓 Estudios</h5>
        {estudios.map((est, i) => (
          <Card key={i} className="mb-3 p-3">
            {editingEst[i] ? (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Nivel</Form.Label>
                  <Form.Control
                    value={est.nivel}
                    onChange={(e) =>
                      handleChangeEst(i, "nivel", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Centro</Form.Label>
                  <Form.Control
                    value={est.centro}
                    onChange={(e) =>
                      handleChangeEst(i, "centro", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="d-flex gap-2 mb-2">
                  <Form.Control
                    placeholder="MM"
                    value={est.fechaInicioMes}
                    onChange={(e) =>
                      handleChangeEst(i, "fechaInicioMes", e.target.value)
                    }
                  />
                  <Form.Control
                    placeholder="AAAA"
                    value={est.fechaInicioAnio}
                    onChange={(e) =>
                      handleChangeEst(i, "fechaInicioAnio", e.target.value)
                    }
                  />
                  {!est.cursandoActualmente && (
                    <>
                      <Form.Control
                        placeholder="MM fin"
                        value={est.fechaFinMes}
                        onChange={(e) =>
                          handleChangeEst(i, "fechaFinMes", e.target.value)
                        }
                      />
                      <Form.Control
                        placeholder="AAAA fin"
                        value={est.fechaFinAnio}
                        onChange={(e) =>
                          handleChangeEst(i, "fechaFinAnio", e.target.value)
                        }
                      />
                    </>
                  )}
                </Form.Group>
                <Form.Check
                  label="Cursando"
                  checked={est.cursandoActualmente}
                  onChange={(e) =>
                    handleChangeEst(i, "cursandoActualmente", e.target.checked)
                  }
                />
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button size="sm" onClick={() => guardarEst(i)}>
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => cancelarEst(i)}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>{est.nivel}</strong> en {est.centro}
                </p>
                <p>
                  {est.fechaInicioMes}/{est.fechaInicioAnio} —{" "}
                  {est.cursandoActualmente
                    ? "Actualmente"
                    : `${est.fechaFinMes}/${est.fechaFinAnio}`}
                </p>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleEditarEst(i)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => eliminarEst(i)}
                  >
                    Eliminar
                  </Button>
                </div>
              </>
            )}
          </Card>
        ))}
        <div className="text-end">
          <Button variant="primary" size="sm" onClick={añadirNuevoEst}>
            ➕ Añadir estudio
          </Button>
        </div>
      </Card>

      {/* 🌍 Idiomas */}
      <Card className="mb-5 p-3">
        <h5>🌍 Idiomas</h5>
        {formData.idiomas.length > 0 ? (
          <ul>
            {formData.idiomas.map((i, idx) => (
              <li key={idx}>
                {i.nombre} — {i.nivel}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aún no has añadido ningún idioma.</p>
        )}
        <div className="d-flex gap-2">
          <Form.Control
            placeholder="Idioma"
            name="nuevoIdioma"
            value={formData.nuevoIdioma}
            onChange={handleChange}
          />
          <Form.Control
            placeholder="Nivel"
            name="nuevoNivel"
            value={formData.nuevoNivel}
            onChange={handleChange}
          />
          <Button onClick={añadirIdioma} variant="outline-primary">
            Añadir
          </Button>
        </div>
      </Card>

      {/* 📝 Otros datos */}
      <Card className="mb-5 p-3">
        <h5>📝 Otros datos</h5>
        <Form.Control
          as="textarea"
          name="otrosDatos"
          rows={3}
          value={formData.otrosDatos}
          onChange={handleChange}
          placeholder="Añade información adicional..."
        />
      </Card>

      <div className="text-center text-muted mb-2">
        🔒 Recuerda guardar los cambios efectuados para que se conserven.
      </div>

      {/* ✅ Botón final */}
      <div className="text-end">
        <Button onClick={handleGuardarCambios} variant="success">
          Guardar cambios ✅
        </Button>
      </div>
    </div>
  );
};

export default PerfilCandidato;
