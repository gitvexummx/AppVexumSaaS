# Fase 21: Separación de Tablas Ventas vs Facturas

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Diseñar e implementar una arquitectura donde las ventas (transacción comercial) y las facturas (documento fiscal) sean entidades independientes pero relacionadas, permitiendo que una venta tenga 0, 1 o múltiples facturas asociadas, con validación estricta de que la suma de montos facturados no exceda el total de la venta, y preparando el terreno para integración futura con APIs de facturación electrónica.

## 📋 REQUERIMIENTOS DETALLADOS

### 21.1 Tabla `ventas` (Independiente)
Tabla que representa la transacción comercial pura, sin datos fiscales específicos:
- `id` (PK, UUID o auto-incremental)
- `folio_interno` (string, consecutivo interno del negocio)
- `sucursal_id` (FK a sucursales)
- `caja_id` (FK a cajas)
- `turno_id` (FK a turnos)
- `usuario_id` (FK a usuarios, quién realizó la venta)
- `cliente_id` (FK a clientes, nullable para ventas sin cliente registrado)
- `subtotal` (decimal)
- `impuestos` (decimal)
- `total` (decimal)
- `descuento` (decimal, nullable)
- `estado` (enum: 'completada', 'cancelada', 'pendiente', 'borrador')
- `tipo_venta` (enum: 'mostrador', 'online', 'cotizacion', 'servicio')
- `notas` (text, nullable)
- `fecha_venta` (timestamp)
- `created_at`, `updated_at`
- `deleted_at` (nullable, para soft delete)

**Nota:** Esta tabla NO contiene datos fiscales del cliente ni información específica de facturación.

### 21.2 Tabla `venta_items` (Detalle de Venta)
- `id` (PK)
- `venta_id` (FK a ventas)
- `producto_id` (FK a productos)
- `cantidad` (decimal, permite decimales para kilos/metros)
- `precio_unitario` (decimal)
- `costo_unitario_historico` (decimal, costo al momento de la venta)
- `subtotal` (decimal)
- `impuestos` (decimal)
- `descuento` (decimal, nullable)
- `total` (decimal)
- `unidad_medida` (string, ej: "Pieza", "Kilo", "Caja")
- `notas` (text, nullable)

### 21.3 Tabla `facturas` (Documento Fiscal Independiente)
Tabla que representa el documento fiscal emitido, relacionado a una venta pero con vida propia:
- `id` (PK, UUID)
- `folio_fiscal` (string, único, ej: UUID del CFDI en México)
- `serie` (string, nullable, serie de factura)
- `folio` (string, consecutivo fiscal)
- `venta_id` (FK a ventas, nullable si es factura sin venta directa - raro pero posible)
- `cliente_id` (FK a clientes)
- `emisor_rfc` (string, RFC/ID fiscal del negocio emisor)
- `receptor_rfc` (string, RFC/ID fiscal del cliente)
- `receptor_nombre` (string, razón social del cliente)
- `receptor_cp` (string, código postal del receptor)
- `regimen_fiscal_emisor` (string)
- `regimen_fiscal_receptor` (string)
- `uso_cfdi` (string, uso que le da el cliente a la factura)
- `version_tf` (string, versión de tecnología fiscal, ej: "4.0" para CFDI)
- `subtotal` (decimal)
- `impuestos` (decimal)
- `total` (decimal)
- `moneda` (string, ej: "MXN", "USD")
- `tipo_cambio` (decimal, nullable, si es moneda extranjera)
- `metodo_pago` (string, ej: "PUE", "PPD")
- `forma_pago` (string, ej: "01", "03" - códigos de la Fase 20)
- `fecha_emision` (timestamp)
- `fecha_timbrado` (timestamp, nullable)
- `uuid_timbrado` (string, nullable, UUID del timbre fiscal)
- `sello_sat` (string, nullable, sello de la autoridad)
- `sello_cfd` (string, nullable, sello del emisor)
- `cadena_original` (text, nullable, cadena original del complemento)
- `xml_url` (string, nullable, URL/path al XML almacenado localmente)
- `pdf_url` (string, nullable, URL/path al PDF generado)
- `estado_factura` (enum: 'borrador', 'emitida', 'timbrada', 'cancelada', 'rechazada')
- `motivo_cancelacion` (string, nullable)
- `fecha_cancelacion` (timestamp, nullable)
- `notas` (text, nullable)
- `datos_extra` (json, nullable, para datos específicos de país/API)
- `webhook_response` (json, nullable, respuesta de API de facturación)
- `created_at`, `updated_at`
- `deleted_at` (nullable, soft delete)

### 21.4 Tabla Intermedia `factura_venta_items` (Si una factura cubre parcial de venta)
Si una factura puede cubrir solo una parte de los items de una venta:
- `id` (PK)
- `factura_id` (FK a facturas)
- `venta_item_id` (FK a venta_items)
- `cantidad_facturada` (decimal, cantidad de ese item que esta factura cubre)
- `monto_facturado` (decimal, monto de ese item que esta factura cubre)

