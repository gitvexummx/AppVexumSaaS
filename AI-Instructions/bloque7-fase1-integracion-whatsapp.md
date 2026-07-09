# BLOQUE 7, FASE 1: Integración con WhatsApp para Envío de Tickets

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Implementar la funcionalidad para enviar tickets de venta a los clientes directamente a su WhatsApp mediante enlaces `wa.me`, permitiendo personalizar el mensaje, registrar el intento de envío y ofrecer una experiencia rápida y moderna típica de comercios en LATAM.

## 📋 REQUERIMIENTOS DETALLADOS

### 22.1 Mecanismo de Envío (wa.me)
- Usar exclusivamente la API de enlaces web: `https://wa.me/<numero>?text=<mensaje_encoded>`
- No integrar APIs oficiales de WhatsApp Business (Meta) por ahora.
- El enlace debe abrir:
  - App de WhatsApp si está instalada (móvil).
  - WhatsApp Web si es escritorio o no hay app.
- El número de teléfono debe incluir el código de país (ej: +521...) sin espacios ni caracteres especiales.

### 22.2 Plantilla del Mensaje
- El mensaje predeterminado debe ser editable/configurable.
- Estructura default:
    {
        Hola, aquí tu ticket de [NOMBRE_NEGOCIO]:
        Folio: [FOLIO]
        Fecha: [FECHA]
        Total: $[TOTAL]
        ¡Gracias por tu compra!
    }
- Variables disponibles para la plantilla: `{negocio}`, `{folio}`, `{fecha}`, `{total}`, `{items}` (lista resumida opcional).
- El mensaje debe codificarse correctamente para URL (`encodeURIComponent`).

### 22.3 Ubicación del Botón
- Agregar botón "Enviar por WhatsApp" en:
- Lista de ventas del Dashboard (columna de acciones o ícono).
- Modal de detalle de venta.
- Vista previa del ticket (si existe).
- Ícono reconocible de WhatsApp (verde).

### 22.4 Flujo de Interacción
1. Usuario hace clic en "Enviar por WhatsApp".
2. Si la venta no tiene teléfono del cliente registrado:
 - Abrir modal pequeño: "Ingresa el número de WhatsApp del cliente (con código de país)".
 - Input con máscara de teléfono opcional.
 - Botón "Enviar".
3. Si ya tiene teléfono:
 - Abrir directamente la ventana/enlace de WhatsApp.
4. Registrar el evento como "Ticket enviado por WhatsApp" en la BD (contador o log).

### 22.5 Registro de Envíos
- Crear tabla o campo para rastrear intentos de envío:
- `venta_id`
- `fecha_envio`
- `numero_destino`
- `usuario_id` (quién envió)
- Nota: No podemos confirmar si el mensaje se entregó realmente, solo registramos el clic/intento.
- Mostrar contador en detalle de venta: "Enviado X veces por WhatsApp".

### 22.6 Configuración de Plantilla
- En sección de Configuración/Negocio:
- Área de texto para editar la plantilla del mensaje.
- Botón "Restaurar default".
- Lista de variables disponibles mostrada como ayuda.

### 22.7 Consideraciones Offline/PWA
- La generación del enlace funciona offline.
- El envío real requiere conexión a internet (obvio).
- Si no hay conexión al hacer clic, mostrar alerta: "No tienes conexión. Conéctate para enviar el mensaje".

## ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)

1. ¿Existe ya un campo `telefono_cliente` en la tabla `ventas` o `clientes`?
2. ¿Cómo se captura actualmente el teléfono del cliente en el POS?
3. ¿Qué librerías se usan para máscaras de input (teléfono)?
4. ¿Existe una tabla de `logs_actividad` o similar donde registrar eventos?
5. ¿El frontend maneja già detección de dispositivo (móvil vs escritorio)?
6. ¿Hay algún componente de modal para inputs rápidos ya creado?
7. ¿Cómo se manejan las configuraciones del negocio actualmente (tabla `configuraciones`)?
8. ¿Existe un ícono de WhatsApp en la librería de íconos del proyecto?
9. ¿Se usa algún formato específico para números de teléfono en la BD?
10. ¿El sistema tiene ya detectado el código de país default (de la Fase 19)?
11. ¿Qué librerías se usan para notificaciones/toasts?
12. ¿Hay restricciones de CORS o seguridad al abrir enlaces externos?
13. ¿El diseño actual de la lista de ventas permite agregar una columna más o botón?
14. ¿Se requiere validar que el número tenga longitud mínima antes de enviar?
15. ¿Los tickets tienen ya una vista HTML pública o son solo PDF/Print?
16. ¿Cómo se maneja la internacionalización de mensajes actualmente?
17. ¿Existe un servicio de utilidades para manejo de URLs o encoding?
18. ¿El backend tiene endpoints para actualizar metadatos de venta (como conteo de envíos)?
19. ¿Se permite editar el teléfono del cliente después de creada la venta?
20. ¿Hay alguna política de privacidad o aviso sobre envío de datos a terceros (WhatsApp)?

## 🛠️ ENTREGABLES ESPERADOS

### Backend
- [ ] Migración para agregar campo `telefono_cliente` en `ventas` (si no existe)
- [ ] Migración para crear tabla `logs_envio_whatsapp` (venta_id, telefono, fecha, usuario_id)
- [ ] Endpoint: `PUT /api/ventas/:id/agregar-telefono`
- [ ] Endpoint: `POST /api/ventas/:id/registrar-envio-whatsapp`
- [ ] Endpoint: `GET /api/configuracion/plantilla-whatsapp`
- [ ] Endpoint: `PUT /api/configuracion/plantilla-whatsapp`
- [ ] Modelo `LogEnvioWhatsapp` con relaciones
- [ ] Validación de formato de teléfono (básica)

