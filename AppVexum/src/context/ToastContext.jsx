/**
 * ToastContext.jsx - Contexto global para notificaciones tipo toast
 * 
 * Sistema de notificaciones ligero sin dependencias externas
 * Permite mostrar mensajes de éxito, error e información
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

/**
 * Hook personalizado para usar el contexto de toasts
 * @returns {{ success: Function, error: Function, info: Function }}
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de toasts
 * Gestiona la cola de notificaciones y su renderizado
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Agrega un nuevo toast a la cola
   * @param {string} message - Mensaje a mostrar
   * @param {'success' | 'error' | 'info'} type - Tipo de notificación
   * @param {number} duration - Duración en milisegundos (default: 3000)
   */
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  /**
   * Elimina un toast específico por ID
   * @param {number} id - ID del toast a eliminar
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Funciones helper para cada tipo de notificación
  const success = (msg) => addToast(msg, 'success');
  const error = (msg) => addToast(msg, 'error');
  const info = (msg) => addToast(msg, 'info');

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      {/* Contenedor de toasts - posición fija en la parte inferior */}
      <div 
        className="fixed bottom-20 left-0 right-0 z-50 flex flex-col items-center space-y-2 px-4 pointer-events-none safe-area-bottom"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              w-full max-w-sm p-4 rounded-lg shadow-lg text-white text-sm font-medium
              transform transition-all duration-300 ease-in-out animate-slide-up
              pointer-events-auto flex justify-between items-center
              ${toast.type === 'success' ? 'bg-green-600' : ''}
              ${toast.type === 'error' ? 'bg-red-600' : ''}
              ${toast.type === 'info' ? 'bg-blue-600' : ''}
            `}
            role="alert"
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              aria-label="Cerrar notificación"
              type="button"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
