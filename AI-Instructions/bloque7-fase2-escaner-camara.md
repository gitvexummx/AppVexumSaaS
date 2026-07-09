# BLOQUE 7, FASE 2: Escáner de Código de Barras y QR con Cámara

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Permitir escanear códigos de barras y QR usando la cámara del dispositivo (móvil/tablet/desktop) mediante la librería `html5-qrcode`, como alternativa a los escáneres físicos, integrado en el POS y en la gestión de inventario.

## 📋 REQUERIMIENTOS DETALLADOS

### 23.1 Librería a Utilizar
- Usar `html5-qrcode` (open source, compatible con navegadores modernos).
- Soporte para códigos de barras 1D (EAN-13, UPC, Code-128, etc.) y QR.
- Detección automática de tipo de código.

### 23.2 Interfaz de Escaneo
- Modal emergente al activar escáner.
- Vista previa de la cámara en un recuadro central.
- Indicador visual de enfoque/zona de escaneo.
- Botón para cambiar cámara (frontal/trasera) si hay múltiples.
- Botón "Cerrar" o "Cancelar".
- Linterna/flash toggle (si el dispositivo lo soporta).

### 23.3 Integración en POS
- Botón "Escanear con cámara" junto al campo de búsqueda/código en POS.
- Al escanear exitosamente:
  - Buscar producto por código detectado.
  - Si existe: agregar al carrito automáticamente.
  - Si no existe: mostrar alerta "Producto no encontrado".
  - Cerrar modal automáticamente tras escaneo exitoso (configurable).

### 23.4 Integración en Inventario
- Botón "Escanear" en formulario de creación/edición de producto.
- Rellenar automáticamente el campo `codigo_barras` con lo detectado.
- Permitir múltiples escaneos hasta confirmar.

### 23.5 Manejo de Colisiones y Errores
- Si múltiples productos tienen mismo código (raro):
  - Mostrar modal de selección: "Varios productos encontrados, elige uno".
- Si el escáner lee mal (código incorrecto):
  - Permitir eliminar el item agregado fácilmente y re-escanear.
- Si no se detecta código en X segundos: mostrar mensaje "Acércate más" o "Mejora la iluminación".

### 23.6 Permisos y Configuración
- Solicitar permiso explícito de cámara al iniciar.
- Manejar denegación de permiso con mensaje amigable: "Necesitas permitir el uso de la cámara para escanear".
- En Configuración:
  - Toggle: "Habilitar escáner con cámara" (On/Off).
  - Toggle: "Sonido al escanear" (Beep).
  - Toggle: "Vibración al escanear" (si dispositivo soporta).
  - Selector: "Cámara preferida" (trasera/frontal).

### 23.7 Feedback Sensorial
- Emitir sonido "beep" corto al detectar código exitosamente.
- Vibrar dispositivo (API de vibración) si está disponible y activado.
- Flash visual en la interfaz (borde verde momentáneo).

### 23.8 Auto-Focus Manual
- Permitir tocar la vista previa de la cámara para enfocar en ese punto.
- Mejora la precisión en dispositivos móviles.

### 23.9 Rendimiento y Optimización
- Escaneo en segundo plano sin congelar la UI.
- Detener la cámara inmediatamente al cerrar modal (liberar recursos).
- Manejar calentamiento de dispositivo en usos prolongados.

### 23.10 Offline/PWA
- Funcionar completamente offline (la librería es client-side).
- No requiere internet para escanear, solo para buscar producto en BD local/remota.

### ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)

