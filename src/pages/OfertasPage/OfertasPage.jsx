import React, { useEffect, useState } from "react";
import axios from "axios";
import ListaOfertas from "../../components/ListaOfertas/ListaOfertas";

const OfertasPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8081/api/ofertas")
      .then(res => setOfertas(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <ListaOfertas ofertas={ofertas} loading={loading} error={error} />
    </div>
  );
};

export default OfertasPage;