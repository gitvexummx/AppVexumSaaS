# 📋 BLOQUE 2, FASE 1: Frontend - POS Mejorado

## 🎯 Contexto para la IA
Este documento contiene las instrucciones para implementar la **Fase 3** del proyecto Vexum MX.

### ⚠️ REGLAS CRÍTICAS - LEER PRIMERO
1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto antes de comenzar cualquier trabajo.
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos en `AIContext.md`.
3. Mantener consistencia con el código existente en el proyecto.
4. Usar el stack tecnológico definido en `AIContext.md`.
5. **REQUISITO:** Las Fases 1 y 2 deben estar completas y probadas antes de iniciar esta fase.

---

## 📌 OBJETIVO DE ESTA FASE
Rediseñar y mejorar la página de POS (Punto de Venta) para soportar:
- Escáneres de códigos de barras (listener automático)
- Consulta rápida de precios con tecla modificadora
- Carrito de compras mejorado
- Modal de pagos mixtos
- Flujo post-cobro con opción de ticket

---

## ❓ PREGUNTAS OBLIGATORIAS ANTES DE COMENZAR
**LA IA DEBE HACER ESTAS PREGUNTAS Y ESPERAR RESPUESTA ANTES DE ESCRIBIR CÓDIGO:**

1. ¿Qué framework de frontend se está usando? (React, Vue, Angular, Svelte, otro)
2. ¿Hay algún sistema de estado global? (Redux, Vuex, Pinia, Zustand, Context API)
3. ¿Existe ya una página/componente de POS implementado? ¿Cuál es su estructura actual?
4. ¿Cómo se maneja el routing? (React Router, Vue Router, Angular Router)
5. ¿Hay una librería de componentes UI establecida? (Material UI, Ant Design, TailwindUI, Vuetify)
6. ¿Cómo se hacen las peticiones HTTP? (axios, fetch, React Query, SWR)
7. ¿Existe un sistema de notificaciones/toasts? (react-toastify, vue-toasted, etc.)
8. ¿Se usa TypeScript o JavaScript?
9. ¿Hay algún patrón para hooks/composables personalizados?
10. ¿Existe ya un carrito de compras implementado? ¿Cómo funciona actualmente?
11. ¿Cómo se manejan los modales en el proyecto? (componente propio, librería externa)
12. ¿Hay configuración de hotkeys/atajos de teclado existente?
13. ¿Se requiere soporte offline/PWA?
14. ¿Existe un sistema de temas o modo oscuro/claro?
15. ¿Cómo se maneja la autenticación en frontend? (tokens, sesiones)
16. ¿Hay validación de formularios establecida? (Formik, VeeValidate, Yup, Zod)
17. ¿Se usa alguna librería para manejo de fechas? (date-fns, moment, dayjs)
18. ¿Existe ya integración con APIs del backend? ¿En qué formato están las respuestas?
19. ¿Hay tests de frontend configurados? (Jest, Vitest, Testing Library)
20. ¿La página POS ya tiene listener de teclado? ¿Cómo está implementado?

---

## 📁 COMPONENTES A CREAR/MODIFICAR

### 3.1 Hook/Composable para Scanner Listener

#### Nombre sugerido: `useScannerListener` o `composableScanner`

**Funcionalidad:**
```javascript
// Debe:
- Activarse solo cuando el componente POS está montado
- Escuchar eventos de teclado globalmente
- Detectar secuencia de caracteres + Enter (patrón de escáner)
- Diferenciar entre teclado humano y escáner (velocidad de entrada)
- Buscar producto por código de barras vía API
- Agregar al carrito automáticamente si existe
- Mostrar notificación si no existe o sin stock
- Desactivarse cuando el componente se desmonta
- Ser configurable (tecla modificadora para consulta de precio)
```

**Comportamiento especial - Modo Consulta:**
```javascript
// Si se mantiene presionada tecla específica (SHIFT/CTRL/ALT):
- El siguiente escaneo NO agrega al carrito
- Abre modal de consulta rápida con:
  * Nombre del producto
  * Precio
  * Stock disponible
  * Código de barras
- Modal se cierra automáticamente después de 3-5 segundos
- O se cierra con click/tecla Escape
```

