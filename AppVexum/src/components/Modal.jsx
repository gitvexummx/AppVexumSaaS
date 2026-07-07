import { X } from 'lucide-react';

/**
 * Modal - Componente reutilizable para ventanas emergentes
 * @param {boolean} isOpen - Controla si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @param {string} title - Título del modal
 * @param {React.ReactNode} children - Contenido del modal
 * @param {boolean} showCloseButton - Muestra botón de cerrar (X)
 */
export default function Modal({ isOpen, onClose, title, children, showCloseButton = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