1. ¿El proyecto ya tiene alguna librería de escaneo instalada?
2. ¿Qué framework frontend se usa (Vue, React, Angular)?
3. ¿Existe un sistema de modales genérico reutilizable?
4. ¿Cómo se manejan los permisos de hardware (cámara/micrófono) actualmente?
5. ¿El POS ya tiene un campo de búsqueda de productos por código?
6. ¿Existe un endpoint para buscar producto por código de barras?
7. ¿La base de datos tiene índice en `codigo_barras`?
8. ¿Hay productos con códigos duplicados actualmente?
9. ¿El frontend soporta Service Workers para caché offline?
10. ¿Qué librerías de audio se usan para efectos de sonido?
11. ¿La API de vibración (`navigator.vibrate`) es compatible con los targets?
12. ¿Existe un componente de cámara o multimedia ya creado?
13. ¿Cómo se manejan los errores de permisos en la app actualmente?
14. ¿El diseño es responsive para móviles y tablets?
15. ¿Hay límites de tasa (rate limiting) en búsquedas de productos?
16. ¿Se usa caché local (IndexedDB/LocalStorage) para catálogo de productos?
17. ¿Existe un estado global para el carrito de compras?
18. ¿Qué navegadores objetivo se deben soportar (Chrome, Safari, Firefox)?
19. ¿Hay consideraciones de privacidad para acceso a cámara?
20. ¿Existe documentación de la librería `html5-qrcode` revisada?

### 🛠️ ENTREGABLES ESPERADOS

### Backend
- [ ] Verificar índice en `codigo_barras` en tabla productos
- [ ] Endpoint optimizado: `GET /api/productos/buscar-codigo/:codigo`
- [ ] Endpoint: `GET /api/productos/verificar-duplicados/:codigo` (opcional)

### Frontend
- [ ] Instalar librería `html5-qrcode`
- [ ] Componente `ModalEscanerCamara`
  - Vista previa de cámara
  - Controles (flash, cambiar cámara, cerrar)
  - Zona de enfoque táctil
- [ ] Integración en POS: botón para abrir escáner
- [ ] Integración en Inventario: botón en formulario de producto
- [ ] Lógica de post-escaneo:
  - Búsqueda de producto
  - Agregar al carrito o rellenar campo
  - Manejo de errores y colisiones
- [ ] Sistema de feedback:
  - Sonido beep (archivo audio local o generado)
  - Vibración (navigator.vibrate)
  - Indicador visual
- [ ] Configuración de preferencias (toggle cámara, sonido, vibración)
- [ ] Manejo de permisos (solicitud, error, denegación)
- [ ] Limpieza de recursos al cerrar (stop tracks)
- [ ] Pruebas en iOS y Android (Safari/Chrome)
- [ ] Documentación de uso para el usuario final

## 💡 Notas Adicionales

### Orden Sugerido de Desarrollo
1. **Primero:** Investigar librerías de escaneo de códigos de barras/QR para el stack tecnológico usado
2. **Segundo:** Implementar componente de cámara con permisos y manejo de errores
3. **Tercero:** Integrar motor de decodificación (ZXing, QuaggaJS, html5-qrcode, etc.)
4. **Cuarto:** Validar códigos escaneados contra base de datos de productos
5. **Quinto:** UI de feedback visual/sonoro al escanear exitosamente
6. **Sexto:** Historial de escaneos y modo continuo para inventario rápido

### Puntos Críticos
- ⚠️ **CRÍTICO:** Manejar permisos de cámara correctamente; pedir permiso explícito con explicación clara
- ⚠️ Soporte multi-formato: EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, QR, DataMatrix
- ⚠️ Performance: escaneo debe ser rápido (<1 segundo) incluso en dispositivos gama media
- ⚠️ Funcionamiento offline: caché local de productos para escanear sin conexión (PWA/service worker)

### Recomendaciones de UX
- Feedback inmediato: beep/vibración + highlight verde cuando escanea exitosamente
- Preview del producto escaneado antes de confirmar (imagen, nombre, precio)
- Modo "inventario rápido": escaneo continuo sin confirmación individual, contador en pantalla
- Linterna/flash toggle para ambientes oscuros
- Ajuste automático de enfoque y exposición
- Instrucciones visuales: "Acérquese al código", "Más luz", "Código no reconocido"

### Dependencias con Otras Fases
- Requiere módulo de productos completado (para buscar por SKU/código de barras)
- Integrará con inventario (Bloque 4) para conteos físicos
- Puede usarse en POS (Bloque 2) para agregar productos al carrito rápidamente

