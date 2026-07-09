# 📋 FASE 1: Modelo de Datos y Migraciones

## 🎯 Contexto para la IA
Este documento contiene las instrucciones para implementar la **Fase 1** del proyecto Vexum MX. 

### ⚠️ REGLAS CRÍTICAS - LEER PRIMERO
1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto antes de comenzar cualquier trabajo.
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos en `AIContext.md`.
3. Mantener consistencia con el código existente en el proyecto.
4. Usar el stack tecnológico definido en `AIContext.md`.

---

## 📌 OBJETIVO DE ESTA FASE
Crear todas las tablas necesarias en la base de datos para soportar:
- Ventas y sus items
- Pagos (incluyendo pagos mixtos)
- Gestión de cajas y turnos
- Cortes de caja
- Configuraciones del sistema

---

## ❓ PREGUNTAS OBLIGATORIAS ANTES DE COMENZAR
**LA IA DEBE HACER ESTAS PREGUNTAS Y ESPERAR RESPUESTA ANTES DE ESCRIBIR CÓDIGO:**

1. ¿Qué motor de base de datos se está usando actualmente? (MySQL, PostgreSQL, SQLite, otro)
2. ¿Se usa algún ORM específico? (Sequelize, Prisma, TypeORM, Knex, otro)
3. ¿Existe alguna convención específica para nombres de tablas y columnas? (singular/plural, snake_case/camelCase)
4. ¿Hay migraciones existentes que deba revisar para mantener consistencia en el formato?
5. ¿Los UUIDs deben ser string o tipo UUID nativo de la BD?
6. ¿Existe ya una tabla de `usuarios`? ¿Cuál es su estructura exacta?
7. ¿Existe ya una tabla de `productos`? ¿Tiene campo `codigo_barras`? ¿Qué tipo de dato es?
8. ¿Hay alguna configuración especial para decimales? (precision, scale)
9. ¿Se requiere soft delete en alguna de estas tablas?
10. ¿Hay algún estándar para timestamps? (created_at/updated_at vs creada_en/actualizada_en, con/sin timezone)
11. ¿Existen índices ya creados que deba considerar como patrón?
12. ¿La numeración consecutiva de folios debe manejarse en BD o en aplicación?
13. ¿Hay restricciones de integridad referencial específicas? (ON DELETE CASCADE, SET NULL, etc.)
14. ¿Se requiere algún seed inicial para configuraciones básicas?
15. ¿Existe alguna política para manejo de transacciones en migraciones?

---

## 📁 ESTRUCTURA DE TABLAS A CREAR

### 1. Tabla `ventas`
```
- id: UUID, primary key
- folio: string, único, consecutivo por caja/día
- caja_id: foreign key -> cajas.id
- turno_id: foreign key -> turnos.id
- total: decimal
- subtotal: decimal
- impuestos: decimal
- estado: enum ('completada', 'cancelada', 'pendiente')
- creada_en: timestamp
- actualizada_en: timestamp
```

### 2. Tabla `venta_items`
```
- id: UUID, primary key
- venta_id: foreign key -> ventas.id (CASCADE DELETE)
- producto_id: foreign key -> productos.id
- cantidad: integer
- precio_unitario: decimal
- subtotal: decimal
- impuestos: decimal
- total: decimal
```

### 3. Tabla `pagos`
```
- id: UUID, primary key
- venta_id: foreign key -> ventas.id (CASCADE DELETE)
- metodo: enum ('efectivo', 'tarjeta', 'transferencia')
- monto: decimal
- referencia: string, nullable (para nº tarjeta, comprobante, etc.)
- creada_en: timestamp
```

### 4. Tabla `cajas`
```
- id: UUID, primary key
- nombre: string
- descripcion: text, nullable
- estado: enum ('abierta', 'cerrada')
- saldo_inicial: decimal, default 0
- saldo_final: decimal, nullable
- abierta_por: foreign key -> usuarios.id
- cerrada_por: foreign key -> usuarios.id, nullable
- abierta_en: timestamp, nullable
- cerrada_en: timestamp, nullable
- creada_en: timestamp
- actualizada_en: timestamp
```

### 5. Tabla `turnos`
```
- id: UUID, primary key
- caja_id: foreign key -> cajas.id (CASCADE DELETE)
- usuario_id: foreign key -> usuarios.id
- numero_turno: integer, consecutivo por caja
- estado: enum ('abierto', 'cerrado')
- iniciado_en: timestamp
- finalizado_en: timestamp, nullable
- created_at: timestamp
```

