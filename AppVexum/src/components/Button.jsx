import '../Elements.css';

/**
 * Button - Componente reutilizable para botones
 * @param {string} children - Contenido del botón (texto o iconos)
 * @param {string} variant - Variante del botón (primary, secondary, danger, outline)
 * @param {boolean} disabled - Si el botón está deshabilitado
 * @param {boolean} isLoading - Si el botón está en estado de carga
 * @param {function} onClick - Función para manejar click
 * @param {string} type - Tipo de botón (button, submit, reset)
 * @param {string} className - Clases CSS adicionales
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  isLoading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`btn-base btn-${variant} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="btn-spinner"></div>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
}
