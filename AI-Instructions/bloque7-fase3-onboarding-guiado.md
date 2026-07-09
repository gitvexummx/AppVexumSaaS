# BLOQUE 7, FASE 3: Onboarding Guiado y Tour Interactivo

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Implementar un tour interactivo guiado usando `driver.js` para nuevos usuarios, cubriendo las funciones básicas del sistema (crear producto, realizar venta, ver reportes), con opción de saltar, reiniciar desde configuración y almacenamiento del estado en LocalStorage por dispositivo.

## 📋 REQUERIMIENTOS DETALLADOS

### 24.1 Librería a Utilizar
- Usar `driver.js` (ligera, sin dependencias, accesible).
- Configurar para resaltar elementos del DOM y mostrar tooltips explicativos.

### 24.2 Flujo del Tour
- **Activación**:
  - Automático al primer inicio de sesión (si `tour-completed` no está en LocalStorage).
  - Manual desde Configuración ("Iniciar tour de nuevo").
- **Pasos Sugeridos** (definibles en configuración JSON):
  1. Bienvenida: "¡Bienvenido a Vexum! Te mostraremos cómo usar la app."
  2. Dashboard: "Aquí ves el resumen de tu negocio."
  3. Inventario: "Gestiona tus productos aquí. ¡Sube tu primer producto!"
  4. Formulario Producto: "Llena los datos del producto (nombre, precio, stock)."
  5. POS/Ventas: "Realiza ventas rápidamente desde aquí."
  6. Escanear: "Usa el escáner o busca productos para agregar al carrito."
  7. Cobrar: "Selecciona método de pago y completa la venta."
  8. Reportes: "Consulta tus ventas y ganancias aquí."
  9. Cierre: "¡Listo! Ya sabes usar Vexum. ¿Quieres explorar por tu cuenta?"
- **Acciones**:
  - Botones: "Siguiente", "Anterior", "Saltar tour", "Finalizar".
  - Al saltar o finalizar: guardar `tour-completed: true` en LocalStorage.

### 24.3 Almacenamiento de Estado
- Usar `localStorage` clave `vexum_tour_completed`.
- Valor: `true` (completado) o `false/null` (pendiente).
- Por dispositivo: el tour puede repetirse en otros dispositivos del mismo usuario.

### 24.4 Reinicio del Tour
- En Configuración > General:
  - Botón "Ver tour de introducción nuevamente".
  - Confirmación: "¿Estás seguro de reiniciar el tour?".
  - Al aceptar: eliminar clave de LocalStorage y redirigir a inicio del tour.
- Restricciones de visibilidad del botón:
  - Visible para Dueño y Gerente siempre.
  - Visible para Cajero solo si caja cerrada o turno no activo (evitar interrupciones en venta).

### 24.5 Diseño y Adaptabilidad
- Responsive: funcionar en móvil, tablet y desktop.
- Los pasos deben adaptarse si ciertos elementos no existen (ej: si no hay ventas aún, saltar paso de reportes detallados).
- Modo claro/oscuro compatible (colores de tooltip ajustables).

