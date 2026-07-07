/**
 * Ajustes - Página de configuración y suscripción
 * 
 * Muestra información de la tienda, estado de suscripción
 * y opciones de configuración básica
 * - Gestiona datos del negocio (persistencia en DB settings).
 * - Muestra y gestiona el estado de la suscripción.
 * - Implementa UX mobile-first con loading states y toasts.
 */
import { useState, useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { useToast } from '../context/ToastContext';
import { saveSetting, getSetting } from '../db';
import { Store, CreditCard, Calendar, Save, RefreshCw } from 'lucide-react';

function Ajustes() {
  const { user, subscription, isActive, logout, activateDemoSubscription } = useAuthStore();
  const toast = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Estado para datos del negocio
  const [businessData, setBusinessData] = useState({
    name: '',
    rfc: '',
    address: ''
  });

  // Estado de carga y edición
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [name, rfc, address] = await Promise.all([
          getSetting('businessName'),
          getSetting('businessRFC'),
          getSetting('businessAddress')
        ]);

        setBusinessData({
          name: name || user?.businessName || '',
          rfc: rfc || '',
          address: address || ''
        });
      } catch (error) {
        console.error("Error cargando ajustes:", error);
        toast.error("No se pudieron cargar los datos del negocio.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast, user?.businessName]);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };

  // Guardar configuración del negocio
  const handleSaveBusiness = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Validación simple
    if (!businessData.name.trim()) {
      toast.error("El nombre del negocio es obligatorio.");
      setIsSaving(false);
      return;
    }

    try {
      await Promise.all([
        saveSetting('businessName', businessData.name),
        saveSetting('businessRFC', businessData.rfc),
        saveSetting('businessAddress', businessData.address)
      ]);
      
      toast.success("Configuración del negocio guardada correctamente.");
    } catch (error) {
      console.error("Error guardando ajustes:", error);
      toast.error("Hubo un error al guardar los datos. Intente nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Simular renovación/activación de suscripción
  const handleRenewSubscription = () => {
    activateDemoSubscription();
    toast.success("Suscripción renovada exitosamente (Modo Demo).");
  };
  
  // Manejar cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      toast.error("Error al cerrar sesión");
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

  // Determinar colores y textos según estado de suscripción
  const isExpired = !isActive;
  const statusColor = isExpired ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-600 bg-green-50 border-green-200';
  const statusText = isExpired ? 'Vencida' : 'Activa';
  const IconStatus = isExpired ? Calendar : CreditCard;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">Ajustes</h1>
      </header>
      
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Estado de Suscripción */}
        <section className={`p-4 rounded-lg border ${statusColor} shadow-sm`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <IconStatus size={20} />
              Estado de Suscripción
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isExpired ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
              {statusText}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <p>Fecha de vencimiento: <strong>{subscription?.endDate ? formatDate(subscription.endDate) : 'N/A'}</strong></p>
            
            {isExpired ? (
              <div className="mt-3 p-3 bg-white rounded border border-red-100">
                <p className="text-red-700 mb-2">Tu suscripción ha vencido. Renueva para seguir usando el sistema.</p>
                <button
                  onClick={handleRenewSubscription}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors h-12"
                >
                  <RefreshCw size={18} />
                  Renovar Suscripción (Demo)
                </button>
              </div>
            ) : (
              <p className="text-green-700 mt-2">Tu plan está activo hasta la fecha indicada.</p>
            )}
          </div>
        </section>

        {/* Formulario de Datos del Negocio */}
        <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Store size={20} />
            Datos del Negocio
          </h2>

          <form onSubmit={handleSaveBusiness} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={businessData.name}
                onChange={handleChange}
                placeholder="Ej. Abarrotes Don Pepe"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-12"
                required
              />
            </div>

            <div>
              <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
              <input
                type="text"
                id="rfc"
                name="rfc"
                value={businessData.rfc}
                onChange={handleChange}
                placeholder="Ej. XAXX010101000"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-12 uppercase"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección Fiscal</label>
              <textarea
                id="address"
                name="address"
                value={businessData.address}
                onChange={handleChange}
                placeholder="Calle, Número, Colonia, Ciudad..."
                rows="3"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded font-medium transition-all h-12 ${
                isSaving 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Cambios
                </>
              )}
            </button>
          </form>
        </section>
        
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
