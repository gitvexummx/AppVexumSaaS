# BLOQUE 4, FASE 2: Alertas de Stock y Notificaciones Internas

## ⚠️ INSTRUCCIONES CRÍTICAS PARA LA IA
1. **LEER PRIMERO:** Leer estrictamente `AIContext.md`.
2. **PREGUNTAR ANTES DE CODIFICAR:** Realizar las preguntas de clarificación listadas abajo.

## 🎯 Objetivo
Implementar un sistema proactivo de monitoreo de inventario que detecte niveles críticos ("Poco Stock" y "Sin Stock") y notifique a los usuarios responsables mediante un centro de notificaciones en el Dashboard (tipo campanita) y resúmenes diarios.

## 📋 Especificaciones Detalladas

### 1. Niveles de Alerta
- **Campo Nuevo:** `stock_minimo` en cada variante de producto.
- **Estado "Poco Stock":** `0 < stock_actual <= stock_minimo`. Icono Amarillo.
- **Estado "Sin Stock":** `stock_actual == 0`. Icono Rojo.
- **Estado "Normal":** `stock_actual > stock_minimo`. Sin icono o Verde.

### 2. Centro de Notificaciones (Dashboard)
- Icono de campana en el header global.
- Badge contador de alertas no leídas.
- Dropdown/Modal con lista de productos en alerta.
- Acciones rápidas: "Ver producto", "Crear orden de compra" (futuro), "Marcar como leído".
- Filtrado: Mostrar alertas de la sucursal actual o globales (para dueños).

### 3. Resumen Diario
- Job programado (Cron) que se ejecuta al inicio del día o cierre.
- Genera un reporte: "X productos con poco stock, Y productos sin stock".
- Si no hay alertas, no se envía/notifica nada.
- Accesible en el Dashboard como un widget o tarjeta de "Estado de Inventarios".

### 4. PWA y Offline
- Al ser PWA, las notificaciones deben guardarse en `IndexedDB` o `localStorage` para estar disponibles sin internet.
- Sincronización al recuperar conexión.

## ❓ PREGUNTAS OBLIGATORIAS DE CLARIFICACIÓN
1. ¿Existe algún sistema de notificaciones previo en el proyecto (Websockets, Pusher, Firebase)? ¿O empezamos desde cero con almacenamiento en BD?
2. ¿Dónde se guardará el `stock_minimo`? ¿En el producto padre o en cada variante? (Debería ser por variante).
3. ¿Quién recibe las alertas? ¿Solo el Gerente de la sucursal y el Dueño? ¿También el Almacenista?
4. ¿El umbral de "Poco Stock" es global o configurable por producto?
5. ¿Se debe enviar un email resumen además de la notificación en el dashboard?
6. ¿Cómo manejamos la lectura de notificaciones? ¿Se marcan como leídas automáticamente al abrir el detalle o requiere acción manual?
7. ¿El resumen diario se genera a una hora fija (ej: 8:00 AM) o al cerrar caja?
8. ¿Las alertas deben persistir históricamente o solo mostrar el estado actual? (Ej: Si repongo stock, ¿desaparece la alerta o queda registro de que estuvo baja?)
9. ¿En el POS, si intento vender y quedo en "Poco Stock", debo mostrar una advertencia inmediata al cajero?
10. ¿Hay algún color corporativo específico para las alertas aparte de Amarillo/Rojo estándar?
11. ¿El contador de notificaciones debe actualizarse en tiempo real (polling/websocket) o solo al recargar página?
12. ¿Para el modo offline, qué frecuencia de sincronización deseamos al volver online?
13. ¿Se permitirá silenciar alertas para productos específicos temporalmente?
14. ¿El widget del dashboard debe mostrar gráficas de tendencia de stock bajo?
15. ¿Cómo se comporta esto con productos de tipo "Servicio" o "Digital" que no tienen stock físico? (Deben ignorarse).

## ✅ Checklist de Entregables
- [ ] Migración: Agregar `stock_minimo` a tabla de variantes/productos.
- [ ] Lógica Backend: Service/Detector de niveles de stock.
- [ ] Tabla `notificaciones` (usuario_id, tipo, mensaje, leido, created_at).
- [ ] Endpoint API: `GET /notificaciones`, `PUT /notificaciones/{id}/leer`.
- [ ] Frontend: Componente `CampanaNotificaciones`, Badge, Dropdown de lista.
- [ ] Widget Dashboard: "Resumen de Stock Crítico".
- [ ] Lógica POS: Warning visual si stock baja de mínimo tras una venta.
- [ ] Job/Tarea programada para resumen diario.

## 🎨 UX/UI
- Usar iconos intuitivos (⚠️ para poco, 🛑 para sin stock).
- Las notificaciones no deben ser intrusivas (toasts), sino acumulativas en la campana.

