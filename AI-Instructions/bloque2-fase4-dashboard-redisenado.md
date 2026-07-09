# 📋 BLOQUE 2, FASE 4: Dashboard Rediseñado

## 🎯 Contexto para la IA
Este documento contiene las instrucciones para implementar la **Fase 6** del proyecto Vexum MX.

### ⚠️ REGLAS CRÍTICAS - LEER PRIMERO
1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto antes de comenzar cualquier trabajo.
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos en `AIContext.md`.
3. Mantener consistencia con el código existente en el proyecto.
4. Usar el stack tecnológico definido en `AIContext.md`.
5. **REQUISITO:** Las Fases 1, 2 y preferentemente 3 deben estar completas para tener datos reales.

---

## 📌 OBJETIVO DE ESTA FASE
Actualizar el dashboard existente para mostrar información basada en el nuevo sistema de cajas/turnos, incluyendo:
- Métricas filtrables por turno/caja/día
- Estado actual de caja y turno
- Tabla de ventas rediseñada con más información
- Gráficas actualizadas (si existen)
- Acceso rápido a funciones de corte de caja

---

## ❓ PREGUNTAS OBLIGATORIAS ANTES DE COMENZAR
**LA IA DEBE HACER ESTAS PREGUNTAS Y ESPERAR RESPUESTA ANTES DE ESCRIBIR CÓDIGO:**

1. ¿Cómo está estructurado el dashboard actualmente? (componentes, archivos)
2. ¿Qué librería de gráficas se usa? (Chart.js, Recharts, ApexCharts, D3, ninguna)
3. ¿Existe ya un sistema de filtros de fechas en el dashboard?
4. ¿Hay tarjetas/stat cards existentes que puedan reutilizarse?
5. ¿Cómo se muestra la tabla de "Últimas ventas" actualmente?
6. ¿El dashboard tiene actualización en tiempo real o requiere recargar?
7. ¿Existe un layout establecido para el dashboard? (grid, flex, CSS grid)
8. ¿Hay roles de usuario que deban ver diferente información en el dashboard?
9. ¿Se requiere exportar datos del dashboard? (CSV, PDF, Excel)
10. ¿El dashboard actual consume APIs específicas? ¿Cuáles?
11. ¿Hay caching implementado para las consultas del dashboard?
12. ¿Existe un componente de selector de rango de fechas?
13. ¿Se muestran comparativas con periodos anteriores? (ej: vs semana pasada)
14. ¿Hay límites de datos a mostrar? (ej: máximo 100 ventas en tabla)
15. ¿El dashboard debe ser responsive para móviles/tablets?
16. ¿Existe modo oscuro/claro que deba respetarse?
17. ¿Hay métricas personalizadas ya definidas por el usuario?
18. ¿Se necesita drill-down en las gráficas? (click para ver detalle)

---

## 📁 COMPONENTES A MODIFICAR/CREAR

### 6.1 Tarjetas de Métricas Principales

#### Componente existente a modificar: `StatCard` o similar

**Nuevas métricas a mostrar:**

**1. Total Vendido (configurable)**
```javascript
{
  titulo: "Total Vendido",
  valor: "$15,430.00",
  subtitulo: "Turno #45 - Caja 1",
  periodo: "15/Jan/2025 09:00 - 14:32",
  icono: "💰",
  color: "verde",
  tooltip: "Click para cambiar periodo"
}
```

**2. Ventas del Día/Turno**
```javascript
{
  titulo: "Ventas Hoy",
  valor: "45",
  subtitulo: "Transacciones",
  comparativa: "+12% vs ayer",
  icono: "📦",
  color: "azul"
}
```

**3. Ticket Promedio**
```javascript
{
  titulo: "Ticket Promedio",
  valor: "$342.89",
  subtitulo: "Por transacción",
  comparativa: "+$23.50 vs ayer",
  icono: "🎫",
  color: "morado"
}
```

