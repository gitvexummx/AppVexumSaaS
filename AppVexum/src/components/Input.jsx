import '../Elements.css';

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
    <div className={`input-container ${className}`}>
      {label && (
        <label className="input-label">
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input-field ${error ? 'input-field-error' : ''}`}
        {...props}
      />
      {error && (
        <p className="input-error-message">{error}</p>
      )}
    </div>
  );
}
