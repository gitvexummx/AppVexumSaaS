# BLOQUE 5, FASE 4: Dashboard Visual con Gráficas Interactivas

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Transformar el dashboard actual de solo mostrar números a proporcionar insights visuales mediante gráficas interactivas de barras y pastel, con selector dinámico de rango de fechas, capacidades de drill-down para análisis profundo, y adaptación completa a modo claro/oscuro.

## 📋 REQUERIMIENTOS DETALLADOS

### 17.1 Librería de Gráficas
- Usar librería open-source gratuita, optimizada y con buenas herramientas
- Recomendadas: Chart.js, ApexCharts, o Recharts (según stack tecnológico)
- Debe soportar:
  - Gráficas de barras verticales y horizontales
  - Gráficas de pastel/dona
  - Tooltips interactivos
  - Leyendas clickeables
  - Exportación de imagen (PNG)
  - Responsive automático
  - Modo claro/oscuro

### 17.2 Gráfica de Barras - Ventas por Día de la Semana
- Mostrar ventas totales agrupadas por día (Lun, Mar, Mié, Jue, Vie, Sáb, Dom)
- Eje Y: Monto en moneda ($), Eje X: Días de la semana
- Toggle para cambiar entre:
  - Ventas en $$$
  - Cantidad de transacciones
  - Ganancia bruta (si Fase 15 está activa)
- Click en una barra: Drill-down para ver detalle de ese día (abre modal o navega a reporte filtrado por esa fecha)
- Selector de rango: "Esta semana", "Semana pasada", "Últimas 4 semanas", "Personalizado"

### 17.3 Gráfica de Pastel - Ventas por Categoría
- Mostrar distribución porcentual de ventas por categoría de producto
- Cada rebanada representa una categoría
- Tooltip muestra: nombre categoría, monto ($), porcentaje (%)
- Click en rebanada: Drill-down para ver productos de esa categoría (abre reporte filtrado)
- Leyenda interactiva: click para ocultar/mostrar categorías
- Máximo 8 categorías visibles, el resto agrupar en "Otros"

### 17.4 Gráfica de Pastel - Ventas por Método de Pago
- Mostrar distribución de pagos: Efectivo, Tarjeta, Transferencia, Mixtos
- Cada rebanada representa un método de pago
- Tooltip: método, monto ($), porcentaje (%)
- Click en rebanada: Drill-down para ver ventas con ese método de pago
- Considerar pagos mixtos: ¿contabilizar proporcionalmente o como categoría "Mixto"?

### 17.5 Selector Dinámico de Tiempo
- Botón/Selector global en dashboard: "Tiempo"
- Opciones predefinidas:
  - Hoy
  - Ayer
  - Esta Semana (Lun-Dom)
  - Semana Pasada
  - Este Mes (1ro-último día)
  - Mes Pasado
  - Últimos 30 días
  - Últimos 90 días
  - Este Año
  - Año Pasado
  - Personalizado (abre datepicker de inicio y fin)
- Al cambiar selector, TODAS las gráficas y KPIs del dashboard se actualizan
- Guardar preferencia en localStorage (opcional)

### 17.6 Drill-Down (Profundización)
- Al hacer click en elemento de gráfica (barra o rebanada):
  - Opción A: Abrir modal con tabla de detalle
  - Opción B: Navegar a página de reportes con filtros pre-aplicados
  - Opción C: Expandir gráfica inline mostrando sub-categorías
- Implementar al menos una de estas opciones (preferiblemente B)
- Ejemplo: Click en "Viernes" → Reporte de ventas filtrado por todas las fechas que caigan en viernes del rango seleccionado
- Ejemplo: Click en "Categoría Bebidas" → Reporte de productos filtrado por categoría Bebidas

### 17.7 Adaptación Modo Claro/Oscuro
- Las gráficas deben detectar automáticamente el tema de la app
- Modo Claro:
  - Fondo: blanco o gris muy claro
  - Colores de barras/pastel: vibrantes pero profesionales
  - Texto: negro o gris oscuro
  - Grid lines: gris claro
