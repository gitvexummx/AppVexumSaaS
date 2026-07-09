# 📋 BLOQUE 1, FASE 3: Backend - API de Ventas y Pagos

## 🎯 Contexto para la IA
Este documento contiene las instrucciones para implementar la **Fase 2** del proyecto Vexum MX.

### ⚠️ REGLAS CRÍTICAS - LEER PRIMERO
1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto antes de comenzar cualquier trabajo.
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos en `AIContext.md`.
3. Mantener consistencia con el código existente en el proyecto.
4. Usar el stack tecnológico definido en `AIContext.md`.
5. **REQUISITO:** La Fase 1 (Modelo de Datos) debe estar completa y probada antes de iniciar esta fase.

---

## 📌 OBJETIVO DE ESTA FASE
Crear todos los endpoints del backend necesarios para gestionar:
- CRUD de ventas y sus items
- Registro de pagos (incluyendo pagos mixtos)
- Búsqueda de productos por código de barras
- Gestión de cajas y turnos
- Generación de cortes de caja
- Endpoints para dashboard actualizado

---

## ❓ PREGUNTAS OBLIGATORIAS ANTES DE COMENZAR
**LA IA DEBE HACER ESTAS PREGUNTAS Y ESPERAR RESPUESTA ANTES DE ESCRIBIR CÓDIGO:**

1. ¿Qué framework de backend se está usando? (Express, NestJS, Fastify, otro)
2. ¿Existe una estructura específica para controllers, services, repositories?
3. ¿Hay algún patrón de validación establecido? (Joi, class-validator, Yup, express-validator)
4. ¿Cómo se manejan las respuestas API? (formato estándar, envoltorio de éxito/error)
5. ¿Existe middleware de autenticación/autorización ya implementado?
6. ¿Cómo se manejan los errores en el proyecto? (clases personalizadas, try-catch estándar)
7. ¿Hay algún formato específico para responses paginados?
8. ¿Se usa algún sistema de logging específico? (winston, morgan, pino)
9. ¿Existen tests de API ya configurados? ¿Qué framework? (Jest, Mocha, Supertest)
10. ¿Cómo se documentan las APIs? (Swagger/OpenAPI, comentarios JSDoc, otro)
11. ¿Hay rate limiting configurado que deba considerar?
12. ¿Se requiere transaccionalidad en operaciones de venta? (crear venta + items + pagos)
13. ¿Existe un sistema de colas o eventos para acciones asíncronas?
14. ¿Cómo se maneja el tema de permisos/roles en el proyecto?
15. ¿Hay alguna convención para nombres de endpoints? (plural/singular, versionado)
16. ¿Los endpoints de dashboard requieren caché? ¿Qué sistema de caché existe?
17. ¿Se requiere webhook o integración externa para métodos de pago?
18. ¿Existe ya un sistema de numeración consecutiva implementado en otro módulo?

---

## 📁 ENDPOINTS A IMPLEMENTAR

### 2.1 Ventas

#### POST `/api/ventas`
**Descripción:** Crear nueva venta completa (con items)
**Body:**
```json
{
  "caja_id": "uuid",
  "turno_id": "uuid",
  "items": [
    {
      "producto_id": "uuid",
      "cantidad": 2,
      "precio_unitario": 100.00,
      "impuestos": 16.00
    }
  ],
  "total": 232.00,
  "subtotal": 200.00,
  "impuestos": 32.00
}
```
**Reglas:**
- Debe ser transaccional (venta + items)
- Validar stock disponible antes de crear
- Generar folio consecutivo automáticamente
- Estado inicial: "pendiente" hasta que se registre al menos un pago
- Descontar inventario

**Response:** Venta creada con folio generado

#### GET `/api/ventas`
**Descripción:** Listar ventas con filtros
**Query Params:**
- `fecha_inicio`: YYYY-MM-DD
- `fecha_fin`: YYYY-MM-DD
- `caja_id`: uuid
- `turno_id`: uuid
- `estado`: completada|cancelada|pendiente
- `page`: número de página
- `limit`: registros por página

**Response:** Array de ventas con paginación

#### GET `/api/ventas/:id`
**Descripción:** Obtener detalle completo de una venta
**Response:** Venta con items y pagos relacionados

#### PUT `/api/ventas/:id`
**Descripción:** Actualizar venta (solo si está pendiente)
**Reglas:**
- No permitir si ya tiene pagos registrados
- No permitir si estado es "completada" o "cancelada"

#### DELETE `/api/ventas/:id`
**Descripción:** Cancelar venta
**Reglas:**
- Cambiar estado a "cancelada" (no borrar físicamente)
- Revertir inventario (sumar productos)
- Solo permitido si no tiene pagos o todos los pagos se reversan

#### GET `/api/ventas/:id/ticket`
**Descripción:** Obtener datos formateados para renderizar ticket
**Response:** 
```json
{
  "negocio": {...},
  "venta": {...},
  "items": [...],
  "pagos": [...],
  "configuracion": {...}
}
```

