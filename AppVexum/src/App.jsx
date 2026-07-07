/**
 * App.jsx - Componente principal con routing
 * 
 * Configura las rutas de la aplicación Vexum MX
 * Incluye navegación responsiva y protección de rutas
 */
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import SubscriptionGuard from './components/guards/SubscriptionGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventario from './pages/Inventario';
import Ajustes from './pages/Ajustes';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const { isDarkMode } = useDarkMode();
  
  return (
    <Router>
      <div className="PageContainer">
        <Routes>
          {/* Ruta pública: Login */}
          <Route path="/" element={<Login />} />
          
          {/* Rutas protegidas con autenticación y suscripción */}
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
                <SubscriptionGuard>
                  <POS />
                </SubscriptionGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <ProtectedRoute>
                <SubscriptionGuard>
                  <Inventario />
                </SubscriptionGuard>
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
        
        {/* Navegación responsiva (solo en rutas autenticadas) */}
        <AuthNavWrapper />
      </div>
    </Router>
  );
}

/**
 * Wrapper condicional para mostrar BottomNav/Sidebar solo en rutas autenticadas
 */
function AuthNavWrapper() {
  const location = useLocation();
  
  // Verificar si estamos en ruta pública
  const isPublicRoute = location.pathname === '/';
  
  if (isPublicRoute) return null;
  
  return <BottomNav />;
}

export default App;
