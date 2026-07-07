/**
 * ProtectedRoute - Componente para rutas protegidas
 * 
 * Verifica si el usuario está autenticado y tiene suscripción activa
 * Si no, redirige a la página de inicio/login o ajustes según corresponda
 */
import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar
 * @param {boolean} [props.requireSubscription=true] - Si requiere suscripción activa
 */
function ProtectedRoute({ children, requireSubscription = true }) {
  const { isAuthenticated, isActive, loadAuth } = useAuthStore();
  
  // Verificar estado de autenticación
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Verificar suscripción si es requerido
  if (requireSubscription && !isActive) {
    return <Navigate to="/ajustes" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
