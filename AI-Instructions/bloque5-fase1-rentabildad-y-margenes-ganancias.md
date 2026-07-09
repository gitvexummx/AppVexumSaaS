# BLOQUE 5, FASE 1: Rentabilidad y Márgenes (Costo, Ganancia Bruta, %Margen, %Markup)

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Implementar el sistema de cálculo de rentabilidad que permita al dueño entender la ganancia real del negocio, calculando márgenes y markups basados en el costo histórico exacto de cada producto al momento de la venta, sin promedios que generen imprecisiones.

## 📋 REQUERIMIENTOS DETALLADOS

### 15.1 Campo "Costo" en Productos
- Agregar campo `costo` a la tabla `productos` (o `producto_almacen` si existe multi-almacén)
- El costo puede ser diferente por almacén
- Validar que costo sea mayor o igual a 0
- Si costo está vacío o es null, marcar como error en reportes

### 15.2 Cálculo con Costo Histórico
- Al momento de realizar una venta, guardar el `costo_unitario` exacto del producto en ese instante en la tabla `venta_items`
- NUNCA usar el costo actual para calcular ganancias de ventas pasadas
- Fórmula: `Ganancia Bruta = (precio_venta - costo_historico) * cantidad`

### 15.3 Cálculo Exacto sin Promedios
- Sumar costos exactos de cada item vendido: `Costo Total Vendido = SUM(costo_historico * cantidad)`
- Ventas Totales = SUM(precio_venta * cantidad)
- Ganancia Bruta = Ventas Totales - Costo Total Vendido
- No usar promedios de costo entre almacenes

### 15.4 Porcentajes a Mostrar
- **% Margen Bruto**: `((Venta - Costo) / Venta) * 100`
- **% Markup**: `((Venta - Costo) / Costo) * 100`
- Mostrar ambos porcentajes en reportes

### 15.5 Manejo de Productos sin Costo
- Si un producto no tiene costo registrado al momento de la venta:
  - Marcar como ALERTA/ERROR en el reporte
  - No incluir ese item en el cálculo de ganancia bruta total
  - Mostrar advertencia: "X productos sin costo registrado, ganancia no calculada para estos items"

### 15.6 Reporte de Rentabilidad
- Vista de reporte con filtros por:
  - Rango de fechas (día, semana, mes, año, personalizado)
  - Sucursal (si aplica)
  - Categoría de producto
  - Almacén específico
- Columnas del reporte:
  - Producto
  - Cantidad Vendida
  - Precio Venta Promedio
  - Costo Unitario (histórico)
  - Ventas Totales
  - Costo Total
  - Ganancia Bruta ($)
  - % Margen
  - % Markup
- Totales generales al final
- Botones de exportar: PDF y Excel

### 15.7 Dashboard - KPI de Rentabilidad
- Nueva tarjeta en dashboard: "Ganancia Bruta del Día/Mes"
- Mostrar: Ventas Totales, Costo Total, Ganancia Bruta, % Margen Promedio
- Comparativa con periodo anterior (ej: vs mes pasado)

## ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)

1. ¿Ya existe el campo `costo` en la tabla `productos` o `producto_almacen`?
2. ¿Cuál es la estructura actual de la tabla `venta_items`? ¿Tiene campos para guardar costo histórico?
3. ¿Qué modelo/s se usan actualmente para Productos y Ventas?
4. ¿El sistema ya tiene multi-almacén implementado? ¿Cómo se estructura?
5. ¿Existe alguna migración previa relacionada con costos o precios?
6. ¿Qué librerías se usan actualmente para exportar a PDF y Excel?
7. ¿Hay algún reporte existente que podamos usar como plantilla?
8. ¿El frontend usa TypeScript o JavaScript puro?
9. ¿Qué librería de UI se usa para tablas y gráficas?
10. ¿Existe un sistema de permisos/roles ya implementado?
11. ¿Cómo se manejan actualmente los decimales en el sistema (librería, formato)?
12. ¿Hay algún cálculo de promedios o totales existente que podamos reutilizar?
13. ¿El backend ya tiene endpoints para reportes con filtros de fecha?
14. ¿Se usa algún paquete para manejo de moneda/formato financiero?
15. ¿Existe cacheo de consultas pesadas en el backend?
16. ¿Qué base de datos se usa (MySQL, PostgreSQL, SQLite)?
17. ¿Hay límites de registros en los reportes actuales?
18. ¿El sistema tiene timezone configurado? ¿Cómo maneja fechas?
19. ¿Existen tests unitarios o de integración para reportes?
20. ¿Qué versión de PHP/Laravel/Node/etc. se está usando?

## 🛠️ ENTREGABLES ESPERADOS

### Backend
- [ ] Migración para agregar campo `costo` en productos/producto_almacen
- [ ] Migración para agregar `costo_unitario_historico` en `venta_items`
- [ ] Actualización del modelo `Producto` con validaciones de costo
- [ ] Actualización del proceso de venta para guardar costo histórico
- [ ] Endpoint nuevo: `GET /api/reportes/rentabilidad` con filtros
- [ ] Endpoint nuevo: `GET /api/dashboard/rentabilidad-resumen`
- [ ] Service/Clase para cálculos de margen y markup
- [ ] Exportador a PDF para reporte de rentabilidad
- [ ] Exportador a Excel para reporte de rentabilidad
- [ ] Tests unitarios para cálculos de rentabilidad