---

### 2.2 Pagos

#### POST `/api/ventas/:id/pagos`
**Descripción:** Registrar pago parcial o total
**Body:**
```json
{
  "metodo": "efectivo|tarjeta|transferencia",
  "monto": 150.00,
  "referencia": "opcional"
}
```
**Reglas:**
- Validar que monto no exceda saldo pendiente
- Validar que suma de pagos no exceda total de venta
- Si suma de pagos == total: cambiar estado de venta a "completada"
- Permitir múltiples pagos por venta (pagos mixtos)
- Transaccional

**Response:** Pago registrado + saldo pendiente restante

#### GET `/api/ventas/:id/pagos`
**Descripción:** Obtener todos los pagos de una venta
**Response:** Array de pagos con desglose

#### PUT `/api/pagos/:id`
**Descripción:** Actualizar pago (solo antes de que venta esté completada)
**Reglas:**
- Solo editable si venta estado es "pendiente"
- Recalcular estado de venta después de actualizar

---

### 2.3 Productos

#### GET `/api/productos/buscar-codigo/:codigo`
**Descripción:** Buscar producto por código de barras
**Response:** Producto completo o 404 si no existe
**Uso:** Para escáneres de códigos de barras

#### GET `/api/productos/:id/precio`
**Descripción:** Obtener solo precio de producto (para consulta rápida)
**Response:** `{ producto_id, nombre, precio, codigo_barras }`

#### GET `/api/productos/:id/stock`
**Descripción:** Obtener stock disponible
**Response:** `{ producto_id, stock_disponible, unidad_medida }`

---

### 2.4 Cajas y Turnos

#### POST `/api/cajas`
**Descripción:** Crear nueva caja
**Body:** `{ nombre, descripcion }`

#### GET `/api/cajas`
**Descripción:** Listar todas las cajas
**Query Params:** `estado` (opcional)

#### GET `/api/cajas/:id`
**Descripción:** Obtener detalle de caja con historial

#### POST `/api/cajas/:id/abrir`
**Descripción:** Abrir caja con saldo inicial
**Body:** 
```json
{
  "saldo_inicial": 1000.00,
  "usuario_id": "uuid"
}
```
**Reglas:**
- Solo si caja está "cerrada"
- Cambia estado a "abierta"
- Registra timestamp de apertura

#### POST `/api/cajas/:id/cerrar`
**Descripción:** Cerrar caja con saldo final
**Body:**
```json
{
  "saldo_final": 1500.00,
  "usuario_id": "uuid",
  "observaciones": "opcionales"
}
```
**Reglas:**
- Solo si caja está "abierta"
- No debe haber turnos activos asociados
- Cambia estado a "cerrada"

#### POST `/api/turnos`
**Descripción:** Iniciar nuevo turno
**Body:**
```json
{
  "caja_id": "uuid",
  "usuario_id": "uuid"
}
```
**Reglas:**
- Caja debe estar abierta
- Generar numero_turno consecutivo automáticamente
- Estado inicial: "abierto"

#### PUT `/api/turnos/:id/cerrar`
**Descripción:** Cerrar turno
**Body:** `{ usuario_id: "uuid" }`
**Reglas:**
- Solo si turno está "abierto"
- No debe haber ventas pendientes de pago en este turno
- Calcula totales del turno

#### GET `/api/turnos/activos`
**Descripción:** Obtener turnos actualmente abiertos
**Response:** Array de turnos activos con info de caja y usuario

---

### 2.5 Cortes de Caja

#### POST `/api/cortes-caja`
**Descripción:** Generar corte de caja
**Body:**
```json
{
  "caja_id": "uuid",
  "turno_id": "uuid",
  "usuario_id": "uuid",
  "fecha_inicio": "YYYY-MM-DD HH:mm:ss",
  "fecha_fin": "YYYY-MM-DD HH:mm:ss",
  "observaciones": "opcionales"
}
```
**Reglas:**
- Calcular automáticamente totales por método de pago
- Contar número de transacciones en el rango
- Validar que fechas sean correctas (inicio < fin)
- El turno debe estar cerrado

**Response:** Corte creado con totales calculados

#### GET `/api/cortes-caja`
**Descripción:** Listar cortes de caja
**Query Params:**
- `caja_id`: uuid
- `fecha_inicio`: YYYY-MM-DD
- `fecha_fin`: YYYY-MM-DD
- `usuario_id`: uuid

#### GET `/api/cortes-caja/:id`
**Descripción:** Obtener detalle completo de corte
**Response:** Corte con desglose de ventas incluidas

#### POST `/api/cortes-caja/:id/reabrir`
**Descripción:** Reabrir corte (requiere validación de superior)
**Body:**
```json
{
  "password_superior": "contraseña",
  "usuario_id": "uuid",
  "justificacion": "texto"
}
```
**Reglas:**
- Validar password contra configuración (hash)
- Solo usuarios autorizados pueden ejecutar
- Registra quién autorizó y cuándo
- Revierte estado de cierre (permite modificaciones)

