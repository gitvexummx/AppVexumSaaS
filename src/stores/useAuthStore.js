import { create } from 'zustand';

/**
 * Store de autenticación y gestión del negocio actual
 * Maneja el estado del usuario logueado y su businessId para scoped IDs
 */
const useAuthStore = create((set, get) => ({
  // Estado del usuario
  user: null,
  isAuthenticated: false,
  
  // Datos del negocio
  businessId: null,
  businessName: null,
  subscriptionStatus: 'inactive', // 'active', 'inactive', 'suspended'
  subscriptionExpiry: null,
  
  // Acciones de autenticación
  login: (userData) => set({
    user: userData,
    isAuthenticated: true,
    businessId: userData.businessId || null,
    businessName: userData.businessName || null,
    subscriptionStatus: userData.subscriptionStatus || 'inactive',
    subscriptionExpiry: userData.subscriptionExpiry || null
  }),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    businessId: null,
    businessName: null,
    subscriptionStatus: 'inactive',
    subscriptionExpiry: null
  }),
  
  // Actualizar datos del negocio
  updateBusiness: (businessData) => set((state) => ({
    ...state,
    ...businessData
  })),
  
  // Verificar si la suscripción está activa
  isActiveSubscription: () => {
    const state = get();
    if (!state.subscriptionExpiry) return false;
    
    const expiryDate = new Date(state.subscriptionExpiry);
    const now = new Date();
    
    return state.subscriptionStatus === 'active' && expiryDate > now;
  },
  
  // Obtener businessId actual (helper para otros módulos)
  getCurrentBusinessId: () => get().businessId,
  
  // Inicializar store desde localStorage o sesión
  initialize: () => {
    try {
      const savedAuth = localStorage.getItem('vexum_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        set(parsed);
        return true;
      }
    } catch (error) {
      console.error('Error al inicializar auth store:', error);
    }
    return false;
  },
  
  // Persistir en localStorage
  persist: () => {
    const state = get();
    const toSave = {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      businessId: state.businessId,
      businessName: state.businessName,
      subscriptionStatus: state.subscriptionStatus,
      subscriptionExpiry: state.subscriptionExpiry
    };
    localStorage.setItem('vexum_auth', JSON.stringify(toSave));
    
    // Exponer para acceso desde db.js (temporal hasta tener mejor integración)
    window.__VEXUM_AUTH_STORE__ = {
      businessId: state.businessId
    };
  },
  
  // Limpiar localStorage al hacer logout
  clearPersistence: () => {
    localStorage.removeItem('vexum_auth');
    window.__VEXUM_AUTH_STORE__ = null;
  }
}));

export default useAuthStore;
