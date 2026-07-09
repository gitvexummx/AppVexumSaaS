# 📋 BLOQUE 2, FASE 2: Frontend - Gestión de Cajas y Turnos

## 🎯 Contexto para la IA
Este documento contiene las instrucciones para implementar la **Fase 4** del proyecto Vexum MX.

### ⚠️ REGLAS CRÍTICAS - LEER PRIMERO
1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto antes de comenzar cualquier trabajo.
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos en `AIContext.md`.
3. Mantener consistencia con el código existente en el proyecto.
4. Usar el stack tecnológico definido en `AIContext.md`.
5. **REQUISITO:** Las Fases 1 y 2 deben estar completas. La Fase 3 puede estar en paralelo.

---

## 📌 OBJETIVO DE ESTA FASE
Implementar la interfaz de usuario para gestionar:
- Apertura y cierre de cajas
- Inicio y fin de turnos por empleado
- Generación de cortes de caja
- Reapertura de cortes con validación de superior
- Historial de movimientos de caja

---

## ❓ PREGUNTAS OBLIGATORIAS ANTES DE COMENZAR
**LA IA DEBE HACER ESTAS PREGUNTAS Y ESPERAR RESPUESTA ANTES DE ESCRIBIR CÓDIGO:**

1. ¿Existe ya una página/section de administración o configuración en el frontend?
2. ¿Dónde debería ubicarse la gestión de cajas? (¿página separada, modal, sidebar?)
3. ¿Hay un sistema de roles/perfiles de usuario implementado? ¿Cómo se maneja?
4. ¿Existe algún componente de "dashboard" o "panel de control" que pueda extenderse?
5. ¿Cómo se muestran las tablas de datos en el proyecto? (ag-grid, react-table, vuetify-data-table)
6. ¿Hay componentes de tarjetas/stat cards existentes para métricas?
7. ¿Se usa alguna librería para gráficas? (Chart.js, Recharts, ApexCharts)
8. ¿Existe un patrón para formularios complejos? (multi-step, wizards)
9. ¿Cómo se manejan los estados de carga en el proyecto? (spinners, skeletons)
10. ¿Hay un sistema de permisos por botón/acción en el frontend?
11. ¿Los modales existentes siguen algún patrón específico?
12. ¿Existe navegación entre pestañas/tabs establecida?
13. ¿Se requiere historial/auditoría visible para el usuario?
14. ¿Hay formato establecido para fechas y horas?
15. ¿Existe un componente de búsqueda/filtros reutilizable?
16. ¿Cómo se maneja la exportación de datos? (CSV, PDF, Excel)
17. ¿Se necesita notificación push o email cuando se cierra caja?
18. ¿Hay algún estándar para confirmaciones de acciones destructivas?

---

## 📁 COMPONENTES A CREAR

### 4.1 Panel de Control de Caja

#### Componente: `PanelCaja` o `CashRegisterPanel`

**Estado interno:**
```javascript
{
  caja_actual: {
    id: "uuid",
    nombre: "string",
    estado: "abierta|cerrada",
    saldo_inicial: decimal,
    saldo_final: decimal|null,
    abierta_por: { usuario_id, nombre },
    abierta_en: timestamp|null,
    cerrada_por: { usuario_id, nombre }|null,
    cerrada_en: timestamp|null
  },
  mostrando_modal_apertura: boolean,
  mostrando_modal_cierre: boolean
}
```

**Funcionalidades:**
```
✅ Mostrar estado actual de caja:
   - Indicador visual grande (verde=abierta, rojo=cerrada)
   - Nombre de la caja
   - Usuario que abrió
   - Hora de apertura
   - Tiempo transcurrido (si está abierta)

✅ Botón "Abrir Caja" (solo si está cerrada):
   - Abre modal con formulario:
     * Saldo inicial (obligatorio, >= 0)
     * Comentarios/opciones (opcional)
   - Validar que no haya turnos abiertos pendientes
   - Confirmación antes de abrir

✅ Botón "Cerrar Caja" (solo si está abierta):
   - Abre modal con formulario:
     * Saldo final esperado (input manual)
     * Saldo registrado en sistema (calculado, solo lectura)
     * Diferencia (automático, con color: verde=cuadra, rojo=diferencia)
     * Campo de observaciones (obligatorio para cierre)
   - Validar que todos los turnos estén cerrados
   - Advertencia si hay diferencia significativa
   - Confirmación explícita

✅ Historial reciente:
   - Últimas 5-10 aperturas/cierres
   - Fecha, usuario, saldos
   - Click para ver detalle completo
```

