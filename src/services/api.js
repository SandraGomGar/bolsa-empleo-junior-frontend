import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:8081/api', // Usa el proxy configurado en package.json (http://localhost:8081/api)
  timeout: 10000, // Tiempo máximo de espera
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response.data, // Extrae solo los datos de la respuesta
  (error) => {
    console.error('Error en la petición:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Operaciones CRUD para "ofertas"
export const OfertasService = {
  // Obtener todas las ofertas (GET)
  getAll: async () => {
    return api.get('/ofertas');
  },

  // Crear una oferta (POST)
  create: async (ofertaData) => {
    return api.post('/ofertas', ofertaData);
  },

  // Actualizar una oferta (PUT)
  update: async (id, ofertaData) => {
    return api.put(`/ofertas/${id}`, ofertaData);
  },

  // Eliminar una oferta (DELETE)
  delete: async (id) => {
    return api.delete(`/ofertas/${id}`);
  },
};

// Operaciones para "postulaciones" (ejemplo adicional)
export const PostulacionesService = {
  postularse: async (postulacionData) => {
    return api.post('/postular', postulacionData);
  },
};