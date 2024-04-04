import React, { useContext, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import AuthProvider, { AuthContext } from "./assets/js/AuthContext";

import IndexAdm from "./Componentes/IndexAdmin";
import LogIn from "./Componentes/LogIn";
import Registrarse from "./Componentes/Registrarse";
import ShowCategories from "./Componentes/ShowCategories";
import ShowEmployees from "./Componentes/ShowEmployees";
import ShowBuyBill from "./Componentes/ShowBuyBill";
import ShowJobs from "./Componentes/ShowJobs";
import ShowLoses from "./Componentes/ShowLoses";
import ShowProducts from "./Componentes/ShowProducts";
import ShowSellBill from "./Componentes/ShowSellBill";
import ShowSuppliers from "./Componentes/ShowSuppliers";
import ShowUsers from "./Componentes/ShowUsers";
import Validate from "./Componentes/Auth/Validate";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Validate>
          <Routes>
            <Route path="/Index" element={<IndexAdm />} />
            <Route path="/Cargos" element={<ShowJobs />} />
            <Route path="/Categorias" element={<ShowCategories />} />
            <Route path="/Empleados" element={<ShowEmployees />} />
            <Route path="/Facturas/Compras" element={<ShowBuyBill />} />
            <Route path="/Facturas/Ventas" element={<ShowSellBill />} />
            <Route path="/" element={<LogIn />} />
            <Route path="/Perdidas" element={<ShowLoses />} />
            <Route path="/Productos" element={<ShowProducts />} />
            <Route path="/Proveedores" element={<ShowSuppliers />} />
            <Route path="/Registrarse" element={<Registrarse />} />
            <Route path="/Usuarios" element={<ShowUsers />} />
          </Routes>
        </Validate>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
