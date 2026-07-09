# BLOQUE 1, FASE 2: Gestión Multi-Sucursal, Roles y Usuarios

## ⚠️ INSTRUCCIONES CRÍTICAS PARA LA IA
1. **LEER PRIMERO:** Debes leer y entender estrictamente el archivo `AIContext.md` en la raíz del proyecto. Todas las reglas de estilo, stack tecnológico y patrones de código ahí definidos son obligatorios.
2. **NO ASUMIR:** No asumas ninguna estructura de base de datos o frontend existente sin verificarla.
3. **PREGUNTAR ANTES DE CODIFICAR:** Antes de escribir una sola línea de código, DEBES hacer una pausa y formular una lista de preguntas de clarificación (ver sección de preguntas abajo) para asegurar que entiendes el contexto actual del repositorio.

## 🎯 Objetivo
Implementar una arquitectura jerárquica de **Negocio → Sucursales → Cajas/Usuarios**, permitiendo gestión multi-tenancy (varias sucursales), roles granulares (Dueño, Gerente, Cajero, Almacenista) y autenticación por usuario (no email) específica por sucursal.

## 📋 Especificaciones Detalladas

### 1. Jerarquía de Datos
- **Nivel 1: Negocio (Padre)**
  - Datos globales: Nombre comercial, RFC, Logo, Configuración fiscal.
  - Relación: Tiene muchas Sucursales.
- **Nivel 2: Sucursal**
  - Hereda: RFC y Nombre del Negocio (solo lectura).
  - Propios: Nombre específico (ej. "Sucursal Norte"), Dirección, Teléfono, Configuración local.
  - Relación: Pertenece a un Negocio, tiene muchas Cajas, tiene muchos Usuarios.
- **Nivel 3: Caja (Punto de Venta físico/lógico)**
  - Pertenece exclusivamente a una Sucursal.
  - Estado: Abierta/Cerrada.
- **Nivel 4: Usuarios**
  - **Dueño:** Acceso global a todas las sucursales y dashboard consolidado.
  - **Gerente:** Acceso total solo a su sucursal asignada.
  - **Cajero:** Acceso limitado a POS y caja asignada.
  - **Almacenista:** Acceso a inventario y transferencias de su sucursal.
  - **Login:** Se realiza con `username` (único por sucursal o global según configuración) y contraseña. No se usa email para login diario.

### 2. Autenticación y Sesión
- Sistema de login debe solicitar: `Usuario`, `Contraseña` y seleccionar `Sucursal` (si el usuario tiene acceso a varias, o auto-seleccionar si es único).
- El token JWT debe incluir: `role`, `sucursal_id`, `negocio_id`.
- Middleware de backend debe validar permisos basados en la sucursal activa en la sesión.

### 3. Dashboard Diferenciado
- **Vista Dueño:** Gráficas consolidadas de todas las sucursales + selector para ver detalle por sucursal.
- **Vista Sucursal:** Solo datos de la sucursal logueada.

## ❓ PREGUNTAS OBLIGATORIAS DE CLARIFICACIÓN (Responder antes de codificar)
1. ¿La tabla de `users` actual ya tiene campo `role`? ¿Debemos crear una tabla separada `roles` o usamos un enum/string?
2. ¿Cómo está manejada actualmente la sesión? ¿Usamos Laravel Sanctum, JWT Auth, o sesiones nativas?
3. ¿El campo `username` debe ser único globalmente o único solo dentro de la sucursal? (Ej: ¿Puede haber un "juan" en Sucursal A y otro "juan" en Sucursal B?)
4. ¿Existe ya una tabla `sucursales` o `branches`? ¿Qué campos tiene actualmente?
5. ¿El dueño puede crear usuarios directamente desde el dashboard global, o debe entrar al contexto de una sucursal específica para crearlos?
6. ¿Para el login, la UI actual pide correo? ¿Debemos cambiar el input a "Usuario"?
7. ¿Cómo manejaremos el cambio de sucursal para el Dueño? ¿Un dropdown en el header para "Cambiar de contexto"?
8. ¿Los cajeros pueden ver información de otras cajas de su misma sucursal o solo la suya propia?
9. ¿Qué pasa si un Gerente es transferido de sucursal? ¿Se crea un nuevo usuario o se actualiza el `sucursal_id` del existente?
10. ¿Hay algún requisito de seguridad extra para la contraseña (longitud, complejidad) diferente al estándar?
11. ¿El sistema debe permitir desactivar usuarios sin borrarlos (soft delete)?
12. ¿Las sucursales tienen algún ID visible para el cliente en los tickets (ej: "Caja 3 - Sucursal 5")?
13. ¿El dueño puede ver en tiempo real qué cajeros están con sesión activa en qué sucursal?
14. ¿Existe algún límite de usuarios por sucursal según el plan del SaaS?
15. ¿Cómo se maneja actualmente el middleware de autorización? ¿Podemos inyectar la lógica de "solo sucursal X"?

