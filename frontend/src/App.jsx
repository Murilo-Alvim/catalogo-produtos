import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Componente que protege rotas privadas
// Se não estiver autenticado, redireciona para o login
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Rota pública: login */}
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />

      {/* Rota pública: cadastro */}
      <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />

      {/* Rota privada: dashboard com o CRUD */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Redireciona qualquer rota desconhecida para o início */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Toast notifications globais */}
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