**Consideraciones técnicas:**
- Debounce para evitar lecturas duplicadas
- Buffer temporal para acumular caracteres del escáner
- Timeout para limpiar buffer (escáneres envían rápido ~50-100ms entre teclas)
- Filtrar eventos de input fields (no leer si usuario escribe en campo)
- Manejar casos de error (producto no encontrado, API falla)

---

### 3.2 Modal de Consulta Rápida de Precio

#### Componente: `ModalConsultaPrecio` o `QuickPriceModal`

**Props esperadas:**
```javascript
{
  isOpen: boolean,
  producto: { nombre, precio, stock, codigo_barras },
  onClose: function
}
```

**Diseño:**
```
┌─────────────────────────────────┐
│  📦 CONSULTA RÁPIDA              │
├─────────────────────────────────┤
│                                 │
│     [Imagen opcional]           │
│                                 │
│  Producto: Coca Cola 600ml      │
│  Código: 750123456789           │
│                                 │
│  💰 $18.00 MXN                  │
│  📊 Stock: 45 disponibles       │
│                                 │
│  [Se cierra automático en 5s]   │
│                                 │
└─────────────────────────────────┘
```

**Comportamiento:**
- Aparece flotando sobre la interfaz
- No bloquea completamente la interfaz (modal ligero)
- Se cierra automáticamente después de 3-5 segundos
- Se puede cerrar manualmente con botón X o tecla Escape
- Sonido opcional de confirmación

---

### 3.3 Carrito Mejorado

#### Componente: `CarritoPOS` o `ShoppingCartPOS`

**Estado interno:**
```javascript
{
  items: [
    {
      producto_id: "uuid",
      nombre: "string",
      codigo_barras: "string",
      cantidad: number,
      precio_unitario: decimal,
      subtotal: decimal,
      impuestos: decimal,
      total: decimal,
      stock_disponible: number
    }
  ],
  subtotal_total: decimal,
  impuestos_total: decimal,
  total_general: decimal
}
```

**Funcionalidades requeridas:**
```
✅ Listar productos agregados con:
   - Nombre del producto
   - Código de barras (pequeño)
   - Cantidad (editable)
   - Precio unitario
   - Subtotal por línea
   - Indicador visual si stock es bajo

✅ Permitir editar cantidades:
   - Botones + y - para ajustar
   - Input directo numérico
   - Validar que no exceda stock disponible
   - Actualizar totales en tiempo real

✅ Permitir eliminar items:
   - Botón de eliminar por fila
   - Confirmación opcional (configurable)
   - Recalcular totales

✅ Cálculos en tiempo real:
   - Subtotal (suma de items sin impuestos)
   - Impuestos (según configuración global)
   - Total general
   - Mostrar desglose claramente

✅ Validaciones visuales:
   - Advertencia si cantidad > stock
   - Deshabilitar cobrar si stock insuficiente
   - Resaltar items con problemas

✅ Información adicional:
   - Número de items en carrito
   - Peso/volumen total (si aplica)
   - Ahorro si hay descuentos (futuro)
```

**Diseño sugerido:**
```
┌──────────────────────────────────────┐
│  🛒 CARRITO (5 productos)            │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ Coca Cola 600ml         $18.00   │ │
│ │ 750123456789                     │ │
│ │ [-]  2  [+]        Sub: $36.00   │ │
│ │ ⚠️ Stock restante: 43            │ │
│ └──────────────────────────────────┘ │
│ ... más items ...                    │
├──────────────────────────────────────┤
│ Subtotal:       $450.00              │
│ Impuestos (16%): $72.00              │
│ ─────────────────────────────        │
│ TOTAL:          $522.00              │
│                                      │
│ [🗑️ Vaciar]  [💳 COBRAR]            │
└──────────────────────────────────────┘
```

---

### 3.4 Modal de Pagos Mixtos

#### Componente: `ModalPagosMixtos` o `MixedPaymentModal`