### Advertencias Comunes
- ❌ No asumir que todos los dispositivos tienen cámara trasera con autofocus
- ❌ No olvidar manejar caso donde usuario deniega permisos de cámara (fallback a input manual)
- ❌ Evitar escaneo en bucle infinito; implementar cooldown de 1-2 segundos entre escaneos
- ❌ No confiar ciegamente en código escaneado; validar formato y existencia en BD

### Librerías Recomendadas por Plataforma

**Web (JavaScript/TypeScript):**
- `html5-qrcode`: Ligera, soporta múltiples formatos, fácil integración
- `QuaggaJS`: Especializada en códigos de barras 1D, muy rápida
- `ZXing-js/library`: Port de ZXing (Java), soporta QR y barras

**React Native:**
- `react-native-camera`: Camera completa con barcode scanning
- `react-native-vision-camera`: Más moderna, mejor performance
- `@react-native-community/camera`: Mantenida por comunidad

**Flutter:**
- `mobile_scanner`: Basada en ML Kit, muy rápida
- `qr_code_scanner`: Especializada en QR
- `flutter_barcode_scanner`: Simple y efectiva

**Android Nativo:**
- Google ML Kit Barcode Scanning (recomendado)
- ZXing Android Embedded

**iOS Nativo:**
- AVFoundation + Vision Framework (nativo Apple)
- ZXingObjC

### Casos Especiales
- Códigos dañados o parcialmente visibles (intentar lectura múltiple)
- Múltiples códigos en mismo encuadre (seleccionar el más grande/centrado)
- Productos sin código de barras (generar e imprimir etiquetas QR internas)
- Escaneo desde galería (subir imagen con código en lugar de cámara en vivo)

### Optimizaciones de Performance
- Usar resolución de cámara media (no máxima) para procesar más rápido
- Limitar framerate de escaneo a 15-20 fps (suficiente para capturar códigos)
- Web Workers para decodificación en hilo separado (no bloquear UI)
- Caché de resultados: si mismo código escaneado 2 veces en 5 segundos, usar resultado previo

### 🔒 CONSIDERACIONES TÉCNICAS

### Privacidad y Seguridad
- Solicitar permiso solo cuando sea necesario.
- No almacenar imágenes de la cámara, solo el código decodificado.
- Informar al usuario qué se hace con los datos escaneados.

### Rendimiento
- Liberar cámara inmediatamente al cerrar modal.
- Evitar múltiples instancias del escáner corriendo.
- Throttle de lecturas para evitar duplicados rápidos (debounce 1-2 seg).

### UX/UI
- Instrucciones claras: "Apunta al código de barras".
- Feedback visual durante el escaneo (línea láser simulada).
- Manejo elegante de errores de iluminación/enfoque.

### Compatibilidad
- Probar en iOS (Safari tiene limitaciones con cámaras).
- Probar en Android (Chrome).
- Probar en escritorio con webcam.
- Fallback si el navegador no soporta `getUserMedia`.

### Edge Cases
- Código dañado o ilegible.
- Múltiples códigos en el encuadre (elegir el más grande/central).
- Luz ambiental muy baja o reflejos.
- Pantalla rota del dispositivo afectando cámara.

### ✅ CHECKLIST DE VERIFICACIÓN FINAL

- [ ] Librería instalada y configurada
- [ ] Modal abre y muestra cámara correctamente
- [ ] Permisos solicitados y manejados
- [ ] Escanea códigos 1D (barras) exitosamente
- [ ] Escanea códigos QR exitosamente
- [ ] Agrega producto al carrito en POS
- [ ] Rellena campo en Inventario
- [ ] Sonido y vibración funcionan (si están activos)
- [ ] Cambio de cámara frontal/trasera funciona
- [ ] Linterna/flash toggle funciona (si soportado)
- [ ] Enfoque táctil funciona
- [ ] Manejo de errores es claro
- [ ] Recursos se liberan al cerrar
- [ ] Funciona offline (búsqueda en caché local)
- [ ] Configuración de preferencias guarda cambios
- [ ] No hay fugas de memoria