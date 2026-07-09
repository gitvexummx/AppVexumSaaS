# 📋 BLOQUE 2, FASE 2: Sistema de Tickets

## 🎯 Contexto para la IA
Este documento contiene las instrucciones para implementar la **Fase 5** del proyecto Vexum MX.

### ⚠️ REGLAS CRÍTICAS - LEER PRIMERO
1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto antes de comenzar cualquier trabajo.
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos en `AIContext.md`.
3. Mantener consistencia con el código existente en el proyecto.
4. Usar el stack tecnológico definido en `AIContext.md`.
5. **REQUISITO:** Las Fases 1 y 2 deben estar completas. La Fase 3 puede estar en paralelo.

---

## 📌 OBJETIVO DE ESTA FASE
Implementar un sistema completo de generación y visualización de tickets que incluya:
- Renderizado de tickets en formato HTML/CSS
- Numeración consecutiva automática
- Opciones de impresión directa
- Descarga como PDF (opcional)
- Vista previa desde el POS y desde historial de ventas
- Configuración de datos del negocio

---

## ❓ PREGUNTAS OBLIGATORIAS ANTES DE COMENZAR
**LA IA DEBE HACER ESTAS PREGUNTAS Y ESPERAR RESPUESTA ANTES DE ESCRIBIR CÓDIGO:**

1. ¿Existe alguna librería ya instalada para generación de PDF? (jsPDF, html2pdf, pdfmake, Puppeteer)
2. ¿Se requiere impresión directa a impresoras térmicas específicas?
3. ¿Hay algún formato de ticket ya definido o estandarizado en el negocio?
4. ¿El logo del negocio ya está almacenado en algún lado? ¿En qué formato?
5. ¿Qué ancho de ticket se usará principalmente? (58mm, 80mm, carta)
6. ¿Existe configuración de impuestos ya implementada? ¿Cómo se maneja?
7. ¿Los precios en el ticket deben mostrar impuestos desglosados o incluidos?
8. ¿Hay algún requisito legal específico para los tickets? (leyendas, RFC, etc.)
9. ¿Se necesita código de barras o QR en el ticket?
10. ¿Existe ya un sistema de numeración consecutiva en otro módulo?
11. ¿Cómo se manejan las imágenes en el proyecto? (URLs absolutas, base64, paths relativos)
12. ¿Hay componentes de impresión ya implementados en el proyecto?
13. ¿Se requiere guardar una copia digital del ticket generado?
14. ¿El ticket debe enviarse por email/SMS al cliente? (futuro)
15. ¿Existe plantilla de email o sistema de notificaciones?
16. ¿Qué navegadores deben ser soportados? (importante para window.print())
17. ¿Se necesita modo offline para impresión?
18. ¿Hay requisitos de accesibilidad para el ticket?

---

## 📁 COMPONENTES A CREAR

### 5.1 Renderizado de Ticket HTML

#### Componente: `TicketView` o `ReceiptTemplate`

**Props esperadas:**
```javascript
{
  venta: {
    folio: "A00123",
    fecha: "2025-01-15T14:30:00",
    caja: { nombre: "Caja 1" },
    turno: { numero: 45 },
    vendedor: { nombre: "Juan Pérez" },
    items: [
      {
        nombre: "Coca Cola 600ml",
        cantidad: 2,
        precio_unitario: 18.00,
        subtotal: 36.00,
        impuestos: 5.76,
        total: 41.76
      }
    ],
    subtotal: 450.00,
    impuestos: 72.00,
    total: 522.00,
    pagos: [
      { metodo: "efectivo", monto: 300.00 },
      { metodo: "tarjeta", monto: 222.00 }
    ]
  },
  configuracion: {
    negocio_nombre: "Vexum MX",
    negocio_rfc: "VEX123456789",
    negocio_direccion: "Calle Principal #123",
    negocio_telefono: "55-1234-5678",
    logo_url: "/path/to/logo.png",
    impuestos_activos: true,
    impuesto_porcentaje: 16,
    ticket_mensaje_final: "¡Gracias por su compra!"
  },
  ancho: "58mm|80mm|carta",
  mostrarBotones: boolean
}
```