**Estado interno:**
```javascript
{
  total_venta: decimal,
  pagos_registrados: [
    { metodo: "efectivo", monto: 200.00 },
    { metodo: "tarjeta", monto: 150.00 }
  ],
  saldo_pendiente: decimal,
  metodo_seleccionado: "efectivo|tarjeta|transferencia",
  monto_input: decimal,
  referencia_input: string
}
```

**Funcionalidades requeridas:**
```
✅ Mostrar información de venta:
   - Total a pagar (grande y claro)
   - Saldo pendiente actual
   - Progreso visual (barra de pago)

✅ Lista de pagos registrados:
   - Cada pago con ícono de método
   - Monto pagado
   - Referencia (si existe)
   - Botón para eliminar (solo si venta no completada)

✅ Formulario de nuevo pago:
   - Selector de método (dropdown o botones)
   - Input de monto (con validación)
   - Input de referencia (opcional)
   - Botón "Registrar Pago Parcial"
   - Botón "Completar y Cobrar" (deshabilitado si saldo > 0)

✅ Validaciones:
   - Monto no puede ser mayor a saldo pendiente
   - Monto debe ser mayor a 0
   - Al menos un pago registrado
   - Suma exacta para completar

✅ Cálculos automáticos:
   - Saldo pendiente = Total - Suma(pagos)
   - Cambio/sobrante (si paga de más en efectivo)
   - Porcentaje pagado vs pendiente

✅ Estados visuales:
   - Barra de progreso de pago
   - Colores diferentes para cada método
   - Indicador de "Falta $X" o "Pago Completo"
```

**Diseño sugerido:**
```
┌──────────────────────────────────────────┐
│  💳 REGISTRAR PAGOS                      │
├──────────────────────────────────────────┤
│                                          │
│  TOTAL A PAGAR:            $522.00       │
│  ═══════════════════════════════════     │
│                                          │
│  PAGOS REGISTRADOS:                      │
│  ┌────────────────────────────────────┐  │
│  │ 💵 Efectivo           $200.00  [×] │  │
│  │ 💳 Tarjeta            $150.00  [×] │  │
│  ├────────────────────────────────────┤  │
│  │ Pagado:               $350.00       │  │
│  │ Pendiente:            $172.00       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [██████████░░░░░░░░░░] 67% pagado       │
│                                          │
│  NUEVO PAGO:                             │
│  Método: [💵 Efectivo ▼]                 │
│  Monto:  [$ ____________]                │
│  Ref:    [________________] (opcional)   │
│                                          │
│  [➕ Registrar Pago Parcial]             │
│  [✅ Completar y Cobrar] (deshabilitado) │
│                                          │
│  [Cancelar]                              │
└──────────────────────────────────────────┘
```

**Flujo post-completado:**
```
Al hacer click en "Completar y Cobrar":
1. Enviar datos a API (POST /api/ventas/:id/pagos)
2. Mostrar spinner de carga
3. Si éxito:
   - Cerrar modal de pagos
   - Mostrar modal de "Venta Exitosa"
   - Opciones: Ver Ticket, Nueva Venta, Ver Detalles
4. Si error:
   - Mostrar mensaje de error
   - Permitir reintentar o cancelar
```

---

### 3.5 Flujo Post-Cobro

#### Componente: `ModalVentaExitosa` o `CheckoutSuccessModal`

**Opciones a mostrar:**
```
┌──────────────────────────────────────┐
│  ✅ ¡VENTA EXITOSA!                  │
│                                      │
│  Folio: A00123                       │
│  Total: $522.00                      │
│                                      │
│  ¿Qué deseas hacer?                  │
│                                      │
│  [🎫 Ver/Imprimir Ticket]            │
│  [📋 Ver Detalles de Venta]          │
│  [🛒 Nueva Venta]                    │
│  [❌ Cerrar]                         │
│                                      │
└──────────────────────────────────────┘
```

**Acciones:**
- **Ver/Imprimir Ticket:** Abre componente VistaTicket en nueva ventana/modal
- **Ver Detalles:** Muestra resumen de venta con items y pagos
- **Nueva Venta:** Limpia carrito y reinicia flujo
- **Cerrar:** Cierra modal y vuelve al POS

