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