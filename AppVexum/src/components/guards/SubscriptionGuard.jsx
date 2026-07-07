import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

/**
 * SubscriptionGuard: Protege rutas que requieren una suscripción activa.
 * Si la suscripción está vencida, redirige a la página de Ajustes.
 */
const SubscriptionGuard = ({ children }) => {
  const { subscriptionStatus } = useAuthStore();

  // Verificar si la suscripción está vencida
  if (subscriptionStatus === 'expired') {
    return <Navigate to="/settings" replace />;
  }

  return children;
};

export default SubscriptionGuard;