## ✅ Checklist de Entregables
- [ ] Migraciones para tablas `sucursales`, actualización de `users` (role, sucursal_id, username).
- [ ] Models con relaciones correctas (Negocio, Sucursal, User).
- [ ] Seeders para crear un Super Admin/Dueño por defecto.
- [ ] Endpoints API: CRUD Sucursales, CRUD Usuarios, Login personalizado.
- [ ] Middleware de validación de Rol y Sucursal.
- [ ] Vistas/Frontend: Login adaptado, Selector de Sucursal (para dueños), Gestión de Usuarios por sucursal.
- [ ] Dashboard condicional según rol.

## 🔒 Consideraciones de Seguridad
- Validar siempre que el usuario pertenezca a la sucursal que está consultando (evitar IDOR).
- Los passwords deben estar hasheados (bcrypt/argon2).
- Logs de auditoría: Quién creó/modificó usuarios y cambios de rol.

## 💡 Notas Adicionales

### Orden Sugerido de Desarrollo
1. **Primero:** Crear migraciones para tablas `branches` (sucursales), `user_branches` (relación muchos-a-muchos), `roles`, `permissions`
2. **Segundo:** Implementar modelos con relaciones y scopes
3. **Tercero:** Middleware de autorización por sucursal y rol
4. **Cuarto:** Endpoints de asignación de usuarios a sucursales y roles
5. **Quinto:** UI de gestión de usuarios, sucursales y asignación de roles
6. **Sexto:** Testing exhaustivo de permisos cruzados

### Puntos Críticos
- ⚠️ **CRÍTICO:** Un usuario puede tener roles DIFERENTES en sucursales distintas (ej: admin en sucursal A, vendedor en sucursal B)
- ⚠️ El contexto de sucursal activa debe estar siempre presente en requests (vía header, query param, o sesión)
- ⚠️ Usuarios "super admin" pueden acceder a todas las sucursales sin restricción

### Recomendaciones de UX
- Selector de sucursal visible en header/navbar cuando usuario tiene acceso a múltiples
- Mostrar claramente en qué sucursal se está operando (breadcrumb o badge)
- Listar roles por sucursal en perfil de usuario (tabla: Sucursal | Rol | Permisos)
- Permitir cambio rápido de sucursal sin re-login

### Dependencias con Otras Fases
- Esta fase es PREREQUISITO para todas las fases posteriores que involucren permisos
- Bloque 2 (POS) dependerá de sucursal activa para filtrar productos/cajas
- Bloque 3 (configuración) permitirá configuraciones por sucursal

### Advertencias Comunes
- ❌ No asumir que usuario tiene un solo rol fijo; siempre verificar rol EN EL CONTEXTO de la sucursal actual
- ❌ No olvidar validar permisos en cada endpoint, no solo en frontend
- ❌ No hardcodear IDs de roles o sucursales; usar constantes o lookup por nombre/código
- ❌ Evitar queries que filtren por sucursal sin índices apropiados

---

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

