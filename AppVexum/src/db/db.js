import Dexie from 'dexie';
import {
  configuracionesSchema,
  cajasSchema,
  turnosSchema,
  ventasSchema,
  ventaItemsSchema,
  pagosSchema,
  cortesCajaSchema,
  productosSchema
} from './schema.js';

/**
 * Clase principal de la base de datos Dexie para Vexum MX
 * Implementa el schema unificado para sincronización con Supabase
 */
class VexumDB extends Dexie {
  constructor() {
    super('vexum-db');
    
    // Definición del schema para Dexie
    // Formato: "tabla ++id, campo1, campo2, [indiceCompuesto]"
    // Usamos IDs string (UUIDs scoped) en lugar de autoincrementales
    this.version(1).stores({
      configuraciones: 'id, businessId, key, category, createdAt, updatedAt',
      cajas: 'id, businessId, activa, createdAt, updatedAt',
      turnos: 'id, businessId, cajaId, userId, estado, fechaApertura, createdAt, updatedAt',
      ventas: 'id, businessId, turnoId, cajaId, userId, folio, estado, fecha, createdAt, updatedAt',
      venta_items: 'id, businessId, ventaId, productoId, createdAt',
      pagos: 'id, businessId, ventaId, metodoPago, estado, fechaProcesamiento, createdAt',
      cortes_caja: 'id, businessId, turnoId, cajaId, userId, estado, fechaCorte, createdAt, updatedAt',
      productos: 'id, businessId, codigo, codigoBarras, categoria, activo, nombre, createdAt, updatedAt'
    });
  }
}

// Instancia única de la base de datos
export const db = new VexumDB();

/**
 * Inicializa la conexión a la base de datos
 * @returns {Promise<void>}
 */
export const initDB = async () => {
  try {
    await db.open();
    console.log('✅ Base de datos Vexum inicializada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
};

/**
 * Cierra la conexión a la base de datos
 * @returns {Promise<void>}
 */
export const closeDB = async () => {
  try {
    await db.close();
    console.log('🔒 Base de datos cerrada');
  } catch (error) {
    console.error('Error al cerrar la base de datos:', error);
    throw error;
  }
};

/**
 * Limpia completamente la base de datos (solo para desarrollo/testing)
 * @returns {Promise<void>}
 */
export const clearDB = async () => {
  try {
    await db.delete();
    await initDB();
    console.log('🗑️ Base de datos limpiada y reinicializada');
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    throw error;
  }
};

/**
 * Obtiene el businessId actual del usuario logueado
 * Esto debería venir del store de autenticación
 * @returns {string|null}
 */
const getCurrentBusinessId = () => {
  // TODO: Integrar con useAuthStore cuando esté implementado
  // Por ahora, retornamos un valor por defecto para desarrollo
  const authStore = window.__VEXUM_AUTH_STORE__;
  if (authStore && authStore.businessId) {
    return authStore.businessId;
  }
  // Valor temporal para desarrollo
  return 'dev_business_001';
};

/**
 * Helper genérico para crear registros con ID scoped
 * @param {string} tableName - Nombre de la tabla
 * @param {Object} data - Datos del registro (sin id ni businessId)
 * @returns {Promise<string>} ID del registro creado
 */
export const createRecord = async (tableName, data) => {
  try {
    const businessId = getCurrentBusinessId();
    const { generateScopedId } = await import('../utils/idGenerator.js');
    
    const record = {
      ...data,
      id: generateScopedId(businessId),
      businessId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const id = await db.table(tableName).add(record);
    console.log(`✅ Registro creado en ${tableName}:`, id);
    return id;
  } catch (error) {
    console.error(`❌ Error al crear registro en ${tableName}:`, error);
    throw error;
  }
};

/**
 * Helper genérico para actualizar registros
 * @param {string} tableName - Nombre de la tabla
 * @param {string} id - ID del registro
 * @param {Object} data - Datos a actualizar (sin id ni businessId)
 * @returns {Promise<number>} Número de registros actualizados
 */
export const updateRecord = async (tableName, id, data) => {
  try {
    const updatedData = {
      ...data,
      updatedAt: new Date()
    };
    
    const count = await db.table(tableName).update(id, updatedData);
    if (count === 0) {
      throw new Error(`No se encontró el registro ${id} en ${tableName}`);
    }
    console.log(`✅ Registro actualizado en ${tableName}:`, id);
    return count;
  } catch (error) {
    console.error(`❌ Error al actualizar registro en ${tableName}:`, error);
    throw error;
  }
};

/**
 * Helper genérico para obtener un registro por ID
 * @param {string} tableName - Nombre de la tabla
 * @param {string} id - ID del registro
 * @returns {Promise<Object|null>}
 */
export const getRecordById = async (tableName, id) => {
  try {
    const record = await db.table(tableName).get(id);
    return record || null;
  } catch (error) {
    console.error(`❌ Error al obtener registro de ${tableName}:`, error);
    throw error;
  }
};

/**
 * Helper genérico para eliminar un registro
 * @param {string} tableName - Nombre de la tabla
 * @param {string} id - ID del registro
 * @returns {Promise<void>}
 */
export const deleteRecord = async (tableName, id) => {
  try {
    await db.table(tableName).delete(id);
    console.log(`✅ Registro eliminado de ${tableName}:`, id);
  } catch (error) {
    console.error(`❌ Error al eliminar registro de ${tableName}:`, error);
    throw error;
  }
};

/**
 * Helper genérico para consultar registros con filtros
 * @param {string} tableName - Nombre de la tabla
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>}
 */
export const queryRecords = async (tableName, filters = {}) => {
  try {
    const businessId = getCurrentBusinessId();
    let collection = db.table(tableName).where('businessId').equals(businessId);
    
    // Aplicar filtros adicionales
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        collection = collection.and((record) => record[key] === value);
      }
    });
    
    const results = await collection.toArray();
    return results;
  } catch (error) {
    console.error(`❌ Error al consultar registros de ${tableName}:`, error);
    throw error;
  }
};

/**
 * Exportamos las tablas directamente para acceso directo cuando sea necesario
 */
export const tables = {
  configuraciones: db.configuraciones,
  cajas: db.cajas,
  turnos: db.turnos,
  ventas: db.ventas,
  venta_items: db.venta_items,
  pagos: db.pagos,
  cortes_caja: db.cortes_caja,
  productos: db.productos
};

export default db;
