/**
 * Esquema centralizado de la base de datos para Vexum MX
 * Define la estructura unificada para Dexie.js (local) y PostgreSQL (Supabase)
 * 
 * Convenciones:
 * - Todos los IDs son scoped por negocio: businessId_uuid
 * - Los campos numéricos (precios, totales) son tipo number (let/flexible)
 * - Las fechas se almacenan como ISO strings
 * - Campos comunes en todas las tablas: id, businessId, createdAt, updatedAt
 */

/**
 * Schema de la tabla de configuración del negocio
 * @type {Object}
 */
export const configuracionesSchema = {
  name: 'configuraciones',
  keyPath: 'id', // UUID scoped
  fields: {
    id: 'string',           // businessId_uuid
    businessId: 'string',   // ID del negocio propietario
    key: 'string',          // Clave de configuración (ej: 'nombre_negocio', 'moneda')
    value: '*',             // Valor (puede ser string, number, boolean, object)
    type: 'string',         // Tipo de dato: 'string', 'number', 'boolean', 'object'
    category: 'string',     // Categoría: 'general', 'impuestos', 'apariencia', 'comportamiento'
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  indexes: ['businessId', 'key', 'category']
};

/**
 * Schema de la tabla de cajas (puntos de cobro físicos o virtuales)
 * @type {Object}
 */
export const cajasSchema = {
  name: 'cajas',
  keyPath: 'id',
  fields: {
    id: 'string',
    businessId: 'string',
    nombre: 'string',       // Ej: 'Caja 1', 'Mostrador Principal'
    descripcion: '?string', // Opcional
    activa: 'boolean',      // Estado actual de la caja
    ubicacion: '?string',   // Ubicación física opcional
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  indexes: ['businessId', 'activa']
};

/**
 * Schema de la tabla de turnos (sesiones de caja por usuario)
 * @type {Object}
 */
export const turnosSchema = {
  name: 'turnos',
  keyPath: 'id',
  fields: {
    id: 'string',
    businessId: 'string',
    cajaId: 'string',       // Referencia a caja.id
    userId: 'string',       // Usuario que abre el turno
    folioInicio: 'number',  // Folio inicial de ventas
    folioFin: '?number',    // Folio final (se asigna al cerrar)
    montoInicial: 'number', // Dinero base al abrir (float)
    montoFinal: '?number',  // Dinero al cerrar (float)
    estado: 'string',       // 'abierto', 'cerrado', 'suspendido'
    fechaApertura: 'Date',
    fechaCierre: '?Date',
    observaciones: '?string',
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  indexes: ['businessId', 'cajaId', 'userId', 'estado', 'fechaApertura']
};

/**
 * Schema de la tabla de ventas (cabecera de venta)
 * @type {Object}
 */
export const ventasSchema = {
  name: 'ventas',
  keyPath: 'id',
  fields: {
    id: 'string',
    businessId: 'string',
    turnoId: 'string',      // Referencia a turnos.id
    cajaId: 'string',       // Referencia a cajas.id
    userId: 'string',       // Vendedor/cajero
    folio: 'number',        // Número consecutivo de venta
    subtotal: 'number',     // Suma de items antes de descuentos e impuestos (float)
    descuento: 'number',    // Descuento total aplicado (float)
    impuestos: 'number',    // Impuestos totales (float)
    total: 'number',        // Total final de la venta (float)
    estado: 'string',       // 'completada', 'cancelada', 'pendiente'
    fecha: 'Date',
    clienteNombre: '?string', // Nombre del cliente (opcional)
    clienteTelefono: '?string', // Teléfono del cliente (opcional)
    observaciones: '?string',
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  indexes: ['businessId', 'turnoId', 'cajaId', 'userId', 'folio', 'estado', 'fecha']
};

/**
 * Schema de la tabla de items de venta (detalle de cada venta)
 * @type {Object}
 */
export const ventaItemsSchema = {
  name: 'venta_items',
  keyPath: 'id',
  fields: {
    id: 'string',
    businessId: 'string',
    ventaId: 'string',      // Referencia a ventas.id
    productoId: 'string',   // Referencia a productos.id (puede ser null si el producto fue eliminado)
    productoNombre: 'string', // Nombre del producto al momento de la venta (snapshot)
    productoCodigo: '?string', // Código/SKU del producto (snapshot)
    cantidad: 'number',     // Cantidad vendida (float para productos a granel)
    precioUnitario: 'number', // Precio unitario al momento de la venta (float)
    subtotal: 'number',     // cantidad * precioUnitario (float)
    descuento: 'number',    // Descuento aplicado a este item (float)
    impuestos: 'number',    // Impuestos aplicados (float)
    total: 'number',        // subtotal - descuento + impuestos (float)
    notas: '?string',
    createdAt: 'Date'
  },
  indexes: ['businessId', 'ventaId', 'productoId']
};

/**
 * Schema de la tabla de pagos (métodos de pago aplicados a ventas)
 * @type {Object}
 */
export const pagosSchema = {
  name: 'pagos',
  keyPath: 'id',
  fields: {
    id: 'string',
    businessId: 'string',
    ventaId: 'string',      // Referencia a ventas.id
    metodoPago: 'string',   // 'efectivo', 'tarjeta', 'transferencia', 'monedero'
    monto: 'number',        // Monto pagado con este método (float)
    referencia: '?string',  // Referencia del pago (últimos 4 dígitos de tarjeta, etc.)
    estado: 'string',       // 'aprobado', 'rechazado', 'pendiente'
    fechaProcesamiento: 'Date',
    notas: '?string',
    createdAt: 'Date'
  },
  indexes: ['businessId', 'ventaId', 'metodoPago', 'estado', 'fechaProcesamiento']
};

/**
 * Schema de la tabla de cortes de caja (cierres parciales o finales de turno)
 * @type {Object}
 */
export const cortesCajaSchema = {
  name: 'cortes_caja',
  keyPath: 'id',
  fields: {
    id: 'string',
    businessId: 'string',
    turnoId: 'string',      // Referencia a turnos.id
    cajaId: 'string',       // Referencia a cajas.id
    userId: 'string',       // Usuario que realiza el corte
    folioInicio: 'number',  // Folio inicial del corte
    folioFin: 'number',     // Folio final del corte
    ventasContadas: 'number', // Número de ventas en este corte
    subtotal: 'number',     // Subtotal de ventas (float)
    descuentos: 'number',   // Total descuentos (float)
    impuestos: 'number',    // Total impuestos (float)
    totalVentas: 'number',  // Total de ventas (float)
    efectivoEsperado: 'number', // Efectivo esperado según sistema (float)
    efectivoReal: 'number', // Efectivo real contado (float)
    diferencia: 'number',   // Diferencia entre esperado y real (float)
    otrosPagos: 'number',   // Suma de otros métodos de pago (float)
    estado: 'string',       // 'abierto', 'cerrado', 'cuadrado', 'descuadrado'
    observaciones: '?string',
    fechaCorte: 'Date',
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  indexes: ['businessId', 'turnoId', 'cajaId', 'userId', 'estado', 'fechaCorte']
};

/**
 * Schema de la tabla de productos (catálogo de productos del negocio)
 * @type {Object}
 */
export const productosSchema = {
  name: 'productos',
  keyPath: 'id',
  fields: {
    id: 'string',
    businessId: 'string',
    nombre: 'string',
    descripcion: '?string',
    codigo: '?string',      // SKU o código de barras
    codigoBarras: '?string', // Código de barras estándar
    precioCompra: 'number', // Precio de costo (float)
    precioVenta: 'number',  // Precio de venta al público (float)
    precioOferta: '?number', // Precio en oferta (float, opcional)
    stock: 'number',        // Cantidad disponible (float para productos a granel)
    stockMinimo: 'number',  // Stock mínimo para alertas
    unidadMedida: 'string', // 'pieza', 'kg', 'litro', 'metro', etc.
    categoria: 'string',    // Categoría del producto
    subcategoria: '?string',
    marca: '?string',
    proveedor: '?string',
    activo: 'boolean',      // Producto disponible para venta
    imagenUrl: '?string',   // URL de la imagen del producto
    impuestos: 'number',    // Porcentaje de impuestos (ej: 16 para 16%)
    permiteDescuento: 'boolean', // Si se puede aplicar descuento
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  indexes: ['businessId', 'codigo', 'codigoBarras', 'categoria', 'activo', 'nombre']
};

/**
 * Lista completa de schemas para inicialización
 * @type {Array<Object>}
 */
export const allSchemas = [
  configuracionesSchema,
  cajasSchema,
  turnosSchema,
  ventasSchema,
  ventaItemsSchema,
  pagosSchema,
  cortesCajaSchema,
  productosSchema
];

/**
 * Obtiene los nombres de todas las tablas
 * @returns {string[]} Array con los nombres de las tablas
 */
export const getTableNames = () => allSchemas.map(schema => schema.name);

/**
 * Obtiene el schema de una tabla específica
 * @param {string} tableName - Nombre de la tabla
 * @returns {Object|null} Schema de la tabla o null si no existe
 */
export const getSchemaByName = (tableName) => {
  return allSchemas.find(schema => schema.name === tableName) || null;
};
