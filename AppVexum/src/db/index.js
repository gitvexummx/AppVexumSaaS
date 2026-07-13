/**
 * Archivo índice para exportar todos los módulos de base de datos
 */

export { db, initDB, closeDB, clearDB } from './db.js';
export { createRecord, updateRecord, getRecordById, deleteRecord, queryRecords, tables } from './db.js';
export * from './schema.js';