**Diseño sugerido:**
```
┌──────────────────────────────────────────────┐
│  🏦 PANEL DE CAJA                            │
├──────────────────────────────────────────────┤
│                                              │
│  Estado: [🟢 ABIERTA]                        │
│  Caja Principal                              │
│  Abierta por: Juan Pérez                     │
│  Desde: 15/Jan/2025 09:00 AM                 │
│  Tiempo transcurrido: 4h 32min               │
│                                              │
│  Saldo Inicial: $1,000.00                    │
│  Ventas del día: $8,450.00                   │
│  ─────────────────────────                   │
│  Saldo Esperado: $9,450.00                   │
│                                              │
│  [🔒 Cerrar Caja]  [📊 Ver Historial]        │
│                                              │
├──────────────────────────────────────────────┤
│  HISTORIAL RECIENTE                          │
│  ┌────────────────────────────────────────┐  │
│  │ 14/Jan - Cierre - $9,200.00 - María    │  │
│  │ 13/Jan - Apertura - $1,000.00 - Juan   │  │
│  │ 13/Jan - Cierre - $9,100.00 - Juan     │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

### 4.2 Gestión de Turnos

#### Componente: `GestionTurnos` o `ShiftManagement`

**Estado interno:**
```javascript
{
  turnos_activos: [
    {
      id: "uuid",
      numero_turno: number,
      caja_id: "uuid",
      usuario: { id, nombre },
      iniciado_en: timestamp,
      ventas_count: number,
      total_vendido: decimal
    }
  ],
  mostrando_modal_inicio: boolean,
  mostrando_modal_cierre: boolean,
  mostrando_resumen: boolean
}
```

**Funcionalidades:**
```
✅ Lista de turnos activos:
   - Número de turno
   - Empleado asignado
   - Hora de inicio
   - Tiempo transcurrido
   - Número de ventas realizadas
   - Total vendido en el turno
   - Botón "Cerrar Turno"

✅ Botón "Iniciar Turno" (si no hay turno activo del usuario):
   - Modal simple de confirmación
   - Seleccionar caja (si hay múltiples)
   - Auto-generar número consecutivo
   - Asignar usuario actual automáticamente

✅ Modal de Cierre de Turno:
   - Mostrar resumen completo:
     * Hora inicio / hora fin
     * Duración del turno
     * Número de ventas
     * Total por método de pago
     * Ticket promedio
   - Campo de observaciones/incidencias
   - Botón "Confirmar Cierre"
   - Validar que no haya ventas pendientes de pago

✅ Historial de turnos:
   - Filtrar por fecha, usuario, caja
   - Ver resumen de turnos anteriores
   - Exportar reporte (opcional)
```

**Diseño sugerido:**
```
┌──────────────────────────────────────────────┐
│  👷 GESTIÓN DE TURNOS                        │
├──────────────────────────────────────────────┤
│                                              │
│  TURNOS ACTIVOS                              │
│  ┌────────────────────────────────────────┐  │
│  │ Turno #45                               │  │
│  │ 👤 María González                       │  │
│  │ 🕐 Inició: 09:00 AM (4h 32min)          │  │
│  │ 📦 Ventas: 23                           │  │
│  │ 💰 Total: $8,450.00                     │  │
│  │                                         │  │
│  │ [Cerrar Turno]                          │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [+ Iniciar Nuevo Turno]                     │
│                                              │
├──────────────────────────────────────────────┤
│  TURNO #45 - RESUMEN                         │
│  ═══════════════════════════════════════     │
│  Inicio: 09:00 AM  |  Fin: 01:32 PM          │
│  Duración: 4h 32min                          │
│  ─────────────────────────────────────────   │
│  Transacciones: 23                           │
│  Ticket Promedio: $367.39                    │
│  ─────────────────────────────────────────   │
│  Efectivo:      $4,500.00                    │
│  Tarjeta:       $3,200.00                    │
│  Transferencia: $750.00                      │
│  ─────────────────────────────────────────   │
│  TOTAL:         $8,450.00                    │
│  ─────────────────────────────────────────   │
│  Observaciones: Sin novedades                │
└──────────────────────────────────────────────┘
```

---

### 4.3 Corte de Caja

#### Componente: `CorteCaja` o `CashierCut`

**Estado interno:**
```javascript
{
  cortes_recientes: [...],
  mostrando_modal_generar: boolean,
  mostrando_resumen_corte: boolean,
  corte_seleccionado: null|object,
  mostrando_validacion_superior: boolean
}
```

**Funcionalidades:**
```
✅ Botón "Generar Corte de Caja":
   - Abre modal de configuración:
     * Seleccionar caja (si hay múltiples)
     * Rango de fechas (default: día actual)
     * Turnos a incluir (checkboxes, default: todos)
     * Observaciones generales
   - Vista previa de totales antes de confirmar
   - Botón "Generar Corte"

