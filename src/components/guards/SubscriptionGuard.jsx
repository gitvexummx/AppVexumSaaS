import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useToast } from '../../context/ToastContext';

/**
 * SubscriptionGuard: Protege rutas que requieren una suscripción activa.
 * Si la suscripción está vencida, redirige a la página de Ajustes con un mensaje.
 */
const SubscriptionGuard = ({ children }) => {
  const { subscriptionStatus } = useAuthStore();
  const toast = useToast();

  // Verificar si la suscripción está vencida
  if (subscriptionStatus === 'expired') {
    // Mostrar notificación solo una vez al intentar acceder (opcional, se puede manejar en el store)
    // toast.error("Acceso denegado: Tu suscripción ha vencido.");
    return <Navigate to="/settings" replace />;
  }

  return children;
};

export default SubscriptionGuard;