### Frontend
- [ ] Componente de formulario para editar costo en producto
- [ ] Vista de Reporte de Rentabilidad con filtros
- [ ] Tabla de resultados con columnas especificadas
- [ ] Tarjeta de KPI en dashboard para ganancia bruta
- [ ] Modal/Alerta para productos sin costo
- [ ] Botones de exportar PDF/Excel funcionales
- [ ] Adaptación a modo claro/oscuro
- [ ] Manejo de estados de carga y error
- [ ] Validaciones de frontend para costo >= 0

## 🔒 CONSIDERACIONES TÉCNICAS

### Performance
- Indexar campos: `fecha_venta`, `producto_id`, `sucursal_id` en `ventas`
- Usar agregaciones de base de datos para sumas (no traer todos los registros y sumar en PHP/JS)
- Implementar caché de resultados para reportes de rangos grandes (ej: 1 hora de caché)
- Paginar resultados si superan 1000 registros

### Seguridad
- Solo roles "Dueño" y "Gerente" pueden ver reportes de rentabilidad
- Solo roles "Dueño" y "Gerente" pueden editar costos de productos
- Log de auditoría: registrar quién cambió el costo de un producto y cuándo
- Validar que el usuario tenga permiso de la sucursal específica que consulta

### Consistencia de Datos
- Usar transacciones de base de datos al guardar venta + costo histórico
- Nunca actualizar el costo histórico de ventas ya realizadas
- Si se corrige el costo de un producto, NO afectar ventas pasadas
- Bloquear edición de costo histórico en `venta_items` después de creada la venta

### Manejo de Errores
- Si hay productos sin costo, mostrar alerta clara pero permitir continuar
- En exportaciones, incluir columna de "Errores/Advertencias"
- Logging de errores de cálculo para debugging
- Mensajes de error amigables para el usuario final

### Formato Financiero
- Usar 2 decimales para todos los montos de moneda
- Separador de miles adecuado a la región (MXN)
- Símbolo de moneda configurable ($, MXN, etc.)
- Porcentajes con 2 decimales (ej: 45.67%)

## 💡 Notas Adicionales

### Orden Sugerido de Desarrollo
1. **Primero:** Definir fórmulas exactas de cálculo (margen bruto, margen neto, ROI, markup)
2. **Segundo:** Crear migraciones para tablas de costos operativos y gastos asignables
3. **Tercero:** Implementar service layer para cálculos de rentabilidad por producto/categoría/venta
4. **Cuarto:** Agregar campos calculados o vistas materializadas para performance
5. **Quinto:** Crear endpoints de reporting con filtros por fecha, categoría, sucursal
6. **Sexto:** Dashboard visual con gráficas de márgenes y ranking de productos más/menos rentables

### Puntos Críticos
- ⚠️ **CRÍTICO:** Diferenciar claramente entre **MARGEN** (`(precio - costo) / precio * 100`) y **MARKUP** (`(precio - costo) / costo * 100`)
- ⚠️ Los costos deben incluir TODOS los componentes: costo producto + flete + impuestos no recuperables + handling
- ⚠️ Considerar costos variables vs fijos en el cálculo de rentabilidad neta
- ⚠️ Precisión decimal: mínimo 4 decimales en cálculos intermedios, 2 decimales en visualización

### Recomendaciones de UX
- Mostrar ambos valores: margen absoluto ($) y margen porcentual (%)
- Indicadores visuales de color: verde (>30%), amarillo (15-30%), rojo (<15%)
- Permitir drill-down: de vista general → categoría → producto → venta específica
- Incluir comparativa temporal: margen actual vs mes anterior vs mismo mes año pasado
- Tooltips explicativos definiendo cada métrica para usuarios no financieros

### Dependencias con Otras Fases
- Requiere módulo de compras completada (para tener costos reales de adquisición)
- Depende de sistema de gastos operativos (si existe en fase posterior)
- Integrará con dashboard ejecutivo (Bloque 8)

### Advertencias Comunes
- ❌ No usar precio de lista; usar precio real de venta (con descuentos aplicados)
- ❌ No olvidar proratear gastos indirectos (luz, alquiler, personal) si se calcula margen neto
- ❌ Evitar mostrar márgenes negativos sin explicación clara (¿por qué se vendió bajo costo?)
- ❌ No calcular en tiempo real si hay grandes volúmenes; usar caché o vistas materializadas refresh diarias

### Casos Especiales a Considerar
- Productos vendidos en promoción con margen negativo estratégico
- Kits/bundles: ¿cómo asignar costo y precio a cada componente?
- Devoluciones: ajustar márgenes históricos cuando se devuelve producto

---

## ✅ CHECKLIST DE VERIFICACIÓN FINAL
- Multi-moneda: convertir todo a moneda base antes de calcular márgenes