✅ Modal de Confirmación/Resumen:
   - Mostrar desglose completo:
     * Período cubierto
     * Número de turnos incluidos
     * Número de transacciones
     * Total por método de pago
     * Total general
   - Opción de imprimir resumen
   - Botón "Confirmar y Guardar"

✅ Listado de cortes anteriores:
   - Tabla con columnas:
     * Folio/Número de corte
     * Fecha de generación
     * Caja
     * Usuario que generó
     * Total
     * Estado (cerrado/reabierto)
   - Acciones por fila:
     * Ver detalle
     * Imprimir
     * Reabrir (con validación)

✅ Detalle de corte individual:
   - Información completa del corte
   - Lista de ventas incluidas
   - Desglose por turno
   - Gráfica de métodos de pago (opcional)
```

**Diseño sugerido:**
```
┌──────────────────────────────────────────────┐
│  📊 CORTE DE CAJA                            │
├──────────────────────────────────────────────┤
│                                              │
│  [📄 Generar Nuevo Corte]                    │
│                                              │
├──────────────────────────────────────────────┤
│  CORTES ANTERIORES                           │
│  ┌────────────────────────────────────────┐  │
│  │ #CORTE-001 | 15/Jan/2025 | Caja 1      │  │
│  │ 👤 Juan Pérez | 💰 $15,430.00          │  │
│  │ [Ver] [Imprimir] [Reabrir]             │  │
│  ├────────────────────────────────────────┤  │
│  │ #CORTE-002 | 14/Jan/2025 | Caja 1      │  │
│  │ 👤 María González | 💰 $14,200.00      │  │
│  │ [Ver] [Imprimir] [Reabrir]             │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘

// Modal de Generar Corte:
┌──────────────────────────────────────────────┐
│  📄 GENERAR CORTE DE CAJA                    │
├──────────────────────────────────────────────┤
│                                              │
│  Caja: [Caja Principal ▼]                    │
│  Fecha inicio: [15/Jan/2025 00:00]           │
│  Fecha fin:   [15/Jan/2025 23:59]            │
│                                              │
│  Turnos a incluir:                           │
│  ☑ Turno #45 - María (09:00-13:32)          │
│  ☑ Turno #44 - Juan (06:00-09:00)           │
│                                              │
│  ─────────────────────────────────────────   │
│  VISTA PREVIA:                               │
│  Transacciones: 45                           │
│  Efectivo: $8,200.00                         │
│  Tarjeta: $5,500.00                          │
│  Transferencia: $1,730.00                    │
│  ─────────────────────────────────────────   │
│  TOTAL: $15,430.00                           │
│                                              │
│  Observaciones: [_________________________]  │
│                                              │
│  [Cancelar]  [✅ Confirmar Corte]            │
└──────────────────────────────────────────────┘
```

---

### 4.4 Validación de Superior

#### Componente: `ModalValidacionSuperior` o `SupervisorAuthModal`

**Props esperadas:**
```javascript
{
  isOpen: boolean,
  accion_requerida: string,
  onValidar: function(password),
  onCancel: function
}
```

**Funcionalidades:**
```
✅ Modal de seguridad:
   - Título claro de la acción requerida
   - Explicación de por qué se necesita autorización
   - Input de contraseña (tipo password)
   - Mensajes de error claros
   - Intentos fallidos (opcional: bloquear después de N intentos)

