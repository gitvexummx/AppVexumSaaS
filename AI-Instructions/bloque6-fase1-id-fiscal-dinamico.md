# Fase 19: ID Fiscal Dinámico y Configuración por País

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Implementar la arquitectura base para soportar múltiples países con diferentes requisitos fiscales, permitiendo que el sistema se adapte dinámicamente al país seleccionado por el negocio durante el onboarding. Esto incluye tablas de países, configuración de IDs fiscales dinámicos (RFC, RUT, RUC, NIF, etc.), y mecanismos para cambiar de país (con solicitud a soporte) limpiando o exportando datos previos.

## 📋 REQUERIMIENTOS DETALLADOS

### 19.1 Tabla `paises`
Crear tabla catálogo con información fiscal de cada país soportado:
- `id` (PK)
- `nombre` (string, ej: "México", "Colombia")
- `codigo_iso` (string, ej: "MX", "CO", "AR")
- `nombre_id_fiscal` (string, ej: "RFC", "RUT", "RUC", "NIF", "CUIT")
- `regex_validacion` (string nullable, patrón regex para validar ID fiscal)
- `longitud_minima` (integer nullable)
- `longitud_maxima` (integer nullable)
- `ejemplo_visual` (string, ej: "XAXX010101000")
- `requiere_validacion_strict` (boolean, default false)
- `activo` (boolean, default true)
- `created_at`, `updated_at`

**Países iniciales precargados:**
- México (RFC)
- Colombia (RUT/NIT)
- República Dominicana (RNC/Cédula)
- Chile (RUT)
- Argentina (CUIT/CUIL)

### 19.2 Tabla `configuracion_pais_cuenta`
Relación 1:1 entre cuenta/negocio y país seleccionado:
- `id` (PK)
- `cuenta_id` (FK a cuentas/negocios, único)
- `pais_id` (FK a paises)
- `fecha_seleccion` (timestamp)
- `bloqueado_por_cambio` (boolean, default false - si está en proceso de cambio de país)
- `solicitud_cambio_pendiente` (boolean, default false)
- `created_at`, `updated_at`

### 19.3 Selección de País en Onboarding
- Durante el registro/creación de cuenta, paso obligatorio: "Selecciona tu país"
- Dropdown muestra solo países activos de tabla `paises`
- Al seleccionar, mostrar información contextual:
  - "Tu ID fiscal será: [Nombre del ID]"
  - "Ejemplo: [ejemplo_visual]"
  - "Requisitos específicos de [país]"
- No se puede crear cuenta sin seleccionar país
- Guardar en `configuracion_pais_cuenta`

### 19.4 Visualización del ID Fiscal en Configuración
- En panel de configuración del negocio, mostrar campo de ID fiscal con nombre dinámico:
  - Si país = México → "RFC: [campo]"
  - Si país = Colombia → "RUT/NIT: [campo]"
  - Etc.
- Campo de solo lectura si ya fue registrado (para evitar cambios accidentales)
- Validación frontend usando regex del país (si existe)
- Validación backend estricta al guardar

### 19.5 Solicitud de Cambio de País
- Botón/enlace en configuración: "Solicitar cambio de país"
- Al hacer clic, abrir modal con:
  - Advertencia clara: "Cambiar de país requiere reiniciar datos fiscales"
  - Selector de nuevo país
  - Textarea: "Motivo del cambio" (obligatorio)
  - Checkbox: "Entiendo que deberé exportar mis datos actuales y posiblemente borrarlos"
- Al enviar solicitud:
  - Crear registro en tabla `solicitudes_cambio_pais`
  - Notificar a administración/soporte (email o dashboard admin)
  - Bloquear operaciones críticas de la cuenta (opcional, según política)
  - Estado: "Pendiente de revisión"

### 19.6 Proceso de Aprobación de Cambio de País
- Panel de administración para revisar solicitudes
- Admin aprueba o rechaza solicitud
- Si aprueba:
  - Notificar al usuario
  - Mostrar opciones:
    - **Opción A**: "Exportar datos actuales (PDF/Excel) y limpiar sistema"
      - Generar archivo con todas las ventas/facturas/clientes actuales
      - Permitir descarga
      - Eliminar registros de ventas/facturas/clientes (soft delete o hard delete según política)
      - Actualizar `configuracion_pais_cuenta` con nuevo país
      - Desbloquear cuenta
    - **Opción B**: "Mantener datos actuales (solo cambiar configuración)"
      - Actualizar `configuracion_pais_cuenta` con nuevo país
      - Mantener historial (pero podría haber inconsistencias fiscales)
      - Desbloquear cuenta
- Si rechaza:
  - Notificar al usuario con motivo del rechazo
  - Mantener país actual

### 19.7 Bloqueo de Sucursales y Usuarios durante Cambio
- Al iniciar proceso de cambio de país:
  - Bloquear todas las sucursales asociadas a la cuenta
  - Bloquear usuarios (no pueden iniciar sesión o realizar ventas)
  - Mostrar mensaje: "Cuenta en proceso de cambio de país. Contacta a soporte."
