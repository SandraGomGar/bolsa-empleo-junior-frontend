import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistroCandidato = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    viveEnEspaña: "sí",
    codigoPostal: "",
    provincia: "",
    poblacion: "",
    cv: null,
    tieneExperiencia: "",
    experiencia: "",
    tieneEstudios: "",
    estudios: "",
    tipo: "CANDIDATO",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      cv: e.target.files[0],
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      const { nombre, apellido, email, contraseña } = formData;
      if (!nombre || !apellido || !email || !contraseña) {
        toast.error("Completa todos los campos obligatorios del paso 1");
        return;
      }
    }
    if (step === 2) {
      const { fechaNacimiento, telefono, codigoPostal, provincia, poblacion } = formData;
      if (!fechaNacimiento || !telefono || !codigoPostal || !provincia || !poblacion) {
        toast.error("Completa todos los campos obligatorios del paso 2");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    try {
      await axios.post("http://localhost:8081/auth/registro-candidato", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registro completado con éxito 🎉");
      navigate("/login/candidato");
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((error) => toast.error(error));
      } else {
        toast.error("Error al registrar");
      }
    }
  };

  return (
    <Card className="mt-4 mx-auto" style={{ maxWidth: "600px" }}>
      <Card.Body>
        <h4 className="mb-4">Registro de Candidato (Paso {step} de 5)</h4>
        <Form onSubmit={handleSubmit}>
          {/* Paso 1 */}
          {step === 1 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleNext}>Siguiente →</Button>
              </div>
            </>
          )}

          {/* Paso 2 */}
          {step === 2 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de nacimiento</Form.Label>
                <Form.Control type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Género (opcional)</Form.Label>
                <Form.Control type="text" name="genero" value={formData.genero} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>¿Vives en España?</Form.Label>
                <Form.Select name="viveEnEspaña" value={formData.viveEnEspaña} onChange={handleChange}>
                  <option value="sí">Sí</option>
                  <option value="no">No</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Código postal</Form.Label>
                <Form.Control type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Provincia</Form.Label>
                <Form.Control type="text" name="provincia" value={formData.provincia} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Población</Form.Label>
                <Form.Control type="text" name="poblacion" value={formData.poblacion} onChange={handleChange} required />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleBack}>← Volver</Button>
                <Button variant="primary" onClick={handleNext}>Siguiente →</Button>
              </div>
            </>
          )}

          {/* Paso 3 */}
          {step === 3 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Sube tu currículum (opcional)</Form.Label>
                <Form.Control type="file" name="cv" onChange={handleFileChange} />
                {formData.cv && (
                  <div className="mt-2 d-flex justify-content-between align-items-center">
                    <span className="text-success">📄 {formData.cv.name}</span>
                    <Button size="sm" variant="outline-danger" onClick={() => setFormData((prev) => ({ ...prev, cv: null }))}>Quitar archivo</Button>
                  </div>
                )}
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleBack}>← Volver</Button>
                <Button variant="primary" onClick={handleNext}>Siguiente →</Button>
              </div>
            </>
          )}

          {/* Paso 4 */}
          {step === 4 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>¿Tienes experiencia?</Form.Label>
                <Form.Select name="tieneExperiencia" value={formData.tieneExperiencia} onChange={handleChange}>
                  <option value="">Selecciona una opción</option>
                  <option value="sí">Sí</option>
                  <option value="no">No</option>
                </Form.Select>
              </Form.Group>

              {formData.tieneExperiencia === "sí" && (
                <Form.Group className="mb-3">
                  <Form.Label>Describe tu experiencia</Form.Label>
                  <Form.Control as="textarea" name="experiencia" value={formData.experiencia} onChange={handleChange} rows={3} />
                </Form.Group>
              )}

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleBack}>← Volver</Button>
                <Button variant="primary" onClick={handleNext}>Siguiente →</Button>
              </div>
            </>
          )}

          {/* Paso 5 */}
          {step === 5 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>¿Tienes estudios?</Form.Label>
                <Form.Select name="tieneEstudios" value={formData.tieneEstudios} onChange={handleChange}>
                  <option value="">Selecciona una opción</option>
                  <option value="sí">Sí</option>
                  <option value="no">No</option>
                </Form.Select>
              </Form.Group>

              {formData.tieneEstudios === "sí" && (
                <Form.Group className="mb-3">
                  <Form.Label>Describe tus estudios</Form.Label>
                  <Form.Control as="textarea" name="estudios" value={formData.estudios} onChange={handleChange} rows={3} />
                </Form.Group>
              )}

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleBack}>← Volver</Button>
                <Button type="submit" variant="success">Registrarse ✅</Button>
              </div>
            </>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegistroCandidato;
