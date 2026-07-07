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
  const baseStyles = 'w-full flex items-center justify-center gap-2 py-3 px-4 rounded font-medium transition-all h-12';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg disabled:bg-blue-400',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-md disabled:bg-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg disabled:bg-red-400',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 disabled:border-gray-400 disabled:text-gray-400'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
}
