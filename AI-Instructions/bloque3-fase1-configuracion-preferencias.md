# 📋 BLOQUE 3, FASE 1: Configuración y Preferencias

## 🎯 Contexto para la IA
Este documento contiene las instrucciones para implementar la **Fase 7** del proyecto Vexum MX.

### ⚠️ REGLAS CRÍTICAS - LEER PRIMERO
1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto antes de comenzar cualquier trabajo.
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos en `AIContext.md`.
3. Mantener consistencia con el código existente en el proyecto.
4. Usar el stack tecnológico definido en `AIContext.md`.
5. **REQUISITO:** Las Fases anteriores deben estar avanzadas para conocer qué configuraciones se necesitan.

---

## 📌 OBJETIVO DE ESTA FASE
Crear una interfaz de configuración centralizada donde los administradores puedan gestionar:
- Datos del negocio (nombre, RFC, logo, dirección)
- Configuración de impuestos
- Formato de tickets
- Seguridad y permisos
- Comportamiento del POS
- Preferencias generales del sistema

---

## ❓ PREGUNTAS OBLIGATORIAS ANTES DE COMENZAR
**LA IA DEBE HACER ESTAS PREGUNTAS Y ESPERAR RESPUESTA ANTES DE ESCRIBIR CÓDIGO:**

1. ¿Existe ya una página de configuración o ajustes en el sistema?
2. ¿Cómo se almacenan actualmente las configuraciones? (tabla en BD, archivo .env, localStorage)
3. ¿Hay un sistema de roles que limite quién puede modificar configuraciones?
4. ¿Existe algún componente de formulario reutilizable que pueda aprovecharse?
5. ¿Cómo se maneja el upload de imágenes en el proyecto?
6. ¿Hay validación de formularios establecida? (Formik, VeeValidate, React Hook Form)
7. ¿Se usa algún patrón para settings/preferencias? (objeto único, clave-valor)
8. ¿Las configuraciones deben aplicarse inmediatamente o requieren reinicio?
9. ¿Existe historial/auditoría de cambios en configuraciones?
10. ¿Hay configuraciones por usuario vs configuraciones globales?
11. ¿Se requiere backup/restore de configuraciones?
12. ¿Existen valores por defecto documentados para cada configuración?
13. ¿Algunas configuraciones deben ser de solo lectura para ciertos roles?
14. ¿Se necesita notificar a usuarios cuando cambian configuraciones críticas?
15. ¿Hay integraciones externas que dependan de configuraciones? (APIs, webhooks)
16. ¿El logo tiene requisitos específicos de tamaño/formato?
17. ¿Se requiere previsualización de cambios antes de guardar?
18. ¿Existe modo de "configuración por defecto de fábrica"?

---

## 📁 SECCIONES DE CONFIGURACIÓN

### 7.1 Datos del Negocio

#### Campos requeridos:
```javascript
{
  negocio_nombre: {
    tipo: "text",
    label: "Nombre del Negocio",
    required: true,
    placeholder: "Ej: Vexum MX",
    valor_default: ""
  },
  
  negocio_rfc: {
    tipo: "text",
    label: "RFC",
    required: false,
    placeholder: "XXX000000XXX",
    mask: "RFC",
    valor_default: ""
  },
  
  negocio_direccion: {
    tipo: "textarea",
    label: "Dirección Completa",
    required: false,
    placeholder: "Calle, Número, Colonia, CP, Ciudad, Estado",
    valor_default: ""
  },
  
  negocio_telefono: {
    tipo: "tel",
    label: "Teléfono",
    required: false,
    placeholder: "55-1234-5678",
    mask: "telefono",
    valor_default: ""
  },
  
  negocio_email: {
    tipo: "email",
    label: "Correo Electrónico",
    required: false,
    placeholder: "contacto@negocio.com",
    valor_default: ""
  },
  
  negocio_logo: {
    tipo: "image_upload",
    label: "Logo del Negocio",
    required: false,
    accept: "image/png, image/jpeg",
    max_size: "2MB",
    dimensiones_recomendadas: "200x50px",
    valor_default: null,
    preview: true
  },
  
  ticket_mensaje_final: {
    tipo: "text",
    label: "Mensaje Final del Ticket",
    required: false,
    placeholder: "¡Gracias por su compra!",
    max_length: 100,
    valor_default: "¡Gracias por su compra!"
  }
}
```

