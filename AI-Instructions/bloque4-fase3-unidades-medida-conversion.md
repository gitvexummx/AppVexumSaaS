# BLOQUE 4, FASE 3: Unidades de Medida y Conversión (Pieza, Kilo, Caja)

## ⚠️ INSTRUCCIONES CRÍTICAS PARA LA IA
1. **LEER PRIMERO:** Leer estrictamente `AIContext.md`.
2. **PREGUNTAR ANTES DE CODIFICAR:** Asegurar comprensión de la lógica de conversión y precios.

## 🎯 Objetivo
Eliminar el concepto fijo de "Piezas". Implementar unidades de medida flexibles (Pieza, Kilo, Litro, Metro, Servicio, Caja/Lote) con soporte para decimales en POS y lógica de venta compuesta (Venta por Pieza vs Venta por Caja).

## 📋 Especificaciones Detalladas

### 1. Tipos de Unidad
- Selector en creación de producto:
  - **Discretas:** Pieza, Caja, Paquete, Lote.
  - **Continuas:** Kilo (3 decimales), Litro (2 decimales), Metro (2 decimales).
  - **Servicio:** Sin stock, no numerico estricto.

### 2. Soporte Decimal en POS
- Si la unidad es Continua (Kilo/Metro), el input de cantidad en POS acepta decimales (ej: `0.250`, `1.5`).
- Si es Discreta (Pieza), solo enteros.
- Validación en tiempo real según tipo de producto.

### 3. Lógica "Caja vs Pieza" (Unidad Compuesta)
- Configuración en producto:
  - ¿Se vende por pieza? (Sí/No) → Precio Unitario.
  - ¿Se vende por caja? (Sí/No) → Activar opción.
    - Input: `Cantidad de piezas por caja` (ej: 12).
    - Cálculo Auto: `Precio Caja = Precio Pieza * Cantidad`.
    - Edición Manual: Usuario puede sobrescribir `Precio Caja` (ej: ofrecer descuento por mayoreo, $100 en vez de $120).
- En POS:
  - Al agregar, preguntar o detectar: ¿Escaneó código de pieza o de caja?
  - Si es código de caja, agrega cantidad `1` (unidad caja) o `12` (unidades pieza) según configuración de visualización.
  - Ticket debe desglosar claramente: "1 Caja (12 pzas)" o "12 Piezas".

### 4. Conversión Futura (Preparación)
- Diseñar la BD para soportar factores de conversión, aunque inicialmente solo usaremos la lógica Caja/Pieza.

## ❓ PREGUNTAS OBLIGATORIAS DE CLARIFICACIÓN
1. ¿El campo `unidad_medida` será un ENUM fijo o una tabla catálogo editable? (Recomendado Catálogo para extensibilidad).
2. ¿Cómo distinguimos en el escáner si el código de barras corresponde a una "Caja" o a una "Pieza"? (¿Códigos distintos o mismo código y el sistema pregunta?).
3. Si vendo 1.5 Kg, el库存 (stock) debe bajar en 1.5 o en gramos? (Internamente trabajar en la unidad base, ej: Kilos con decimales).
4. ¿El precio por caja sobrescrito manualmente, se actualiza si cambio después el precio de la pieza? (No, debe desacoplarse tras edición manual).
5. ¿En el inventario, el stock de "Cajas" se calcula automático (`Stock Piezas / Piezas por Caja`) o se maneja separado? (Mejor calcularlo dinámicamente para evitar inconsistencias).
6. ¿Se permiten decimales en "Litros" y "Metros"? ¿Cuánta precisión? (2 o 3 decimales).
7. ¿El ticket debe mostrar la unidad abreviada (kg, pz, lt)?
8. ¿Qué pasa si intento vender más stock del disponible en decimales? (Validación estándar).
9. ¿Hay productos que solo se venden por caja y no permiten venta suelta? (Flag "Venta mínima: Caja").
10. ¿La exportación a Excel debe incluir la columna "Piezas por Caja"?
11. ¿Cómo manejamos el costo? ¿El costo es por pieza y el de caja se deriva, o pueden ser independientes?
12. ¿En las gráficas de "Producto más vendido", contamos por unidad base (piezas totales) o por unidades vendidas (cajas)?
13. ¿Se requiere cambiar la etiqueta del input en POS dinámicamente ("Cantidad (Kg)" vs "Cantidad (Pzas)")?
14. ¿Los servicios tienen precio pero stock infinito/no controlado?
15. ¿Existe alguna regla fiscal sobre cómo mostrar decimales en tickets (redondeo)?

## ✅ Checklist de Entregables
- [ ] Migración: Agregar `tipo_unidad`, `contenido_por_caja`, `precio_caja_forzado` a productos/variantes.
- [ ] Lógica Backend: Calculadora de precios y validación de decimales según unidad.
- [ ] Frontend POS: Input dinámico (acepta decimales o no), Selector "Vender por Caja/Pieza".
- [ ] UI Inventario: Campos condicionales (si elige "Kilo", muestra aviso de decimales; si elige "Caja", pide cantidad interna).
- [ ] Ticket: Formato de cantidad adaptable (mostrar decimales si aplica).
- [ ] Validaciones: No permitir decimales en productos discretos.

## 🧮 Lógica Crítica
- **Fórmula Caja:** `PrecioCaja = (PrecioPieza * Contenido) unless Overridden`.
- **Stock Unificado:** Todo se guarda en la unidad más pequeña (Pieza/Kilo) para facilitar conteo, la UI presenta la conversión.

