# BLOQUE 5, FASE 2: Ranking de Productos (Top 10, Productos Hueso, Filtros Avanzados)

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Mejorar el reporte de productos más vendidos actual, implementando un sistema completo de ranking con múltiples criterios (cantidad vendida, ingresos generados, ganancia), identificación de productos sin movimiento ("huesos"), y una interfaz interactiva accesible desde el dashboard con filtros avanzados y navegación a reportes detallados.

## 📋 REQUERIMIENTOS DETALLADOS

### 16.1 Top 10 Más Vendidos - Múltiples Criterios
- **Toggle/Criterio 1**: "Más Piezas Vendidas" - Ordenar por cantidad total de unidades vendidas
- **Toggle/Criterio 2**: "Mayores Ingresos" - Ordenar por monto total recaudado (ventas totales $)
- **Toggle/Criterio 3**: "Mayor Ganancia" - Ordenar por ganancia bruta total (requiere Fase 15 implementada)
- Default: Mostrar por "Mayores Ingresos"

### 16.2 Filtros de Tiempo para Top 10
- Selector en el modal: "Más vendido del Día", "Semana", "Mes", "Año", "Personalizado"
- Al cambiar el filtro, recargar datos del ranking
- Guardar preferencia de filtro en localStorage (opcional)

### 16.3 Productos "Hueso" (Sin Ventas)
- Definición: Productos activos creados hace más de 30 días sin ventas en los últimos 30 días
- Excluir automáticamente: Productos creados hace menos de 30 días (evitar falsos positivos)
- Excluir: Productos inactivos/descontinuados
- Mostrar en lista separada dentro del mismo modal
- Columnas: Nombre del producto, categoría, última venta (si tuvo), días sin vender, stock actual

### 16.4 Interacción desde Dashboard
- En el dashboard, recuadro/tarjeta "Producto Más Vendido" debe ser clickable
- Al hacer clic: Abrir modal con dos pestañas/secciones:
  - Pestaña 1: Top 10 Más Vendidos (con toggles y filtros de tiempo)
  - Pestaña 2: Productos Sin Ventas (Huesos)
- Modal debe ser responsive y adaptarse a móvil/desktop

### 16.5 Navegación a Reportes Detallados
- Dentro del modal, botón: "Ver Reporte Completo"
- Este botón lleva a una página nueva `/reportes/productos` con:
  - Lista completa de todos los productos (no solo top 10)
  - Filtros avanzados: fecha, categoría, sucursal, almacén, estado (activo/inactivo)
  - Ordenamiento por cualquier columna
  - Exportar a PDF/Excel
  - Gráfica de tendencia de ventas por producto (si es posible)

