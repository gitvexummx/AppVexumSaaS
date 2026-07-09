# BLOQUE 6, FASE 2: Códigos de Pago Estandarizados por País

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Implementar catálogos estandarizados de métodos de pago específicos por país, almacenando tanto el código oficial (ej: "01" para Efectivo en México) como el nombre visible para el usuario, permitiendo que el sistema seleccione automáticamente los códigos correctos según el país configurado y los asocie a cada pago registrado (incluyendo pagos mixtos).

## 📋 REQUERIMIENTOS DETALLADOS

### 20.1 Tabla `catalogo_metodos_pago_pais`
Tabla intermedia que relaciona países con sus métodos de pago oficiales:
- `id` (PK)
- `pais_id` (FK a paises)
- `codigo_oficial` (string, ej: "01", "02", "03")
- `nombre_visible` (string, ej: "Efectivo", "Tarjeta de crédito/débito", "Transferencia")
- `descripcion` (text nullable, detalles adicionales)
- `activo` (boolean, default true)
- `orden_mostrar` (integer, para ordenar en dropdowns)
- `requiere_referencia` (boolean, si el método requiere número de comprobante)
- `created_at`, `updated_at`

**Catálogos iniciales por país (mínimo):**

**México (SAT):**
- 01 - Efectivo
- 02 - Cheque nominativo
- 03 - Transferencia electrónica de fondos
- 04 - Tarjeta de crédito
- 05 - Monedero electrónico
- 06 - Dinero electrónico
- 08 - Vales de despensa
- 12 - Dación en pago
- 13 - Pago por subrogación
- 14 - Pago por renovación de plazo
- 15 - Pago diferido
- 17 - Compensación
- 23 - Novación
- 24 - Condonación
- 25 - Remisión
- 26 - Venta de mercancía dada en pago
- 27 - Prescripción o caducidad
- 28 - Acondonamiento
- 29 - Confusión
- 30 - Repudio del legado
- 31 - Insolvencia
- 32 - Rejectment
- 99 - Otros

**Colombia (DIAN):**
- 1 - Efectivo
- 2 - Cheque
- 3 - Tarjeta de crédito/débito
- 4 - Transferencia
- 5 - Recaudo bancario
- 99 - Otros

**República Dominicana (DGII):**
- 01 - Efectivo
- 02 - Cheque
- 03 - Tarjeta de crédito/débito
- 04 - Transferencia bancaria
- 05 - Saldo a favor
- 99 - Otros

**Chile (SII):**
- 1 - Efectivo
- 2 - Cheque
- 3 - Tarjeta de crédito
- 4 - Tarjeta de débito
- 5 - Transferencia
- 99 - Otros

**Argentina (AFIP):**
- 01 - Contado
- 02 - Cheque
- 03 - Tarjeta de crédito
- 04 - Tarjeta de débito
- 05 - Transferencia
- 99 - Otros

### 20.2 Carga Inicial de Catálogos
- Seeder que precarga todos los métodos de pago oficiales para los 5 países iniciales
- Permitir actualización de catálogos mediante nuevos seeders o migraciones de datos
- Marcar como activos solo los métodos más comunes por defecto:
  - Efectivo
  - Tarjeta (crédito/débito combinados o separados según país)
  - Transferencia
- Los demás métodos quedan disponibles pero pueden estar ocultos por defecto

### 20.3 Integración con Métodos de Pago Existentes
- Actualizar tabla `metodos_pago` (o equivalente) para incluir:
  - `codigo_oficial_id` (FK a `catalogo_metodos_pago_pais.id`)
  - O almacenar directamente `codigo_oficial` y `pais_id` si no hay relación FK
- Mantener nombre amigable para el usuario (`nombre_visible`)
- El código oficial es dato interno, no necesariamente visible en UI principal

### 20.4 Selección de Método de Pago en POS
- En modal de pagos (Fase de Pagos Mixtos), dropdown muestra solo `nombre_visible`
- Filtrar métodos disponibles según país configurado en la cuenta
- Ordenar por `orden_mostrar` para mostrar primero los más comunes
- Al seleccionar método, guardar internamente:
  - `metodo_pago_id`
  - `codigo_oficial`
  - `pais_id`
