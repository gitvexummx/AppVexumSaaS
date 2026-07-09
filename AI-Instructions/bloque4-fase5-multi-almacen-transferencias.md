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