### Backend
- [ ] Migración para tabla `branches` (id, name, code, address, phone, email, is_active, settings)
- [ ] Migración para tabla `roles` (id, name, slug, description, is_system_role)
- [ ] Migración para tabla `permissions` (id, name, slug, resource, action)
- [ ] Migración para tabla `role_permissions` (role_id, permission_id)
- [ ] Migración para tabla `user_branches` (user_id, branch_id, role_id, is_primary)
- [ ] Modelo Branch con relaciones a Users, Roles
- [ ] Modelo Role con relaciones a Permissions, Users (via user_branches)
- [ ] Modelo Permission con scopes por recurso y acción
- [ ] Modelo User actualizado con relación many-to-many a Branches through user_branches
- [ ] Middleware `SetCurrentBranch` para establecer contexto de sucursal
- [ ] Middleware `CheckPermission` para validar permisos por rol+ sucursal
- [ ] Scope global en modelos para filtrar por sucursal activa (soft delete pattern)
- [ ] Endpoints CRUD para branches (solo super admin)
- [ ] Endpoints CRUD para roles y permisos (solo super admin)
- [ ] Endpoint para asignar usuario a sucursal con rol específico
- [ ] Endpoint para cambiar rol de usuario en sucursal específica
- [ ] Endpoint para listar sucursales de usuario actual
- [ ] Endpoint para cambiar sucursal activa (sesión)
- [ ] Seeder con roles predefinidos (Super Admin, Admin, Manager, Seller, Viewer)
- [ ] Seeder con permisos básicos por recurso (usuarios, productos, ventas, reportes)
- [ ] Tests unitarios para modelos y relaciones
- [ ] Tests de integración para flujos de autorización
- [ ] Tests de seguridad (usuarios no acceden a datos de sucursales no asignadas)

### Frontend
- [ ] Selector de sucursal en header/navbar (dropdown con lista de sucursales del usuario)
- [ ] Badge indicador de sucursal activa
- [ ] Página de gestión de sucursales (lista, crear, editar, desactivar)
- [ ] Página de gestión de roles y permisos (matriz de permisos editable)
- [ ] Página de gestión de usuarios con pestaña de "Sucursales y Roles"
- [ ] Componente para asignar/quitar sucursales a usuario con selector de rol
- [ ] Formulario de creación/edición de usuario con selección de sucursal primaria
- [ ] Vista de perfil de usuario mostrando roles por sucursal
- [ ] Redirect automático a dashboard de sucursal al cambiar contexto
- [ ] Manejo de errores 403 (permiso denegado) con mensaje claro
- [ ] Ocultar UI elements (botones, menús) según permisos del rol en sucursal activa
- [ ] Directivas/custom hooks para validación de permisos en templates/componentes
- [ ] Estado global (Vuex/Pinia/Redux) con: usuario actual, sucursal activa, roles, permisos
- [ ] Persistencia de sucursal activa en localStorage/sessionStorage
- [ ] Responsive en móvil y tablet
- [ ] Tests de integración para flujos de cambio de sucursal y validación de permisos

### UX/UI
- [ ] Diseño claro de matriz de permisos (checkboxes por recurso/acción)
- [ ] Tooltips explicativos en permisos complejos
- [ ] Confirmación antes de remover usuario de sucursal o cambiar rol
- [ ] Notificación toast al cambiar sucursal exitosamente
- [ ] Loading states mientras se cargan permisos/sucursales
- [ ] Mensaje informativo cuando usuario no tiene acceso a ninguna sucursal (contactar admin)
- [ ] Accesibilidad (ARIA labels, focus management en modales)

### Performance & Security
- [ ] Caché de permisos por usuario+sucursal (invalidar al cambiar rol)
- [ ] Índices en `user_branches(user_id, branch_id)`, `role_permissions(role_id, permission_id)`
- [ ] Eager loading de relaciones para evitar N+1 queries
- [ ] Validación de permisos en backend (nunca confiar solo en frontend)
- [ ] Logs de auditoría: cambios de rol, asignación de sucursales, intentos de acceso denegado
- [ ] Rate limiting en endpoints de gestión de usuarios
- [ ] Sanitización de inputs en formularios de creación/edición

### Casos Especiales
- [ ] Usuario "super admin" salta validaciones de sucursal (acceso global)
- [ ] Sucursal "matriz" o "headquarters" con permisos especiales
- [ ] Herencia de permisos: rol base + permisos adicionales por sucursal
- [ ] Temporalidad de roles: usuario con rol válido solo por período determinado (opcional avanzado)
- [ ] Multi-empresa: si el sistema soporta múltiples organizaciones, aislar sucursales por empresa

### Migración de Datos
- [ ] Script para migrar usuarios existentes a sucursal por defecto
- [ ] Script para asignar rol "Admin" a usuarios actuales (backward compatibility)
- [ ] Plan de rollback en caso de errores en asignación de permisos

### Documentación
- [ ] Diagrama de relaciones entre usuarios, sucursales, roles y permisos
- [ ] Guía de administración de usuarios y sucursales
- [ ] Lista completa de permisos disponibles con descripciones
- [ ] FAQ sobre problemas comunes de permisos
- [ ] API documentation para endpoints de autorización