- Para pagos mixtos, cada pago individual guarda su propio código estandarizado

### 20.5 Visualización del Código Oficial
- El código oficial es visible solo como dato informativo en:
  - Detalle de venta/factura (vista interna)
  - Reportes de pagos
  - Exportaciones (Excel/PDF)
- No mostrar en UI principal de POS para no confundir al cajero
- Tooltip opcional: "Código SAT: 01" si usuario pasa cursor sobre método

### 20.6 Validación de Métodos de Pago
- Validar que método de pago seleccionado exista en catálogo del país
- Prevenir uso de métodos inactivos
- Si método requiere referencia (ej: transferencia, cheque), hacer campo obligatorio
- Mensaje de error claro si se intenta usar método no válido para el país

### 20.7 Actualización de Catálogos
- Mecanismo para actualizar catálogos cuando gobiernos cambian códigos
- Opción A: Nuevos seeders que actualizan registros existentes
- Opción B: Panel de administración para super-admins agreguen/editen métodos
- Log de cambios en catálogos (auditoría)
- Notificar a usuarios si hay cambios críticos (opcional)

### 20.8 Pagos Mixtos y Códigos Múltiples
- En pago mixto, cada parcialidad guarda su propio código oficial
- Ejemplo: Venta $1000
  - $600 Efectivo → código "01"
  - $400 Transferencia → código "03"
- En factura/documento fiscal, listar todos los métodos con sus códigos
- Suma total de métodos debe igualar total de venta

### 20.9 Reportes y Exportaciones
- En reportes de ventas/pagos, incluir columna "Código Oficial"
- Agrupar pagos por código oficial en reportes fiscales
- Exportación a Excel incluye códigos oficiales
- Filtros por método de pago usan nombres visibles, pero internamente mapean a códigos

### 20.10 APIs de Facturación de Terceros
- Preparar estructura para enviar código oficial a APIs de facturación (ej: Facturama)
- Mapeo directo: `codigo_oficial` → parámetro de API externa
- No asumir formato fijo, leer de tabla según país
- Webhook/callback de facturación debe almacenar confirmación con códigos usados

## ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)

1. ¿Existe actualmente una tabla `metodos_pago` o similar? ¿Cuál es su estructura?
2. ¿Los métodos de pago actuales están hardcodeados o vienen de base de datos?
3. ¿La Fase 19 (tabla `paises`) ya está implementada?
4. ¿El sistema de pagos mixtos ya está desarrollado? ¿Cómo guarda los métodos?
5. ¿Qué endpoint(s) devuelve los métodos de pago disponibles actualmente?
6. ¿El frontend usa dropdowns nativos o componentes personalizados para selects?
7. ¿Existe algún catálogo similar ya implementado (ej: catálogos de productos, categorías)?
8. ¿La API de facturación (ej: Facturama) ya está integrada o es futuro?
9. ¿Qué librerías se usan para seeders/migraciones de datos?
10. ¿Hay un panel de administración para super-admins?
11. ¿Los reportes actuales ya incluyen desglose por método de pago?
12. ¿Se permite editar métodos de pago después de creada la venta?
13. ¿El sistema valida que la suma de pagos mixtos iguale el total?
14. ¿Existe un campo "referencia" o "comprobante" para métodos de pago?
15. ¿Los métodos de pago pueden ser personalizados por el usuario o solo catálogos?
16. ¿Qué versión de la base de datos se usa?
17. ¿Hay índices en tablas de catálogos actualmente?
18. ¿El cacheo de catálogos está implementado en algún lado?
19. ¿Los tooltips ya tienen un componente estandarizado?
20. ¿Existen tests para validación de métodos de pago?

## 🛠️ ENTREGABLES ESPERADOS