**Diseño de sección:**
```
┌──────────────────────────────────────────────┐
│  🏢 DATOS DEL NEGOCIO                        │
├──────────────────────────────────────────────┤
│                                              │
│  Nombre del Negocio: *                       │
│  [________________________________]          │
│                                              │
│  RFC:                                        │
│  [________________________________]          │
│                                              │
│  Dirección Completa:                         │
│  [________________________________]          │
│  [________________________________]          │
│                                              │
│  Teléfono:           Correo Electrónico:     │
│  [____________]      [____________________]  │
│                                              │
│  Logo del Negocio:                           │
│  ┌─────────────┐  [Subir Imagen]             │
│  │   [LOGO]    │  Dimensiones recomendadas:  │
│  │  Vista      │  200x50px, máx 2MB          │
│  │  Previa     │  PNG o JPG                  │
│  └─────────────┘  [Eliminar]                 │
│                                              │
│  Mensaje Final del Ticket:                   │
│  [________________________________] /100     │
│                                              │
└──────────────────────────────────────────────┘
```

---

### 7.2 Impuestos

#### Campos requeridos:
```javascript
{
  impuestos_activos: {
    tipo: "toggle",
    label: "Activar Cálculo de Impuestos",
    required: true,
    valor_default: false,
    help_text: "Si está desactivado, los precios se consideran finales"
  },
  
  impuesto_porcentaje: {
    tipo: "number",
    label: "Porcentaje de Impuesto",
    required: "condicional (si impuestos_activos)",
    min: 0,
    max: 100,
    step: 0.01,
    suffix: "%",
    valor_default: 16.00,
    disabled_when: "!impuestos_activos"
  },
  
  precios_incluyen_impuestos: {
    tipo: "radio_group",
    label: "¿Los precios incluyen impuestos?",
    options: [
      { value: true, label: "Sí, IVA incluido" },
      { value: false, label: "No, IVA se agrega al total" }
    ],
    required: true,
    valor_default: false,
    disabled_when: "!impuestos_activos"
  },
  
  mostrar_impuestos_en_ticket: {
    tipo: "toggle",
    label: "Mostrar impuestos desglosados en ticket",
    required: false,
    valor_default: true,
    disabled_when: "!impuestos_activos"
  }
}
```

**Diseño de sección:**
```
┌──────────────────────────────────────────────┐
│  💰 IMPUESTOS                                │
├──────────────────────────────────────────────┤
│                                              │
│  ☑ Activar Cálculo de Impuestos              │
│  ℹ️ Si está desactivado, los precios se     │
│     consideran finales sin desglose          │
│                                              │
│  Porcentaje de Impuesto:                     │
│  [____16.00____] %                           │
│  ℹ️ Ejemplo: 16 para IVA estándar en México │
│                                              │
│  ¿Los precios incluyen impuestos?            │
│  ○ Sí, IVA incluido                         │
│  ● No, IVA se agrega al total                │
│                                              │
│  ☑ Mostrar impuestos desglosados en ticket   │
│                                              │
└──────────────────────────────────────────────┘
```

---

### 7.3 Tickets

#### Campos requeridos:
```javascript
{
  ticket_ancho: {
    tipo: "select",
    label: "Ancho de Ticket",
    options: [
      { value: "58mm", label: "58mm (Impresora pequeña)" },
      { value: "80mm", label: "80mm (Impresora estándar)" },
      { value: "carta", label: "Tamaño Carta (PDF)" }
    ],
    required: true,
    valor_default: "58mm"
  },
  
  ticket_folio_prefijo: {
    tipo: "text",
    label: "Prefijo de Folio",
    required: false,
    placeholder: "Ej: A, FAC, B",
    max_length: 5,
    valor_default: "",
    help_text: "Dejar vacío para folios sin prefijo"
  },
  
  ticket_folio_padding: {
    tipo: "number",
    label: "Longitud de Folio",
    min: 4,
    max: 8,
    suffix: "dígitos",
    valor_default: 4,
    help_text: "Ej: 4 → A0001, 6 → A000001"
  },
  
  ticket_mostrar_codigo_barras: {
    tipo: "toggle",
    label: "Mostrar código de barras en ticket",
    required: false,
    valor_default: false,
    help_text: "Requiere librería de generación de códigos"
  },
  
  ticket_copias_por_defecto: {
    tipo: "number",
    label: "Número de copias a imprimir",
    min: 1,
    max: 5,
    valor_default: 1
  },
  
  ticket_imprimir_automaticamente: {
    tipo: "toggle",
    label: "Imprimir ticket automáticamente después de cobrar",
    required: false,
    valor_default: false,
    help_text: "Abre diálogo de impresión sin mostrar vista previa"
  }
}
```