- Modo Oscuro:
  - Fondo: gris oscuro o negro suave
  - Colores de barras/pastel: mismos tonos pero ajustados para contraste
  - Texto: blanco o gris claro
  - Grid lines: gris oscuro
- Transición suave al cambiar de tema (sin parpadeos)

### 17.8 KPIs Numéricos Actualizables
- Los números del dashboard (Total Vendido, Ventas Hoy, etc.) deben actualizarse al cambiar el selector de tiempo
- Mantener mismas tarjetas existentes pero hacerlas reactivas al filtro de tiempo
- Agregar indicador de período seleccionado (ej: "Ventas: $50,000 (Este Mes)")

### 17.9 Comparativas en Gráficas
- Opcional: Mostrar barras dobles o líneas de tendencia para comparar con periodo anterior
- Ej: Barra oscura = periodo actual, barra clara = periodo anterior
- O línea punteada mostrando promedio del periodo anterior
- Tooltip indica ambos valores y porcentaje de cambio

### 17.10 Performance y Optimización
- Las gráficas deben cargar en < 2 segundos
- Lazy loading de datos (no cargar todo al inicio si hay muchos datos)
- Debounce en selector de tiempo personalizado para evitar queries excesivos
- Cacheo de resultados de gráficas (5-15 minutos dependiendo de volumen)
- Skeleton loaders mientras cargan datos

### 17.11 Exportación de Gráficas
- Botón en cada gráfica: "Descargar imagen" (PNG)
- Botón: "Exportar datos" (CSV/Excel con los datos crudos de la gráfica)
- Incluir título y rango de fechas en la imagen exportada

## ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)

1. ¿Qué librerías de gráficas están actualmente instaladas en el proyecto?
2. ¿El proyecto usa Vue, React, Angular o vanilla JS?
3. ¿Existe un sistema de temas (claro/oscuro) ya implementado? ¿Cómo se detecta/cambia?
4. ¿Cuál es la estructura actual del dashboard (componentes, layout)?
5. ¿Ya hay gráficas implementadas en alguna parte del sistema?
6. ¿Qué endpoint(s) existen actualmente para obtener datos del dashboard?
7. ¿La base de datos permite agregaciones por día de semana (DAYNAME, EXTRACT, etc.)?
8. ¿Existe un componente de datepicker o selector de fechas?
9. ¿El frontend usa TypeScript o JavaScript?
10. ¿Hay un store global (Vuex, Redux, Pinia, Context) para manejar estado del dashboard?
11. ¿Se usa localStorage para preferencias de usuario?
12. ¿Qué ancho/resolución tiene el dashboard actualmente (responsive breakpoints)?
13. ¿Existen modales ya implementados que podamos reutilizar para drill-down?
14. ¿Hay páginas de reportes existentes a donde podamos navegar con filtros?
15. ¿Qué librerías se usan para manejo de fechas (moment, dayjs, date-fns)?
16. ¿El backend ya agrupa datos por categorías o métodos de pago?
17. ¿Hay límite de registros en las consultas actuales del dashboard?
18. ¿Se usa caché (Redis, memoria, query cache) en el backend?
19. ¿Los usuarios pueden personalizar el dashboard (agregar/quitar widgets)?
20. ¿Existen tests para componentes del dashboard?

## 🛠️ ENTREGABLES ESPERADOS

### Backend
- [ ] Endpoint: `GET /api/dashboard/grafica-barras-dias` con parámetro rango_fechas
- [ ] Endpoint: `GET /api/dashboard/grafica-pastel-categorias` con parámetro rango_fechas
- [ ] Endpoint: `GET /api/dashboard/grafica-pastel-metodos-pago` con parámetro rango_fechas
- [ ] Endpoint: `GET /api/dashboard/kpis` actualizado para aceptar rango_fechas
- [ ] Lógica para agrupar ventas por día de semana
- [ ] Lógica para agrupar ventas por categoría
- [ ] Lógica para agrupar ventas por método de pago (incluyendo mixtos)
- [ ] Optimización de queries con índices en `fecha_venta`
- [ ] Implementación de caché para resultados de gráficas
- [ ] Tests unitarios para agregaciones

