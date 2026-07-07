/**
 * db.js - Base de datos Dexie para Vexum MX
 *
 * Schema offline-first para pequeños negocios en México
 * Incluye: productos, ventas, items de venta, configuración y usuario
 */
import Dexie from 'dexie';

const db = new Dexie('VexumDB');

/**
 * Versión 1 del schema de base de datos
 * @stores {
 *   products: ++id (auto-incremental), name (indexado para búsqueda), category, barcode
 *   sales: ++id, date (indexado por fecha), total, paymentMethod
 *   saleItems: ++id, saleId (indexado), productId, quantity, price
 *   settings: key (llave única), value
 * }
 */
db.version(1).stores({
  // Productos del inventario
  products: '++id, name, category, barcode',

  // Ventas realizadas
  sales: '++id, date, total, paymentMethod',

  // Items individuales de cada venta
  saleItems: '++id, saleId, productId',

  // Configuración de la tienda y suscripción
  settings: 'key'
});

/**
 * Guarda un valor en la tabla de configuración.
 * @param {string} key - La clave única del setting.
 * @param {any} value - El valor a guardar.
 */
export const saveSetting = async (key, value) => {
  try {
    await db.settings.put({ key, value });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    throw error;
  }
};

/**
 * Obtiene un valor de la tabla de configuración.
 * @param {string} key - La clave del setting a obtener.
 * @returns {Promise<any>} El valor guardado o null si no existe.
 */
export const getSetting = async (key) => {
  try {
    const record = await db.settings.get(key);
    return record ? record.value : null;
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    throw error;
  }
};

export default db;
