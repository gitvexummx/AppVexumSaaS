/**
 * Ajustes - Página de configuración y suscripción
 * 
 * Muestra información de la tienda, estado de suscripción
 * y opciones de configuración básica
 */
import { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';

function Ajustes() {
  const { user, subscription, isActive, logout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Manejar cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };
  
  // Formato de fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">Ajustes</h1>
      </header>
      
      <div className="p-4 space-y-4">
        {/* Información del usuario */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Mi cuenta</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Nombre:</span>
              <span className="font-medium">{user?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Negocio:</span>
              <span className="font-medium">{user?.businessName || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Estado de suscripción */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Suscripción</h2>
          
          <div className={`rounded-lg p-4 mb-4 ${
            isActive 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded-full ${
                isActive ? 'bg-green-500' : 'bg-yellow-500'
              }`}></span>
              <span className={`font-semibold ${
                isActive ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            
            {subscription && (
              <div className="text-sm space-y-1">
                <p className="text-gray-600">Plan: <span className="font-medium">{subscription.plan || 'Básico'}</span></p>
                {subscription.startDate && (
                  <p className="text-gray-600">Inicio: <span className="font-medium">{formatDate(subscription.startDate)}</span></p>
                )}
                {subscription.endDate && (
                  <p className="text-gray-600">Vence: <span className="font-medium">{formatDate(subscription.endDate)}</span></p>
                )}
              </div>
            )}
          </div>
          
          {!isActive && (
            <button className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors h-12 font-medium">
              Renovar suscripción
            </button>
          )}
        </div>
        
        {/* Configuración de la tienda */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Tienda</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors h-12 flex justify-between items-center">
              <span>Datos del negocio</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors h-12 flex justify-between items-center">
              <span>Configuración de impuestos</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors h-12 flex justify-between items-center">
              <span>Respaldar datos</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Información de la app */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Acerca de</h2>
          <div className="text-sm space-y-2 text-gray-600">
            <p><strong>Vexum MX</strong> v1.0.0</p>
            <p>Sistema de punto de venta offline-first para pequeños negocios en México.</p>
            <p className="text-xs text-gray-400 mt-2">
              Hecho con ❤️ para emprendedores mexicanos
            </p>
          </div>
        </div>
        
        {/* Cerrar sesión */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors h-12 font-medium"
        >
          Cerrar sesión
        </button>
      </div>
      
      {/* Modal de confirmación de logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">¿Cerrar sesión?</h3>
            <p className="text-gray-600 mb-6">
              Podrás volver a iniciar sesión cuando quieras.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors h-12 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors h-12 font-medium"
              >
                Sí, cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ajustes;