### Frontend
- [ ] Instalar librería de gráficas seleccionada (Chart.js, ApexCharts, etc.)
- [ ] Crear componente `GraficaBarrasDiasSemana`
- [ ] Crear componente `GraficaPastelCategorias`
- [ ] Crear componente `GraficaPastelMetodosPago`
- [ ] Crear componente `SelectorTiempo` con opciones predefinidas y personalizado
- [ ] Integrar selector de tiempo en dashboard (global)
- [ ] Hacer reactivas todas las gráficas al cambiar selector de tiempo
- [ ] Actualizar KPIs numéricos con selector de tiempo
- [ ] Implementar drill-down (click en gráfica → reporte filtrado)
- [ ] Implementar detección automática de tema claro/oscuro
- [ ] Configurar colores y estilos para modo claro
- [ ] Configurar colores y estilos para modo oscuro
- [ ] Transiciones suaves al cambiar tema
- [ ] Botones de exportar imagen (PNG) en cada gráfica
- [ ] Botones de exportar datos (CSV/Excel) en cada gráfica
- [ ] Skeleton loaders para estado de carga
- [ ] Manejo de errores y estados vacíos
- [ ] Responsive design (móvil, tablet, desktop)
- [ ] Guardar preferencia de tiempo en localStorage (opcional)

## 💡 Notas Adicionales

### Orden Sugerido de Desarrollo
1. **Primero:** Definir KPIs principales a mostrar (ventas, margen, tickets promedio, productos top, etc.)
2. **Segundo:** Crear endpoints optimizados para dashboard (consultas agregadas, caché)
3. **Tercero:** Seleccionar librería de gráficas (Chart.js, ApexCharts, Recharts, D3 según stack)
4. **Cuarto:** Implementar componentes de gráficas reutilizables con props configurables
5. **Quinto:** Sistema de widgets personalizables (usuario puede agregar/quitar/reordenar)
6. **Sexto:** Filtros globales de dashboard (rango de fechas, sucursal, categoría)

### Puntos Críticos
- ⚠️ **CRÍTICO:** Performance es prioritario; dashboard no debe tardar más de 2 segundos en cargar
- ⚠️ Usar caché agresivo: KPIs pueden tener caché de 5-15 minutos dependiendo volumen
- ⚠️ Las gráficas deben ser responsive y verse bien en móvil, tablet y desktop
- ⚠️ Accesibilidad: colores con contraste suficiente, labels claros, soporte screen readers

### Recomendaciones de UX
- Widgets arrastrables y redimensionables (grid layout tipo dashboard moderno)
- Perfiles de dashboard preconfigurados: "Ventas", "Finanzas", "Inventario", "Personalizado"
- Exportar dashboard completo a PDF o imagen
- Drill-down en gráficas: click en barra/sector → ver detalle de ese dato
- Comparativas temporales automáticas: "vs período anterior", "vs mismo período año pasado"
- Modo presentación: pantalla completa sin menús laterales

### Dependencias con Otras Fases
- Consumirá datos de TODOS los módulos anteriores (ventas, inventario, gastos, rentabilidad)
- Requiere sistema de permisos (diferentes dashboards por rol)
- Integrará con alertas inteligentes (mostrar alertas activas en dashboard)

### Advertencias Comunes
- ❌ No sobrecargar dashboard con demasiados KPIs; máximo 8-12 widgets visibles simultáneamente
- ❌ Evitar consultas complejas en tiempo real; usar vistas materializadas o caché
- ❌ No usar colores engañosos en gráficas (ej: rojo para valores positivos)
- ❌ No olvidar estado de carga skeleton mientras se fetchean datos