**Estructura del ticket:**
```
┌─────────────────────────────────┐
│         [LOGO]                  │
│     NOMBRE DEL NEGOCIO          │
│     RFC: XXX-XXX-XXX            │
│     Dirección completa          │
│     Teléfono                    │
│                                 │
│  Folio: A00123                  │
│  Fecha: 15/01/2025 14:30        │
│  Caja: 1  Turno: 45             │
│  Vendedor: Juan Pérez           │
│                                 │
│  ─────────────────────────────  │
│  CANT  DESCRIPCIÓN      TOTAL   │
│  ─────────────────────────────  │
│                                 │
│  2   Coca Cola 600ml   $36.00   │
│      $18.00 c/u                 │
│                                 │
│  1   Papas Lays        $45.00   │
│      $45.00 c/u                 │
│                                 │
│  ─────────────────────────────  │
│         Subtotal: $450.00       │
│         IVA (16%): $72.00       │
│  ═════════════════════════════  │
│         TOTAL: $522.00          │
│  ═════════════════════════════  │
│                                 │
│  FORMA DE PAGO:                 │
│  Efectivo:       $300.00        │
│  Tarjeta:        $222.00        │
│                                 │
│  ─────────────────────────────  │
│    ¡Gracias por su compra!      │
│    Mensaje personalizado        │
│                                 │
│  * * * * * * * * * * * * * * *  │
└─────────────────────────────────┘
```

**Consideraciones de diseño:**
```css
/* Estilos específicos para impresión */
@media print {
  @page {
    size: 58mm auto; /* o 80mm auto */
    margin: 0;
  }
  
  body {
    font-family: 'Courier New', monospace; /* Fuente tipo ticket */
    font-size: 10px;
    line-height: 1.2;
  }
  
  .ticket-container {
    width: 100%;
    max-width: 58mm; /* ajustable */
  }
  
  /* Ocultar elementos no imprimibles */
  .no-print {
    display: none !important;
  }
}
```

**Características requeridas:**
```
✅ Encabezado:
   - Logo centrado (si existe, tamaño máximo 200x50px)
   - Nombre del negocio (negritas, centrado)
   - RFC (si está configurado)
   - Dirección y teléfono (opcional)

✅ Información de venta:
   - Folio consecutivo (grande y visible)
   - Fecha y hora formateadas
   - Número de caja y turno
   - Nombre del vendedor/cajero

✅ Items detallados:
   - Cantidad
   - Descripción del producto
   - Precio unitario
   - Subtotal por línea
   - Salto de línea si descripción es larga

✅ Totales claros:
   - Subtotal
   - Impuestos (desglosados si están activos)
   - Total en grande
   - Líneas separadoras

✅ Métodos de pago:
   - Lista de pagos realizados
   - Monto por cada método
   - Referencias (si existen)

✅ Pie del ticket:
   - Mensaje de agradecimiento
   - Mensaje personalizado de configuración
   - Separador final
   - Leyenda legal (si aplica)
```

---

### 5.2 Modal de Vista Previa

#### Componente: `ModalVistaTicket` o `TicketPreviewModal`

**Funcionalidades:**
```
✅ Mostrar ticket en modal grande:
   - Renderizar componente TicketView
   - Scroll si el ticket es largo
   - Fondo oscuro para resaltar

✅ Botones de acción:
   - [🖨️ Imprimir] - Abre diálogo de impresión nativo
   - [📥 Descargar PDF] - Genera y descarga PDF
   - [✉️ Enviar por email] - Futuro
   - [❌ Cerrar] - Cierra modal

✅ Opciones adicionales (toggle):
   - Cambiar ancho (58mm / 80mm)
   - Mostrar/Ocultar impuestos
   - Vista previa de cómo quedará impreso
```

