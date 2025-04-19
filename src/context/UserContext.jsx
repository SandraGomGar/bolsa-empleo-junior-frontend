import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
    setCargandoUsuario(false); // ✅ Ya se terminó de cargar (haya o no usuario)
  }, []);

  const login = (userData) => {
    localStorage.setItem("usuario", JSON.stringify(userData));
    setUsuario(userData);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <UserContext.Provider value={{ usuario, login, logout, cargandoUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
