/**
 * supabase.js - Cliente de Supabase para Vexum MX
 * 
 * Configuración centralizada del cliente de Supabase
 * Usado para autenticación con Magic Link y sincronización futura
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables de Supabase no configuradas. Revisa tu archivo .env');
}

/**
 * Cliente de Supabase configurado
 * @see https://supabase.com/docs/reference/javascript/introduction
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Auto-refresh de tokens
      autoRefreshToken: true,
      // Persistencia de sesión (usa localStorage por defecto)
      persistSession: true,
      // Detectar cambios de sesión automáticamente
      detectSessionInUrl: true
    }
  }
);

/**
 * Envía un enlace mágico de inicio de sesión al email del usuario
 * @param {string} email - Email del usuario
 * @returns {Promise<{ error: null | object }>} Resultado de la operación
 */
export const sendMagicLink = async (email) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // Datos adicionales para crear el perfil del usuario
        data: {
          email: email
        }
      }
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error enviando magic link:', error);
    return { error };
  }
};

/**
 * Cierra la sesión del usuario en Supabase
 * @returns {Promise<{ error: null | object }>} Resultado de la operación
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    return { error };
  }
};

/**
 * Obtiene la sesión actual del usuario
 * @returns {Promise<{ session: object | null, error: null | object }>}
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return { session, error: null };
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    return { session: null, error };
  }
};

/**
 * Escucha cambios en la autenticación (login, logout, token refresh)
 * @param {Function} callback - Función que recibe el evento y la sesión
 * @returns {Object} Subscription que puedes cancelar con .subscription.unsubscribe()
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Evento de auth:', event, session?.user?.email);
    callback(event, session);
  });
  
  return { subscription };
};

/**
 * Crea o actualiza el perfil del usuario en la tabla profiles
 * @param {object} user - Usuario de Supabase
 * @param {string} businessName - Nombre del negocio
 * @returns {Promise<{ profile: object | null, error: null | object }>}
 */
export const upsertProfile = async (user, businessName) => {
  try {
    // Generar business_id único (UUID scoped)
    const businessId = crypto.randomUUID();
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        business_id: businessId,
        business_name: businessName,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id' // Actualizar si ya existe
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { profile, error: null };
  } catch (error) {
    console.error('Error creando/actualizando perfil:', error);
    return { profile: null, error };
  }
};

/**
 * Obtiene el perfil del usuario desde Supabase
 * @param {string} userId - ID del usuario
 * @returns {Promise<{ profile: object | null, error: null | object }>}
 */
export const getProfile = async (userId) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    
    return { profile, error: null };
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return { profile: null, error };
  }
};

export default supabase;
