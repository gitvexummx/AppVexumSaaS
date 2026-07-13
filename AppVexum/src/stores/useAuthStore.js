/**
 * useAuthStore - Store de autenticación y suscripción para Vexum MX
 * 
 * Maneja el estado del usuario con Supabase Auth + IndexedDB local
 * Soporta Magic Link (código mágico) y sincronización offline-first
 */
import { create } from 'zustand';
import db from '../db';
import { supabase, sendMagicLink, signOut, getSession, onAuthStateChange, getProfile } from '../lib/supabase';

const useAuthStore = create((set, get) => ({
  // Estado del usuario
  user: null,
  isAuthenticated: false,
  businessId: null,
  businessName: null,
  
  // Estado de suscripción
  subscription: null,
  isActive: false,
  
  // Estado de carga
  loading: false,
  magicLinkSent: false,
  error: null,
  
  /**
   * Inicializa el listener de autenticación de Supabase
   * Debe llamarse una vez al iniciar la app
   */
  initAuthListener: () => {
    const { subscription } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Usuario autenticado en Supabase
        const profile = await get().fetchUserProfile(session.user.id);
        
        set({
          user: {
            id: session.user.id,
            email: session.user.email,
            ...profile
          },
          isAuthenticated: true,
          businessId: profile?.business_id || null,
          businessName: profile?.business_name || null,
          loading: false
        });
        
        // Guardar en IndexedDB para offline
        await get().saveUserToLocal({
          id: session.user.id,
          email: session.user.email,
          ...profile
        });
      } else if (event === 'SIGNED_OUT') {
        // Usuario cerró sesión
        await get().clearLocalAuth();
        set({
          user: null,
          isAuthenticated: false,
          businessId: null,
          businessName: null,
          subscription: null,
          isActive: false,
          loading: false
        });
      }
    });
    
    return subscription;
  },
  
  /**
   * Envía código mágico al email del usuario
   * @param {string} email - Email del usuario
   */
  sendMagicLink: async (email) => {
    set({ loading: true, error: null, magicLinkSent: false });
    
    try {
      const { error } = await sendMagicLink(email);
      
      if (error) throw error;
      
      set({ magicLinkSent: true, loading: false });
      return { success: true };
    } catch (error) {
      console.error('Error enviando magic link:', error);
      set({ 
        error: error.message || 'Error al enviar código mágico',
        loading: false 
      });
      return { success: false, error };
    }
  },
  
  /**
   * Verifica si hay una sesión activa al cargar la app
   */
  checkSession: async () => {
    set({ loading: true });
    
    try {
      const { session, error } = await getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        const profile = await get().fetchUserProfile(session.user.id);
        
        set({
          user: {
            id: session.user.id,
            email: session.user.email,
            ...profile
          },
          isAuthenticated: true,
          businessId: profile?.business_id || null,
          businessName: profile?.business_name || null,
          loading: false
        });
        
        // Cargar suscripción desde IndexedDB
        await get().loadSubscription();
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      set({ loading: false });
    }
  },
  
  /**
   * Obtiene el perfil del usuario desde Supabase
   * @param {string} userId - ID del usuario
   */
  fetchUserProfile: async (userId) => {
    try {
      const { profile } = await getProfile(userId);
      return profile || {};
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return {};
    }
  },
  
  /**
   * Guarda datos del usuario en IndexedDB (offline-first)
   * @param {object} userData - Datos del usuario
   */
  saveUserToLocal: async (userData) => {
    try {
      await db.settings.put({ key: 'user', value: userData });
    } catch (error) {
      console.error('Error guardando usuario local:', error);
    }
  },
  
  /**
   * Carga suscripción desde IndexedDB
   */
  loadSubscription: async () => {
    try {
      const subscriptionEntry = await db.settings.get('subscription');
      const subscription = subscriptionEntry?.value || null;
      
      if (subscription) {
        const now = new Date();
        const expirationDate = new Date(subscription.expiresAt);
        const isActive = subscription.status === 'active' && now < expirationDate;
        
        set({ 
          subscription,
          isActive,
          loading: false
        });
      } else {
        set({ subscription: null, isActive: false, loading: false });
      }
    } catch (error) {
      console.error('Error cargando suscripción:', error);
      set({ subscription: null, isActive: false, loading: false });
    }
  },
  
  /**
   * Guarda suscripción en IndexedDB
   * @param {object} subscriptionData - Datos de suscripción
   */
  setSubscription: async (subscriptionData) => {
    try {
      await db.settings.put({ key: 'subscription', value: subscriptionData });
      set({ 
        subscription: subscriptionData,
        isActive: subscriptionData.status === 'active'
      });
    } catch (error) {
      console.error('Error guardando suscripción:', error);
      throw error;
    }
  },
  
  /**
   * Cierra sesión en Supabase y limpia estado local
   */
  logout: async () => {
    set({ loading: true });
    
    try {
      await signOut();
      await get().clearLocalAuth();
      
      set({
        user: null,
        isAuthenticated: false,
        businessId: null,
        businessName: null,
        subscription: null,
        isActive: false,
        loading: false
      });
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      set({ loading: false });
      throw error;
    }
  },
  
  /**
   * Limpia datos de autenticación locales
   */
  clearLocalAuth: async () => {
    try {
      await db.settings.delete('user');
    } catch (error) {
      console.error('Error limpiando auth local:', error);
    }
  },
  
  /**
   * Activa suscripción demo (para pruebas)
   * @param {number} days - Días de duración
   */
  activateDemoSubscription: async (days = 30) => {
    try {
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + days);

      const subscriptionData = {
        status: 'active',
        plan: 'demo',
        startedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isDemo: true
      };

      await db.settings.put({ key: 'subscription', value: subscriptionData });
      set({ 
        subscription: subscriptionData,
        isActive: true 
      });

      return subscriptionData;
    } catch (error) {
      console.error('Error activando suscripción demo:', error);
      throw error;
    }
  },
  
  /**
   * Actualiza el nombre del negocio
   * @param {string} newName - Nuevo nombre
   */
  updateBusinessName: async (newName) => {
    set({ businessName: newName });
    
    const currentUser = get().user;
    if (currentUser?.id) {
      // Actualizar en Supabase (se implementará después)
      // Por ahora solo actualizamos localmente
      await get().saveUserToLocal({ ...currentUser, business_name: newName });
    }
  }
}));

export default useAuthStore;

