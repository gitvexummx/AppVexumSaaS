# 📚 Instrucciones para IA - Vexum MX POS
	
## 🎯 Descripción
Esta carpeta contiene la documentación detallada por fases para implementar las mejoras del sistema Vexum MX POS. Cada archivo está diseñado para ser leído por una IA y guiar la implementación de cada fase del proyecto. Está dividida en bloques con fases cada uno.

---

## ⚠️ INSTRUCCIONES CRÍTICAS PARA LA IA

### ANTES DE COMENZAR CUALQUIER FASE:

1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos
3. Mantener consistencia con el código existente
4. Usar el stack tecnológico definido en AIContext.md
5. **NUNCA INSTALAR DEPENDENCIAS**

### AL INICIAR CADA FASE:

1. **LEER** el archivo de la fase correspondiente (ej: `fase-1-modelo-datos-migraciones.md`)
2. **HACER TODAS LAS PREGUNTAS** listadas en la sección "PREGUNTAS OBLIGATORIAS"
3. **ESPERAR RESPUESTAS** antes de escribir cualquier código
4. **VERIFICAR** que las fases prerequisites estén completas

---

## 📁 Fases Disponibles

|Bloque|   Fase  | Descripción | Prerrequisitos |
|------|---------|-------------|----------------|
|  1   |    1    |           |                 |
|------|---------|-------------|----------------|
|  1   |    2    |           |                 |
|------|---------|-------------|----------------|
|  1   |    3    |           |                 |
|------|---------|-------------|----------------|
|  2   |    1    |           |                 |
|------|---------|-------------|----------------|
|  2   |    2    |           |                 |
|------|---------|-------------|----------------|
|  2   |    3    |           |                 |
|------|---------|-------------|----------------|
|  2   |    4    |           |                 |
|------|---------|-------------|----------------|
|  3   |    1    |           |                 |
|------|---------|-------------|----------------|
|  3   |    2    |           |                 |
|------|---------|-------------|----------------|
|  4   |    1    |           |                 |
|------|---------|-------------|----------------|
|  4   |    2    |           |                 |
|------|---------|-------------|----------------|
|  4   |    3    |           |                 |
|------|---------|-------------|----------------|
|  4   |    4    |           |                 |
|------|---------|-------------|----------------|
|  4   |    5    |           |                 |
|------|---------|-------------|----------------|
|  5   |    1    |           |                 |
|------|---------|-------------|----------------|
|  5   |    2    |           |                 |
|------|---------|-------------|----------------|
|  5   |    3    |           |                 |
|------|---------|-------------|----------------|
|  5   |    4    |           |                 |
|------|---------|-------------|----------------|
|  6   |    1    |           |                 |
|------|---------|-------------|----------------|
|  6   |    2    |           |                 |
|------|---------|-------------|----------------|
|  6   |    3    |           |                 |
|------|---------|-------------|----------------|
|  7   |    1    |           |                 |
|------|---------|-------------|----------------|
|  7   |    2    |           |                 |
|------|---------|-------------|----------------|
|  7   |    3    |           |                 |
|------|---------|-------------|----------------|
|  7   |    4    |           |                 |
|------|---------|-------------|----------------|


---


## 🔄 Orden Sugerido de Implementación


BLOQUE 1 → BLOQUE 2 → BLOQUE 3 → BLOQUE 4 → BLOQUE 5 → BLOQUE 6 → BLOQUE 7 → BLOQUE 8

**IMPLEMENTAR EN ORDEN**