**Diseño sugerido:**
```
┌──────────────────────────────────────────────┐
│  🎫 VISTA PREVIA DEL TICKET           [×]   │
├──────────────────────────────────────────────┤
│                                              │
│  Ancho: ○ 58mm  ● 80mm  ○ Carta             │
│  [👁️ Ver como imprimir]                     │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │         [LOGO]                         │  │
│  │     VEXUM MX                           │  │
│  │     RFC: VEX123456789                  │  │
│  │                                        │  │
│  │  Folio: A00123                         │  │
│  │  Fecha: 15/01/2025 14:30               │  │
│  │  ... resto del ticket ...              │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [🖨️ Imprimir]  [📥 PDF]  [❌ Cerrar]       │
│                                              │
└──────────────────────────────────────────────┘
```

---

### 5.3 Generación de PDF

#### Función/Service: `generarPDFTicket` o `TicketPDFService`

**Opciones de implementación:**

**Opción A: html2pdf.js** (Recomendada para simplicidad)
```javascript
import html2pdf from 'html2pdf.js';

const generarPDF = async (elementoHTML, opciones) => {
  const opt = {
    margin: 0,
    filename: `ticket-${venta.folio}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: [58, 200], orientation: 'portrait' }
  };
  
  await html2pdf().set(opt).from(elementoHTML).save();
};
```

**Opción B: window.print() con CSS específico** (Más simple, sin librerías)
```javascript
const imprimirTicket = () => {
  const contenido = document.getElementById('ticket-content');
  const ventana = window.open('', '_blank');
  ventana.document.write(contenido.innerHTML);
  ventana.document.close();
  ventana.print();
};
```

**Opción C: Librerías más avanzadas** (pdfmake, Puppeteer para backend)
- Más control sobre el PDF
- Mejor calidad
- Más complejo de implementar

**Recomendación:** Iniciar con Opción B (window.print) y agregar Opción A si se requiere PDF descargable.

---

### 5.4 Numeración Consecutiva

#### Service/Helper: `generarFolio` o `ConsecutiveNumberService`

**Lógica de generación:**
```javascript
/**
 * Genera folio consecutivo por caja
 * Formato configurable: {prefijo}{numero}{padding}
 * Ejemplos: A0001, B0001, FAC-00001
 */