- Después de aprobar y ejecutar cambio:
  - Opción para administrador de cuenta: "Desbloquear sucursales"
  - Opción para eliminar/cerrar sucursales que ya no son necesarias
  - Las sucursales heredán automáticamente el nuevo país de la cuenta maestra

### 19.8 Adaptación Dinámica del Frontend
- El frontend lee el país configurado desde API (endpoint `/api/configuracion/pais`)
- Basado en el país:
  - Cambiar etiquetas de formularios ("RFC" vs "RUT" vs "RUC")
  - Aplicar validaciones regex específicas
  - Mostrar/ocultar campos condicionales
  - Mostrar mensajes de error personalizados por país
  - Adaptar reportes y dashboard (filtros automáticos por país)
- Si país no está configurado (caso edge):
  - Mostrar alerta crítica: "País no configurado. Contacta a soporte."
  - Bloquear funcionalidades fiscales

### 19.9 Campos Fiscales en Clientes
- Agregar a tabla `clientes`:
  - `id_fiscal` (string, único por cliente dentro del mismo país)
  - `nombre_razon_social` (string)
  - `codigo_postal` (string)
  - `regimen_fiscal` (string nullable)
  - `uso_cfdi` (string nullable, específico por país)
  - `email` (string, para envío de facturas)
  - `telefono` (string)
  - `activo` (boolean)
- Validar que un cliente NO pueda tener IDs fiscales diferentes para diferentes países (un cliente pertenece a un país específico)
- Si cliente no proporciona ID fiscal → opción de facturación no disponible para ese cliente

### 19.10 Alerta de Facturación Desactivada
- Si negocio no ha registrado su propio ID fiscal en configuración:
  - Dashboard NO muestra métricas de facturación
  - Mostrar alerta: "Configura tu ID fiscal para activar la facturación"
  - Botón que lleva a configuración
- Una vez registrado ID fiscal → activar módulo de facturación

## ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)

1. ¿Existe actualmente una tabla `cuentas` o `negocios` que represente la cuenta maestra?
2. ¿Cómo está estructurada actualmente la tabla de usuarios y su relación con negocios/sucursales?
3. ¿Existe algún proceso de onboarding/registro implementado? ¿Dónde ocurre?
4. ¿Hay una tabla de configuración global o por negocio actualmente?
5. ¿El sistema ya tiene multi-sucursal implementado? ¿Cómo se relacionan sucursales con la cuenta maestra?
6. ¿Qué librerías se usan para validación de formularios en frontend?
7. ¿Existe un panel de administración para super-admins/soporte?
8. ¿Cómo se envían notificaciones actualmente (email, push, dashboard)?
9. ¿La base de datos soporta expresiones regulares (REGEXP) para validaciones?
10. ¿Existe un sistema de exportación a PDF/Excel ya implementado?
11. ¿Se usa soft delete en alguna tabla actualmente?
12. ¿Qué middleware o guards existen para bloquear acceso de usuarios?
13. ¿El frontend usa un store global (Vuex, Redux, Pinia) para configuración?
14. ¿Hay endpoints existentes para obtener configuración del negocio?
15. ¿Los reportes actuales ya filtran por algún criterio geográfico?
16. ¿Existe un sistema de logs/auditoría para acciones críticas?
17. ¿Qué versión de la base de datos se usa (MySQL, PostgreSQL, etc.)?
18. ¿Hay límites de registros para exportaciones masivas?
19. ¿El sistema tiene timezone configurado por negocio?
20. ¿Existen tests para procesos de registro/onboarding?

## 🛠️ ENTREGABLES ESPERADOS

### Backend
- [ ] Migración para crear tabla `paises` con todos los campos especificados
- [ ] Seeder con 5 países iniciales (MX, CO, DO, CL, AR) y sus IDs fiscales
- [ ] Migración para crear tabla `configuracion_pais_cuenta`
- [ ] Migración para agregar campos fiscales a tabla `clientes`
- [ ] Migración para crear tabla `solicitudes_cambio_pais`
- [ ] Modelo `Pais` con scopes y métodos helper
- [ ] Modelo `ConfiguracionPaisCuenta` con relación 1:1
- [ ] Modelo `SolicitudCambioPais` con estados
- [ ] Endpoint: `GET /api/paises` - Listar países activos
- [ ] Endpoint: `GET /api/configuracion/pais` - Obtener país de cuenta actual
- [ ] Endpoint: `POST /api/configuracion/pais` - Asignar país (solo en registro)
- [ ] Endpoint: `POST /api/solicitudes-cambio-pais` - Crear solicitud
- [ ] Endpoint (Admin): `GET /api/admin/solicitudes-cambio-pais` - Listar solicitudes
- [ ] Endpoint (Admin): `PUT /api/admin/solicitudes-cambio-pais/:id/aprobar` - Aprobar
- [ ] Endpoint (Admin): `PUT /api/admin/solicitudes-cambio-pais/:id/rechazar` - Rechazar
- [ ] Endpoint: `POST /api/ejecutar-cambio-pais` - Ejecutar cambio (exportar + limpiar)
- [ ] Servicio de exportación de datos (PDF/Excel) para cambio de país
- [ ] Servicio de limpieza de datos (ventas, facturas, clientes)
- [ ] Middleware para verificar país configurado
- [ ] Middleware para bloquear cuenta en proceso de cambio
- [ ] Validadores de ID fiscal por país (backend)
- [ ] Tests unitarios para validaciones de ID fiscal