**4. Producto Más Vendido**
```javascript
{
  titulo: "Producto Estrella",
  valor: "Coca Cola 600ml",
  subtitulo: "150 unidades vendidas",
  ingresos: "$2,700.00",
  icono: "⭐",
  color: "naranja"
}
```

**5. Estado de Caja (NUEVA)**
```javascript
{
  titulo: "Estado de Caja",
  valor: "🟢 Abierta",
  subtitulo: "Caja Principal",
  turno: "Turno #45 - María G.",
  tiempo_transcurrido: "4h 32min",
  icono: "🏦",
  color: "dinámico (verde=abierta, rojo=cerrada)",
  acciones: ["Ver detalle", "Cerrar caja"]
}
```

**6. Desglose por Método de Pago (NUEVA o ampliada)**
```javascript
{
  titulo: "Pagos por Método",
  datos: [
    { metodo: "Efectivo", monto: "$8,200", porcentaje: 53 },
    { metodo: "Tarjeta", monto: "$5,500", porcentaje: 36 },
    { metodo: "Transferencia", monto: "$1,730", porcentaje: 11 }
  ],
  icono: "💳",
  color: "gris"
}
```

---

### 6.2 Selector de Periodo

#### Componente: `SelectorPeriodo` o `DateRangePicker`

**Funcionalidades:**
```
✅ Opciones predefinidas:
   - Turno Actual
   - Hoy
   - Ayer
   - Esta Semana
   - Semana Pasada
   - Este Mes
   - Mes Pasado
   - Personalizado

✅ Selector personalizado:
   - Fecha inicio
   - Fecha fin
   - Botón "Aplicar"
   - Botón "Cancelar"

✅ Selector de contexto:
   - Caja específica o todas
   - Turno específico o todos
   - Usuario específico o todos

✅ Persistencia:
   - Recordar última selección
   - Guardar en URL params (opcional)
   - Resetear al cerrar sesión
```

**Diseño sugerido:**
```
┌──────────────────────────────────────────────┐
│  📅 Periodo: [Hoy ▼]                         │
├──────────────────────────────────────────────┤
│  Opciones rápidas:                           │
│  [Turno Actual] [Hoy] [Ayer]                 │
│  [Esta Semana] [Este Mes]                    │
│                                              │
│  ─────────────────────────────────────────   │
│  Personalizado:                              │
│  Del: [15/Jan/2025] Al: [15/Jan/2025]       │
│                                              │
│  Filtros adicionales:                        │
│  Caja: [Todas ▼]                             │
│  Turno: [Todos ▼]                            │
│  Vendedor: [Todos ▼]                         │
│                                              │
│  [Cancelar]  [Aplicar Filtros]               │
└──────────────────────────────────────────────┘
```

---

### 6.3 Tabla de Ventas Rediseñada

#### Componente: `TablaVentas` o `SalesTable`

**Columnas requeridas:**
```
| Folio | Fecha/Hora | Caja | Turno | Vendedor | Items | Total | Pagos | Estado | Acciones |
```

**Detalle de columnas:**

**Folio:**
```javascript
{
  campo: 'folio',
  header: 'Folio',
  render: (folio) => <Badge>{folio}</Badge>,
  sortable: true,
  clickable: true // abre detalle/ticket
}
```

**Fecha/Hora:**
```javascript
{
  campo: 'creada_en',
  header: 'Fecha',
  render: (fecha) => format(fecha, 'dd/MMM HH:mm'),
  sortable: true
}
```

**Caja:**
```javascript
{
  campo: 'caja.nombre',
  header: 'Caja',
  render: (nombre) => <Chip>{nombre}</Chip>,
  filterable: true
}
```