const generarFolio = async (caja_id) => {
  // 1. Obtener último folio usado por esta caja
  const ultimaVenta = await obtenerUltimaVentaPorCaja(caja_id);
  
  // 2. Extraer número del último folio
  const ultimoNumero = extraerNumeroFolio(ultimaVenta?.folio);
  
  // 3. Incrementar
  const nuevoNumero = ultimoNumero + 1;
  
  // 4. Obtener configuración de formato
  const config = await obtenerConfiguracion('ticket_folio_formato');
  const prefijo = config?.prefijo || '';
  const padding = config?.padding || 4;
  
  // 5. Formatear
  const folio = `${prefijo}${nuevoNumero.toString().padStart(padding, '0')}`;
  
  return folio;
};
```

**Consideraciones:**
```
- El folio debe generarse en transacción para evitar duplicados
- Considerar concurrencia (dos ventas al mismo tiempo)
- Posible usar secuencias de BD si el motor lo soporta
- Permitir reinicio de folios por día/mes (configurable)
- Validar que no existan huecos en la numeración
```

---

### 5.5 Integración con Ventas

#### Modificaciones al flujo de venta:

**En el backend (ya debería estar en Fase 2):**
```javascript
// POST /api/ventas/:id/ticket
// Retorna datos formateados para ticket
{
  "venta": {...},
  "items": [...],
  "pagos": [...],
  "configuracion": {...},
  "ticket_url": "/api/ventas/:id/ticket/html"
}
```

**En el frontend (Fase 3 - POS Mejorado):**
```javascript
// Después de completar pago:
const handleVentaExitosa = async (ventaId) => {
  // Obtener datos del ticket
  const ticketData = await api.get(`/ventas/${ventaId}/ticket`);
  
  // Mostrar modal con opciones
  mostrarModalVentaExitosa({
    folio: ticketData.venta.folio,
    total: ticketData.venta.total,
    acciones: {
      verTicket: () => abrirVistaTicket(ticketData),
      imprimirTicket: () => imprimirTicketDirecto(ticketData),
      nuevaVenta: () => limpiarCarrito(),
      verDetalles: () => abrirDetalleVenta(ventaId)
    }
  });
};
```

---

## ✅ ENTREGABLES ESPERADOS

1. **Componentes React/Vue/Angular**
   - `TicketView` - Plantilla principal de ticket
   - `ModalVistaTicket` - Modal de vista previa
   - `BotonImprimir` - Componente reutilizable de impresión

2. **Servicios/Utilidades**
   - `generarPDFTicket` - Función para generar PDF
   - `imprimirDirecto` - Función para impresión nativa
   - `generarFolio` - Servicio de numeración consecutiva

3. **Estilos CSS**
   - Hoja de estilos específica para impresión
   - Media queries para diferentes anchos de ticket
   - Clases utilitarias para formato de ticket

4. **Configuración**
   - Endpoint para obtener configuración de tickets
   - Seeder para valores por defecto
   - Interfaz para actualizar configuración (Fase 7)

5. **Integración**
   - Conexión con flujo de ventas (Fase 3)
   - Conexión con historial de ventas
   - Endpoint de ticket funcional

---

## 🔍 CONSIDERACIONES TÉCNICAS

### Impresión:
```javascript
// Retos comunes:
- Diferentes navegadores manejan print() diferente
- Impresoras térmicas pueden tener márgenes distintos
- Algunos navegadores bloquean popups de impresión
- Solución: Usar ventana emergente con contenido limpio
```

### PDF:
```javascript
// Calidad vs Complejidad:
- html2pdf es fácil pero puede perder calidad
- pdfmake da más control pero requiere aprender su API
- Puppeteer en backend da mejor resultado pero es más pesado
- Recomendación: Empezar simple, mejorar después
```

### Performance:
```javascript
// Optimizaciones:
- No generar PDF hasta que usuario lo solicite
- Cachear configuración de ticket
- Lazy load de logo/imágenes
- Minimizar DOM para impresión rápida
```

### Accesibilidad:
```javascript
// Consideraciones:
- El ticket impreso no necesita accesibilidad web
- Pero la vista previa SÍ debe ser accesible
- Labels ARIA para botones de impresión
- Texto alternativo para logo
```

---

## 📝 NOTAS ADICIONALES

- Probar impresión en impresora térmica real si es posible
- El formato de 58mm es más común en negocios pequeños
- Considerar que algunos usuarios no tienen impresora
- El PDF descargable sirve como respaldo digital
- Documentar cómo configurar logo y datos del negocio

---

## 🔄 CHECKLIST DE VERIFICACIÓN

- [ ] Leído AIContext.md completamente
- [ ] Respondidas todas las preguntas de clarificación
- [ ] Fases 1 y 2 completadas y verificadas
- [ ] Componente TicketView renderiza correctamente
- [ ] Estilos de impresión funcionan en Chrome/Firefox
- [ ] Modal de vista previa operativo
- [ ] Impresión directa funciona (window.print)
- [ ] Generación de PDF funcional (si se implementa)
- [ ] Numeración consecutiva sin duplicados
- [ ] Integrado con flujo de ventas (Fase 3)
- [ ] Datos de configuración se aplican correctamente
- [ ] Logo se muestra si está configurado
- [ ] Impuestos se muestran según configuración
- [ ] Probado con datos reales de venta
- [ ] Commit con mensaje descriptivo

---

**IMPORTANTE:** Esta fase depende de que las ventas estén completamente implementadas. Coordinar con el equipo de la Fase 3 para la integración del flujo post-cobro.