### 16.6 Datos a Mostrar en Top 10
Para cada producto en el ranking:
- Posición (#1, #2, etc.)
- Nombre del producto (con variantes si aplica)
- Categoría
- Cantidad vendida (unidades)
- Ventas totales ($)
- Ganancia bruta ($) - si Fase 15 está activa
- % Margen promedio - si Fase 15 está activa
- Stock actual
- Tendencia (ícono ↑ ↓ → comparado con periodo anterior)

### 16.7 Datos a Mostrar en Productos Hueso
Para cada producto hueso:
- Nombre del producto
- Categoría
- Fecha de creación
- Días sin vender (calculado desde última venta o desde creación si nunca vendió)
- Stock actual (con alerta si es bajo)
- Costo acumulado en inventario (stock * costo) - para mostrar dinero estancado
- Sugerencia: "Considerar promoción" o "Revisar precio"

### 16.8 Comparativas y Tendencias
- Para cada producto en Top 10, mostrar comparación con periodo anterior:
  - Ej: "Ventas: $10,000 (↑ 15% vs semana pasada)"
  - Usar íconos: ↑ verde (subió), ↓ rojo (bajó), → gris (igual)
- Calcular porcentaje de cambio: `((periodo_actual - periodo_anterior) / periodo_anterior) * 100`

### 16.9 Exportación
- Botón para exportar Top 10 a PDF
- Botón para exportar Top 10 a Excel
- Botón para exportar Lista de Huesos a PDF/Excel
- Incluir fecha/rango del reporte en el exportado
- Incluir logo del negocio en PDF (si está configurado)

## ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)

1. ¿Ya existe algún endpoint o función para obtener productos más vendidos?
2. ¿Cuál es la estructura actual de la tabla `ventas` y `venta_items`?
3. ¿Cómo se identifica si un producto está "activo" o "inactivo" en la BD?
4. ¿Existe un campo `fecha_creacion` en la tabla `productos`?
5. ¿La Fase 15 (Rentabilidad) ya está implementada? ¿Podemos usar sus campos?
6. ¿Qué librería se usa actualmente para modales en el frontend?
7. ¿El dashboard ya tiene tarjetas/recuadros interactivos? ¿Cuál es su estructura?
8. ¿Existe una página de reportes actualmente? ¿Cuál es su ruta?
9. ¿Qué librerías están instaladas para exportar a PDF y Excel?
10. ¿El frontend usa Vue, React, Angular o vanilla JS?
11. ¿Se usa TypeScript o JavaScript?
12. ¿Hay algún sistema de caché para consultas frecuentes?
13. ¿Qué base de datos se usa y qué funciones de agregación soporta?
14. ¿Existe un componente de "tabs" o "pestañas" en la UI?
15. ¿Cómo se manejan los estados de carga (loading states) actualmente?
16. ¿Hay íconos de tendencias (flechas arriba/abajo) ya implementados en algún lado?
17. ¿El sistema tiene soporte para localStorage o preferencias de usuario?
18. ¿Qué librería de gráficas se usa (si aplica para tendencias)?
19. ¿Los reportes actuales tienen paginación?
20. ¿Existe un middleware o guardia para permisos de visualización de reportes?

## 🛠️ ENTREGABLES ESPERADOS

### Backend
- [ ] Endpoint: `GET /api/reportes/productos/top10` con parámetros: criterio, rango_fechas
- [ ] Endpoint: `GET /api/reportes/productos/huesos` con filtros
- [ ] Endpoint: `GET /api/reportes/productos/completo` con todos los filtros
- [ ] Lógica para calcular días sin vender
- [ ] Lógica para excluir productos creados < 30 días de huesos
- [ ] Cálculo de comparativas vs periodo anterior
- [ ] Servicio de exportación a PDF para rankings
- [ ] Servicio de exportación a Excel para rankings
- [ ] Optimización de queries con índices apropiados
- [ ] Tests unitarios para lógica de ranking

### Frontend
- [ ] Hacer clicable la tarjeta "Producto Más Vendido" en dashboard
- [ ] Componente ModalRankingProductos con dos pestañas
- [ ] Pestaña Top 10 con toggles de criterio (piezas, ingresos, ganancia)
- [ ] Selector de filtro de tiempo (día, semana, mes, año, personalizado)
- [ ] Lista de Top 10 con todos los datos especificados
- [ ] Pestaña Productos Hueso con lista y datos especificados
- [ ] Íconos de tendencia (↑ ↓ →) con colores
- [ ] Botón "Ver Reporte Completo" que navega a página de reportes
- [ ] Página `/reportes/productos` con lista completa y filtros avanzados
- [ ] Botones de exportar PDF/Excel funcionales
- [ ] Adaptación a modo claro/oscuro
- [ ] Estados de carga y skeleton loaders
- [ ] Manejo de errores y mensajes vacíos ("No hay datos")
- [ ] Responsive design para móvil

## 💡 Notas Adicionales

### Orden Sugerido de Desarrollo
1. **Primero:** Definir métricas de ranking (ventas unidades, ventas $, margen, rotación, combinación)
2. **Segundo:** Crear vistas materializadas o tablas de agregación para performance
3. **Tercero:** Implementar algoritmos de scoring ponderado (ej: 40% ventas + 30% margen + 30% rotación)
4. **Cuarto:** Endpoints de ranking con filtros múltiples (fecha, categoría, sucursal, proveedor)
5. **Quinto:** UI de tablas clasificatorias con paginación y exportación
6. **Sexto:** Gráficas comparativas y evolución temporal del ranking

### Puntos Críticos
- ⚠️ **CRÍTICO:** El ranking debe ser configurable: usuario puede cambiar pesos de cada métrica
- ⚠️ Considerar estacionalidad: comparar contra período equivalente (no mes anterior si es producto estacional)
- ⚠️ Normalizar datos: productos nuevos no pueden competir con productos de años en ranking crudo
- ⚠️ Segmentar rankings por categoría (no mezclar productos de diferentes gamas/tipos)

### Recomendaciones de UX
- Múltiples vistas de ranking: Top 10, Bottom 10, Más Rentables, Mayor Rotación, Tendencias
- Badges visuales: "🔥 Trending", "📈 Subiendo", "📉 Bajando", "⭐ Nuevo en top"
- Permitir guardar rankings personalizados como favoritos
- Exportar ranking a PDF/Excel con un clic
- Vista de "ficha de producto" desde el ranking con un click

### Dependencias con Otras Fases
- Requiere datos históricos de ventas (mínimo 3 meses para rankings significativos)
- Depende de fase de rentabilidad (bloque 5.1) para ranking por margen
- Integrará con alertas inteligentes (Bloque 8) para notificar cambios drásticos en ranking

### Advertencias Comunes
- ❌ No usar rankings con menos de 30 días de datos históricos (poco representativo)
- ❌ No olvidar excluir productos descontinuados o sin stock
- ❌ Evitar rankings estáticos; deben recalcularse periódicamente (diario/semanal)
- ❌ No mostrar rankings sin contexto (incluir métricas raw junto al ranking)

### Algoritmos Sugeridos
- **Score ABC:** Clasificación Pareto (A=top 20% productos que generan 80% ventas)
- **Score de Rotación:** `(ventas_últimos_30_días / stock_promedio)` 
- **Score Compuesto:** `0.4 * normalizar(ventas) + 0.3 * normalizar(margen) + 0.3 * normalizar(rotación)`
- **Tendencia:** Comparar posición actual vs posición hace 30/60/90 días

## 🔒 CONSIDERACIONES TÉCNICAS

### Performance
- Usar queries optimizados con GROUP BY y agregaciones de BD
- Indexar: `fecha_venta`, `producto_id`, `estado_producto`
- Cachear resultados de Top 10 por 15-30 minutos (dependiendo de volumen de ventas)
- Lazy loading para la lista completa de productos (paginación o infinite scroll)
- Evitar N+1 queries al obtener datos de productos

### UX/UI
- El modal debe abrir rápido (< 1 segundo)
- Mostrar skeleton loaders mientras cargan datos
- Animaciones suaves al cambiar entre tabs y filtros
- Tooltips explicativos en métricas complejas (ganancia, margen)
- Mensaje claro cuando no hay datos ("No hay productos hueso en este momento")

### Accesibilidad
- Navegación por teclado en el modal
- Labels ARIA para toggles y selectores
- Contraste de colores adecuado en modo claro/oscuro
- Textos alternativos para íconos

### Consistencia
- Mantener mismo estilo de modales que el resto de la app
- Usar misma paleta de colores para tendencias (verde=positivo, rojo=negativo)
- Mismo formato de moneda y números que el resto del sistema
- Mismos íconos y librerías ya utilizadas

### Edge Cases
- Manejar caso cuando hay menos de 10 productos vendidos
- Manejar caso cuando no hay productos hueso
- Manejar productos con variantes (¿se agrupan o se muestran separados?)
- Manejar timezone en cálculos de "últimos 30 días"
- Manejar productos eliminados/borrados lógicamente

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

- [ ] Toggle entre criterios (piezas, ingresos, ganancia) funciona correctamente
- [ ] Filtros de tiempo (día, semana, mes, año) actualizan datos
- [ ] Productos hueso excluyen correctamente los creados < 30 días
- [ ] Productos inactivos no aparecen en rankings
- [ ] Tarjeta de dashboard es clicable y abre modal
- [ ] Modal tiene dos pestañas funcionales
- [ ] Botón "Ver Reporte Completo" navega correctamente
- [ ] Página de reportes tiene filtros avanzados
- [ ] Exportación a PDF funciona con formato correcto
- [ ] Exportación a Excel funciona con datos correctos
- [ ] Íconos de tendencia muestran dirección correcta
- [ ] Comparativas vs periodo anterior son precisas
- [ ] Modo claro/oscuro se aplica correctamente
- [ ] Responsive design funciona en móvil
- [ ] No hay regresiones en el dashboard existente
- [ ] Tests unitarios pasan exitosamente