---

### 7.4 Seguridad

#### Campos requeridos:
```javascript
{
  password_superior: {
    tipo: "password_with_confirmation",
    label: "Contraseña de Supervisor",
    required: true,
    min_length: 6,
    help_text: "Necesaria para reaperturas de caja, cancelaciones, etc.",
    valor_default: "(establecer)",
    acciones: ["Cambiar contraseña"]
  },
  
  requerir_confirmacion_cancelar_venta: {
    tipo: "toggle",
    label: "Requerir confirmación para cancelar ventas",
    required: false,
    valor_default: true
  },
  
  requerir_autorizacion_para_descuentos: {
    tipo: "toggle",
    label: "Requerir autorización para aplicar descuentos",
    required: false,
    valor_default: false,
    help_text: "Aplica para descuentos mayores al X%"
  },
  
  descuento_maximo_sin_autorizacion: {
    tipo: "number",
    label: "Descuento máximo sin autorización",
    min: 0,
    max: 100,
    suffix: "%",
    valor_default: 10,
    disabled_when: "!requerir_autorizacion_para_descuentos"
  },
  
  timeout_sesion: {
    tipo: "select",
    label: "Tiempo de inactividad antes de cerrar sesión",
    options: [
      { value: 15, label: "15 minutos" },
      { value: 30, label: "30 minutos" },
      { value: 60, label: "1 hora" },
      { value: 120, label: "2 horas" },
      { value: 0, label: "Nunca" }
    ],
    required: true,
    valor_default: 60
  },
  
  intentos_fallidos_bloqueo: {
    tipo: "number",
    label: "Intentos fallidos antes de bloquear",
    min: 3,
    max: 10,
    valor_default: 5,
    help_text: "Para contraseña de supervisor y acceso general"
  }
}
```

---

### 7.5 Comportamiento POS

#### Campos requeridos:
```javascript
{
  pos_tecla_consulta_precio: {
    tipo: "select",
    label: "Tecla para consulta rápida de precio",
    options: [
      { value: "Shift", label: "SHIFT" },
      { value: "Ctrl", label: "CTRL" },
      { value: "Alt", label: "ALT" }
    ],
    required: true,
    valor_default: "Shift",
    help_text: "Mantener presionada mientras escanea para solo ver precio"
  },
  
  pos_sonido_al_escanear: {
    tipo: "toggle",
    label: "Reproducir sonido al escanear producto",
    required: false,
    valor_default: true
  },
  
  pos_sonido_exito: {
    tipo: "audio_picker",
    label: "Sonido de éxito",
    options: ["beep.mp3", "ding.mp3", "success.mp3"],
    valor_default: "beep.mp3",
    disabled_when: "!pos_sonido_al_escanear"
  },
  
  pos_sonido_error: {
    tipo: "audio_picker",
    label: "Sonido de error",
    options: ["error.mp3", "buzz.mp3"],
    valor_default: "error.mp3",
    disabled_when: "!pos_sonido_al_escanear"
  },
  
  pos_abrir_modal_pagos_automatico: {
    tipo: "toggle",
    label: "Abrir modal de pagos automáticamente al llegar al cobro",
    required: false,
    valor_default: false,
    help_text: "Si está desactivado, el usuario debe hacer click en 'Cobrar'"
  },
  
  pos_items_por_fila: {
    tipo: "number",
    label: "Items mostrados por fila en carrito",
    min: 1,
    max: 10,
    valor_default: 5,
    help_text: "Controla cuántos items se ven sin scroll"
  },
  
  pos_permitir_precios_negociables: {
    tipo: "toggle",
    label: "Permitir modificar precios en POS",
    required: false,
    valor_default: false,
    help_text: "Solo usuarios autorizados pueden cambiar precios"
  }
}
```

---

### 7.6 Preferencias Generales

