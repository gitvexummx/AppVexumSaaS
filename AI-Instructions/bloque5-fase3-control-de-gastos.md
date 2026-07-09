# BLOQUE 5, FASE 3: Control de Gastos Operativos (Registro, Recurrentes, Ganancia Neta)

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Implementar un sistema simple pero completo para registrar gastos operativos del negocio, permitiendo categorización libre definida por el usuario, programación de gastos recurrentes, y cálculo de ganancia neta real (Ventas - Costo Productos - Gastos Operativos) para que el dueño tenga visibilidad completa de la salud financiera del negocio.

## 📋 REQUERIMIENTOS DETALLADOS

### 18.1 Modelo de Datos - Gastos
Crear tabla `gastos` con campos:
- `id` (UUID o auto-incremental)
- `sucursal_id` (FK a sucursales, nullable si es gasto global)
- `usuario_id` (FK a usuarios, quién registró)
- `categoria` (string, definido libremente por usuario)
- `descripcion` (text, detalles del gasto)
- `monto` (decimal, 2 decimales)
- `fecha_gasto` (date, cuándo se realizó el gasto)
- `fecha_registro` (timestamp, cuándo se registró en sistema)
- `es_recurrente` (boolean)
- `frecuencia_recurrente` (enum: 'diario', 'semanal', 'quincenal', 'mensual', 'anual', nullable)
- `dia_recurrente` (integer, día del mes para mensuales, nullable)
- `activo` (boolean, para gastos recurrentes activos/inactivos)
- `proxima_ejecucion` (date, para recurrentes, cuándo se creará el próximo)
- `notas` (text, opcional)
- `created_at`, `updated_at`

### 18.2 Categorización Libre
- El usuario escribe libremente el nombre de la categoría al crear gasto
- Ejemplos comunes sugeridos (autocomplete): "Renta", "Luz", "Agua", "Internet", "Nómina", "Insumos", "Mantenimiento", "Publicidad", "Impuestos", "Seguros", "Transporte", "Comisiones", "Otros"
- Guardar historial de categorías usadas por el usuario/sucursal para autocompletado futuro
- Permitir editar categoría en gastos ya registrados (con log de auditoría)

### 18.3 Registro de Gastos
- Formulario simple con campos:
  - Categoría (input con autocomplete)
  - Descripción (textarea opcional)
  - Monto (input numérico, validación > 0)
  - Fecha (datepicker, default hoy)
  - ¿Es recurrente? (toggle/checkbox)
  - Si es recurrente: mostrar opciones de frecuencia
- Botón "Guardar Gasto"
- Botón "Cancelar"
- Validaciones en frontend y backend

### 18.4 Gastos Recurrentes
- Si usuario marca "Es recurrente":
  - Mostrar selector de frecuencia: Diario, Semanal, Quincenal, Mensual, Anual
  - Si es mensual: mostrar selector de día (1-31)
  - Si es semanal: mostrar selector de día de semana (Lun-Dom)
  - Calcular y mostrar `proxima_ejecucion`
- Sistema automático (cron job o scheduler):
  - Diariamente revisar gastos recurrentes con `proxima_ejecucion` = hoy
  - Crear nuevo registro de gasto automático (copia del original)
  - Actualizar `proxima_ejecucion` según frecuencia
  - Registrar en log que fue generado automáticamente
- Usuario puede:
  - Editar gasto recurrente (cambia futuras ejecuciones, no pasadas)
  - Desactivar gasto recurrente (no elimina históricos)
  - Eliminar gasto recurrente (preguntar: ¿solo este o todos los futuros?)

### 18.5 Lista/Historial de Gastos
- Página `/gastos` con tabla de todos los gastos
- Filtros:
  - Rango de fechas
  - Categoría (dropdown con categorías usadas)
  - Sucursal (si aplica)
  - Tipo: Todos, Únicos, Recurrentes
  - Estado: Activos, Inactivos (para recurrentes)
- Columnas:
  - Fecha
  - Categoría
  - Descripción
  - Monto
  - Sucursal
  - Tipo (Ícono: único/recurrente)
  - Usuario que registró
  - Acciones (Editar, Eliminar)
- Paginación (25-50 registros por página)
- Totalizador: Suma de gastos en el rango filtrado