**Turno:**
```javascript
{
  campo: 'turno.numero',
  header: 'Turno',
  render: (numero) => `#${numero}`,
  filterable: true
}
```

**Vendedor:**
```javascript
{
  campo: 'usuario.nombre',
  header: 'Vendedor',
  filterable: true
}
```

**Items:**
```javascript
{
  campo: 'items_count',
  header: 'Items',
  render: (count) => `${count} prod.`,
  align: 'center'
}
```

**Total:**
```javascript
{
  campo: 'total',
  header: 'Total',
  render: (monto) => formatCurrency(monto),
  sortable: true,
  align: 'right',
  style: { fontWeight: 'bold' }
}
```

**Pagos:**
```javascript
{
  campo: 'pagos',
  header: 'Pagos',
  render: (pagos) => (
    <div>
      {pagos.map(p => (
        <IconTooltip metodo={p.metodo} monto={p.monto} />
      ))}
    </div>
  )
}
// Ejemplo visual: 💵$200 💳$150
```

**Estado:**
```javascript
{
  campo: 'estado',
  header: 'Estado',
  render: (estado) => (
    <Badge color={colores[estado]}>
      {estado}
    </Badge>
  ),
  filterable: true
}
// completada = verde, cancelada = rojo, pendiente = amarillo
```

**Acciones:**
```javascript
{
  campo: 'acciones',
  header: '',
  render: (venta) => (
    <Dropdown>
      <Item onClick={() => verTicket(venta)}>🎫 Ver Ticket</Item>
      <Item onClick={() => verDetalle(venta)}>📋 Detalles</Item>
      <Item onClick={() => reimprimir(venta)}>🖨️ Reimprimir</Item>
      {puedeCancelar && (
        <Item onClick={() => cancelar(venta)} className="danger">
          ❌ Cancelar
        </Item>
      )}
    </Dropdown>
  )
}
```

**Características adicionales:**
```
✅ Paginación: 10/25/50/100 registros por página
✅ Ordenamiento: Click en headers para ordenar
✅ Filtros: Por columna (búsqueda rápida)
✅ Exportar: Botón para descargar CSV/Excel
✅ Selección múltiple: Checkboxes para acciones bulk
✅ Resaltado: Filas hover, fila nueva reciente
✅ Responsive: Scroll horizontal en móviles
```

---

### 6.4 Gráficas (opcionales pero recomendadas)

#### Componente: `GraficaVentas` o `SalesChart`

**Tipos de gráficas sugeridas:**

**1. Ventas por Hora (línea o barras)**
```javascript
// Muestra cuándo hay más ventas durante el día
data: [
  { hora: '09:00', ventas: 5, monto: 1500 },
  { hora: '10:00', ventas: 12, monto: 4200 },
  { hora: '11:00', ventas: 8, monto: 2800 },
  ...
]
```

**2. Ventas por Día (barras)**
```javascript
// Comparativa de últimos 7-30 días
data: [
  { dia: 'Lun', ventas: 45, monto: 15430 },
  { dia: 'Mar', ventas: 52, monto: 18200 },
  ...
]
```

**3. Métodos de Pago (pastel o dona)**
```javascript
// Distribución porcentual
data: [
  { name: 'Efectivo', value: 53 },
  { name: 'Tarjeta', value: 36 },
  { name: 'Transferencia', value: 11 }
]
```

**4. Productos Más Vendidos (barras horizontales)**
```javascript
// Top 5-10 productos
data: [
  { producto: 'Coca Cola', cantidad: 150, ingresos: 2700 },
  { producto: 'Papas Lays', cantidad: 85, ingresos: 3825 },
  ...
]
```

**Interactividad:**
```
- Tooltip al hover con detalles
- Click para filtrar por ese periodo/producto
- Leyenda interactiva (mostrar/ocultar series)
- Zoom/pan para periodos largos
- Exportar gráfica como imagen
```

---

### 6.5 Panel de Estado de Caja (NUEVO)

#### Componente: `PanelEstadoCaja` o `CashRegisterStatus`

**Ubicación sugerida:** Sidebar derecho o sección destacada del dashboard

**Contenido:**
```
┌──────────────────────────────────────────────┐
│  🏦 ESTADO DE CAJA                           │
├──────────────────────────────────────────────┤
│                                              │
│  Caja Principal                              │
│  Estado: 🟢 ABIERTA                          │
│                                              │
│  👤 Cajero: María González                   │
│  🔄 Turno: #45                               │
│  ⏱️ Tiempo: 4h 32min                         │
│                                              │
│  ─────────────────────────────────────────   │
│  Saldo Inicial:     $1,000.00                │
│  Ventas del turno:  $8,450.00                │
│  ─────────────────────────────────────────   │
│  Saldo Esperado:    $9,450.00                │
│                                              │
│  [📊 Ver Corte]  [🔒 Cerrar Caja]            │
│                                              │
├──────────────────────────────────────────────┤
│  PRÓXIMOS TURNOS                             │
│  ┌────────────────────────────────────────┐  │
│  │ Juan Pérez - 02:00 PM - 10:00 PM       │  │
│  │ Ana López - Mañana 06:00 AM            │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## ✅ ENTREGABLES ESPERADOS