### Frontend
- [ ] Botón "WhatsApp" en lista de ventas (ícono verde)
- [ ] Botón "WhatsApp" en detalle de venta
- [ ] Modal para ingresar teléfono si no existe
- [ ] Input con máscara de teléfono (opcional pero recomendado)
- [ ] Lógica para construir URL `wa.me` con mensaje codificado
- [ ] Función para abrir enlace en nueva pestaña/ventana
- [ ] Integración con configuración de plantilla editable
- [ ] Mostrar contador de envíos en detalle de venta
- [ ] Notificación toast al intentar enviar
- [ ] Manejo de error si no hay conexión
- [ ] Adaptación a móvil (abrir app) y escritorio (web)
- [ ] Tests de integración del flujo

## 💡 Notas Adicionales

### Orden Sugerido de Desarrollo
1. **Primero:** Elegir proveedor de API de WhatsApp Business (Meta oficial, Twilio, MessageBird, 360dialog)
2. **Segundo:** Configurar cuenta de WhatsApp Business API y obtener credenciales
3. **Tercero:** Crear migraciones para `whatsapp_templates`, `whatsapp_messages`, `whatsapp_contacts`
4. **Cuarto:** Implementar service layer para envío de mensajes (texto, plantillas, multimedia)
5. **Quinto:** Webhook handler para recibir respuestas y actualizaciones de estado (entregado, leído)
6. **Sexto:** UI para envío manual de mensajes, vista de conversaciones, estadísticas

### Puntos Críticos
- ⚠️ **CRÍTICO:** WhatsApp Business API tiene reglas estrictas; mensajes proactivos solo con plantillas aprobadas
- ⚠️ Las plantillas deben ser pre-aprobadas por Meta antes de usarse (proceso de 24-72 horas)
- ⚠️ Rate limiting: WhatsApp impone límites de mensajes por segundo/minuto según nivel de negocio
- ⚠️ Costos: WhatsApp cobra por conversación (ventana de 24h), no por mensaje individual

### Recomendaciones de UX
- Constructor visual de plantillas con preview de cómo se verá en WhatsApp
- Variables dinámicas en plantillas: `{{1}}` = nombre_cliente, `{{2}}` = número_pedido
- Cola de mensajes con reintentos automáticos si falla envío
- Indicadores de estado: enviado ✅, entregado ✓✓, leído (azul)
- Bandeja de entrada unificada para respuestas de clientes
- Etiquetas/tags para organizar contactos y conversaciones

### Dependencias con Otras Fases
- Requiere módulo de clientes completado (para vincular teléfonos a clientes)
- Integrará con notificaciones (Bloque 4.2) para enviar alertas por WhatsApp
- Puede dispararse desde ventas, recordatorios de pago, seguimiento post-venta

### Advertencias Comunas
- ❌ No enviar spam; WhatsApp bloquea números que reportan abuso masivamente
- ❌ No almacenar mensajes en texto plano; encriptar datos sensibles
- ❌ Evitar enviar mensajes fuera de horario permitido (8am-8pm hora local del cliente)
- ❌ No olvidar manejar opt-out: clientes deben poder darse de baja fácilmente

### Proveedores Recomendados
- **Meta WhatsApp Cloud API:** Oficial, más económico, hosting propio requerido
- **Twilio:** Fácil integración, buena documentación, pricing transparente
- **MessageBird:** Omnicanal (WhatsApp + SMS + email), enterprise-ready
- **360dialog:** Partner oficial Meta, infraestructura gestionada incluida

### Casos de Uso Típicos
- Confirmación de pedidos automáticos
- Recordatorios de citas/reservas
- Notificaciones de envío/entrega
- Encuestas de satisfacción post-compra
- Alertas de promociones personalizadas (solo a clientes que opt-in)
- Soporte al cliente vía chat

### Webhooks a Implementar
- `message_status`: actualiza estado de mensaje enviado (sent, delivered, read, failed)
- `incoming_message`: recibe respuesta de cliente y crea hilo de conversación
- `template_status`: notifica cuando plantilla es aprobada/rechazada por Meta

## 🔒 CONSIDERACIONES TÉCNICAS

### Privacidad y Seguridad
- No almacenar mensajes completos, solo registro de intento.
- Asegurar que el número se almacene de forma segura.
- Advertir al usuario que está compartiendo datos con WhatsApp (tercero).

### UX/UI
- El botón debe ser visible pero no intrusivo.
- Feedback inmediato al hacer clic.
- Permitir copiar número al portapapeles como alternativa.

### Performance
- Generación de enlace debe ser instantánea (cliente-side).
- No bloquear la UI mientras se abre WhatsApp.

### Edge Cases
- Número inválido o incompleto.
- Usuario cancela el ingreso del teléfono.
- WhatsApp no instalado y navegador no redirige bien a Web.
- Caracteres especiales en el mensaje que rompen la URL.

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

- [ ] Botón aparece en lista y detalle de ventas
- [ ] Modal de teléfono funciona correctamente
- [ ] Enlace `wa.me` se genera con formato correcto
- [ ] Mensaje incluye variables dinámicas (folio, total, etc.)
- [ ] Plantilla editable se guarda y aplica
- [ ] Registro de envío se crea en BD
- [ ] Contador de envíos se muestra
- [ ] Funciona en móvil (abre app)
- [ ] Funciona en escritorio (abre web)
- [ ] Manejo de errores de conexión
- [ ] No hay regresiones en ventas existentes