**Alternativa simplificada:** Si la factura siempre es 1:1 con la venta en cuanto a items, no se necesita esta tabla intermedia y la factura hereda los items de la venta.

### 21.5 Relación Venta-Factura: Reglas de Negocio
- **Una venta puede tener 0 facturas**: Venta de mostrador sin facturación
- **Una venta puede tener 1 factura**: Caso más común, venta completa facturada
- **Una venta puede tener N facturas**: 
  - Caso: Cliente pide facturar parcialidades en diferentes fechas
  - Validación crítica: `SUM(facturas.total) <= venta.total`
  - No permitir que suma de facturas exceda total de venta
- **Una factura pertenece a 1 venta**: Relación muchos-a-uno desde facturas hacia ventas
- **Factura en borrador**: Permite crear cotizaciones o pre-facturas sin valor fiscal aún

### 21.6 Validación de Montos Facturados
- Al crear/editar factura, calcular total de facturas existentes para esa venta
- Validar: `nuevo_monto_factura + monto_ya_facturado <= venta.total`
- Si excede:
  - Bloquear creación de factura
  - Mostrar error: "El monto a facturar ($X) más lo ya facturado ($Y) excede el total de la venta ($Z). Monto máximo facturable: $W"
- Permitir facturar menos del total (factura parcial)
- Tracking de "Monto restante por facturar" en vista de venta

### 21.7 Modo Borrador (Cotizaciones)
- Venta puede crearse con estado `borrador`
- Factura puede crearse con estado `borrador`
- Borradores:
  - No descuentan inventario (opcional, configurable)
  - No generan asiento contable
  - No se timbran/envían a autoridad
  - Pueden editarse libremente
  - No cuentan para reportes de ventas reales
- Conversión de borrador a completado:
  - Validar stock disponible
  - Calcular impuestos
  - Generar folio consecutivo
  - Cambiar estado a `completada`

### 21.8 Datos Fiscales del Cliente
- Tabla `clientes` amplía campos fiscales (desde Fase 19):
  - `id_fiscal` (RFC, RUT, etc.)
  - `nombre_razon_social`
  - `codigo_postal`
  - `regimen_fiscal`
  - `uso_cfdi`
  - `email` (para envío de factura)
  - `telefono`
- Validar que cliente tenga todos los datos fiscales requeridos antes de permitir facturación
- Si cliente no tiene datos completos → opción "Facturar" deshabilitada con tooltip explicativo

### 21.9 Independencia de Ventas y Facturas
- **Venta existe sin factura**: Sí, venta de mostrador, ticket simple
- **Factura existe sin venta**: Teóricamente posible (ej: factura de servicios recurrentes sin venta en POS), pero no es caso común en este sistema
- **Cancelar venta**:
  - Si tiene factura(s) asociada(s):必须先 cancelar facturas antes de cancelar venta
  - Validar que ninguna factura esté timbrada/emitida
  - O crear nota de crédito automática
- **Cancelar factura**:
  - No cancela la venta automáticamente
  - Marca factura como `cancelada`
  - Libera monto facturado para poder re-facturar
  - Requiere motivo de cancelación (catálogo oficial por país)

### 21.10 Endpoints de API

**Ventas:**
- `POST /api/ventas` - Crear venta
- `GET /api/ventas` - Listar ventas
- `GET /api/ventas/:id` - Obtener detalle de venta (incluye info de facturas asociadas)
- `PUT /api/ventas/:id` - Actualizar venta (si está en borrador)
- `DELETE /api/ventas/:id` - Cancelar/eliminar venta
- `GET /api/ventas/:id/facturas` - Obtener facturas asociadas a venta
- `GET /api/ventas/:id/monto-facturable` - Obtener monto restante por facturar

**Facturas:**
- `POST /api/facturas` - Crear factura (asociada a venta o independiente)
- `GET /api/facturas` - Listar facturas con filtros
- `GET /api/facturas/:id` - Obtener detalle de factura (incluye datos de venta)
- `PUT /api/facturas/:id` - Actualizar factura (si está en borrador)
- `DELETE /api/facturas/:id` - Cancelar/eliminar factura
- `POST /api/facturas/:id/timbrar` - Enviar a timbrado/fiscalización
- `POST /api/facturas/:id/cancelar` - Cancelar factura con motivo
- `POST /api/facturas/:id/reenviar` - Reenviar PDF/XML por email
- `GET /api/facturas/:id/xml` - Descargar XML
- `GET /api/facturas/:id/pdf` - Descargar PDF
- `POST /api/facturas/webhook` - Endpoint para recibir callbacks de API de facturación