### Backend
- [ ] Migración para crear tabla `catalogo_metodos_pago_pais`
- [ ] Seeder con catálogos completos para 5 países (MX, CO, DO, CL, AR)
- [ ] Migración para actualizar tabla `metodos_pago` existente (agregar `codigo_oficial`, `pais_id`)
- [ ] O migración para crear nueva tabla `metodos_pago` normalizada con relación a catálogo
- [ ] Modelo `CatalogoMetodoPagoPais` con relaciones
- [ ] Modelo `MetodoPago` actualizado con validaciones
- [ ] Endpoint: `GET /api/catalogos/metodos-pago?pais_id=X` - Obtener métodos por país
- [ ] Endpoint: `GET /api/metodos-pago` - Listar métodos disponibles (filtrados por país de cuenta)
- [ ] Actualización de endpoint de creación de pago para guardar `codigo_oficial`
- [ ] Actualización de endpoint de pagos mixtos para guardar código por cada pago
- [ ] Servicio de mapeo de métodos a APIs de facturación
- [ ] Validador de métodos de pago activos por país
- [ ] Middleware para verificar método válido según país
- [ ] Seeder de actualización para futuros cambios de catálogos
- [ ] Tests unitarios para validación de métodos

### Frontend
- [ ] Actualizar dropdown de métodos de pago en POS para cargar dinámicamente según país
- [ ] Filtrar métodos inactivos en UI
- [ ] Ordenar métodos por `orden_mostrar`
- [ ] Mostrar solo `nombre_visible` en dropdown
- [ ] Tooltip opcional mostrando código oficial al hacer hover
- [ ] En detalle de venta, mostrar código oficial como dato informativo
- [ ] En modal de pagos mixtos, cada fila guarda su código oficial
- [ ] Validación frontend: si método requiere referencia, mostrar campo obligatorio
- [ ] Mensajes de error si método no es válido para país
- [ ] Reportes incluyen columna de código oficial
- [ ] Exportaciones (PDF/Excel) incluyen códigos oficiales
- [ ] Adaptación a modo claro/oscuro
- [ ] Estados de carga al cargar catálogo
- [ ] Manejo de errores si catálogo no carga

## 💡 NOTAS DE IMPLEMENTACIÓN

### Orden Sugerido de Desarrollo
1. **Primero:** Investigar estándares de códigos de pago locales e internacionales (ISO 20022, CATálogos de SAT, etc.)
2. **Segundo:** Crear migración para tabla `payment_codes` o `payment_methods` estandarizada
3. **Tercero:** Seeder con catálogo oficial de códigos de pago vigentes
4. **Cuarto:** Actualizar modelo de ventas/pagos para usar código estandarizado en lugar de texto libre
5. **Quinto:** UI de selección de método de pago con búsqueda por código/descripción
6. **Sexto:** Reportes fiscales usando códigos estandarizados obligatorios

### Puntos Críticos
- ⚠️ **CRÍTICO:** Los códigos de pago son obligatorios para facturación electrónica en muchos países
- ⚠️ El catálogo oficial puede cambiar; diseñar sistema versionado o con actualización periódica
- ⚠️ Cada código tiene descripción oficial que no debe modificarse (solo agregar descripciones internas opcionales)
- ⚠️ Validar que cada venta tenga método de pago asignado antes de cerrar/facturar

### Recomendaciones de UX
- Selector con búsqueda: escribir "tarjeta" o "01" y encontrar "Tarjeta de crédito/débito"
- Mostrar código y descripción juntos: "01 - Efectivo", "03 - Transferencia electrónica"
- Iconos visuales para métodos comunes (billete para efectivo, tarjeta para crédito, etc.)
- Métodos frecuentes marcados como favoritos para acceso rápido
- Deshabilitar métodos no aplicables según configuración de la sucursal

### Dependencias con Otras Fases
- Requiere módulo de ventas completado
- Obligatorio para facturación electrónica (Bloque 6 fases siguientes)
- Necesario para conciliación bancaria automatizada

### Advertencias Comunes
- ❌ No permitir texto libre para método de pago; siempre seleccionar del catálogo oficial
- ❌ No hardcodear códigos; cargar desde base de datos (pueden cambiar por actualización legal)
- ❌ Evitar eliminar métodos de pago usados históricamente (soft delete o flag is_active)
- ❌ No olvidar mapeo entre métodos internos y códigos fiscales (puede haber diferencia)

