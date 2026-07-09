# BLOQUE 4, FASE 5: Multi-Almacén y Transferencias Internas

## ⚠️ INSTRUCCIONES CRÍTICAS PARA LA IA
1. **LEER PRIMERO:** Leer estrictamente `AIContext.md`.
2. **PREGUNTAR ANTES DE CODIFICAR:** Clarificar dudas sobre la lógica de costos y asignación.

## 🎯 Objetivo
Gestionar inventario distribuido en múltiples ubicaciones (Tienda Física, Bodega, Sucursales) permitiendo descontar stock de almacenes específicos al vender y realizar transferencias inmediatas entre ellos.

## 📋 Especificaciones Detalladas

### 1. Concepto de "Ubicación/Almacén"
- Cada Sucursal tiene por defecto un Almacén principal ("Tienda").
- Posibilidad de crear almacenes adicionales (ej: "Bodega Trasera", "Almacén Central").
- El stock se registra a nivel: `Variante` + `Almacén`.

### 2. Ventas y Desconto
- Por defecto, la venta descuenta del Almacén asignado a la Sucursal donde se realiza la transacción.
- **Excepción:** Permitir seleccionar manualmente otro almacén disponible al momento de cobrar (ej: vender desde Bodega si Tienda está agotada).

### 3. Transferencias
- Flujo simple: Origen → Destino.
- Inmediato: Al confirmar, resta en Origen y suma en Destino al instante (sin estado "En tránsito").
- Registro: Bitácora de movimiento con motivo, usuario y fecha.
- Costos: El costo del producto puede diferir por almacén. Al transferir, ¿se mantiene el costo origen o se ajusta al promedio? (Por defecto: se mantiene el costo unitario registrado, pero editable).

### 4. Costos Diferenciados
- Campo `precio_costo` puede variar por Almacén.
- Default: Mismo costo en todos.
- Manual: Usuario puede ajustar costo en un almacén específico (ej: costo de flete incluido en Bodega lejana).

## ❓ PREGUNTAS OBLIGATORIAS DE CLARIFICACIÓN
1. ¿La tabla de stock actual es `producto_id -> cantidad`? Debemos cambiarla a `variante_id + almacen_id -> cantidad`.
2. ¿Un almacén pertenece exclusivamente a una sucursal o puede ser compartido? (Ej: Bodega central sirve a 3 sucursales).
3. ¿Al hacer una transferencia, se debe imprimir algún documento "Remisión interna"?
4. ¿Quién tiene permiso para hacer transferencias? ¿Solo Gerentes y Almacenistas?
5. ¿Se permite tener stock negativo en algún almacén? (Generalmente no, validar stock antes de transferir/vender).
6. ¿El reporte de "Valor de Inventario" debe sumar costos diferenciados por almacén?
7. ¿En el POS, si selecciono un almacén alternativo, el ticket debe reflejar de dónde salió la mercancía? (Probablemente no, es dato interno).
8. ¿Cómo manejamos el historial de movimientos? ¿Una tabla única `movimientos_inventario` con tipo (venta, transferencia, ajuste)?
9. ¿Se requiere aprobación para transferencias entre sucursales diferentes? (Dijiste inmediato, pero ¿hay validación?).
10. ¿El nombre del almacén es visible para el cajero en el POS o solo para personal autorizado?
11. ¿Qué pasa si transfiero un producto que no existe en el almacén destino? (Se crea el registro con stock 0 previo a la suma).
12. ¿Podemos tener un "Almacén Virtual" para productos dañados o en devolución?
13. ¿La búsqueda de disponibilidad "Ver en otras tiendas" será una feature futura o la planeamos ahora en la BD?
14. ¿El costo promedio ponderado se recalcula automáticamente al recibir transferencia con distinto costo?
15. ¿Hay límite de peso/volumen para transferencias? (No parece, pero confirmar).

## ✅ Checklist de Entregables
- [ ] Migración: Crear tabla `almacenes` y refactorizar stock a tabla pivote `stock_variante_almacen`.
- [ ] Models: `Almacen`, `MovimientoInventario`.
- [ ] Endpoints: CRUD Almacenes, Transferencia (`POST /transferencias`), Consulta de Stock por Almacén.
- [ ] UI Inventario: Selector de Almacén para ver stock filtrado.
- [ ] UI Transferencias: Formulario Origen/Destino, Lista de productos a mover.
- [ ] POS: Selector de "Descontar de:" (Default: Sucursal actual).
- [ ] Reportes: Movimientos de inventario filtrables por almacén.

## 💡 Nota de Diseño
- Mantener la simplicidad: No complicar con estados "Pendiente de recepción". Todo es atómico e inmediato.
- La integridad del stock es crítica: Usar transacciones de BD en las transferencias (Restar A, Sumar B, Registrar Movimiento).

## 🔒 CONSIDERACIONES TÉCNICAS

### Performance
- Índices obligatorios en: `warehouses(code, is_active)`, `inventory_levels(warehouse_id, product_id, variant_id)`, `transfer_requests(status, created_at)`
- Caché de stock total por producto (suma de todos los almacenes) refresh on-change
- Paginación server-side para listados de transferencias (>50 registros por página)
- Query optimization para reporte de stock multi-almacén (evitar N+1)

### Seguridad
- Validar permisos por almacén: usuario puede tener acceso solo a ciertos warehouses
- Middleware `CanAccessWarehouse` para restringir operaciones por ubicación
- Sanitizar inputs de transferencias (cantidades, IDs de almacenes)
- Prevenir race conditions en transferencias con locking a nivel de fila o transacciones
- Auditoría completa: quién autorizó, quién recibió, timestamps exactos

