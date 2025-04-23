import React, { useEffect, useState } from "react";
import axios from "axios";
import ListaOfertas from "../../components/ListaOfertas/ListaOfertas";
import { useNavigate } from "react-router-dom";

const OfertasPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    axios.get("http://localhost:8081/api/ofertas")
      .then(res => setOfertas(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const navegarADetalles = (id) => {
    console.log('DONDE VOY ??', id)
    navigate(`/oferta/${id}`)
  }

  return (
    <div className="container mt-4">
      <ListaOfertas ofertas={ofertas} loading={loading} error={error} onVerDetalles={navegarADetalles} />
    </div>
  );
};

export default OfertasPage;