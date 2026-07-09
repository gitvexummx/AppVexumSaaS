# 📚 Instrucciones para IA - Vexum MX POS

## 🎯 Descripción
Esta carpeta contiene la documentación detallada por fases para implementar las mejoras del sistema Vexum MX POS. Cada archivo está diseñado para ser leído por una IA y guiar la implementación de cada fase del proyecto.

---

## ⚠️ INSTRUCCIONES CRÍTICAS PARA LA IA

### ANTES DE COMENZAR CUALQUIER FASE:

1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos
3. Mantener consistencia con el código existente
4. Usar el stack tecnológico definido en AIContext.md

### AL INICIAR CADA FASE:

5. **LEER** el archivo de la fase correspondiente (ej: `fase-1-modelo-datos-migraciones.md`)
6. **HACER TODAS LAS PREGUNTAS** listadas en la sección "PREGUNTAS OBLIGATORIAS"
7. **ESPERAR RESPUESTAS** antes de escribir cualquier código
8. **VERIFICAR** que las fases prerequisites estén completas

---

## 📁 Fases Disponibles

| Fase | Archivo | Descripción | Prerrequisitos |
|------|---------|-------------|----------------|
| 1 | `fase-1-modelo-datos-migraciones.md` | Creación de tablas para ventas, pagos, cajas, turnos y cortes | Ninguno |
| 2 | `fase-2-backend-api-ventas-pagos.md` | Endpoints API para gestión de ventas, pagos, cajas y dashboard | Fase 1 completa |
| 3 | `fase-3-frontend-pos-mejorado.md` | POS con scanner, pagos mixtos, carrito mejorado | Fases 1-2 completas |
| 4 | `fase-4-frontend-cajas-turnos.md` | Interfaz para gestión de cajas, turnos y cortes | Fases 1-2 completas |
| 5 | `fase-5-sistema-tickets.md` | Generación e impresión de tickets | Fases 1-2 completas |
| 6 | `fase-6-dashboard-redisenado.md` | Dashboard actualizado con métricas de turno/caja | Fases 1-3 preferentemente |
| 7 | `fase-7-configuracion-preferencias.md` | Panel de configuración del sistema | Fases avanzadas |
| 8 | `fase-8-pruebas-documentacion.md` | Tests, documentación y optimización | Fases 1-7 completas |

---

## 🔄 Orden Sugerido de Implementación

```
FASE 1 → FASE 2 → FASE 3 → FASE 5 → FASE 4 → FASE 6 → FASE 7 → FASE 8
                    ↓
              (Fase 4 y 5 pueden ser en paralelo)
```

### Justificación del orden:
1. **Fase 1**: Sin modelo de datos no hay nada más que hacer
2. **Fase 2**: El backend debe estar listo para que el frontend consuma
3. **Fase 3**: El POS es el core del sistema - priorizar
4. **Fase 5**: Los tickets dependen de ventas pero son independientes de cajas/turnos
5. **Fase 4**: Gestión administrativa puede hacerse en paralelo con tickets
6. **Fase 6**: El dashboard necesita datos reales de las fases anteriores
7. **Fase 7**: Configuración puede hacerse cuando ya se conoce el sistema
8. **Fase 8**: Testing y documentación siempre al final (o incrementalmente)

---

## 📋 Estructura de Cada Documento de Fase

Cada archivo de fase contiene:

1. **Contexto para la IA** - Recordatorio de reglas críticas
2. **Objetivo de la Fase** - Qué se debe lograr
3. **Preguntas Obligatorias** - Lista de preguntas que la IA DEBE hacer antes de codificar
4. **Componentes a Crear/Modificar** - Detalle técnico de lo que se requiere
5. **Entregables Esperados** - Checklist de lo que debe quedar completo
6. **Consideraciones Técnicas** - Patrones, validaciones, performance, seguridad
7. **Notas Adicionales** - Consejos y advertencias importantes
8. **Checklist de Verificación** - Para confirmar que todo está completo

---

## 🎯 Requerimientos Principales del Proyecto

### 1. Atajos de Escáner
- Listener permanente en POS que detecte códigos de barras
- Soporte para escáneres tipo "pistola" que emiten teclado + enter
- Tecla modificadora para consulta rápida de precio (sin agregar al carrito)

### 2. Pagos Mixtos
- Permitir combinar efectivo + tarjeta + transferencia en una sola venta
- Validar que suma de pagos = total de venta
- Registrar desglose de cuánto se pagó con cada método

