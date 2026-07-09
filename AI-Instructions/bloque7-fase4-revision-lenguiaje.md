# Fase 25: Revisión de Lenguaje e Internacionalización (Español LATAM)

## ⚠️ REGLAS CRÍTICAS - LEER PRIMERO

1. **LEER OBLIGATORIAMENTE**: `AIContext.md` en la raíz del proyecto antes de escribir una sola línea de código.
2. **SEGUIR ESTRICTAMENTE**: Todas las reglas, patrones de código, convenciones de nombres, estructura de carpetas y stack tecnológico definido en AIContext.md.
3. **PREGUNTAR ANTES DE CODIFICAR**: Antes de implementar cualquier funcionalidad, DEBES hacer al menos 15-20 preguntas específicas sobre el estado actual del proyecto, estructuras existentes, y detalles de implementación. NO ASUMAS NADA.
4. **VERIFICAR ESTADO ACTUAL**: Revisa archivos existentes, migraciones, modelos y componentes antes de proponer cambios.
5. **MANTENER CONSISTENCIA**: Usa los mismos patrones de código, librerías y arquitecturas ya establecidas en el proyecto.

## 🎯 OBJETIVO DE LA FASE

Estandarizar el lenguaje de la aplicación para que sea accesible, claro y regionalmente apropiado para LATAM, eliminando tecnicismos contables innecesarios e implementando un sistema de internacionalización (i18n) basado en `es-LATAM` con overrides por país.

## 📋 REQUERIMIENTOS DETALLADOS

### 25.1 Auditoría de Lenguaje
- Revisar toda la interfaz (frontend) y mensajes visibles (backend responses).
- **Términos PROHIBIDOS a eliminar/cambiar**:
  - "Amortización" → "Depreciación" o "Gasto diferido" (según contexto) o eliminar si no aplica.
  - "Pasivos" → "Deudas" o "Por pagar".
  - "Activos" → "Bienes" o "Recursos".
  - "Devengado" → "Acumulado" o "Pendiente".
  - "Cargo/Abono" (sentido contable estricto) → "Ingreso/Egreso" o "Entrada/Salida".
  - "Cuenta por cobrar" → "Por cobrar".
- **Términos PREFERIDOS**:
  - "Ganancia", "Utilidad".
  - "Stock" (en vez de "Existencias" o "Inventario disponible").
  - "Venta", "Ingreso".
  - "Gasto", "Egreso".
  - "Cliente", "Comprador".
  - "Producto", "Artículo".

### 25.2 Sistema de Internacionalización (i18n)
- Usar librería estándar según framework (ej: `vue-i18n`, `react-i18next`, `angular-i18n`).
- Estructura de archivos:
  - `locales/es-LATAM.json` (base común para toda Latinoamérica).
  - `locales/es-MX.json`, `es-CO.json`, `es-AR.json`, etc. (overrides específicos por país).
- El sistema cargará automáticamente el archivo del país configurado en la cuenta (Fase 19), cayendo a `es-LATAM` si no hay override.