### 18.6 Dashboard - Ganancia Neta
- Nueva tarjeta/KPI en dashboard: "Ganancia Neta"
- Fórmula: `Ganancia Neta = Ventas Totales - Costo de lo Vendido - Gastos Operativos`
- Mostrar en periodo seleccionado (usando mismo selector de tiempo de Fase 17):
  - Ventas Totales: $X
  - (-) Costo Productos: $Y
  - (=) Ganancia Bruta: $Z
  - (-) Gastos Operativos: $W
  - (=) GANANCIA NETA: $R (destacado, más grande)
- Indicador visual: color verde si positivo, rojo si negativo
- Comparativa con periodo anterior: "% vs periodo anterior"
- Pequeña gráfica de tendencia (línea) de ganancia neta últimos 6 periodos

### 18.7 Reporte de Gastos
- Página `/reportes/gastos` con análisis detallado
- Gráfica de barras: Gastos por categoría (mes actual)
- Gráfica de pastel: Distribución porcentual de gastos por categoría
- Gráfica de línea: Tendencia de gastos últimos 6-12 meses
- Tabla resumen por categoría:
  - Categoría
  - Total gastado en periodo
  - % del total
  - Promedio mensual
  - Mes con mayor gasto
- Botones exportar: PDF, Excel
- Filtro de rango de fechas (personalizable)

### 18.8 Alertas de Gastos Elevados
- Opcional: Alerta si una categoría supera cierto umbral
- Ej: "Gastos en 'Luz' este mes ($5,000) superan el promedio de últimos 3 meses ($3,200)"
- Mostrar en dashboard o sección de notificaciones
- Configurable por el usuario (umbrales por categoría)

### 18.9 Permisos y Roles
- Solo roles "Dueño" y "Gerente" pueden:
  - Registrar gastos
  - Editar gastos
  - Eliminar gastos
  - Ver reporte completo de gastos
- Rol "Cajero": No puede ver ni registrar gastos
- Rol "Almacenista": No puede ver ni registrar gastos
- Auditoría: Registrar quién creó/editó/eliminó cada gasto

### 18.10 Multiples Sucursales
- Al registrar gasto, preguntar: ¿A qué sucursal pertenece?
- Opción: "Gasto Global" (no asignado a sucursal específica)
- En dashboard con múltiples sucursales:
  - Selector: Ver todas las sucursales o una específica
  - Gastos globales se incluyen siempre
  - Gastos de sucursales individuales se filtran según selección
- Reportes desagregados por sucursal

### 18.11 Exportación
- Exportar lista de gastos a Excel (con filtros aplicados)
- Exportar reporte de gastos a PDF (con gráficas)
- Incluir: fecha de generación, rango de fechas, total de gastos, desglose por categoría
- Formato profesional con logo del negocio (si está configurado)

## ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)

1. ¿Existe alguna tabla o modelo relacionado con gastos actualmente?
2. ¿El sistema tiene jobs/schedulers configurados (cron, Laravel Scheduler, etc.)?
3. ¿Qué roles de usuario están actualmente implementados?
4. ¿Existe un sistema de permisos/middleware para roles?
5. ¿La Fase 15 (Rentabilidad) ya está implementada? ¿Podemos usar sus cálculos?
6. ¿El dashboard actual ya tiene tarjetas/KPIs que podamos usar como referencia?
7. ¿Existe un selector de tiempo global en el dashboard (Fase 17)?
8. ¿Qué librerías se usan para datepickers en el proyecto?
9. ¿El frontend usa formularios con validación (Formik, VeeValidate, etc.)?
10. ¿Hay un sistema de notificaciones/alertas ya implementado?
11. ¿Qué librerías se usan para exportar a PDF y Excel?
12. ¿Existe una página de configuración o preferencias del usuario?
13. ¿El sistema multipropósito/sucursal ya está implementado?
14. ¿Cómo se maneja la auditoría/log de cambios actualmente?
15. ¿La base de datos soporta eventos programados o debemos usar cron externo?
16. ¿Existe un componente de tabla con paginación que podamos reutilizar?
17. ¿Qué librerías de gráficas se instalaron en Fase 17?
18. ¿Hay un patrón establecido para modales de confirmación (eliminar, etc.)?
19. ¿El sistema usa colas (queues) para procesos en background?
20. ¿Existen tests para features de CRUD similares?