### 21.11 Webhooks/Callbacks para APIs de Terceros
- Preparar endpoint `POST /api/facturas/webhook` que reciba respuestas de APIs externas (ej: Facturama)
- Cuando API externa confirma timbrado:
  - Actualizar factura con `uuid_timbrado`, `sello_sat`, `fecha_timbrado`
  - Cambiar estado a `timbrada`
  - Guardar `webhook_response` en JSON
  - Disparar evento/notificación a usuario
  - Opcional: Generar PDF automáticamente
- Manejar casos de error/rechazo desde API externa
- Reintentos automáticos si webhook falla (cola de reintentos)

### 21.12 Almacenamiento de XML/PDF
- **NO guardar XML/JSON completos en base de datos**
- Opción A: Guardar en sistema de archivos local del servidor
  - Path: `/storage/facturas/{anio}/{mes}/{folio}.xml`
  - Guardar solo `url_path` en BD
- Opción B: Guardar en servicio cloud (S3, Google Cloud Storage)
  - Guardar URL pública o firmada en BD
- El usuario final descarga desde su equipo local (instrucciones claras)
- Backup automático de carpeta de facturas

### 21.13 Reportes y Consultas
- Reporte de ventas: Incluye columna "¿Facturado?" y "Folio Fiscal" si aplica
- Reporte de facturas: Independiente, con todos los datos fiscales
- Filtros cruzados:
  - "Ventas sin facturar"
  - "Facturas emitidas este mes"
  - "Monto facturado vs monto vendido"
- Dashboard:
  - Contador: "Facturas emitidas hoy/mes"
  - Solo visible si facturación está activa (negocio tiene ID fiscal configurado)

### 21.14 Migración de Datos Existentes (si aplica)
- Si ya existe tabla `ventas` con datos:
  - Migrar datos a nueva estructura
  - Separar datos fiscales a nueva tabla `facturas` (si hay)
  - Crear relaciones posteriores
- Si no existe tabla `ventas`:
  - Crear desde cero con nueva estructura

## ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)

1. ¿Existe actualmente una tabla `ventas`? ¿Cuál es su estructura exacta?
2. ¿Existe una tabla `clientes`? ¿Qué campos tiene actualmente?
3. ¿Hay alguna tabla relacionada con facturas ya creada?
4. ¿El sistema ya maneja estados (borrador, completado, cancelado) en alguna entidad?
5. ¿Existe un sistema de folios consecutivos implementado?
6. ¿La Fase 19 (países) y Fase 20 (métodos de pago) ya están implementadas?
7. ¿Qué librerías se usan para generación de PDFs?
8. ¿El sistema tiene almacenamiento de archivos configurado (local, S3)?
9. ¿Existe un sistema de colas (queues) para procesos en background?
10. ¿La API de facturación (ej: Facturama) ya está seleccionada/integrada?
11. ¿Hay endpoints existentes para CRUD de ventas?
12. ¿El sistema ya tiene soft delete implementado en alguna tabla?
13. ¿Existe un sistema de eventos/listeners (observadores de modelo)?
14. ¿Los reportes actuales ya agrupan datos de ventas?
15. ¿Hay un mecanismo de transacciones de base de datos establecido?
16. ¿El sistema permite ediciones de ventas después de creadas?
17. ¿Existe un log de auditoría para cambios críticos?
18. ¿Los usuarios ya pueden descargar archivos generados por el sistema?
19. ¿Hay webhooks implementados para otras funcionalidades?
20. ¿Existen tests para procesos de creación de ventas?

## 🛠️ ENTREGABLES ESPERADOS

### Backend
- [ ] Migración para crear/refinar tabla `ventas` (sin datos fiscales)
- [ ] Migración para crear tabla `venta_items` con costo histórico
- [ ] Migración para crear tabla `facturas` con todos los campos fiscales
- [ ] Migración para crear tabla `factura_venta_items` (si es necesaria relación parcial)
- [ ] Migración para actualizar tabla `clientes` con campos fiscales
- [ ] Modelo `Venta` con relaciones y scopes
- [ ] Modelo `VentaItem` con validaciones
- [ ] Modelo `Factura` con validaciones complejas
- [ ] Modelo `Cliente` actualizado
- [ ] Service `VentaService` con lógica de negocio
- [ ] Service `FacturaService` con validación de montos
- [ ] Controller `VentaController` con CRUD completo
- [ ] Controller `FacturaController` con CRUD + acciones especiales (timbrar, cancelar)
- [ ] Endpoint para validar monto facturable restante
- [ ] Endpoint para obtener facturas por venta
- [ ] Webhook handler para APIs de facturación
- [ ] Job para procesamiento asíncrono de timbrado (si aplica)
- [ ] Servicio de generación de PDF de factura
- [ ] Servicio de almacenamiento de XML/PDF
- [ ] Validador de datos fiscales completos antes de facturar
- [ ] Regla de validación personalizada: suma de facturas <= total venta
- [ ] Eventos/Listeners para acciones críticas (venta creada, factura timbrada)
- [ ] Tests unitarios para validaciones de montos
- [ ] Tests de integración para flujo venta→factura