### 25.3 Gestión de Archivos de Idioma
- Archivos JSON con claves anidadas por sección:
  ```json
  {
    "dashboard": {
      "titulo": "Panel Principal",
      "ventas_hoy": "Ventas de Hoy"
    },
    "productos": {
      "stock": "Stock Disponible",
      "precio": "Precio"
    },
    "mensajes": {
      "error_guardar": "No se pudo guardar. Intenta de nuevo."
    }
  }

- Mantener manualmente estos archivos (por ahora).
- Script utilitario para encontrar textos hardcodeados pendientes de migrar.

### 25.4 Migración de Textos Hardcodeados
- Reemplazar todos los textos fijos en HTML/JS por llamadas a i18n ($t('clave')).
- Priorizar:
    - Menús y navegación.
    - Títulos de páginas.
    - Etiquetas de formularios.
    - Botones.
    - Mensajes de error y éxito.
    - Tickets y PDFs generados.
- Dejar comentarios TODO: i18n en textos complejos dinámicos.

### 25.5 Adaptación por País
- Detectar país de la cuenta (desde backend/session).
- Cargar locale correspondiente al iniciar la app.
- Ejemplos de diferencias:
- México: "Celular", "Computadora", "Factura".
- Argentina: "Móvil", "Ordenador/Compu", "Remito/Ticket".
- Colombia: "Celular", "Computador", "Tiquete".
- El archivo es-CO.json solo tendrá las claves diferentes a es-LATAM.json.

### 25.6 Correos y Notificaciones
- Aplicar i18n a plantillas de correos electrónicos.
- Aplicar i18n a notificaciones push (si aplican).
- Asuntos de correos también traducidos.

### 25.7 PDFs y Tickets
- Los documentos generados (tickets, reportes PDF) deben usar las claves de i18n.
- Asegurar que la fuente soporte caracteres latinos especiales (ñ, tildes).

### 25.8 Configuración de Región
- El cambio de idioma/región es AUTOMÁTICO según el país de la cuenta.
- No permitir cambio manual de idioma por ahora (para evitar inconsistencias fiscales).
- Si el país cambia (Fase 19), forzar recarga de locale.

### 25.9 Mensajes del Backend
- Los mensajes de error del backend NO se traducen en el servidor.
- El backend devuelve códigos de error o claves identificables (ej: ERROR_STOCK_INSUFICIENTE).
- El frontend mapea esas claves a mensajes traducidos.
- Excepción: Mensajes críticos de validación fiscal (ID, país) que puedan venir hardcodeados, se traducirán en frontend.

### ❓ PREGUNTAS OBLIGATORIAS (DEBES RESPONDER ANTES DE CODIFICAR)
- ¿Qué librería de i18n es la estándar para el framework frontend usado?
- ¿Existe ya alguna estructura de carpetas locales o lang?
- ¿Cuántos textos hardcodeados estimamos que hay (orden de magnitud)?
- ¿El backend devuelve mensajes de error en texto libre o códigos?
- ¿Hay plantillas de correos electrónicos ya creadas? ¿Dónde residen?
- ¿Los PDFs se generan en backend (Dompdf, TCPDF) o frontend (html2pdf)?
- ¿Existe un middleware o servicio que detecte el país del usuario actualmente?
- ¿Cómo se almacena la preferencia de país (session, token, BD)?
- ¿Hay términos específicos del negocio que deban conservarse tal cual (marca, nombres propios)?
- ¿Se requiere soporte para pluralización (ej: "1 producto" vs "2 productos")?
- ¿Hay formatos de fecha/hora que varíen por país (DD/MM/YYYY vs MM/DD/YYYY)?
- ¿El formato de moneda ya es dinámico o está hardcodeado?
- ¿Existe un diccionario o glosario oficial de términos prohibidos/preferidos?
- ¿Quiénes serán los responsables de mantener los archivos JSON de idioma?
- ¿Hay presupuesto/tiempo para traducción profesional futura (inglés, etc.)?
- ¿Los componentes de terceros (tablas, gráficas) tienen sus propios textos traducibles?
- ¿Cómo se manejan las variables dentro de los textos traducidos (interpolación)?
- ¿Existe un entorno de staging para probar cambios de idioma?
- ¿Hay tests automatizados que rompan al cambiar textos de la UI?
- ¿Se debe considerar accesibilidad (lectores de pantalla) con los nuevos textos?

### 🛠️ ENTREGABLES ESPERADOS
**Frontend**
Instalar librería de i18n (vue-i18n, react-i18next, etc.)
Crear estructura de carpetas src/locales/
Crear archivo base es-LATAM.json con todas las claves comunes
Crear archivos de override por país (es-MX.json, es-CO.json, etc.) iniciales (vacíos o con pocos cambios)
Configurar plugin de i18n en la app principal
Detectar país del usuario y cargar locale correspondiente
Migrar textos hardcodeados de vistas principales (Dashboard, POS, Inventario)
Migrar textos de formularios y validaciones
Migrar textos de menús y navegación
Migrar textos de notificaciones y toasts
Asegurar que PDFs y tickets usen i18n
Asegurar que plantillas de correo usen i18n
Script/utilidad para detectar textos hardcodeados restantes
Documentación de cómo agregar nuevas traducciones

**Backend**
Cambiar mensajes de error para devolver claves en vez de texto (ej: error.stock_insuficiente)
Asegurar que endpoints de configuración devuelvan el país correcto
(Opcional) Endpoint para actualizar diccionario de términos personalizados (futuro)

### 🔒 CONSIDERACIONES TÉCNICAS
**Consistencia**
- Usar siempre las claves de traducción, nunca concatenar strings dinámicamente si hay una clave.
- Mantener nomenclatura de claves consistente (seccion.subseccion.concepto).

**Rendimiento**
- Cargar solo el archivo de idioma necesario (code splitting).
- Cachear traducciones en el cliente.

**Mantenibilidad**
- Comentarios en archivos JSON para contextos ambiguos.
- Validación de que todas las claves usadas existan en los archivos (tests).

**UX/UI**
- Textos cortos y claros.
- Evitar jerga técnica innecesaria.
- Tonos amigables y profesionales.

**Edge Cases**
- Claves faltantes: mostrar fallback en inglés o español base, no romper la app.
- Variables no proporcionadas en interpolación: manejar gracefulmente.
- Cambios de país en caliente: recargar idioma sin requerir logout.

### ✅ CHECKLIST DE VERIFICACIÓN FINAL
- [ ] Librería i18n instalada y configurada
- [ ] Archivo base es-LATAM.json creado y completo
- [ ] Archivos de override por país funcionando
- [ ] Detección automática de país carga el idioma correcto
- [ ] Términos prohibidos eliminados/cambiados en toda la app
- [ ] Términos preferidos utilizados consistentemente
- [ ] Textos hardcodeados migrados a claves
- [ ] PDFs y tickets muestran lenguaje correcto
- [ ] Correos electrónicos usan lenguaje correcto
- [ ] Mensajes de backend mapeados correctamente
- [ ] No hay errores de consola por claves faltantes
- [ ] Pluralización funciona (si aplica)
- [ ] Formato de fechas/monedas coherente
- [ ] Tests de UI pasan
- [ ] Documentación actualizada