### Justificación del orden:
1. El modelo de datos y migraciones debe ser lo primero porque define la estructura fundamental sobre la cual se construye todo lo demás; sin una base de datos bien diseñada, nada funciona.
2. La gestión multi-sucursal, roles y usuarios sigue inmediatamente porque define quién puede hacer qué y en qué contexto operativo, estableciendo las reglas de acceso antes de implementar funcionalidades de negocio.
3. La API backend de ventas y pagos se implementa temprano para tener los endpoints básicos listos antes de construir el frontend del POS, siguiendo una arquitectura backend-first que facilita el desarrollo paralelo.
4. El frontend del POS es el corazón operativo del sistema y debe desarrollarse después de tener la API lista para poder consumir los endpoints desde el primer día de desarrollo frontend.
5. La gestión de cajas y turnos debe preceder al sistema de tickets porque cada ticket necesita estar asociado a una caja y turno específicos; sin este contexto, los tickets carecen de trazabilidad operativa.
6. El sistema de emisión de tickets viene después de cajas y turnos porque requiere ese contexto ya definido para generar comprobantes válidos con la información correcta de quién vendió, cuándo y en qué caja.
7. El dashboard operativo básico se incluye en el bloque 2 para dar visibilidad inmediata de las operaciones diarias una vez que el POS está funcionando, permitiendo monitoreo temprano.
8. La configuración y preferencias del sistema se coloca al inicio del bloque 3 para permitir personalización del comportamiento del sistema antes de avanzar a módulos más complejos.
9. La internacionalización (i18n) se mueve del bloque 7 al bloque 3 porque es mucho más fácil implementar un sistema de traducciones cuando la interfaz está en desarrollo que cuando ya está completa con textos hardcodeados en todas partes.
10. Las variantes de productos son la base del inventario avanzado y deben implementarse primero porque otros módulos (alertas, unidades de medida, multi-almacén) necesitan entender cómo se estructuran los productos.
11. Las alertas de stock siguen a las variantes porque necesitas tener definida la estructura del inventario para poder monitorear niveles y disparar notificaciones apropiadas.
12. Las unidades de medida y conversión se implementan después porque añaden complejidad al manejo de inventario que requiere que la estructura básica (variantes, alertas) ya esté funcionando.
13. La importación/exportación masiva viene después de tener toda la estructura de inventario definida (variantes, unidades, almacenes) para que los archivos CSV/Excel tengan todas las columnas necesarias.
14. El multi-almacén y transferencias es lo último del inventario porque es la capa más compleja que requiere que todo lo anterior (variantes, unidades, alertas) funcione correctamente en un solo almacén antes de multiplicar la complejidad.
15. La rentabilidad y márgenes es la primera fase de inteligencia de negocio porque requiere datos de costos y precios de venta que ya están definidos en los módulos anteriores de inventario y ventas.
16. El ranking de productos vendidos sigue naturalmente porque usa datos de ventas acumuladas que ya existen después de implementar el POS y el seguimiento de inventario.
17. El control de gastos operativos se añade después porque introduce datos externos (gastos no relacionados directamente con ventas) que complementan el panorama financiero para cálculos de rentabilidad real.
18. El dashboard visual con gráficas es lo último de inteligencia de negocio porque consolida todos los datos anteriores (rentabilidad, ranking, gastos) en visualizaciones comprensibles para la toma de decisiones.
19. El ID fiscal dinámico por país inicia el bloque de fiscalidad porque define cómo se identifican legalmente las transacciones, algo que debe estar claro antes de definir métodos de pago o separar tablas.
20. Los métodos de pago estandarizados siguen al ID fiscal porque diferentes regulaciones fiscales requieren diferentes formas de registrar pagos, y esto depende de la configuración fiscal del país.
21. La separación entre ventas y facturas es lo último de fiscalidad porque requiere tener claros tanto los IDs fiscales como los métodos de pago para crear dos estructuras de datos paralelas pero relacionadas correctamente.
22. La integración con WhatsApp es una característica complementaria que no afecta el núcleo del sistema, por lo que se deja para después de tener toda la funcionalidad principal estable.
23. El escáner con cámara es otra característica opcional que mejora la experiencia de usuario pero no es crítica para el funcionamiento básico del POS, justificando su posición tardía.
24. El onboarding guiado debe ser lo último de las características complementarias porque necesita que todas las funcionalidades del sistema ya estén disponibles para poder guiar adecuadamente al usuario nuevo.
25. Las pruebas integrales E2E deben ser un bloque final separado porque solo tienen sentido cuando TODO el sistema está implementado; hacer pruebas completas antes implica retrabajo constante.
26. La documentación completa también debe ir al final porque documentar funcionalidades que aún cambiarán o no existen genera documentación obsoleta y pérdida de tiempo.
	
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

