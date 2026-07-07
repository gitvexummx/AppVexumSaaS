/**
 * App.jsx - Componente principal con routing
 * 
 * Configura las rutas de la aplicación Vexum MX
 * Incluye navegación inferior y protección de rutas
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventario from './pages/Inventario';
import Ajustes from './pages/Ajustes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Ruta pública: Login */}
          <Route path="/" element={<Login />} />
          
          {/* Rutas protegidas con autenticación */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pos"
            element={
              <ProtectedRoute>
                <POS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <ProtectedRoute>
                <Inventario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ajustes"
            element={
              <ProtectedRoute>
                <Ajustes />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Navegación inferior (solo en rutas autenticadas) */}
        <AuthNavWrapper />
      </div>
    </Router>
  );
}

/**
 * Wrapper condicional para mostrar BottomNav solo en rutas autenticadas
 */
function AuthNavWrapper() {
  // Verificar si estamos en ruta pública
  const isPublicRoute = window.location.pathname === '/';
  
  if (isPublicRoute) return null;
  
  return <BottomNav />;
}

export default App;
