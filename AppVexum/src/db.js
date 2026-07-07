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

export default db;