### Librerías Recomendadas por Stack
- **React:** Recharts, Chart.js con react-chartjs-2, Nivo, Victory
- **Vue:** Vue-ApexCharts, Chart.js con vue-chartjs, Vuetify charts
- **Angular:** ng2-charts, Angular Charts, PrimeNG charts
- **Vanilla JS:** Chart.js, ApexCharts, D3.js (más complejo pero más flexible)

### Tipos de Gráficas Sugeridas
- **KPI Cards:** Ventas totales, ticket promedio, margen %, crecimiento %
- **Line Chart:** Evolución de ventas diarias/semanales/mensuales
- **Bar Chart:** Ventas por categoría/producto/sucursal
- **Pie/Donut Chart:** Distribución de ventas por categoría o método de pago
- **Heat Map:** Ventas por hora del día / día de la semana
- **Table:** Top 10 productos, últimas ventas, alertas activas

## 🔒 CONSIDERACIONES TÉCNICAS

### Performance
- Usar queries SQL optimizados con GROUP BY, DATE_FORMAT, etc.
- Indexar `fecha_venta`, `categoria_id`, `metodo_pago`
- Cachear resultados de gráficas por 15 minutos (ajustable según volumen)
- Limitar máximo de puntos de datos (ej: si rango > 1 año, agrupar por mes en vez de por día)
- Lazy load de componentes de gráficas (code splitting)

### UX/UI
- Las gráficas deben ser intuitivas sin necesidad de explicación
- Tooltips claros y concisos
- Animaciones suaves al cargar/actualizar datos (pero no exageradas)
- Feedback visual inmediato al interactuar (hover, click)
- Mensajes claros cuando no hay datos ("No hay ventas en este periodo")

### Accesibilidad
- Textos alternativos para gráficas (screen readers)
- Navegación por teclado en elementos interactivos
- Contraste de colores WCAG AA mínimo
- Patrones además de colores para diferenciar datos (importante para daltonismo)

### Consistencia
- Usar misma paleta de colores corporativos en gráficas
- Mantener mismo estilo de tooltips, leyendas y ejes
- Mismo formato de moneda y números que resto del sistema
- Mismos íconos y tipografía ya utilizados

### Edge Cases
- Manejar periodos sin ventas (gráfica vacía o en cero)
- Manejar categorías con nombres muy largos (truncar o wrap)
- Manejar demasiadas categorías (>10) agrupando en "Otros"
- Manejar timezone en agrupaciones por día
- Manejar año bisiesto en comparativas
- Manejar cambio de horario (DST) si aplica

### Internacionalización
- Días de la semana en español (Lun, Mar, etc.)
- Formato de moneda local (MXN, $, separadores)
- Primer día de la semana: Lunes (estándar ISO/México)

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

- [ ] Librería de gráficas instalada y configurada correctamente
- [ ] Gráfica de barras muestra datos correctos por día de semana
- [ ] Gráfica de pastel muestra distribución por categoría
- [ ] Gráfica de pastel muestra distribución por método de pago
- [ ] Selector de tiempo actualiza TODAS las gráficas y KPIs
- [ ] Opciones predefinidas de tiempo funcionan correctamente
- [ ] Selector personalizado de fechas funciona
- [ ] Drill-down navega a reportes con filtros aplicados
- [ ] Modo claro se ve profesional y legible
- [ ] Modo oscuro se ve profesional y legible
- [ ] Transición entre temas es suave
- [ ] Botones de exportar imagen funcionan
- [ ] Botones de exportar datos funcionan
- [ ] Skeleton loaders aparecen durante carga
- [ ] Manejo de estados vacíos es adecuado
- [ ] Responsive design funciona en todos los dispositivos
- [ ] Performance: gráficas cargan en < 2 segundos
- [ ] No hay regresiones en funcionalidades existentes del dashboard
- [ ] Tests unitarios pasan exitosamente