### Catálogos Oficiales por País
- **México (SAT):** c_MetodoPago (CATÁLOGO 2.0) - 78 códigos vigentes
- **Argentina (AFIP):** Concepto - Formas de pago
- **Colombia (DIAN):** Formas de pago
- **España:** Formas de pago según normativa AEAT
- **Internacional:** ISO 20022 Payment Method codes

### Ejemplo de Códigos Comunes (México)
- `01` - Efectivo
- `02` - Cheque nominativo
- `03` - Transferencia electrónica de fondos
- `04` - Tarjeta de crédito
- `05` - Monedero electrónico
- `06` - Dinero electrónico
- `08` - Vales de despensa
- `12` - Dación en pago
- `13` - Pago por subrogación
- `14` - Pago por consignación
- `15` - Condono
- `17` - Compensación
- `23` - Novación
- `24` - Confusión
- `25` - Remisión de deuda
- `26` - Prescripción o caducidad
- `27` - A satisfacción del acreedor
- `28` - Tarjeta de débito
- `29` - Tarjeta comercial
- `30` - Aplicación de anticipos
- `31` - Intermediario pagos
- `32` - Pago en parcialidades
- `33` - Pago diferido
- `99` - Por definir

## 🔒 CONSIDERACIONES TÉCNICAS

### Performance
- Indexar `pais_id`, `codigo_oficial`, `activo` en `catalogo_metodos_pago_pais`
- Cachear catálogo de métodos por país (1 hora o hasta que haya actualización)
- Evitar N+1 queries al obtener métodos con ventas
- Precargar catálogo en inicio de sesión si es pequeño

### Consistencia de Datos
- Usar transacciones al actualizar métodos de pago existentes
- Validar integridad referencial con tabla `paises`
- No permitir eliminación de métodos usados en ventas (soft delete o flag inactivo)
- Migración de datos existente: mapear métodos antiguos a nuevos códigos

### Seguridad
- Solo super-admins pueden modificar catálogos globales
- Validar que método pertenezca al país de la cuenta antes de guardar
- Prevenir inyección de códigos no válidos
- Log de auditoría para cambios en catálogos

### UX/UI
- Dropdown rápido y responsivo
- Búsqueda dentro del dropdown si hay muchos métodos
- Tooltips no intrusivos
- Mensajes de error claros y accionables
- Orden lógico (más comunes primero)

### Edge Cases
- Manejar cuentas sin país configurado (usar defaults o bloquear)
- Manejar métodos eliminados/inactivos en ventas históricas (mostrar como "Descontinuado")
- Manejar cambios de país con métodos incompatibles
- Manejar APIs de facturación que requieren códigos específicos

### Internacionalización
- Nombres de métodos en idioma local
- Descripciones traducibles
- Preparado para agregar más países fácilmente

### Mantenibilidad
- Seeders modulares por país
- Documentación de códigos oficiales por país
- Tests para cada país soportado
- Scripts de actualización de catálogos automatizables

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

- [ ] Tabla `catalogo_metodos_pago_pais` creada correctamente
- [ ] Seeders cargan 5 países con todos sus métodos
- [ ] Métodos se filtran automáticamente según país de cuenta
- [ ] Dropdown en POS muestra nombres visibles correctos
- [ ] Código oficial se guarda internamente en cada pago
- [ ] Pagos mixtos guardan código por cada parcialidad
- [ ] Tooltip muestra código oficial (opcional)
- [ ] Detalle de venta muestra código como dato informativo
- [ ] Validación de métodos activos funciona
- [ ] Métodos que requieren referencia validan campo obligatorio
- [ ] Reportes incluyen columna de código oficial
- [ ] Exportaciones incluyen códigos oficiales
- [ ] Mapeo a APIs de facturación funciona
- [ ] Cacheo de catálogos mejora performance
- [ ] No hay métodos duplicados o huérfanos
- [ ] Migración de datos existentes (si aplica) funciona
- [ ] Tests unitarios pasan exitosamente
- [ ] No hay regresiones en flujo de pagos existente