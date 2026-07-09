# BLOQUE 4, FASE 1: Inventario Avanzado - Variantes, Atributos y Precios

## ⚠️ INSTRUCCIONES CRÍTICAS PARA LA IA
1. **LEER PRIMERO:** Debes leer y entender estrictamente el archivo `AIContext.md` en la raíz del proyecto.
2. **NO ASUMIR:** Verifica la estructura actual de la tabla `productos`.
3. **PREGUNTAR ANTES DE CODIFICAR:** Formula las preguntas de la sección correspondiente antes de iniciar cualquier implementación.

## 🎯 Objetivo
Transformar el inventario plano actual a un sistema relacional avanzado que soporte **Productos Padre con Variantes** (Talla, Color, etc.), donde cada variante tiene stock, código de barras y precio independientes, pero heredando atributos del padre.

## 📋 Especificaciones Detalladas

### 1. Modelo Padre-Hijo
- **Producto Padre:** Contiene información general (Nombre base, Descripción, Categoría, Imágenes principales, Atributos definidos ej: ["Talla", "Color"]). No tiene stock ni precio directo vendible.
- **Producto Variante (Hijo):** Instancia concreta (ej: "Playera - Rojo - M").
  - Campos únicos: `sku`, `codigo_barras`, `stock`, `precio_venta`, `precio_costo`.
  - Campos heredados: Nombre base (concatenado dinámicamente), descripción.
  - Si no se especifica precio en la variante, hereda el "Precio Base" del padre.
  - **Alerta de Precio:** UI debe advertir visualmente si el precio de la variante difiere del padre.

### 2. Gestión de Atributos Dinámicos
- Sistema flexible: El usuario define los nombres de los atributos al crear el producto padre (ej: "Talla", "Material").
- Generación masiva de variantes: Al definir atributos (S, M, L) x (Rojo, Azul), el sistema debe pre-generar las combinaciones posibles para llenar datos.

### 3. Códigos de Barras
- Si no se proporciona código externo, el sistema genera un ID interno/código de barras único para cada variante.
- En POS: Al escanear, mostrar "Nombre Padre - Atributo1 - Atributo2".

### 4. Imágenes
- Imágenes a nivel Padre (galería general).
- Imágenes opcionales a nivel Variante (sobrescriben o añaden a la galería para esa variante específica).

## ❓ PREGUNTAS OBLIGATORIAS DE CLARIFICACIÓN
1. ¿La tabla `productos` actual es plana? ¿Cuál es su estructura exacta (columnas)?
2. ¿Vamos a refactorizar la tabla actual a un esquema `productos` (padres) y `variantes` (hijos), o agregaremos columnas nullable para soportar ambos casos? (Se recomienda separación).
3. ¿Cómo se manejarán las imágenes actuales de productos planos al migrar? ¿Se convierten en "Padres" con una sola variante?
4. ¿El atributo "Talla" o "Color" debe ser predefinido en un catálogo o totalmente libre (string)?
5. ¿Se permite editar el nombre base del producto desde la variante o solo desde el padre?
6. ¿En el POS, si escaneo un código que no existe, debo ofrecer crear una variante rápida o dar error?
7. ¿El "Precio Base" del padre es editable si ya existen variantes con precios personalizados? ¿Qué pasa con esas variantes al cambiar el precio padre? (¿Se actualizan solo las que no han sido modificadas manualmente?)
8. ¿Cómo manejamos el stock histórico si ya hay ventas registradas en la estructura antigua?
9. ¿La búsqueda en el inventario debe buscar por nombre del padre o por combinación completa?
10. ¿Se requiere validación para evitar duplicados de combinaciones (ej: no permitir dos variantes Rojo-M)?
11. ¿Los atributos deben tener un orden específico para mostrarse en el ticket/POS?
12. ¿Se permite tener variantes "inactivas" sin borrarlas (ej: Talla S agotada permanentemente)?
13. ¿El código de barras generado internamente seguirá algún patrón específico (ej: prefijo + ID)?
14. ¿En la vista de lista de inventario, mostramos el Padre con un desplegable de variantes o filas individuales por variante?
15. ¿Cómo afecta esto a las reportes de "Producto más vendido"? ¿Se reporta el Padre o la Variante específica?

## ✅ Checklist de Entregables
- [ ] Diseño de BD: Tablas `productos` (padres), `variantes`, `atributos_definicion`, `valores_atributos`.
- [ ] Migraciones y Models con relaciones Eloquent/ORM correctas.
- [ ] Formulario de creación de producto: Paso 1 (Datos Padre + Definir Atributos), Paso 2 (Generación/Grid de Variantes).
- [ ] Lógica de herencia de precios y generación de códigos de barra automáticos.
- [ ] Actualización del endpoint de búsqueda de productos para incluir variantes.
- [ ] UI de Inventario: Vista agrupada por padre con expansión de variantes.
- [ ] Adaptación del POS para mostrar nombre completo de variante al escanear.

## 💡 Notas de Implementación
- La UX de creación de productos será el punto crítico. Usar un enfoque de "Wizard" (Pasos) es recomendado.
- Considerar performance: Si un producto tiene 50 tallas x 10 colores = 500 variantes, la carga debe ser eficiente (paginación o virtual scroll).