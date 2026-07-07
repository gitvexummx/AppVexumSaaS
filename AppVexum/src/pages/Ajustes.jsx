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
import { useDarkMode } from '../hooks/useDarkMode';
import { Moon, Sun, Store, CreditCard, Calendar, Save, RefreshCw } from 'lucide-react';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import '../Pages.css';

function Ajustes() {
  const { user, subscription, isActive, logout, activateDemoSubscription } = useAuthStore();
  const toast = useToast();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
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
  const statusColor = isExpired ? 'vencida' : 'activa';
  const statusText = isExpired ? 'Vencida' : 'Activa';
  const IconStatus = isExpired ? Calendar : CreditCard;

  if (isLoading) {
    return (
      <div className="ajustes-loading-container">
        <div className="ajustes-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="ajustes-container">
      {/* Header */}
      <header className="ajustes-header">
        <h1 className="ajustes-title">Ajustes</h1>
      </header>
      
      <div className="ajustes-content">
        {/* Estado de Suscripción */}
        <section className={`ajustes-suscripcion ${statusColor}`}>
          <div className="ajustes-suscripcion-header">
            <h2 className="ajustes-suscripcion-title">
              <IconStatus size={20} />
              Estado de Suscripción
            </h2>
            <span className={`ajustes-suscripcion-badge ${statusColor}`}>
              {statusText}
            </span>
          </div>
          
          <div className="ajustes-suscripcion-info">
            <p>Fecha de vencimiento: <strong>{subscription?.endDate ? formatDate(subscription.endDate) : 'N/A'}</strong></p>
            
            {isExpired ? (
              <div className="ajustes-suscripcion-alert vencida">
                <p className="ajustes-suscripcion-alert-text">Tu suscripción ha vencido. Renueva para seguir usando el sistema.</p>
                <button
                  onClick={handleRenewSubscription}
                  className="ajustes-renovar-btn"
                >
                  <RefreshCw size={18} />
                  Renovar Suscripción (Demo)
                </button>
              </div>
            ) : (
              <p className="ajustes-suscripcion-alert-text activa">Tu plan está activo hasta la fecha indicada.</p>
            )}
          </div>
        </section>

        {/* Formulario de Datos del Negocio */}
        <section className="ajustes-negocio">
          <h2 className="ajustes-negocio-title">
            <Store size={20} />
            Datos del Negocio
          </h2>
          <form onSubmit={handleSaveBusiness} className="space-y-4">

            <Input
              label="Nombre del Negocio *"
              type="text"
              id="name"
              name="name"
              value={businessData.name}
              onChange={handleChange}
              placeholder="Ej. Abarrotes Don Pepe"
              required
            />

            <Input
              label="RFC"
              type="text"
              id="rfc"
              name="rfc"
              value={businessData.rfc}
              onChange={handleChange}
              placeholder="Ej. XAXX010101000"
              className="uppercase"
            />

            <div className="space-y-1">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark-text-gray-300">Dirección Fiscal</label>
              <textarea
                id="address"
                name="address"
                value={businessData.address}
                onChange={handleChange}
                placeholder="Calle, Número, Colonia, Ciudad..."
                rows="3"
                className="ajustes-textarea"
              />
            </div>

            <Button type="submit" isLoading={isSaving}>
              <Save size={20} />
              Guardar Cambios
            </Button>
          </form>
        </section>
        
        {/* Información del usuario */}
        <div className="ajustes-cuenta">
          <h2 className="ajustes-cuenta-title">Mi cuenta</h2>
          <div className="ajustes-cuenta-info">
            <div className="flex justify-between">
              <span className="ajustes-cuenta-label">Nombre:</span>
              <span className="ajustes-cuenta-value">{user?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="ajustes-cuenta-label">Email:</span>
              <span className="ajustes-cuenta-value">{user?.email || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Modo Oscuro */}
        <section className="ajustes-apariencia">
          <h2 className="ajustes-apariencia-title">
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            Apariencia
          </h2>
          <div className="ajustes-apariencia-content">
            <div>
              <p className="ajustes-apariencia-text">Modo Oscuro</p>
              <p className="ajustes-apariencia-subtext">Cambia la apariencia de la aplicación</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`ajustes-toggle ${isDarkMode ? 'active' : ''}`}
            >
              <span className={`ajustes-toggle-knob ${isDarkMode ? 'active' : ''}`} />
            </button>
          </div>
        </section>
        
        {/* Cerrar sesión */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="ajustes-logout-btn"
        >
          Cerrar sesión
        </button>
      </div>
      
      {/* Modal de confirmación de logout */}
      {showLogoutConfirm && (
        <div className="ajustes-modal-overlay">
          <div className="ajustes-modal">
            <h3 className="ajustes-modal-title">¿Cerrar sesión?</h3>
            <p className="ajustes-modal-text">
              Podrás volver a iniciar sesión cuando quieras.
            </p>
            <div className="ajustes-modal-actions">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="ajustes-modal-cancel-btn"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="ajustes-modal-confirm-btn"
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
