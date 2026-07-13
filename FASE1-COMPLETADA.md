# Fase 1 - Modelo de Datos y Migraciones - IMPLEMENTACIÓN COMPLETADA

## 📋 Resumen de la Implementación

Esta fase establece la base de datos unificada para Vexum MX, diseñada para funcionar tanto en **Dexie.js (IndexedDB local)** como en **PostgreSQL (Supabase)**, facilitando la sincronización futura.

---

## 🏗️ Arquitectura Implementada

### 1. Sistema de IDs Scoped por Negocio

**Archivo:** `src/utils/idGenerator.js`

Funciones implementadas:
- `generateUUID()` - Genera UUIDs v4 estándar
- `generateScopedId(businessId)` - Crea IDs únicos por negocio: `businessId_uuid`
- `extractBusinessId(scopedId)` - Extrae el businessId de un ID scoped
- `validateScopedId(scopedId, businessId)` - Valida pertenencia de un ID

**Ventajas:**
- ✅ Permite repetición de IDs entre diferentes clientes
- ✅ Garantiza unicidad dentro del mismo negocio
- ✅ Facilita la sincronización multitenant

---

### 2. Schema Unificado de Base de Datos

**Archivo:** `src/db/schema.js`

Tablas definidas (8 tablas):

| Tabla | Propósito | Campos Clave |
|-------|-----------|--------------|
| `configuraciones` | Settings del negocio | key, value, type, category |
| `cajas` | Puntos de cobro | nombre, activa, ubicacion |
| `turnos` | Sesiones de caja | cajaId, userId, montoInicial, estado |
| `ventas` | Cabecera de ventas | turnoId, folio, total, estado |
| `venta_items` | Detalle de ventas | ventaId, productoId, cantidad, precio |
| `pagos` | Métodos de pago | ventaId, metodoPago, monto |
| `cortes_caja` | Cortes de caja | turnoId, efectivoEsperado, diferencia |
| `productos` | Catálogo | nombre, precioVenta, stock, categoria |

**Convenciones aplicadas:**
- ✅ Todos los IDs son scoped: `businessId_uuid`
- ✅ Campos numéricos (precios, totales) son tipo `number` (flexibles)
- ✅ Fechas almacenadas como objetos `Date`
- ✅ Campos comunes: `id`, `businessId`, `createdAt`, `updatedAt`
- ✅ Índices definidos para consultas eficientes

---

### 3. Capa de Acceso a Datos (Dexie.js)

**Archivo:** `src/db/db.js`

Clase `VexumDB` extendiendo Dexie con:
- Schema versionado para migraciones futuras
- 8 tablas configuradas con índices

Helpers genéricos exportados:
```javascript
initDB()              // Inicializa conexión
closeDB()             // Cierra conexión
clearDB()             // Limpia DB (dev/testing)
createRecord(table, data)     // Crea con ID scoped automático
updateRecord(table, id, data) // Actualiza con updatedAt
getRecordById(table, id)      // Obtiene por ID
deleteRecord(table, id)       // Elimina registro
queryRecords(table, filters)  // Consulta con filtros
```

**Características clave:**
- ✅ Auto-gestión de `businessId` desde auth store
- ✅ Auto-generación de IDs scoped
- ✅ Timestamps automáticos (`createdAt`, `updatedAt`)
- ✅ Filtros automáticos por businessId en queries

---

### 4. Stores de Zustand (Gestión de Estado)

#### 4.1 `useAuthStore.js`
Gestión de autenticación y negocio:
```javascript
// Estado
user, isAuthenticated, businessId, businessName
subscriptionStatus, subscriptionExpiry

// Acciones
login(userData), logout()
updateBusiness(data), isActiveSubscription()
initialize(), persist(), clearPersistence()
```

**Integración clave:**
- Expone `window.__VEXUM_AUTH_STORE__` para acceso desde db.js
- Persistencia en localStorage
- Método `getCurrentBusinessId()` para otros módulos

---

