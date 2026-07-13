# 🔐 Configuración de Login con Supabase - Vexum MX

## Resumen de la Implementación

Se ha integrado **Supabase Auth** con Magic Link (código mágico) para autenticación segura y sin contraseñas en Vexum MX.

---

## 📋 Archivos Creados/Modificados

### Nuevos Archivos:
1. **`/src/lib/supabase.js`** - Cliente de Supabase y helpers de autenticación
2. **`/.env.example`** - Plantilla de variables de entorno
3. **`/supabase-schema.sql`** - Script SQL para configurar Supabase

### Archivos Modificados:
1. **`/src/stores/useAuthStore.js`** - Integración completa con Supabase Auth
2. **`/src/pages/Login.jsx`** - UI de login con Magic Link
3. **`/src/App.jsx`** - Inicialización del listener de auth
4. **`/package.json`** - Agregada dependencia `@supabase/supabase-js`

---

## 🚀 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Click en **"Start your project"**
3. Llena los datos:
   - **Nombre**: `vexum-mx` (o el que prefieras)
   - **Contraseña de DB**: Genera una segura y guárdala
   - **Región**: Elige la más cercana a tus usuarios (ej: US East)
4. Espera a que se cree el proyecto (~2 minutos)

### 2. Ejecutar el Script SQL

1. En tu dashboard de Supabase, ve a **SQL Editor** (menú lateral)
2. Click en **"New query"**
3. Copia todo el contenido de `supabase-schema.sql`
4. Pégalo en el editor y ejecútalo (botón **Run**)
5. Deberías ver: ✅ "Success. No rows returned"

### 3. Configurar Variables de Entorno

1. En Supabase, ve a **Settings** > **API**
2. Copia los valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

3. En tu proyecto local:
```bash
cd AppVexum
cp .env.example .env
```

4. Edita `.env` y pega tus credenciales:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configurar URLs de Redirección

1. En Supabase, ve a **Authentication** > **URL Configuration**
2. Agrega estas URLs:
   - **Site URL**: `http://localhost:5173` (para desarrollo)
   - **Redirect URLs**: 
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173/*`

3. Para producción, agrega tu dominio real:
   - `https://tudominio.com`
   - `https://tudominio.com/auth/callback`

### 5. Configurar Emails (Opcional pero recomendado)

1. Ve a **Authentication** > **Email Templates**
2. Personaliza el template de **"Magic Link"**
3. Puedes agregar tu logo y cambiar colores

---

## 🔍 ¿Cómo Funciona el Magic Link?

### Flujo de Autenticación:

```
┌─────────────┐
│  Usuario    │
│  ingresa    │
│  su email   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  App envía      │
│  request a      │
│  Supabase       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Supabase       │
│  genera token   │
│  y envía email  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Usuario recibe │
│  email con      │
│  enlace mágico  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Usuario hace   │
│  clic en enlace │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Supabase       │
│  valida token   │
│  y redirige     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  App detecta    │
│  sesión activa  │
│  y muestra      │
│  dashboard      │
└─────────────────┘
```

### Ventajas del Magic Link:

✅ **Sin contraseñas** - Más seguro, menos soporte técnico  
✅ **Fácil de usar** - Solo un clic para entrar  
✅ **Phishing-resistant** - Los tokens expiran rápido  
✅ **Mejor UX móvil** - No hay que recordar contraseñas  

---

## 🧪 Probar el Login

### Modo Desarrollo (sin configurar Supabase aún):

El código maneja gracefully cuando no hay configuración de Supabase:
- Muestra warning en consola
- Permite continuar con modo demo (si lo implementas)

### Con Supabase Configurado:

1. Inicia la app:
```bash
npm run dev
```

2. Ve a `http://localhost:5173`

3. Ingresa tu email real

4. Revisa tu bandeja de entrada

5. Haz clic en el enlace mágico

6. ¡Deberías ser redirigido al dashboard! ✅

---

## 📊 Estructura de Datos

### Tabla `profiles`:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | Primary Key, referencia a `auth.users` |
| `email` | TEXT | Email único del usuario |
| `business_id` | UUID | **Identificador único del negocio** (scoped por tenant) |
| `business_name` | TEXT | Nombre comercial del negocio |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización (auto) |

### Business ID - Clave del Multitenant:

```javascript
// Ejemplo de datos:
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "juan@tiendita.mx",
  business_id: "biz_abc123...", // ← Único por negocio
  business_name: "Tiendita Don Juan"
}
```

**Importante**: 
- Cada usuario tiene un `business_id` único generado automáticamente
- Este ID se usará para scoping de TODOS los datos (productos, ventas, etc.)
- Permite que múltiples negocios usen la misma infraestructura sin mezclar datos

---

## 🔒 Seguridad (RLS - Row Level Security)

Las políticas RLS aseguran que:

```sql
-- Usuarios solo pueden ver SU propio perfil
SELECT * FROM profiles WHERE auth.uid() = id;

-- No pueden ver perfiles de otros
-- ❌ Esto fallaría: SELECT * FROM profiles WHERE id != auth.uid();
```

**Ventajas**:
- ✅ Seguridad a nivel de base de datos
- ✅ No depende del backend
- ✅ Funciona incluso si alguien bypassea el frontend

---

## 🛠️ Próximos Pasos

### Inmediatos:
1. [ ] Crear proyecto en Supabase
2. [ ] Ejecutar script SQL
3. [ ] Configurar `.env`
4. [ ] Probar flujo completo de login

### Siguientes Fases:
- [ ] Crear tabla `products` con `business_id` para scoping
- [ ] Crear tabla `sales` con `business_id`
- [ ] Implementar sincronización offline-first ↔ Supabase
- [ ] Agregar página de "Crear mi negocio" para nuevos usuarios
- [ ] Implementar gestión de suscripciones

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste la **anon/public key**, no la service role key
- Revisa que `.env` esté en la raíz de `AppVexum/`

### Error: "Email not confirmed"
- Por defecto Supabase requiere confirmación de email
- Para desarrollo: ve a Authentication > Email Auth y desactiva "Confirm email"
- **Solo para desarrollo**, en producción déjalo activado

### No llega el email
- Revisa la carpeta de Spam
- En desarrollo, usa servicios como https://ethereal.email para testing
- O configura SMTP personalizado en Supabase

### Redirect después del login no funciona
- Verifica que las URLs estén configuradas en Supabase
- Asegúrate de que el callback route exista en tu app

---

## 📚 Recursos

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Magic Link Example](https://supabase.com/docs/guides/auth/auth-magic-link)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Multitenant with Supabase](https://supabase.com/blog/multitenant-apps-with-row-level-security)

---

**¿Listo para continuar?** Una vez configurado Supabase, podemos implementar:
- Registro de nuevos negocios
- Sincronización de datos locales ↔ nube
- Gestión de suscripciones y pagos

¡Avísame cuando tengas Supabase configurado para seguir! 🚀