## 📊 Performance y Escalabilidad

- Índices en campos de búsqueda frecuente (código_barras, folio, sku)
- Paginación en listados grandes
- Caché de configuraciones y datos estáticos
- Queries optimizadas para dashboard
- Considerar múltiples cajas simultáneas
- Soporte para crecimiento de inventario (10k+ productos)

---

## 🔐 Consideraciones de Seguridad

- Passwords de superior must be hashed (bcrypt/argon2)
- Solo usuarios autorizados pueden realizar acciones críticas
- Logs de auditoría para: aperturas/cierres de caja, cancelaciones, re-aperturas
- Validación de permisos por rol en cada endpoint
- Sanitización de inputs en importaciones masivas
	
---
	
## 🛠️ Stack Tecnológico (Referencia Rápida)
	
Consultar documentos del proyecto para detalles completos. Resúmen:
- **Frontend:** Vue.js 3, Composition API, TailwindCSS
- **Backend:** Laravel 10+, PHP 8.2+
- **Base de Datos:** MySQL 8+ / PostgreSQL
- **PWA:** Service Workers, Offline-first
- **Librerías Clave:** (ver AIContext.md para lista completa)

---

## 🧪 Testing Strategy

Cada fase debe incluir:
- Tests unitarios para lógica de negocio
- Tests de integración para APIs
- Tests E2E para flujos críticos (venta completa, corte de caja, etc.)
- Pruebas manuales con hardware real (escáneres, impresoras)
- Pruebas de carga para importaciones masivas
- **NO INSTALAR DEPENDENCIAS**
	
---

## 📞 Flujo de Trabajo con IA
	
### Para el Usuario Humano:
1. Asignar una fase específica a la IA
2. Proporcionar contexto adicional si es necesario
3. Responder todas las preguntas de clarificación
4. Revisar el código generado
5. Probar en entorno local
6. Dar feedback para ajustes

## 📝 Para la IA: Flujo de Trabajo para Cada Fase
1. **Leer** `AIContext.md` para entender contexto general
2. **Leer** el archivo de la fase específica
3. **Revisar** el código existente relacionado
4. **Hacer** todas las preguntas de clarificación listadas
5. **Esperar** respuestas del equipo
6. **Planear** la implementación con base en respuestas
7. **Implementar** siguiendo patrones existentes
8. **Probar** exhaustivamente
9. **Verificar** checklist de entregables
10. **Documentar** cambios realizados
11. **Entregar** para revisión
	
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
	
## 📞 Soporte y Dudas
	
Si tienes dudas durante la implementación:
1. Revisa si la respuesta está en `AIContext.md`
2. Revisa el archivo de la fase actual
3. **PREGUNTA** al equipo antes de asumir
4. Documenta cualquier decisión tomada durante la implementación
	
---

## ✅ Checklist General de Entrega
Para cada fase completada:
- [ ] Código implementado siguiendo patrones existentes
- [ ] Migraciones creadas y probadas (si aplica)
- [ ] Tests escritos y pasando
- [ ] Documentación actualizada
- [ ] No hay regresiones en funcionalidades existentes
- [ ] Performance considerado (índices, queries optimizados)
- [ ] Seguridad implementada (validaciones, permisos)
- [ ] UX/UI consistente con el resto del sistema
- [ ] Commit messages descriptivos
- [ ] PR listo para review
	
---

**Última actualización:** Julio 2026 
**Versión del plan:** 1.0  
**Proyecto:** Vexum MX App