1. **Componentes modificados**
   - StatCards actualizados con nuevas métricas
   - Tabla de ventas rediseñada
   - Selector de periodo funcional

2. **Componentes nuevos**
   - PanelEstadoCaja
   - SelectorPeriodo (si no existe)
   - Gráficas actualizadas (si aplican)

3. **Integración**
   - Conexión con endpoints de dashboard (Fase 2)
   - Actualización automática de datos
   - Filtros funcionando correctamente

4. **UX/UI**
   - Loading states mientras cargan datos
   - Empty states cuando no hay datos
   - Error states manejados adecuadamente
   - Animaciones suaves de transición

5. **Performance**
   - Caché de datos del dashboard
   - Virtualización de tabla si hay muchos datos
   - Lazy load de gráficas

---

## 🔍 CONSIDERACIONES TÉCNICAS

### Actualización de datos:
```javascript
// Opciones:
- Polling cada X segundos (simple)
- Websockets para tiempo real (avanzado)
- Refrescar al enfocar ventana
- Botón manual de refrescar
```

### Manejo de errores:
```javascript
// Casos a considerar:
- API devuelve error → mostrar mensaje amigable
- Datos vacíos → mostrar empty state informativo
- Timeout → reintentar automáticamente
- Sin conexión → mostrar estado offline
```

### Performance:
```javascript
// Optimizaciones:
- No cargar todas las gráficas de una vez
- Usar skeleton screens mientras carga
- Limitar datos iniciales (paginación)
- Cachear respuestas de API
```

### Accesibilidad:
```javascript
// Consideraciones:
- Labels ARIA para gráficas
- Tablas con headers apropiados
- Contraste de colores adecuado
- Navegación con teclado
```

---

## 📝 NOTAS ADICIONALES

- El dashboard es la cara visible del sistema para gerentes
- Priorizar claridad sobre cantidad de información
- Permitir personalización básica (qué métricas mostrar)
- Documentar cómo interpretar cada métrica
- Considerar impresión del dashboard para reportes

---

## 🔄 CHECKLIST DE VERIFICACIÓN

- [ ] Leído AIContext.md completamente
- [ ] Respondidas todas las preguntas de clarificación
- [ ] Fases 1 y 2 completadas y verificadas
- [ ] Métricas principales mostrando datos correctos
- [ ] Selector de periodo funcional
- [ ] Tabla de ventas rediseñada operativa
- [ ] Panel de estado de caja implementado
- [ ] Filtros por caja/turno/usuario funcionando
- [ ] Gráficas actualizadas (si aplican)
- [ ] Loading/error/empty states implementados
- [ ] Performance aceptable con datos reales
- [ ] Responsive design verificado
- [ ] Tests aprobados (si existen)
- [ ] Commit con mensaje descriptivo

---

**IMPORTANTE:** Esta fase consume datos de todas las fases anteriores. Asegurar que haya datos de prueba reales (ventas, turnos, cortes) para verificar correcto funcionamiento.
