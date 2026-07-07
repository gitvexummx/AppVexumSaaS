import { X } from 'lucide-react';
import '../Elements.css';

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
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="modal-close-button"
            >
              <X size={24} />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