### UX/UI
- Selector de almacén visible en todo momento (breadcrumb o dropdown en header)
- Vista consolidada de stock por producto mostrando desglose por almacén
- Workflow visual para transferencias: Solicitado → Autorizado → En Tránsito → Recibido → Cancelado
- Notificaciones a responsables de almacén origen y destino
- Códigos de barras/QR para tracking de transferencias físicas

### Edge Cases
- Manejar transferencia parcial (enviar 50 de 100 solicitados)
- Prevenir transferencia si stock insuficiente en origen al momento de despachar
- Transferencias con productos en cuarentena/calidad (no transferibles hasta liberados)
- Reversión de transferencias: ¿qué pasa si producto llega dañado?
- Transferencias entre almacenes de diferentes sucursales/empresas (si aplica multi-entidad)

### Consistencia de Datos
- Transacciones ACID para: decrementar en origen + incrementar en destino + crear registro de transferencia
- Estados atómicos: transferencia no puede estar en dos estados simultáneos
- Integridad referencial: no eliminar almacén con stock o transferencias activas
- Conciliación automática: alertar discrepancias entre stock teórico vs físico post-transferencia

### Internacionalización
- Soporte para nombres de almacenes en múltiples idiomas
- Formatos de fecha/hora según zona horaria de cada almacén
- Etiquetas y códigos de seguimiento adaptables a regulaciones locales

---

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

### Backend
- [ ] Migración para tabla `warehouses` (id, name, code, address, is_active, type, parent_id)
- [ ] Migración para tabla `warehouse_users` (user_id, warehouse_id, role, permissions)
- [ ] Modificación a `inventory_levels`: agregar `warehouse_id` (foreign key)
- [ ] Migración para tabla `transfer_requests` (id, from_warehouse_id, to_warehouse_id, status, requested_by, approved_by, shipped_at, received_at)
- [ ] Migración para tabla `transfer_items` (transfer_id, product_id, variant_id, quantity_requested, quantity_shipped, quantity_received)
- [ ] Modelo Warehouse con relaciones a Users, InventoryLevels, Transfers
- [ ] Modelo TransferRequest con estados: pending, approved, rejected, in_transit, partially_received, completed, cancelled
- [ ] Service para cálculo de stock disponible por almacén
- [ ] Service para creación y seguimiento de transferencias
- [ ] Controller con CRUD de almacenes (solo admins globales)
- [ ] Endpoint para solicitar transferencia
- [ ] Endpoint para aprobar/rechazar transferencia
- [ ] Endpoint para registrar envío de transferencia
- [ ] Endpoint para registrar recepción (completa o parcial)
- [ ] Endpoint para obtener stock consolidado y desglosado
- [ ] Jobs para notificaciones de transferencias pendientes
- [ ] Tests unitarios para modelos y servicios
- [ ] Tests de integración para flujo completo de transferencia
- [ ] Tests de concurrencia (múltiples transferencias simultáneas del mismo producto)

### Frontend
- [ ] Selector de almacén activo (persistido en sesión/localStorage)
- [ ] Dashboard de stock multi-almacén con vista consolidada y desglosada
- [ ] Componente WarehouseList con filtros y búsqueda
- [ ] Formulario de creación/edición de almacén (solo roles autorizados)
- [ ] Wizard de solicitud de transferencia: seleccionar origen, destino, productos, cantidades
- [ ] Vista de detalle de transferencia con timeline de estados
- [ ] Acciones por estado: aprobar, rechazar, marcar como enviado, registrar recepción
- [ ] Formulario de recepción parcial con campo para cantidad recibida y observaciones
- [ ] Tabla de transferencias históricas con filtros por fecha, estado, almacenes
- [ ] Gráficas de movimiento entre almacenes (sankey o similar)
- [ ] Notificaciones in-app para transferencias que requieren acción
- [ ] Generación de PDF/etiqueta de envío para transferencia
- [ ] Lectura de códigos de barras/QR para agilizar recepción
- [ ] Responsive en móvil/tablet (especialmente para recepción en piso de almacén)
- [ ] Tests de integración para flujos completos

### UX/UI
- [ ] Diseño de workflow visual claro (stepper o timeline)
- [ ] Badges de estado con colores semánticos
- [ ] Alertas de stock crítico por almacén
- [ ] Confirmaciones antes de acciones irreversibles (cancelar transferencia)
- [ ] Tooltips explicativos en campos de transferencia
- [ ] Modo offline para recepción en almacenes sin conectividad constante (PWA/service worker)
- [ ] Accesibilidad (ARIA labels, navegación por teclado)

### Performance & Security
- [ ] Queries optimizadas con includes/eager loading para evitar N+1
- [ ] Caché de stock por almacén invalidado en eventos de cambio
- [ ] Índices compuestos en `inventory_levels(warehouse_id, product_id, variant_id)`
- [ ] Validación de permisos en cada endpoint (usuario pertenece a almacén origen/destino)
- [ ] Rate limiting en solicitudes de transferencia
- [ ] Logs de auditoría para todas las acciones de transferencia
- [ ] Encriptación de datos sensibles en tránsito y reposo

### Casos Especiales
- [ ] Transferencias express (aprobación automática para ciertos usuarios/rutas)
- [ ] Transferencias programadas (fecha futura de envío)
- [ ] Ajustes de inventario por diferencias en transferencia
- [ ] Devoluciones de transferencia (producto regresa al origen)
- [ ] Transferencias a terceros (clientes, proveedores, otros sistemas)
- [ ] Multi-moneda si almacenes en diferentes países

### Documentación
- [ ] Guía de usuario para gestión de almacenes
- [ ] Manual de procedimientos de transferencia
- [ ] Diagrama de flujo de estados de transferencia
- [ ] API documentation para endpoints de warehouses y transfers
- [ ] Runbook para resolución de discrepancias de inventario