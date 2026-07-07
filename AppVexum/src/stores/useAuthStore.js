/**
 * useAuthStore - Store de autenticación y suscripción
 * 
 * Maneja el estado del usuario y validación de suscripción activa
 * Offline-first: los datos se guardan en settings de IndexedDB
 */
import { create } from 'zustand';
import db from '../db';

const useAuthStore = create((set, get) => ({
  // Estado del usuario
  user: null,
  isAuthenticated: false,
  
  // Estado de suscripción
  subscription: null,
  isActive: false,
  
  // Cargar datos de autenticación desde IndexedDB
  loadAuth: async () => {
    try {
      const [userEntry, subscriptionEntry] = await Promise.all([
        db.settings.get('user'),
        db.settings.get('subscription')
      ]);
      
      const user = userEntry?.value || null;
      const subscription = subscriptionEntry?.value || null;
      
      set({
        user,
        isAuthenticated: !!user,
        subscription,
        isActive: subscription?.status === 'active'
      });
    } catch (error) {
      console.error('Error cargando auth:', error);
      set({ user: null, isAuthenticated: false, subscription: null, isActive: false });
    }
  },
  
  // Guardar usuario en IndexedDB
  setUser: async (userData) => {
    try {
      await db.settings.put({ key: 'user', value: userData });
      set({ user: userData, isAuthenticated: true });
    } catch (error) {
      console.error('Error guardando usuario:', error);
      throw error;
    }
  },
  
  // Guardar suscripción en IndexedDB
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
  
  // Cerrar sesión
  logout: async () => {
    try {
      await db.settings.delete('user');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  }
}));

export default useAuthStore;