## 💡 NOTAS DE IMPLEMENTACIÓN

### Orden Sugerido de Desarrollo
1. **Primero:** Investigar y definir lista base de unidades de medida estándar (SI, imperiales, locales)
2. **Segundo:** Crear migraciones para `units_of_measure` y `conversion_rules`
3. **Tercero:** Implementar service/converter con fórmulas de conversión
4. **Cuarto:** Agregar campo `base_unit_id` y `sell_unit_id` en productos
5. **Quinto:** Actualizar todos los cálculos de precio/stock para considerar conversión
6. **Sexto:** UI para selección de unidades y visualización de equivalencias

### Puntos Críticos
- ⚠️ **CRÍTICO:** Definir UNA unidad base por producto; todas las demás se convierten desde/a esa unidad
- ⚠️ Precisión decimal: usar mínimo 4 decimales en conversiones para evitar drift acumulado
- ⚠️ Las conversiones pueden ser lineales (multiplicación) o no lineales (fórmulas complejas); diseñar sistema extensible

### Recomendaciones de UX
- Mostrar siempre la unidad base junto a la unidad de venta (ej: "Precio: $10 / pieza (base: caja x 12)")
- Incluir calculadora de equivalencias en ficha de producto
- Permitir búsqueda de productos por unidad de medida ("mostrar productos que se venden por kilo")
- Autocompletado inteligente al escribir unidad (reconoce "kg", "kilo", "kilogramo" como lo mismo)

### Dependencias con Otras Fases
- Impacta cálculos de inventario en todas las fases anteriores
- Requiere actualización de reportes de ventas/compras para mostrar unidades correctas
- Necesario para importación/exportación masiva (fase 4.4)

### Advertencias Comunes
- ❌ No permitir conversiones circulares o contradictorias
- ❌ No redondear prematuramente en cálculos intermedios
- ❌ No olvidar actualizar precios al cambiar unidad de venta
- ❌ Evitar unidades personalizadas sin fórmula de conversión clara

---

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

### Backend
- [ ] Migración para tabla `units_of_measure` (id, name, symbol, type, is_base, decimals)
- [ ] Migración para tabla `conversion_rules` (from_unit_id, to_unit_id, formula_type, factor, formula_expression)
- [ ] Campo `base_unit_id` en tabla products
- [ ] Campo `sell_unit_id` en tabla products (puede ser igual a base_unit_id)
- [ ] Campo `purchase_unit_id` en tabla suppliers/products
- [ ] Service UnitConverter con métodos: convert(), getEquivalent(), getAllConversions()
- [ ] Soporte para conversiones lineales (factor) y no lineales (fórmula custom)
- [ ] Validación para prevenir ciclos en conversiones
- [ ] Seeder con unidades estándar (kg, g, lb, oz, m, cm, in, L, mL, gal, etc.)
- [ ] Tests unitarios para converter (casos normales y edge cases)
- [ ] Tests de precisión decimal (mínimo 4 decimales)

### Frontend
- [ ] Componente UnitSelector con búsqueda y autocompletado
- [ ] Modal de equivalencias que muestra todas las conversiones disponibles
- [ ] Calculadora de conversiones en ficha de producto
- [ ] Formulario de producto con selectores para base_unit, sell_unit, purchase_unit
- [ ] Visualización clara de "1 caja = 12 piezas" en UI
- [ ] Tabla de historial de cambios de unidad (si cambia, mostrar equivalencia histórica)
- [ ] Filtro de productos por unidad de medida
- [ ] Labels dinámicos en carrito/ventas según unidad del producto
- [ ] Validación en tiempo real al ingresar cantidades (evitar decimales inválidos)
- [ ] Responsive y accesible

### UX/UI
- [ ] Símbolos de unidades estandarizados y consistentes
- [ ] Tooltips explicativos en conversiones complejas
- [ ] Advertencia visual al cambiar unidad de un producto con transacciones históricas
- [ ] Confirmación requerida para cambios de unidad base
- [ ] Diseño de tabla de conversiones clara y legible

### Performance & Security
- [ ] Caché de reglas de conversión (no consultar DB en cada conversión)
- [ ] Índices en `conversion_rules(from_unit_id, to_unit_id)`
- [ ] Validación de fórmulas custom (prevenir code injection si se evalúan expresiones)
- [ ] Logs de conversiones realizadas para auditoría

### Casos Especiales
- [ ] Conversión de unidades compuestas (ej: "caja x 12 piezas")
- [ ] Unidades específicas por industria (ej: "resma" para papel, "yarda" para tela)
- [ ] Conversión de temperatura (no lineal: °C a °F)
- [ ] Productos con múltiples unidades de venta habilitadas simultáneamente
- [ ] Redondeo inteligente según tipo de producto (no es lo mismo gramos de oro que kilos de arena)

### Migración de Datos
- [ ] Script para asignar unidad base por defecto a productos existentes
- [ ] Script para detectar y corregir inconsistencias de unidades
- [ ] Plan de rollback en caso de errores en conversión

### Documentación
- [ ] Lista completa de unidades soportadas
- [ ] Guía para agregar nuevas unidades de medida
- [ ] Ejemplos de fórmulas de conversión complejas
- [ ] FAQ sobre problemas comunes de conversión