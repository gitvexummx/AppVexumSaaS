/**
 * Input - Componente reutilizable para campos de entrada
 * @param {string} label - Etiqueta del input
 * @param {string} type - Tipo de input (text, number, email, password, etc.)
 * @param {string} value - Valor actual del input
 * @param {function} onChange - Función para manejar cambios
 * @param {string} placeholder - Texto de ejemplo
 * @param {boolean} required - Si el campo es obligatorio
 * @param {string} error - Mensaje de error (opcional)
 * @param {object} className - Clases CSS adicionales
 */
export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error,
  className = '',
  ...props 
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-12
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
          }
          bg-white dark:bg-gray-700 
          text-gray-800 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
