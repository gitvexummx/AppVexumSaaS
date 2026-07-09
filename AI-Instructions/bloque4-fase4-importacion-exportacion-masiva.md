# BLOQUE 4, FASE 4: Importación y Exportación Masiva (Excel/CSV)

## ⚠️ INSTRUCCIONES CRÍTICAS PARA LA IA
1. **LEER PRIMERO:** Leer estrictamente `AIContext.md`.
2. **PREGUNTAR ANTES DE CODIFICAR:** Responder la batería de preguntas antes de implementar librerías de Excel.

## 🎯 Objetivo
Permitir la carga y descarga masiva de inventario mediante archivos Excel/CSV, facilitando la actualización inicial y mantenimientos periódicos. Debe manejar inteligentemente conflictos (duplicados), errores por fila y descarga de imágenes desde URLs.

## 📋 Especificaciones Detalladas

### 1. Exportación
- Botón "Descargar Inventario".
- Genera Excel con columnas: SKU, Código Barras, Nombre Padre, Atributos, Precio, Costo, Stock, Stock Mínimo, URL Imagen, Almacén.
- Formato limpio y legible.

### 2. Importación
- Plantilla descargable previa para guiar al usuario.
- **Detección de Cambios:**
  - Usa `SKU` o `Código de Barras` como llave única.
  - Si existe → Actualiza (precio, stock, etc.).
  - Si no existe → Crea nuevo producto/variante.
- **Manejo de Errores (Robustez):**
  - Si una fila tiene error (ej: precio negativo, formato inválido), **NO** detener todo el proceso.
  - Ignorar fila errónea y continuar con las demás.
  - Al finalizar, mostrar reporte: "Importados: 95, Fallidos: 5".
  - Listar detalles de fallos con número de fila y razón del error, permitiendo corrección rápida o descarga de CSV solo con errores.

### 3. Imágenes desde URL
- Si la columna "URL Imagen" tiene un link válido:
  - Descargar la imagen al servidor/base de datos localmente.
  - Guardar referencia local en BD.
  - No depender del link externo eternamente.
- Manejo de timeouts: Si la imagen tarda mucho, registrar error en esa fila pero no fallar toda la importación.

### 4. Conflictos de Nombre
- Si el nombre coincide pero el SKU es diferente, mostrar advertencia: "¿Es un producto nuevo o un error de duplicado?".

## ❓ PREGUNTAS OBLIGATORIAS DE CLARIFICACIÓN
1. ¿Qué librería de manejo de Excel se prefiere o está instalada? (ej: `laravel-excel`, `SheetJS`, `xlsx`).
2. ¿Cuál es el límite máximo de filas permitido por importación? (¿1000, 5000, ilimitado?).
3. ¿La importación debe ser síncrona (esperar en pantalla) o asíncrona (subir y notificar cuando termine)? (Recomendado asíncrono para archivos grandes).
4. ¿Cómo manejaremos la descarga de imágenes? ¿Queue/Cola de fondo para no bloquear el navegador?
5. ¿Qué columnas son obligatorias mínimamente para crear un producto?
6. ¿Si el Excel actualiza stock, debemos registrar un movimiento de inventario (bitácora) o solo sobrescribir el valor? (Recomendado: Bitácora "Ajuste por Importación").
7. ¿Se permite actualizar precios de costos históricos mediante importación?
8. ¿El formato de fecha en el Excel debe ser específico (DD/MM/YYYY vs YYYY-MM-DD)?
9. ¿Cómo manejamos los atributos de variantes en columnas de Excel? (¿Columnas separadas "Talla", "Color" o una columna combinada?).
10. ¿Si un producto se marca para "eliminar" en el Excel (columna especial), lo borramos o lo desactivamos?
11. ¿Se requiere validación de tipos de dato estricta (ej: rechazar letras en columna de precio)?
12. ¿Dónde se guardarán las imágenes descargadas? ¿En storage público o privado?
13. ¿Qué pasa si la URL de la imagen da error 404? ¿Se ignora la imagen pero se crea el producto?
14. ¿El usuario puede mapear columnas del Excel a campos del sistema si el encabezado no coincide exactamente?
15. ¿Se debe generar un log de auditoría de quién importó qué y cuándo?

## ✅ Checklist de Entregables
- [ ] Endpoint `POST /importar-inventario` (con manejo de colas si es grande).
- [ ] Endpoint `GET /exportar-inventario`.
- [ ] Servicio de procesamiento de Excel: Validación fila por fila.
- [ ] Servicio de descarga de imágenes (Downloader).
- [ ] Frontend: Zona de "Drag & Drop" para subir archivo.
- [ ] Modal/Reporte de resultados: Éxitos vs Fallos detallados.
- [ ] Plantilla de Excel ejemplo descargable.
- [ ] Bitácora de movimientos de stock generada por importación.

## ⚙️ Performance
- Para archivos >500 filas, usar Jobs/Colas en backend para no timeoutear la petición HTTP.
- Barra de progreso en frontend si es posible (via Websockets o polling).

## 💡 NOTAS DE IMPLEMENTACIÓN

### Orden Sugerido de Desarrollo
1. **Primero:** Definir formatos soportados (CSV, Excel XLSX, JSON) y estructuras de plantillas
2. **Segundo:** Crear endpoints de upload con validación de archivos
3. **Tercero:** Implementar parser y validador de datos (schema validation)
4. **Cuarto:** Sistema de colas/jobs para procesamiento asíncrono de imports grandes
5. **Quinto:** UI de seguimiento de progreso en tiempo real
6. **Sexto:** Generador de exports con filtros y columnas personalizables