### 24.6 Contenido Dinámico
- Los pasos del tour se definirán en un archivo JSON configurable.
- Permitir agregar/quitar pasos sin cambiar código duro.
- Ejemplo JSON:
  ```json
  [
    { "element": "#dashboard-card", "popover": { "title": "Dashboard", "description": "..." } },
    { "element": "#btn-nuevo-producto", "popover": { "title": "Productos", "description": "..." } }
  ]

### 24.7 Accesibilidad
- Navegación por teclado (Tab, Enter, Escape).
- Lectores de pantalla compatibles (ARIA labels en tooltips).
- Contraste de colores adecuado.

### 24.8 Analytics (Opcional)
- Registrar en logs cuántos usuarios completan el tour vs lo saltan.
- Identificar en qué paso abandonan más (para mejorar UX).

### ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)
- ¿Existe ya alguna librería de tours o guías instalada?
- ¿Qué framework frontend se usa (Vue, React, Angular)?
- ¿Cómo se estructura el layout principal (sidebar, header, contenido)?
- ¿Existen IDs únicos en los elementos clave del DOM (botones, secciones)?
- ¿El sistema de autenticación detecta el "primer login"?
- ¿Cómo se maneja LocalStorage actualmente en la app?
- ¿Existe una página de Configuración general?
- ¿Qué roles de usuario existen y cómo se validan?
- ¿El estado de la caja/turno es accesible globalmente en el frontend?
- ¿Hay componentes modales o tooltips existentes que podamos usar como referencia?
- ¿El diseño usa Tailwind, Bootstrap o CSS personalizado?
- ¿Existe un archivo de configuración JSON o similar en el frontend?
- ¿Cómo se maneja el modo claro/oscuro actualmente?
- ¿Hay analytics o logs de actividad de usuario implementados?
- ¿El tour debe pausarse si el usuario navega a otra página o es continuo?
- ¿Existen elementos dinámicos que cargan asíncronamente (afectando al tour)?
- ¿Se requiere traducción de los textos del tour (i18n)?
- ¿Hay algún límite de tiempo o expiración para el tour?
- ¿El tour debe bloquear la interacción con otros elementos mientras está activo?
- ¿Existe un sistema de notificaciones para guiar al usuario?

### 🛠️ ENTREGABLES ESPERADOS
**Frontend**
- [ ] Instalar librería driver.js
- [ ] Configurar instancia global de Driver con opciones personalizadas
- [ ] Definir pasos del tour en archivo JSON (tour-steps.json)
- [ ] Lógica de detección de primer inicio (check LocalStorage)
- [ ] Lanzamiento automático del tour al cargar dashboard si corresponde
- [ ] Implementar navegación entre pasos (Siguiente, Anterior, Saltar, Finalizar)
- [ ] Guardar estado tour-completed en LocalStorage al finalizar/saltar
- [ ] Página/Sección en Configuración: "Reiniciar tour"
- [ ] Validación de permisos para mostrar botón de reinicio (roles, estado caja)
- [ ] Estilos personalizados para tooltips (acorde al tema claro/oscuro)
- [ ] Manejo de elementos dinámicos (esperar carga antes de destacar)
- [ ] Pruebas en móvil, tablet y desktop
- [ ] Accesibilidad (teclado, screen readers)
- [ ] Documentación de cómo agregar/modificar pasos del tour

**Backend**
- [ ] (Opcional) Endpoint para registrar métricas de completion del tour
- [ ] (Opcional) Endpoint para obtener pasos del tour dinámicos (si no es JSON estático)

## 💡 NOTAS DE IMPLEMENTACIÓN

### Orden Sugerido de Desarrollo
1. **Primero:** Definir journey de onboarding: pasos críticos que todo usuario nuevo debe completar
2. **Segundo:** Crear migración para tabla `user_onboarding_progress` (trackear progreso por usuario)
3. **Tercero:** Implementar sistema de tours guiados (librería: Intro.js, Shepherd.js, Driver.js)
4. **Cuarto:** Crear componentes de tooltips, modales explicativos y checkpoints
5. **Quinto:** Lógica condicional: mostrar u ocultar pasos según rol, industria, configuración
6. **Sexto:** Dashboard de progreso de onboarding con checklist visual y recompensas/gamificación

### Puntos Críticos
- ⚠️ **CRÍTICO:** Onboarding debe ser opcional y saltabe; nunca forzar al usuario a completarlo
- ⚠️ Persistir progreso: si usuario cierra sesión a mitad, debe retomar donde dejó
- ⚠️ Personalización: onboarding diferente para Admin vs Vendedor vs Contador
- ⚠️ Performance: tours no deben ralentizar carga de página; lazy load de assets

### Recomendaciones de UX
- Progress bar visible: "Paso 3 de 8: Configurando tu primer producto"
- Botones claros: "Anterior", "Siguiente", "Saltar tour", "Ver más tarde"
- Screenshots/anotaciones visuales en cada paso (no solo texto)
- Video tutorials embebidos opcionales para pasos complejos
- Checklist lateral siempre visible durante onboarding
- Celebración al completar onboarding (confetti, badge, mensaje motivacional)
- Encuesta post-onboarding: "¿Qué tan útil fue este tutorial?" (1-5 estrellas)

### Dependencias con Otras Fases
- Requiere sistema de usuarios/roles completado (Bloque 1.2)
- Se activa después de creación de cuenta primera vez
- Puede integrarse con sistema de notificaciones para recordatorios de pasos pendientes

### Advertencias Comunes
- ❌ No hacer onboarding demasiado largo (máximo 8-10 pasos; dividir en módulos si es más)
- ❌ No usar jerga técnica; lenguaje claro y orientado a beneficios
- ❌ Evitar tours genéricos; adaptar según industria/tipo de negocio detectado
- ❌ No olvidar versión móvil; tours deben funcionar en pantallas pequeñas

### Elementos Clave del Onboarding

**Fase 1 - Configuración Inicial:**
1. Completar perfil de empresa (nombre, logo, dirección, datos fiscales)
2. Configurar sucursal principal
3. Establecer moneda, zona horaria, idioma
4. Invitar primeros usuarios/equipo

**Fase 2 - Catálogo Básico:**
5. Crear primera categoría de productos
6. Agregar primer producto con precio y stock
7. Configurar método de pago predeterminado

**Fase 3 - Primera Venta:**
8. Realizar venta de prueba (modo sandbox/tutorial)
9. Generar primer reporte básico
10. Explorar dashboard principal

### Métricas de Éxito del Onboarding
- **Completion Rate:** % de usuarios que completan onboarding
- **Time to Complete:** Tiempo promedio desde inicio hasta finalización
- **Drop-off Points:** En qué pasos abandonan más los usuarios
- **Activation Rate:** % de usuarios que realizan acción clave (primera venta) dentro de 7 días
- **NPS Post-Onboarding:** Satisfacción con el proceso

### Librerías Recomendadas
- **Intro.js:** Muy popular, fácil implementación, temas personalizables
- **Shepherd.js:** Moderna, accesible, sin dependencias
- **Driver.js:** Ligera, sin dependencias, focus mode
- **React Joyride:** Especial para React, muy flexible
- **Vue Tour / Vue Shepherd:** Para proyectos Vue.js

### Gamificación Opcional
- Badges: "Primer Producto Creado", "Primera Venta", "Perfil Completo"
- Progress bar con porcentaje completado
- Recompensas simbólicas: avatar especial, tema premium temporal
- Leaderboard interno (si es equipo multi-usuario)

### 🔒 CONSIDERACIONES TÉCNICAS
**UX/UI**
- No bloquear completamente la app, permitir exploración.
- Textos cortos, directos y amigables.
- Imágenes o íconos en tooltips si ayudan (opcional).
- Animaciones suaves al moverse entre elementos.

**Rendimiento**
- Cargar librería del tour bajo demanda (lazy load) para no afectar carga inicial.
- No ralentizar la navegación normal.

**Mantenibilidad**
- Pasos del tour en archivo externo (JSON) para fácil edición.
- Comentarios claros en código sobre selectores de elementos.

**Edge Cases**
- Elementos del DOM no existen (ej: usuario borra productos, ¿qué mostrar en tour de inventario?).
- Pantallas pequeñas donde el tooltip tapa el elemento.
- Usuario recarga la página a mitad del tour (reiniciar o guardar progreso?).

### ✅ CHECKLIST DE VERIFICACIÓN FINAL
- [ ] Librería instalada y configurada
- [ ] Tour inicia automáticamente en primer login
- [ ] Todos los pasos definidos aparecen correctamente
- [ ] Botones de navegación funcionan
- [ ] Botón "Saltar" termina tour y guarda estado
- [ ] Botón "Finalizar" termina tour y guarda estado
- [ ] Estado se guarda en LocalStorage
- [ ] Botón de reinicio en Configuración funciona
- [ ] Restricciones de rol/caja para reinicio se cumplen
- [ ] Compatible con modo claro/oscuro
- [ ] Responsive en móvil/tablet/desktop
- [ ] Accesible por teclado
- [ ] No rompe funcionalidades existentes
- [ ] Fácil de actualizar pasos (JSON)