### 3. Corte de Caja
- Sistema de turnos por empleado
- Apertura/cierre de caja con saldos
- Cortes de caja con resumen de ventas del periodo
- Reapertura de cortes con validación de supervisor (password)

### 4. Generación de Tickets
- Tickets HTML/CSS imprimibles
- Numeración consecutiva automática
- Incluir: logo, RFC, items, totales, métodos de pago, folio, fecha
- Opción de vista previa y descarga PDF

---

## 🔑 Conceptos Clave

### Cajas y Turnos
```
┌─────────────────────────────────────────┐
│ CAJA (física/punto de venta)            │
│   └── TURNO 1 (empleado A, 6am-2pm)     │
│   └── TURNO 2 (empleado B, 2pm-10pm)    │
│   └── TURNO 3 (empleado C, 10pm-6am)    │
│                                          │
│ CORTE DE CAJA = Resumen de N turnos     │
└─────────────────────────────────────────┘
```

### Flujo de Venta
```
1. Abrir caja (saldo inicial)
2. Iniciar turno (empleado se asigna)
3. Escanear productos → Carrito
4. Cobrar → Modal pagos mixtos
5. Registrar pagos → Completar venta
6. Imprimir ticket
7. Cerrar turno (resumen)
8. Generar corte (múltiples turnos)
9. Cerrar caja (cuadre final)
```

### Estados de Venta
```
PENDIENTE → En proceso de pago
COMPLETADA → Pagada totalmente
CANCELADA → Revertida (con autorización)
```

---

## 🛠️ Stack Tecnológico

**Ver AIContext.md para detalles específicos**

El stack debe incluir:
- Frontend framework (React/Vue/Angular)
- Backend framework (Node.js/Express/NestJS)
- Base de datos relacional (MySQL/PostgreSQL)
- ORM (Sequelize/Prisma/TypeORM)
- Librería de testing (Jest/Cypress/Playwright)

---

## 📞 Flujo de Trabajo con IA

### Para el Usuario Humano:
1. Asignar una fase específica a la IA
2. Proporcionar contexto adicional si es necesario
3. Responder todas las preguntas de clarificación
4. Revisar el código generado
5. Probar en entorno local
6. Dar feedback para ajustes

### Para la IA:
1. Leer AIContext.md primero
2. Leer el documento de fase asignado
3. Hacer TODAS las preguntas de clarificación
4. Esperar respuestas completas
5. Implementar siguiendo especificaciones
6. Verificar checklist antes de entregar
7. Documentar desviaciones o decisiones técnicas

---

## ⚡ Comandos Útiles (por definir según stack)

```bash
# Instalación
npm install

# Migraciones
npm run migrate
npm run migrate:rollback

# Seeds
npm run seed

# Desarrollo
npm run dev

# Tests
npm run test
npm run test:coverage
npm run test:e2e

# Build
npm run build
```

---

## 📝 Notas Importantes

1. **Cada fase debe ser independiente y probada** antes de continuar a la siguiente
2. **Las preguntas de clarificación son obligatorias** - no asumir nada
3. **El código debe seguir patrones existentes** en el proyecto
4. **La documentación es parte del entregable** - no solo el código
5. **Los tests son críticos** - especialmente para flujos de venta y pagos
6. **Probar con hardware real** (escáner, impresora térmica) cuando sea posible
7. **Mantener comunicación constante** sobre bloqueos o decisiones técnicas

---

## 🚀 Para Comenzar

Si eres la IA asignada a este proyecto:

1. **Primero:** Lee `/workspace/AIContext.md` completamente
2. **Segundo:** Identifica qué fase te fue asignada
3. **Tercero:** Abre el archivo de esa fase (ej: `fase-1-modelo-datos-migraciones.md`)
4. **Cuarto:** Haz TODAS las preguntas de la sección "PREGUNTAS OBLIGATORIAS"
5. **Quinto:** Espera las respuestas antes de escribir código
6. **Sexto:** Implementa siguiendo las especificaciones
7. **Séptimo:** Verifica el checklist de verificación
8. **Octavo:** Entrega el trabajo con commit descriptivo

---

## 📞 Contacto y Soporte

Para dudas sobre los requerimientos del negocio, consultar directamente con el usuario/product owner.

Para dudas técnicas, revisar:
- AIContext.md (reglas del proyecto)
- Documentación existente en `/docs` (si existe)
- Código existente como referencia de patrones

---

**Última actualización:** Enero 2025  
**Versión del plan:** 1.0  
**Proyecto:** Vexum MX POS System