### Puntos Críticos
- ⚠️ **CRÍTICO:** Los imports masivos NO deben bloquear el servidor; usar background jobs con progreso reportable
- ⚠️ Timeout: configurar timeouts largos (5-10 min) para jobs de importación
- ⚠️ Memoria: procesar archivos grandes en chunks/streaming para no saturar RAM
- ⚠️ Atomicidad: cada fila debe ser transaccional individualmente; fallo en una no debe cancelar todo el batch

### Recomendaciones de UX
- Proveer plantillas descargables con datos de ejemplo
- Validación previa del archivo antes de procesar (preview de primeras 10 filas)
- Reporte detallado de errores post-import: qué filas fallaron y por qué
- Permitir reintentar solo filas fallidas sin reprocesar todo
- Barra de progreso en tiempo real con estimación de tiempo restante

### Dependencias con Otras Fases
- Requiere módulos de productos, inventario, proveedores ya implementados
- Exportará datos de todas las fases anteriores
- Necesita sistema de notificaciones para avisar cuando job termina

### Advertencias Comunes
- ❌ No confiar en encoding del archivo; detectar y convertir a UTF-8
- ❌ No permitir imports sin validación de schema
- ❌ No olvidar sanitizar datos importados (prevenir XSS/SQL injection desde CSV)
- ❌ Evitar imports cíclicos o duplicados (detectar por SKU/ID externo)

---

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

### Backend
- [ ] Endpoint POST `/api/import/{entity}` con upload de archivo
- [ ] Endpoint GET `/api/import-jobs/{id}` para verificar progreso
- [ ] Endpoint GET `/api/export/{entity}` con filtros query params
- [ ] Parser para CSV (detect delimiter automáticamente: comma, semicolon, tab)
- [ ] Parser para Excel (.xlsx, .xls) usando librería robusta (ej: SheetJS, phpSpreadsheet)
- [ ] Parser para JSON (validar schema contra definición)
- [ ] Validador de schema por entidad (productos, clientes, proveedores, etc.)
- [ ] Job/Worker para procesamiento asíncrono de imports
- [ ] Sistema de colas (Redis, RabbitMQ, database-backed) para jobs
- [ ] Modelo ImportJob con campos: status, progress, total_rows, processed_rows, errors_count, started_at, completed_at
- [ ] Modelo ImportErrorLog para registrar filas fallidas con razón del error
- [ ] Transaccionalidad por fila (rollback individual si falla)
- [ ] Detección de duplicados por SKU/ID externo/email
- [ ] Opción de "update if exists, create if not" vs "skip duplicates" vs "fail on duplicate"
- [ ] Generator para exports con columnas personalizables
- [ ] Compresión automática de exports grandes (>10MB) a ZIP
- [ ] Tests unitarios para parsers y validadores
- [ ] Tests de integración para flujo completo import→process→report
- [ ] Tests de stress con archivos de 10k+ filas

### Frontend
- [ ] Componente FileUploader con drag-and-drop
- [ ] Validación de tipo de archivo y tamaño máximo (ej: 50MB)
- [ ] Preview de primeras 10 filas antes de confirmar import
- [ ] Mapeo de columnas: UI para matchear columnas del archivo con campos del sistema
- [ ] Selección de estrategia para duplicados (crear/actualizar/omitir)
- [ ] Dashboard de jobs de import/export con lista y estados
- [ ] Vista de detalle de job con barra de progreso en tiempo real
- [ ] Tabla de errores con filtrado y opción de reintentar seleccionados
- [ ] Descarga de reporte de errores en CSV/Excel
- [ ] Configuración de export: seleccionar columnas, aplicar filtros, formato
- [ ] Notificación push/email cuando job completa
- [ ] Historial de imports/exports realizados por usuario
- [ ] Responsive en móvil y tablet

### UX/UI
- [ ] Plantillas descargables con ejemplos prellenados
- [ ] Guías visuales paso-a-paso para importar
- [ ] Mensajes de error claros y accionables ("Fila 47: Email inválido")
- [ ] Iconos de estado para jobs (pending, processing, completed, failed)
- [ ] Colores semánticos para progreso (verde=éxito, amarillo=procesando, rojo=error)
- [ ] Tooltips explicativos en opciones avanzadas
- [ ] Confirmación antes de iniciar import grande (>1000 filas)

### Performance & Security
- [ ] Streaming de archivos grandes (no cargar todo en memoria)
- [ ] Chunk processing (lotes de 100-500 filas por transacción)
- [ ] Rate limiting en uploads (max 5 imports simultáneos por usuario)
- [ ] Validación de MIME type real (no confiar en extensión del archivo)
- [ ] Sanitización de todos los datos importados
- [ ] Escaneo de archivos en busca de scripts maliciosos
- [ ] Logs de auditoría: quién importó qué, cuándo, cuántas filas
- [ ] Cleanup automático de archivos temporales después de procesar
- [ ] Índices en `import_jobs(user_id, status, created_at)`

### Casos Especiales
- [ ] Manejo de encoding (UTF-8, ISO-8859-1, Windows-1252)
- [ ] Imports con relaciones (ej: producto con categorías y proveedores; resolver IDs)
- [ ] Campos opcionales vs requeridos manejados correctamente
- [ ] Valores nulos/vacíos tratados según configuración
- [ ] Formatos de fecha múltiples detectados automáticamente
- [ ] Números con separadores decimales/miles regionales
- [ ] Imports parciales (solo ciertas columnas)
- [ ] Rollback manual de import completo si se detectan errores masivos

### Documentación
- [ ] Guía de usuario para importar/exportar
- [ ] Documentación de formatos soportados con ejemplos
- [ ] Lista de campos requeridos por entidad
- [ ] FAQ de errores comunes y soluciones
- [ ] API documentation para endpoints de import/export
- [ ] Runbook para troubleshooting de jobs fallidos