### Frontend
- [ ] Componente selector de país en registro/onboarding
- [ ] Información contextual dinámica al seleccionar país
- [ ] Validación frontend de ID fiscal con regex dinámica
- [ ] Campo de ID fiscal en configuración con etiqueta dinámica
- [ ] Botón "Solicitar cambio de país" en configuración
- [ ] Modal de solicitud de cambio con formulario
- [ ] Vista de estado de solicitud (pendiente, aprobada, rechazada)
- [ ] Pantalla de opciones post-aprobación (exportar vs mantener)
- [ ] Barra de progreso durante exportación/limpieza
- [ ] Alerta crítica si país no está configurado
- [ ] Adaptación de etiquetas en formularios de clientes (RFC/RUT/RUC)
- [ ] Mensajes de error personalizados por país
- [ ] Bloqueo visual de funcionalidades si facturación no activa
- [ ] Dashboard oculta métricas de facturación si no hay ID fiscal registrado
- [ ] Adaptación de reportes según país
- [ ] Estados de carga y manejo de errores

## 🔒 CONSIDERACIONES TÉCNICAS

### Seguridad
- Solo super-admins pueden aprobar cambios de país
- Validar permisos estrictos para ejecución de cambio de país
- Sanitización de inputs en solicitudes
- Log de auditoría inmutable para todos los cambios de país
- Prevenir race conditions durante proceso de cambio

### Performance
- Indexar `codigo_iso`, `nombre_id_fiscal` en tabla `paises`
- Indexar `cuenta_id` en `configuracion_pais_cuenta`
- Exportación masiva debe usar streaming para no agotar memoria
- Limpieza de datos debe ser por lotes (batch processing)
- Usar transacciones para garantizar consistencia durante cambio

### Consistencia de Datos
- Transacción atómica para cambio de país: exportar → limpiar → actualizar configuración
- Soft delete para permitir recuperación en caso de error
- Validar que no haya operaciones en curso antes de permitir cambio
- Bloquear nuevas ventas/facturas durante proceso de cambio

### UX/UI
- Advertencias claras y visibles antes de cambios críticos
- Progreso visible durante exportación/limpieza
- Mensajes de error específicos y accionables
- Tooltips explicativos sobre IDs fiscales por país
- Diseño responsive para modales de solicitud

### Edge Cases
- Manejar cuenta sin país configurado (caso excepcional)
- Manejar solicitud de cambio mientras hay otra pendiente
- Manejar fallo durante exportación (rollback)
- Manejar clientes con IDs fiscales duplicados después de cambio
- Manejar sucursales creadas durante proceso de cambio

### Internacionalización
- Todos los textos de UI deben estar preparados para i18n
- Formatos de fecha, moneda, números según país
- Nombres de países en idioma local del usuario

### Privacidad y Cumplimiento
- No almacenar datos fiscales innecesarios
- Permitir exportación completa antes de eliminar
- Cumplir leyes locales de protección de datos
- Documentar qué datos se eliminan y cuáles se conservan

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

- [ ] Tabla `paises` creada con 5 países iniciales
- [ ] Selección de país obligatoria en registro
- [ ] ID fiscal se muestra con nombre correcto según país
- [ ] Validaciones frontend y backend funcionan por país
- [ ] Solicitud de cambio de país crea registro correctamente
- [ ] Admin puede aprobar/rechazar solicitudes
- [ ] Proceso de exportación genera PDF/Excel completo
- [ ] Limpieza de datos elimina registros correctamente
- [ ] Cambio de país actualiza configuración
- [ ] Sucursales se bloquean/desbloquean según estado
- [ ] Usuarios no pueden operar durante cambio
- [ ] Frontend adapta etiquetas dinámicamente
- [ ] Mensajes de error son específicos por país
- [ ] Alerta de "País no configurado" funciona
- [ ] Dashboard oculta métricas de facturación si no está activo
- [ ] Clientes requieren ID fiscal para facturar
- [ ] Un cliente no puede tener múltiples IDs fiscales
- [ ] Logs de auditoría registran todos los cambios
- [ ] Tests unitarios pasan exitosamente
- [ ] No hay regresiones en funcionalidades existentes