### 6. Tabla `cortes_caja`
```
- id: UUID, primary key
- caja_id: foreign key -> cajas.id
- turno_id: foreign key -> turnos.id
- usuario_id: foreign key -> usuarios.id
- fecha_inicio: timestamp (rango del corte)
- fecha_fin: timestamp
- total_efectivo: decimal, default 0
- total_tarjeta: decimal, default 0
- total_transferencia: decimal, default 0
- total_general: decimal
- numero_transacciones: integer, default 0
- observaciones: text, nullable
- creado_en: timestamp
```

### 7. Tabla `configuraciones` (si no existe)
```
- id: UUID, primary key
- clave: string, único
- valor: text/json
- descripcion: text
- actualizada_en: timestamp
```

**Configuraciones iniciales a sembrar:**
- `negocio_nombre`: string vacío o "Vexum MX"
- `negocio_logo`: string vacío
- `negocio_rfc`: string vacío
- `impuestos_activos`: boolean (false por defecto)
- `impuesto_porcentaje`: decimal (16.00 por defecto)
- `ticket_mensaje_final`: "Gracias por su compra"
- `password_superior`: hash de contraseña por defecto (ej: "admin123" hasheado)

### 8. Modificaciones a tabla `productos`
```
- Agregar columna `codigo_barras`: string, único, nullable, índice
- Verificar que exista columna `precio`: decimal
- Verificar que exista columna `stock` o similar
```

---

## ✅ ENTREGABLES ESPERADOS

1. **Archivos de migración**
   - Una migración por tabla o migración consolidada (según patrón del proyecto)
   - Debe incluir rollback/down
   - Debe seguir formato existente en el proyecto

2. **Models**
   - Crear models para cada nueva entidad
   - Definir relaciones correctamente (belongsTo, hasMany, etc.)
   - Incluir validaciones básicas
   - Seguir patrones de models existentes

3. **Seeders**
   - Seeder para configuraciones iniciales
   - Datos de prueba opcionales (cajas, turnos)

4. **Validaciones**
   - Validaciones en models para campos requeridos
   - Validaciones para enums
   - Validaciones para unicidad (folio, codigo_barras, etc.)

---

## 🔍 CONSIDERACIONES TÉCNICAS

### Índices obligatorios:
- `codigo_barras` en `productos` (único)
- `folio` en `ventas` (índice simple)
- `fecha_creacion` en `ventas` (índice simple)
- `caja_id` en `ventas`, `turnos`, `cortes_caja` (índices simples)
- `turno_id` en `ventas`, `cortes_caja` (índices simples)
- `estado` en `ventas`, `turnos` (índices simples si hay filtros frecuentes)

### Integridad referencial:
- Usar CASCADE DELETE en `venta_items` y `pagos` cuando se elimine una venta
- Usar SET NULL o RESTRICT en relaciones con `usuarios` según política del proyecto
- Validar que no se pueda cerrar caja con turnos abiertos (a nivel aplicación)

### Decimales:
- Usar precisión adecuada para moneda (ej: DECIMAL(10,2) o DECIMAL(12,4))
- Consistente en toda la base de datos

### UUIDs:
- Seguir formato de UUIDs ya usado en el proyecto (string v4, UUID nativo, etc.)

---

## 📝 NOTAS ADICIONALES

- Esta fase es **CRÍTICA** porque todas las fases posteriores dependen de ella
- No avanzar a Fase 2 hasta que esta esté completa y probada
- Las migraciones deben ser idempotentes (poder ejecutarse múltiples veces sin error)
- Probar migraciones en entorno de desarrollo antes de commit
- Documentar cualquier desviación de este plan

---

## 🔄 CHECKLIST DE VERIFICACIÓN

- [ ] Leído AIContext.md completamente
- [ ] Respondidas todas las preguntas de clarificación
- [ ] Revisadas migraciones existentes para consistencia
- [ ] Creadas todas las migraciones
- [ ] Ejecutadas migraciones en entorno local
- [ ] Creados todos los models
- [ ] Definidas todas las relaciones
- [ ] Creado seeder de configuraciones
- [ ] Probada creación de registros en cada tabla
- [ ] Verificados índices
- [ ] Commit con mensaje descriptivo

---

**IMPORTANTE:** Si alguna decisión técnica cambia durante la implementación, documentarlo en los comentarios del código y notificar al equipo.