## 🛠️ ENTREGABLES ESPERADOS

### Backend
- [ ] Migración para crear tabla `gastos` con todos los campos especificados
- [ ] Migración para crear tabla `categorias_gastos_favoritas` (opcional, para autocomplete)
- [ ] Modelo `Gasto` con relaciones y scopes
- [ ] Model `CategoriaGasto` si se normaliza (opcional)
- [ ] Controller `GastoController` con CRUD completo
- [ ] Endpoint: `POST /api/gastos` - Crear gasto
- [ ] Endpoint: `GET /api/gastos` - Listar gastos con filtros
- [ ] Endpoint: `GET /api/gastos/:id` - Obtener detalle
- [ ] Endpoint: `PUT /api/gastos/:id` - Actualizar gasto
- [ ] Endpoint: `DELETE /api/gastos/:id` - Eliminar gasto
- [ ] Endpoint: `GET /api/gastos/categorias-sugeridas` - Autocomplete
- [ ] Endpoint: `GET /api/dashboard/ganancia-neta` - Calcular ganancia neta
- [ ] Endpoint: `GET /api/reportes/gastos-resumen` - Datos para gráficas
- [ ] Job/Scheduler para procesar gastos recurrentes diariamente
- [ ] Middleware/Guard para verificar permisos (solo Dueño/Gerente)
- [ ] Log de auditoría para cambios en gastos
- [ ] Tests unitarios para cálculos de ganancia neta
- [ ] Tests para lógica de gastos recurrentes

### Frontend
- [ ] Página `/gastos` con lista/tabla de gastos
- [ ] Formulario de creación/edición de gastos
- [ ] Toggle para "Es recurrente" con campos condicionales
- [ ] Selector de frecuencia para recurrentes
- [ ] Autocomplete para categorías
- [ ] Filtros avanzados en lista de gastos
- [ ] Paginación de resultados
- [ ] Modal de confirmación para eliminar
- [ ] Página `/reportes/gastos` con gráficas y análisis
- [ ] Gráfica de barras por categoría
- [ ] Gráfica de pastel de distribución
- [ ] Gráfica de línea de tendencia
- [ ] Tarjeta de Ganancia Neta en dashboard
- [ ] Integración con selector de tiempo global
- [ ] Indicador visual (verde/rojo) para ganancia positiva/negativa
- [ ] Comparativa con periodo anterior
- [ ] Botones de exportar PDF/Excel
- [ ] Adaptación a modo claro/oscuro
- [ ] Responsive design
- [ ] Estados de carga y error
- [ ] Notificación/toast al guardar/eliminar éxito

## 💡 Notas Adicionales

### Orden Sugerido de Desarrollo
1. **Primero:** Definir categorías de gastos fijas (alquiler, servicios, nómina, marketing, etc.) y permitir customización
2. **Segundo:** Crear migraciones para `expense_categories`, `expenses`, `expense_recurring`
3. **Tercero:** Implementar CRUD de gastos con subida de comprobantes (PDF/imágenes)
4. **Cuarto:** Sistema de aprobación de gastos (workflow: pendiente → aprobado → pagado)
5. **Quinto:** Integración con cuentas bancarias y cajas para conciliación
6. **Sexto:** Reportes de gastos por categoría, período, centro de costo, proyecto

### Puntos Críticos
- ⚠️ **CRÍTICO:** Diferenciar gastos operativos vs costos de mercancía vendida (COGS)
- ⚠️ Los gastos recurrentes deben generarse automáticamente cada período (jobs programados)
- ⚠️ Validar que cada gasto tenga: concepto claro, monto, fecha, categoría, comprobante, responsable
- ⚠️ Control de presupuestos: alertar cuando gastos de categoría superan presupuesto mensual

### Recomendaciones de UX
- Upload drag-and-drop de comprobantes con OCR opcional (extraer monto/fecha automáticamente)
- Workflow visual de aprobación con notificaciones a aprobadores
- Presupuestos visuales: barra de progreso "gastado vs presupuestado" por categoría
- Calendar view para ver distribución de gastos en el tiempo
- Búsqueda inteligente de gastos (por concepto, proveedor, monto, fecha)