---

### 2.6 Dashboard

#### GET `/api/dashboard/resumen`
**Descripción:** Obtener resumen general configurable
**Query Params:**
- `tipo`: turno|dia|semana|mes|personalizado
- `fecha_inicio`: YYYY-MM-DD (si es personalizado)
- `fecha_fin`: YYYY-MM-DD (si es personalizado)
- `caja_id`: uuid (opcional)
- `turno_id`: uuid (opcional)

**Response:**
```json
{
  "total_vendido": 15000.00,
  "numero_transacciones": 45,
  "ticket_promedio": 333.33,
  "desglose_metodos": {
    "efectivo": 8000.00,
    "tarjeta": 5000.00,
    "transferencia": 2000.00
  },
  "periodo": {
    "inicio": "...",
    "fin": "..."
  }
}
```

#### GET `/api/dashboard/ventas-hoy`
**Descripción:** Ventas específicas del día actual
**Response:** Similar a resumen pero solo día actual + lista de ventas

#### GET `/api/dashboard/producto-mas-vendido`
**Descripción:** Producto más vendido en rango
**Query Params:**
- `criterio`: cantidad|ingresos
- `fecha_inicio`: YYYY-MM-DD
- `fecha_fin`: YYYY-MM-DD
- `limit`: top N (default 5)

**Response:**
```json
[
  {
    "producto_id": "uuid",
    "nombre": "Producto X",
    "cantidad_vendida": 150,
    "ingresos_generados": 4500.00
  }
]
```

#### GET `/api/dashboard/ultimas-ventas`
**Descripción:** Últimas N ventas realizadas
**Query Params:**
- `limit`: número (default 10)
- `caja_id`: uuid (opcional)

**Response:** Array de ventas recientes con datos básicos

---

## ✅ ENTREGABLES ESPERADOS

1. **Controllers**
   - Un controller por entidad (VentasController, PagosController, etc.)
   - Siguiendo patrón existente en el proyecto
   - Con validación de entrada

2. **Services**
   - Lógica de negocio encapsulada
   - Manejo de transacciones
   - Validaciones complejas
   - Cálculos de totales

3. **Requests/FormRequests** (si aplica)
   - Validaciones de entrada centralizadas
   - Mensajes de error personalizados

4. **Resources/Transformers**
   - Formato consistente de respuestas
   - Inclusión/exclusión de campos según contexto
   - Relaciones cargadas selectivamente

5. **Middleware**
   - Autorización por roles (si aplica)
   - Validación de existencia de recursos
   - Manejo de transacciones

6. **Tests**
   - Tests unitarios de services
   - Tests de integración de endpoints
   - Tests de casos borde (pagos mixtos, validaciones)

7. **Documentación**
   - Comentario en cada endpoint
   - Ejemplos de request/response
   - Notas sobre reglas de negocio

---

## 🔍 CONSIDERACIONES TÉCNICAS

### Transaccionalidad:
- Creación de venta + items debe ser atómico
- Registro de pagos debe ser atómico
- Cortes de caja deben ser atómicos
- Usar transacciones de BD apropiadamente

### Validaciones críticas:
- Stock suficiente antes de vender
- Suma de pagos == total de venta
- No modificar ventas completadas/canceladas
- Folios consecutivos sin huecos
- Turnos no superpuestos en misma caja

### Performance:
- Indexar campos de filtrado frecuente
- Usar selectivo de columnas (no SELECT *)
- Considerar caché para dashboard (5-10 min TTL)
- Paginar listados grandes

### Seguridad:
- Validar permisos por rol
- Sanitizar inputs
- Prevenir inyección SQL (usar ORM/query builder)
- Hash para password de superior
- Logs de auditoría para acciones críticas

### Manejo de errores:
- HTTP status codes apropiados
- Mensajes de error claros pero no reveladores
- Logs de errores para debugging
- Rollback en transacciones fallidas

---

## 📝 NOTAS ADICIONALES

- Los endpoints de ventas son el CORE del sistema
- Pagos mixtos requieren lógica especial de validación
- El dashboard debe ser rápido (optimizar queries)
- Considerar concurrencia (dos ventas al mismo tiempo)
- Documentar cualquier cambio al plan original

---

## 🔄 CHECKLIST DE VERIFICACIÓN

- [ ] Leído AIContext.md completamente
- [ ] Respondidas todas las preguntas de clarificación
- [ ] Fase 1 completada y verificada
- [ ] Creados todos los controllers
- [ ] Creados todos los services
- [ ] Implementadas validaciones
- [ ] Tests unitarios aprobados
- [ ] Tests de integración aprobados
- [ ] Documentación de endpoints
- [ ] Probado flujo completo manual (crear venta → pagos → ticket)
- [ ] Probado pagos mixtos
- [ ] Probado cálculo de dashboard
- [ ] Commit con mensaje descriptivo

---

**IMPORTANTE:** Esta fase depende directamente de la Fase 1. Asegurar que models estén disponibles antes de codificar.