## 💡 NOTAS DE IMPLEMENTACIÓN

### Orden Sugerido de Desarrollo
1. **Primero:** Crear migraciones y modelos para `stock_alerts` y `notification_preferences`
2. **Segundo:** Implementar lógica de verificación de stock (service layer)
3. **Tercero:** Configurar jobs/schedulers para verificación periódica
4. **Cuarto:** Implementar sistema de notificaciones (email, push, in-app)
5. **Quinto:** Crear UI para configuración de alertas por usuario/producto
6. **Sexto:** Dashboard de alertas activas y histórico

### Puntos Críticos
- ⚠️ **Importante:** La verificación de stock NO debe correr en cada request; usar jobs programados (cada 15-30 min) o triggers en eventos de cambio de stock
- ⚠️ Evitar notificaciones duplicadas: implementar cooldown de 24h por alerta/producto/usuario
- ⚠️ Considerar zonas horarias de usuarios al enviar notificaciones programadas

### Recomendaciones de UX
- Permitir configuración granular: cada usuario define qué alertas quiere recibir y por qué canales
- Mostrar preview de cómo se verá la notificación antes de guardar configuración
- Incluir acción rápida en notificaciones (ej: "Reponer stock" que lleve directo al formulario de compra)
- Agrupar alertas relacionadas en resumen diario opcional

### Dependencias con Otras Fases
- Requiere fase de multi-almacén completada para alertas por ubicación
- Depende de sistema de notificaciones central (verificar si existe en bloque anterior)
- Integrará con módulo de compras para sugerir órdenes de reposición automáticas

### Advertencias Comunes
- ❌ No hardcodear thresholds de stock; deben ser configurables por producto/categoría/usuario
- ❌ No enviar notificaciones fuera de horario laboral configurable
- ❌ No olvidar caso de productos descontinuados (no alertar)

---

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

### Backend
- [ ] Migración para tabla `stock_alerts` (id, product_id, variant_id, threshold, type, is_active, created_by)
- [ ] Migración para tabla `notification_preferences` (user_id, channel, alert_type, is_enabled)
- [ ] Migración para tabla `alert_history` (registro de alertas enviadas)
- [ ] Modelo StockAlert con scopes (low_stock, out_of_stock, over_stocked)
- [ ] Service para verificación de stock contra thresholds
- [ ] Job/Scheduler para ejecución periódica de verificación
- [ ] Sistema de notificaciones multi-canal (email, push, in-app)
- [ ] Endpoints para CRUD de alertas por usuario
- [ ] Endpoint para obtener alertas activas del usuario
- [ ] Endpoint para marcar alerta como leída/resuelta
- [ ] Tests unitarios para lógica de thresholds
- [ ] Tests de integración para flujo completo de alerta

### Frontend
- [ ] Página de configuración de alertas por usuario
- [ ] Componente para definir threshold por producto/variante
- [ ] Toggle switches para activar/desactivar tipos de alerta
- [ ] Selector de canales de notificación preferidos
- [ ] Dashboard de alertas activas con filtros
- [ ] Vista detallada de alerta con acciones rápidas
- [ ] Historial de alertas con paginación
- [ ] Badges/contadores de alertas no leídas en navbar
- [ ] Notificaciones in-app en tiempo real (WebSocket/polling)
- [ ] Responsive design en todos los dispositivos
- [ ] Tests de integración para flujos de configuración

### UX/UI
- [ ] Diseños de emails de alerta (HTML responsive)
- [ ] Templates de notificaciones push
- [ ] Iconografía clara para tipos de alerta (warning, danger, info)
- [ ] Colores semánticos (amarillo=stock bajo, rojo=agotado)
- [ ] Animaciones sutiles para nuevas alertas
- [ ] Accesibilidad (aria-labels, contraste de colores)

### Performance & Security
- [ ] Job de verificación optimizado (batch processing, no N+1)
- [ ] Índices en `stock_alerts(product_id, is_active)` y `alert_history(user_id, created_at)`
- [ ] Rate limiting en envío de notificaciones
- [ ] Validación de permisos (usuarios solo ven sus alertas)
- [ ] Logs de envío de notificaciones para debugging

### Casos Especiales
- [ ] Manejo de productos con variantes múltiples (alerta por variante vs producto general)
- [ ] Alertas diferenciadas por almacén/sucursal
- [ ] Respetar horarios laborales configurados
- [ ] No alertar productos marcados como "descontinuado" o "sin reposición"
- [ ] Cooldown configurado para evitar spam

### Documentación
- [ ] Guía de configuración de alertas para usuarios finales
- [ ] Documentación técnica de jobs y schedulers
- [ ] Ejemplos de payloads de notificaciones
- [ ] Runbook para troubleshooting de alertas no enviadas