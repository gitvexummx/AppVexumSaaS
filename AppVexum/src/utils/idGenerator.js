/**
 * Genera un UUID v4 único para registros locales
 * @returns {string} UUID en formato estándar xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Genera un ID único scoped por negocio
 * Combina el businessId con un UUID para garantizar unicidad por cliente
 * @param {string} businessId - ID del negocio/tenant
 * @returns {string} ID único compuesto: businessId_uuid
 */
export const generateScopedId = (businessId) => {
  if (!businessId) {
    throw new Error('businessId es requerido para generar un scoped ID');
  }
  const uuid = generateUUID();
  return `${businessId}_${uuid}`;
};

/**
 * Extrae el businessId de un scoped ID
 * @param {string} scopedId - ID scoped completo
 * @returns {string|null} businessId o null si el formato es inválido
 */
export const extractBusinessId = (scopedId) => {
  if (!scopedId || typeof scopedId !== 'string') {
    return null;
  }
  const parts = scopedId.split('_');
  if (parts.length < 2) {
    return null;
  }
  // El businessId puede contener guiones, así que tomamos todo menos la última parte (el UUID)
  parts.pop();
  return parts.join('_');
};

/**
 * Valida que un scoped ID pertenezca a un negocio específico
 * @param {string} scopedId - ID scoped a validar
 * @param {string} businessId - ID del negocio esperado
 * @returns {boolean} true si pertenece al negocio, false en caso contrario
 */
export const validateScopedId = (scopedId, businessId) => {
  return extractBusinessId(scopedId) === businessId;
};
