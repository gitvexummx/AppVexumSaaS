# Fase 9: Gestión Multi-Sucursal, Roles y Usuarios

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