**Limpieza automática:**
- Si se selecciona "Nueva Venta":
  - Limpiar estado del carrito
  - Resetear contadores
  - Enfocar campo de búsqueda/escáner
  - Listo para siguiente cliente

---

### 3.6 Vista de Ticket (Preview)

#### Componente: `VistaTicket` o `TicketPreview`

**Nota:** Este componente se detalla más en la Fase 5, pero se necesita un preview básico aquí.

**Funcionalidad mínima en esta fase:**
```
- Renderizar ticket en formato HTML/CSS
- Mostrar datos de venta, items, pagos
- Botón "Imprimir" (window.print())
- Botón "Cerrar"
- Diseño responsivo para vista previa
```

---

## ✅ ENTREGABLES ESPERADOS

1. **Hooks/Composables**
   - `useScannerListener` o equivalente
   - Con tests básicos de funcionamiento

2. **Componentes nuevos**
   - `ModalConsultaPrecio`
   - `CarritoPOS` (mejorado)
   - `ModalPagosMixtos`
   - `ModalVentaExitosa`
   - `VistaTicket` (básico)

3. **Modificaciones**
   - Página POS existente integrada con nuevos componentes
   - Estado global actualizado para manejar carrito
   - Estilos actualizados para coherencia visual

4. **Integración**
   - Conexión con endpoints de backend (Fase 2)
   - Manejo de estados de carga/error
   - Notificaciones toast para feedback

5. **UX/UI**
   - Feedback visual inmediato al escanear
   - Animaciones suaves para transiciones
   - Accesibilidad básica (tabindex, aria-labels)
   - Responsive design (si aplica)

6. **Tests** (si existen en el proyecto)
   - Tests de componentes críticos
   - Tests de hooks
   - Tests de integración de flujo

---

## 🔍 CONSIDERACIONES TÉCNICAS

### Manejo del Scanner:
```javascript
// Patrón recomendado:
- Buffer de caracteres temporal
- Timeout de 100-200ms entre teclas
- Detectar Enter como final de código
- Validar longitud mínima/máxima de código
- Filtrar si focus está en input field
```

### Estado del Carrito:
```javascript
// Opciones:
- Estado local del componente (simple)
- Estado global (Redux/Vuex/Pinia) - RECOMENDADO
- URL state (para persistencia entre recargas)
- LocalStorage (backup anti-pérdida)
```

### Performance:
- Virtualización de lista si carrito tiene muchos items
- Memoización de cálculos de totales
- Lazy loading de componentes modales
- Optimizar re-renders innecesarios

### Accesibilidad:
- Focus management en modales
- Soporte para navegación con teclado
- Labels ARIA para lectores de pantalla
- Contraste de colores adecuado

### Internacionalización (si aplica):
- Textos externalizados a archivos i18n
- Formato de moneda configurable
- Formato de fechas/tiempos

---

## 📝 NOTAS ADICIONALES

- Esta fase es la más visible para el usuario final
- Priorizar UX fluido y sin fricciones
- El scanner debe funcionar SIN CONFIGURACIÓN manual
- Probar con scanner físico real antes de dar por terminado
- Documentar atajos de teclado para usuarios

---

## 🔄 CHECKLIST DE VERIFICACIÓN

- [ ] Leído AIContext.md completamente
- [ ] Respondidas todas las preguntas de clarificación
- [ ] Fases 1 y 2 completadas y verificadas
- [ ] Hook de scanner implementado y probado
- [ ] Probado con scanner físico real
- [ ] Modal de consulta de precio funcional
- [ ] Carrito mejorado con todas las funciones
- [ ] Modal de pagos mixtos validado
- [ ] Probado flujo completo: escanear → carrito → pagar → ticket
- [ ] Probado pagos mixtos (2-3 métodos combinados)
- [ ] Notificaciones/toasts configurados
- [ ] Manejo de errores implementado
- [ ] Tests aprobados (si existen)
- [ ] Commit con mensaje descriptivo

---

**IMPORTANTE:** Esta fase es crítica para la experiencia de usuario. Dedicar tiempo extra a pruebas con scanner real y flujos de pago mixto.
