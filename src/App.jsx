import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import RouterConfig from './router/RouterConfig';
import { UserProvider } from './context/UserContext';
import AppNavbar from './components/NavBar/Navbar';
import './App.css'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppNavbar />
        <RouterConfig />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