#### 4.2 `useProductsStore.js`
CRUD completo de productos:
```javascript
// Estado
products[], isLoading, error, lastSync
searchQuery, categoryFilter

// Acciones
loadProducts()
createProduct(data)
updateProduct(id, data)
deleteProduct(id)         // Soft delete (activo: false)
hardDeleteProduct(id)     // Hard delete (opcional)
updateStock(id, qty, op)  // add/subtract/set
findByBarcode(code)
findByCode(sku)
getLowStockProducts()
getFilteredProducts()
getCategories()
```

**Características:**
- ✅ Búsqueda por nombre, código y código de barras
- ✅ Filtro por categoría
- ✅ Gestión de stock con validación de negativos
- ✅ Soft delete para mantener historial de ventas

---

#### 4.3 `useCartStore.js`
Gestión del carrito POS:
```javascript
// Estado
items[], globalDiscount, globalDiscountPercent
customerName, customerPhone, notes, paymentMethods[]

// Acciones
addItem(product, qty)
updateQuantity(itemId, qty)
removeItem(itemId)
applyItemDiscount(itemId, amount)
applyGlobalDiscount(amount, isPercent)
clearDiscounts()
setCustomerInfo(name, phone)
clearCart()

// Calculadoras
getTotalItems()
getSubtotal()
getTaxes()
getTotalDiscount()
getTotal()
canCheckout()
checkStockAvailability(products)
```

**Cálculos implementados:**
- ✅ Subtotal por item: `precioUnitario * cantidad`
- ✅ Descuentos por item y globales (monto o porcentaje)
- ✅ Impuestos configurables por producto
- ✅ Total final con todos los ajustes
- ✅ Validación de stock antes de cobrar

---

#### 4.4 `useSalesStore.js`
Procesamiento de ventas e historial:
```javascript
// Estado
sales[], saleItems[], payments[]
isLoading, error, lastSync
dateFilter, statusFilter

// Acciones
loadSales()
processSale(saleData, items, payments)  // Transacción completa
cancelSale(id, reason)
getSaleItems(saleId)
getSalePayments(saleId)
getFilteredSales()
getSalesStats()
getNextFolio(turnoId)
findByFolio(folio)
```

**Flujo de `processSale`:**
1. Crea registro en `ventas`
2. Crea cada item en `venta_items`
3. Registra pagos en `pagos`
4. Actualiza estado local
5. Retorna todo estructurado

---

## 📁 Estructura de Archivos Creada

```
src/
├── db/
│   ├── index.js           # Exportador central
│   ├── schema.js          # Definición de schemas (8 tablas)
│   └── db.js              # Clase Dexie + helpers CRUD
│
├── stores/
│   ├── index.js           # Exportador central
│   ├── useAuthStore.js    # Autenticación y negocio
│   ├── useProductsStore.js # CRUD productos
│   ├── useCartStore.js    # Carrito POS
│   └── useSalesStore.js   # Ventas e historial
│
└── utils/
    ├── index.js           # Exportador central
    └── idGenerator.js     # UUIDs y scoped IDs
```

---

## 🔧 Cómo Usar

### Inicialización de la App

```javascript
import { initDB } from './db/index.js';
import { useAuthStore } from './stores/index.js';

// En tu componente principal o main.jsx
await initDB();

// Inicializar auth desde localStorage
useAuthStore.getState().initialize();
```

### Crear un Producto

```javascript
import { useProductsStore } from './stores/index.js';

const product = await useProductsStore.getState().createProduct({
  nombre: 'Coca Cola 600ml',
  codigo: 'COCA-600',
  codigoBarras: '7501234567890',
  precioCompra: 12,
  precioVenta: 18,
  stock: 100,
  stockMinimo: 20,
  categoria: 'Refrescos',
  unidadMedida: 'pieza',
  impuestos: 16
});
```

### Agregar al Carrito

```javascript
import { useCartStore } from './stores/index.js';

// Agregar producto
useCartStore.getState().addItem(product, 2);

// Aplicar descuento del 10%
useCartStore.getState().applyGlobalDiscount(10, true);

// Obtener total
const total = useCartStore.getState().getTotal();
```

### Procesar Venta

