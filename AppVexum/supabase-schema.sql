-- ============================================
-- VEXUM MX - Configuración de Base de Datos
-- ============================================
-- Este script configura Supabase para Vexum MX
-- Incluye: Auth, tablas de perfiles, RLS y triggers
-- ============================================

-- ============================================
-- 1. TABLA DE PERFILES (extiende auth.users)
-- ============================================
-- Almacena información adicional del usuario y su negocio
-- Cada usuario tiene un business_id único que lo identifica como tenant

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  business_id UUID NOT NULL DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas rápidas por business_id
CREATE INDEX IF NOT EXISTS idx_profiles_business_id ON profiles(business_id);

-- Comentario descriptivo
COMMENT ON TABLE profiles IS 'Perfiles de usuarios con identificación única por negocio (multitenant)';
COMMENT ON COLUMN profiles.business_id IS 'Identificador único del negocio - permite datos aislados por cliente';

-- ============================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Habilita seguridad a nivel de fila para proteger datos

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver su propio perfil
CREATE POLICY "Usuarios ven solo su perfil"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar solo su propio perfil
CREATE POLICY "Usuarios actualizan solo su perfil"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política: Los usuarios pueden insertar su propio perfil al registrarse
CREATE POLICY "Usuarios insertan su perfil"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 3. TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE
-- ============================================
-- Cuando se crea un usuario en auth.users, automáticamente se crea su perfil

CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, business_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'Mi Negocio')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta después de insertar en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- ============================================
-- 4. FUNCIÓN PARA ACTUALIZAR updated_at
-- ============================================
-- Actualiza automáticamente el timestamp cuando se modifica un registro

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. CONFIGURACIÓN ADICIONAL
-- ============================================

-- Permitir que el servicio anon (frontend) pueda hacer signup
-- Esto ya viene por defecto en Supabase, pero lo documentamos aquí

-- Configurar email confirmation (opcional - se puede hacer desde el dashboard)
-- ALTER DATABASE postgres SET "supabase.auth.enable_signup" = 'on';

-- ============================================
-- 6. DATOS DE EJEMPLO (OPCIONAL - SOLO DEV)
-- ============================================
-- Descomentar solo para pruebas locales

-- INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
-- VALUES ('demo@vexum.mx', crypt('demo123', gen_salt('bf')), NOW());

-- ============================================
-- INSTRUCCIONES DE USO
-- ============================================
-- 1. Ejecutar este script en el SQL Editor de Supabase
-- 2. Ir a Authentication > Email Templates para personalizar emails
-- 3. Configurar site URL en Authentication > URL Configuration
-- 4. Probar registro desde la app

-- ============================================
-- CONSULTAS ÚTILES
-- ============================================
-- Ver todos los perfiles: SELECT * FROM profiles;
-- Ver usuario actual: SELECT auth.uid(), auth.jwt();
-- Resetear secuencia (si es necesario): SELECT setval(pg_get_serial_sequence('auth.users', 'id'), coalesce(max(id)+1, 1), false) FROM auth.users;