### Dependencias con Otras Fases
- Requiere módulo de usuarios/sucursales (Bloque 1.2) para asignar responsables
- Integrará con contabilidad formal (Bloque 7) para asientos automáticos
- Depende de sistema de notificaciones para aprobaciones pendientes

### Advertencias Comunes
- ❌ No permitir gastos sin categoría asignada (imposible reportear)
- ❌ No olvidar control de IVA/deducibles en gastos (campo específico para impuestos)
- ❌ Evitar duplicación de gastos recurrentes al regenerar automáticamente
- ❌ No hardcodear categorías; hacerlas configurables por empresa/sucursal

### Casos Especiales
- Gastos compartidos entre múltiples sucursales/proyectos (prorateo automático)
- Gastos en moneda extranjera (convertir a moneda base con tipo de cambio del día)
- Reembolsos a empleados (flujo especial con aprobación y pago)
- Gastos capitalizables vs gastos del período (marcador para contabilidad)

## 🔒 CONSIDERACIONES TÉCNICAS

### Performance
- Indexar: `fecha_gasto`, `sucursal_id`, `categoria`, `es_recurrente`
- Paginar resultados de lista de gastos (máx 50-100 por página)
- Cachear cálculo de ganancia neta por 5-10 minutos
- Scheduler de recurrentes debe ser eficiente (query solo pendientes del día)
- Evitar N+1 queries al listar gastos con relaciones

### Seguridad
- Middleware estricto: solo Dueño y Gerente acceden a gastos
- Validar que usuario pueda acceder a gastos de esa sucursal específica
- Sanitización de inputs (especialmente categoría y descripción)
- Prevenir eliminación masiva accidental (confirmación requerida)
- Log de auditoría inmutable para todos los cambios

### Consistencia de Datos
- Usar transacciones al crear gasto recurrente y actualizar próxima_ejecucion
- No permitir edición de gastos automáticos generados por sistema (solo el template original)
- Al eliminar gasto recurrente, preguntar alcance (este, este y futuros, todos)
- Mantener integridad referencial con sucursales y usuarios

### UX/UI
- Formulario simple e intuitivo, máximo 2 pasos
- Autocomplete de categorías mejora experiencia
- Feedback inmediato al guardar/eliminar
- Confirmaciones claras antes de eliminar
- Tooltips explicativos en conceptos (¿qué es ganancia neta?)
- Resaltar visualmente gastos recurrentes en la lista

### Edge Cases
- Manejar gastos con fecha futura (¿permitir o bloquear?)
- Manejar gastos recurrentes en meses sin día 31 (ajustar automáticamente)
- Manejar cambio de horario/DST en schedulers
- Manejar gastos eliminados que fueron parte de cálculos históricos
- Manejar múltiples gastos recurrentes el mismo día (procesar en lote)

### Internacionalización
- Moneda local (MXN)
- Días de la semana y meses en español
- Formato de fechas DD/MM/YYYY
- Separador de miles y decimales adecuado a región

### Backup y Recovery
- Gastos son datos críticos, asegurar backup diario
- Considerar soft delete para poder recuperar eliminados accidentalmente
- Log de auditoría debe ser inmutable

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

- [ ] CRUD de gastos funciona completamente
- [ ] Categorías con autocomplete funcionan
- [ ] Gastos recurrentes se crean correctamente
- [ ] Scheduler genera gastos recurrentes automáticamente
- [ ] Se puede editar/desactivar gasto recurrente
- [ ] Lista de gastos tiene filtros funcionales
- [ ] Paginación funciona correctamente
- [ ] Cálculo de ganancia neta es preciso
- [ ] Tarjeta de dashboard muestra fórmula completa
- [ ] Comparativas con periodo anterior son correctas
- [ ] Gráficas de reporte de gastos muestran datos reales
- [ ] Exportación a PDF funciona con formato profesional
- [ ] Exportación a Excel funciona con datos correctos
- [ ] Permisos restringen acceso solo a Dueño/Gerente
- [ ] Log de auditoría registra todos los cambios
- [ ] Modo claro/oscuro se aplica correctamente
- [ ] Responsive design funciona en móvil
- [ ] Notificaciones/toasts aparecen en acciones
- [ ] No hay regresiones en dashboard existente
- [ ] Tests unitarios pasan exitosamente