```javascript
import { useCartStore, useSalesStore, useAuthStore } from './stores/index.js';

const cartState = useCartStore.getState();
const authState = useAuthStore.getState();

const saleData = {
  turnoId: 'current_turno_id',
  cajaId: 'current_caja_id',
  userId: authState.user.id,
  folio: useSalesStore.getState().getNextFolio('current_turno_id'),
  subtotal: cartState.getSubtotal(),
  descuento: cartState.getTotalDiscount(),
  impuestos: cartState.getTaxes(),
  total: cartState.getTotal(),
  clienteNombre: cartState.customerName,
  observaciones: cartState.notes
};

const result = await useSalesStore.getState().processSale(
  saleData,
  cartState.items,
  cartState.paymentMethods
);

// Limpiar carrito después de cobrar
cartState.clearCart();
```

---

## 🎯 Decisiones de Diseño

### 1. IDs Scoped vs UUIDs Puros
**Decisión:** `businessId_uuid`  
**Razón:** Permite identificar rápidamente a qué negocio pertenece un registro sin joins adicionales, facilitando queries y sincronización.

### 2. Precios como `number` vs `string`
**Decisión:** `number` flexible  
**Razón:** Permite operaciones matemáticas directas sin parsing. Para mostrar, usar formatters. Evita errores de redondeo usando técnicas estándar (ej: trabajar con centavos si es crítico).

### 3. Soft Delete para Productos
**Decisión:** Marcar `activo: false` en lugar de eliminar  
**Razón:** Mantiene integridad referencial con ventas históricas. El hard delete está disponible pero no se recomienda.

### 4. Snapshots en Venta Items
**Decisión:** Guardar `productoNombre`, `productoCodigo` además del `productoId`  
**Razón:** Si el producto se elimina o cambia, el historial de ventas mantiene la información original.

### 5. Helpers Genéricos CRUD
**Decisión:** Funciones reutilizables `createRecord`, `updateRecord`, etc.  
**Razón:** Reduce código boilerplate, centraliza lógica de businessId y timestamps.

---

## 🔄 Sincronización Futura con Supabase

El schema está diseñado para mapeo directo:

| Dexie.js (Local) | PostgreSQL (Supabase) |
|------------------|----------------------|
| Tabla `productos` | Tabla `productos` |
| ID: `string` scoped | UUID scoped (mismo formato) |
| Fecha: `Date` object | `TIMESTAMPTZ` |
| Índices simples | Índices de PostgreSQL |

**Estrategia de sync:**
1. Cada tabla tiene `updatedAt` para delta sync
2. BusinessId permite filtrar por tenant
3. IDs compatibles evitan traducciones
4. JSON structure facilita serialización

---

## ⚠️ Consideraciones Importantes

### Seed Eliminado Temporalmente
Como solicitado, **no hay seed de productos**. La app debe funcionar creando productos manualmente primero.

### Stores Pendientes de Implementar
Para completar el modelo de datos, faltarán:
- `useBoxesStore.js` - Gestión de cajas
- `useShiftsStore.js` - Gestión de turnos
- `useCashCutsStore.js` - Cortes de caja
- `useSettingsStore.js` - Configuraciones

### Integración con UI
Los stores están listos para conectarse con componentes React. Falta:
- Componentes de CRUD de productos
- Interfaz POS (catálogo + carrito)
- Navegación y layout
- Manejo de errores con toasts

---

## ✅ Checklist de Entregables - Fase 1

- [x] Generator de UUIDs scoped por negocio
- [x] Schema unificado definido (8 tablas)
- [x] DB class Dexie configurada
- [x] Helpers CRUD genéricos
- [x] Store de autenticación
- [x] Store de productos (CRUD completo)
- [x] Store de carrito (cálculos incluidos)
- [x] Store de ventas (procesamiento completo)
- [x] Índices de exportación centralizados
- [x] Documentación de la implementación

---

## 📝 Próximos Pasos (Fase 2)

1. **Stores restantes:** Cajas, Turnos, Cortes de Caja, Settings
2. **Componentes UI:** Layout, BottomNav, ProtectedRoute
3. **Vista de Inventario:** CRUD visual de productos
4. **Vista POS:** Catálogo + Carrito + Cobro
5. **Manejo de Errores:** Toasts y validaciones
6. **Estilos CSS:** Centralizados según nueva arquitectura

---

**Estado:** ✅ Fase 1 Completada  
**Fecha:** 2025  
**Versión del Schema:** 1.0