#### Campos requeridos:
```javascript
{
  sistema_idioma: {
    tipo: "select",
    label: "Idioma del Sistema",
    options: [
      { value: "es", label: "Español" },
      { value: "en", label: "English" }
    ],
    required: true,
    valor_default: "es"
  },
  
  sistema_moneda: {
    tipo: "select",
    label: "Moneda",
    options: [
      { value: "MXN", label: "$ Peso Mexicano" },
      { value: "USD", label: "$ Dólar Americano" },
      { value: "EUR", label: "€ Euro" }
    ],
    required: true,
    valor_default: "MXN"
  },
  
  sistema_formato_fecha: {
    tipo: "select",
    label: "Formato de Fecha",
    options: [
      { value: "DD/MM/YYYY", label: "31/01/2025" },
      { value: "MM/DD/YYYY", label: "01/31/2025" },
      { value: "YYYY-MM-DD", label: "2025-01-31" }
    ],
    required: true,
    valor_default: "DD/MM/YYYY"
  },
  
  sistema_zona_horaria: {
    tipo: "timezone_picker",
    label: "Zona Horaria",
    required: true,
    valor_default: "America/Mexico_City"
  },
  
  sistema_registros_por_pagina: {
    tipo: "number",
    label: "Registros por página (tablas)",
    options: [10, 25, 50, 100],
    valor_default: 25
  },
  
  sistema_backup_automatico: {
    tipo: "toggle",
    label: "Backup automático de base de datos",
    required: false,
    valor_default: true,
    help_text: "Se realiza diariamente a las 2:00 AM"
  }
}
```

---

## ✅ ENTREGABLES ESPERADOS

1. **Página de Configuración**
   - Layout con navegación lateral o tabs
   - Todas las secciones implementadas
   - Guardado por sección o global

2. **Componentes de Formulario**
   - Toggle/Switch personalizado
   - ImageUploader con preview
   - PasswordInput con confirmación
   - Selectores personalizados
   - TimezonePicker

3. **Backend/API**
   - Endpoint GET /api/configuracion - Obtener todas
   - Endpoint PUT /api/configuracion - Actualizar todas
   - Endpoint PATCH /api/configuracion/:clave - Actualizar una
   - Validaciones correspondientes
   - Logs de auditoría

4. **Estado Global**
   - Store de configuraciones accesible desde toda la app
   - Refresco automático después de guardar
   - Valores por defecto si no existen

5. **UX/UI**
   - Confirmación antes de guardar cambios críticos
   - Notificaciones de éxito/error
   - Indicador de "cambios sin guardar"
   - Botón "Restaurar defaults" por sección

---

## 🔍 CONSIDERACIONES TÉCNICAS

### Almacenamiento:
```javascript
// Recomendado:
- Tabla `configuraciones` en BD (clave-valor)
- Cache en Redis/Memcached para lecturas frecuentes
- Sync con frontend state management
- Invalidar cache al actualizar
```

### Seguridad:
```javascript
// Crítico:
- Solo administradores pueden modificar configuraciones
- Password de superior debe guardarse hasheada
- Loggear todos los cambios (quién, cuándo, qué cambió)
- Validar tipos de datos antes de guardar
```

### Performance:
```javascript
// Optimizaciones:
- Cargar configuraciones al login
- Mantener en memoria/global state
- No consultar BD en cada render
- Actualizar solo lo cambiado
```

### Validaciones:
```javascript
// Importantes:
- Validar formato de RFC
- Validar tamaño/formato de imagen
- Validar rangos numéricos
- Validar emails y teléfonos
- Sanitizar inputs de texto
```

---

## 📝 NOTAS ADICIONALES

- Esta fase puede hacerse en paralelo con otras fases finales
- Las configuraciones afectan todo el sistema - probar exhaustivamente
- Documentar cada configuración para el manual de usuario
- Considerar migración de configuraciones existentes si las hay
- Permitir exportar/importar configuraciones (backup)

---

## 🔄 CHECKLIST DE VERIFICACIÓN

- [ ] Leído AIContext.md completamente
- [ ] Respondidas todas las preguntas de clarificación
- [ ] Página de configuración creada con navegación
- [ ] Todas las secciones implementadas
- [ ] Componentes de formulario funcionando
- [ ] Upload de logo funcional con preview
- [ ] Endpoints de API creados y probados
- [ ] Estado global actualizado
- [ ] Validaciones funcionando
- [ ] Logs de auditoría implementados
- [ ] Cambios se reflejan inmediatamente en el sistema
- [ ] Tests aprobados (si existen)
- [ ] Commit con mensaje descriptivo

---

**IMPORTANTE:** Algunas configuraciones pueden requerir reinicio de la aplicación o recarga de página para aplicarse. Documentar claramente cuáles.