### Frontend
- [ ] Página de lista de ventas con indicador de estado de facturación
- [ ] Página de detalle de venta mostrando facturas asociadas
- [ ] Indicador visual: "Monto facturado: $X | Restante por facturar: $Y"
- [ ] Botón "Crear Factura" habilitado solo si hay monto facturable y cliente tiene datos completos
- [ ] Modal/Formulario de creación de factura
- [ ] Selector de tipo: "Factura completa" vs "Factura parcial"
- [ ] Input de monto a facturar (validado en tiempo real)
- [ ] Vista previa de datos fiscales antes de crear
- [ ] Estado de factura: Borrador/Emitida/Timbrada/Cancelada
- [ ] Botón "Timbrar/Enviar a fiscalización"
- [ ] Botón "Cancelar factura" con selector de motivo
- [ ] Botones de descarga: XML, PDF
- [ ] Botón "Reenviar por email"
- [ ] Página de lista de facturas con filtros avanzados
- [ ] Filtro: "Ventas sin facturar"
- [ ] Dashboard muestra contador de facturas emitidas (solo si facturación activa)
- [ ] Alerta si cliente no tiene datos fiscales completos
- [ ] Modo borrador visible y editable
- [ ] Conversión de borrador a completado con validaciones
- [ ] Adaptación a modo claro/oscuro
- [ ] Estados de carga y manejo de errores
- [ ] Notificaciones/toasts para acciones de facturación
- [ ] Responsive design

## 🔒 CONSIDERACIONES TÉCNICAS

### Integridad de Datos
- Usar transacciones para crear venta + items
- Usar transacciones para crear factura + validar montos
- Foreign keys con cascada controlada (no borrar venta si tiene facturas)
- Validaciones a nivel de base de datos y aplicación

### Performance
- Indexar `venta_id`, `cliente_id`, `folio_fiscal`, `fecha_emision` en `facturas`
- Indexar `estado`, `fecha_venta` en `ventas`
- Cachear cálculo de monto facturable por venta
- Paginar listados de facturas (máx 50-100 por página)
- Query optimizados para reporte de "ventas sin facturar"

### Seguridad
- Solo usuarios autorizados pueden crear/editar facturas
- Validar permisos por sucursal
- Sanitización de datos fiscales
- Prevenir facturación duplicada fraudulenta
- Log de auditoría inmutable para timbrado/cancelación

### Escalabilidad
- Diseñar para alto volumen de facturas (miles por mes)
- Considerar particionamiento de tabla `facturas` por año en futuro
- Almacenamiento externo de XML/PDF para no saturar BD
- Colas para procesos pesados (generación PDF, envío emails)

### Edge Cases
- Manejar venta cancelada con facturas pendientes (bloqueo)
- Manejar factura cancelada que libera monto para re-facturar
- Manejar decimales redondeados (diferencias de centavos)
- Manejar cambio de tipo de cambio si es moneda extranjera
- Manejar timeouts de APIs de facturación
- Manejar rechazo de timbrado desde API externa

### Cumplimiento Legal
- Seguir lineamientos de autoridad fiscal de cada país
- Retener datos mínimos necesarios
- Permitir cancelación solo con motivos oficiales
- Generar cadena original y sellos según especificaciones
- Validar versiones de tecnología fiscal (ej: CFDI 4.0)

### Mantenibilidad
- Código modular separado por responsabilidades (Venta vs Factura)
- Tests exhaustivos para reglas de negocio críticas
- Documentación clara de flujos
- Scripts de migración reversibles

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

- [ ] Tabla `ventas` creada sin datos fiscales
- [ ] Tabla `facturas` creada con todos los campos fiscales
- [ ] Relación venta-factura establecida correctamente
- [ ] Validación de suma de facturas <= total venta funciona
- [ ] Se puede crear venta sin factura
- [ ] Se puede crear 1 factura por venta
- [ ] Se pueden crear múltiples facturas parciales por venta
- [ ] Bloqueo si suma de facturas excede total venta
- [ ] Modo borrador funciona para ventas y facturas
- [ ] Conversión de borrador a completado valida stock y datos
- [ ] Cliente requiere datos fiscales completos para facturar
- [ ] Botón de facturar deshabilitado si cliente incompleto
- [ ] Timbrado/envío a API externa funciona (o está preparado)
- [ ] Webhook recibe confirmaciones correctamente
- [ ] XML/PDF se almacenan externamente (no en BD)
- [ ] Descargas de XML/PDF funcionan
- [ ] Cancel