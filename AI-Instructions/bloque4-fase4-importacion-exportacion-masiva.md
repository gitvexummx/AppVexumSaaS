# Fase 12: Importación y Exportación Masiva (Excel/CSV)

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