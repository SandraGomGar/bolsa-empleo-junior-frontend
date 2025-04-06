// 1. Importaciones (siempre al inicio del archivo)
import { useState, useEffect } from 'react';
import { OfertasService, PostulacionesService } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import  ListaOfertas  from './components/ListaOfertas/ListaOfertas';


function App() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    empresa: '',
    salario: ''
  });
  const [postulacionData, setPostulacionData] = useState({
    ofertaId: '',
    nombreCandidato: '',
    email: ''
  });

  // Cargar ofertas al iniciar
  useEffect(() => {
    cargarOfertas();
  }, []);

  const cargarOfertas = async () => {
    try {
      const data = await OfertasService.getAll();
      setOfertas(data);
    } catch (error) {
      console.error('Error al cargar ofertas:', error);
      alert('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const _handleCreateOferta = async (e) => {
    e.preventDefault();
    try {
      await OfertasService.create(formData);
      cargarOfertas(); // Recargar la lista
      setFormData({ titulo: '', empresa: '', salario: '' }); // Limpiar formulario
    } catch (error) {
      console.error('Error al crear oferta:', error);
    }
  };

  const _handlePostularse = async (e) => {
    e.preventDefault();
    try {
      await PostulacionesService.postularse(postulacionData);
      alert('Postulación exitosa!');
      setPostulacionData({ ofertaId: '', nombreCandidato: '', email: '' });
    } catch (error) {
      console.error('Error al postularse:', error);
      alert('Error al postularse');
    }
  };

  const _handleDelete = async (id) => {
    try {
      await OfertasService.delete(id);
      cargarOfertas(); // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
    }
  };

  console.log('DATOS => ', ofertas)

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🏢 Bolsa de Empleo</h1>
      {/* Pasamos los datos y estado de carga al componente ListaOfertas */}
      <ListaOfertas ofertas={ofertas} loading={loading} />
    </div>
  );
}

// 6. Exportación del componente (¡no olvides esto!)
export default App;