✅ Acciones que requieren validación:
   - Reabrir corte de caja
   - Reabrir día/turno
   - Cancelar venta ya completada
   - Modificar corte cerrado
   - Cualquier acción "destructiva" o sensible

✅ Logging:
   - Registrar quién autorizó
   - Fecha/hora de autorización
   - Acción autorizada
   - Justificación (si aplica)
```

**Diseño sugerido:**
```
┌──────────────────────────────────────────────┐
│  🔐 AUTORIZACIÓN REQUERIDA                   │
├──────────────────────────────────────────────┤
│                                              │
│  ⚠️ Esta acción requiere autorización        │
│  de un supervisor.                           │
│                                              │
│  Acción: Reabrir Corte #CORTE-001            │
│  Motivo: Corrección de error en captura      │
│                                              │
│  ─────────────────────────────────────────   │
│                                              │
│  Contraseña de supervisor:                   │
│  [●●●●●●●●]                                  │
│                                              │
│  ❗ 3 intentos restantes                      │
│                                              │
│  [Cancelar]  [Autorizar]                     │
│                                              │
└──────────────────────────────────────────────┘
```

---

## ✅ ENTREGABLES ESPERADOS

1. **Componentes principales**
   - `PanelCaja` completo
   - `GestionTurnos` completo
   - `CorteCaja` completo
   - `ModalValidacionSuperior`

2. **Modales secundarios**
   - Modal apertura de caja
   - Modal cierre de caja
   - Modal inicio de turno
   - Modal cierre de turno
   - Modal generar corte
   - Modal detalle de corte

3. **Integración**
   - Conexión con endpoints de backend (Fase 2)
   - Actualización en tiempo real de estados
   - Manejo de errores y loading states

4. **Características UX**
   - Confirmaciones para acciones críticas
   - Feedback visual de estados
   - Notificaciones de éxito/error
   - Prevenir navegación accidental durante procesos

5. **Reportes** (opcionales pero recomendados)
   - Exportar corte a PDF
   - Exportar historial a CSV/Excel
   - Imprimir resumen de turno

---

## 🔍 CONSIDERACIONES TÉCNICAS

### Estados y sincronización:
```javascript
// Importante:
- El estado de caja debe reflejarse en toda la app
- Si se cierra caja, el POS debe bloquearse
- Actualizar dashboard después de cada acción
- Considerar websockets para actualizaciones en tiempo real
```

### Seguridad:
```javascript
// Validaciones críticas:
- Solo usuarios autorizados pueden abrir/cerrar caja
- Password de superior debe validarse en backend
- Logs de auditoría para todas las acciones
- Prevenir múltiples aperturas simultáneas
```

### Performance:
```javascript
// Optimizaciones:
- Cachear datos de historial
- Paginar listados largos
- Lazy load de detalles
- Pre-cargar datos de turno activo
```

### Manejo de errores:
```javascript
// Casos borde:
- ¿Qué pasa si se va la luz durante cierre de caja?
- ¿Qué pasa si hay error de red al guardar corte?
- ¿Cómo recuperar estado inconsistente?
- Timeouts y reintentos automáticos
```

---

## 📝 NOTAS ADICIONALES

- Esta fase es crítica para el control administrativo
- Las validaciones deben ser estrictas pero la UX fluida
- Documentar claramente el flujo de apertura/cierre
- Capacitar usuarios en el proceso correcto
- Considerar impresión automática de reportes

---

## 🔄 CHECKLIST DE VERIFICACIÓN

- [ ] Leído AIContext.md completamente
- [ ] Respondidas todas las preguntas de clarificación
- [ ] Fases 1 y 2 completadas y verificadas
- [ ] Panel de caja funcional (abrir/cerrar)
- [ ] Gestión de turnos completa (iniciar/cerrar)
- [ ] Generación de cortes de caja operativa
- [ ] Validación de superior implementada
- [ ] Reapertura de cortes funcional
- [ ] Historiales visibles y filtrables
- [ ] Probado flujo completo: abrir caja → turno → ventas → corte → cerrar
- [ ] Probado escenario de reapertura con validación
- [ ] Notificaciones configuradas
- [ ] Tests aprobados (si existen)
- [ ] Commit con mensaje descriptivo

---

**IMPORTANTE:** Coordinar estrechamente con la Fase 3 (POS) para asegurar que el estado de caja/turno se refleje correctamente en la interfaz de ventas.
