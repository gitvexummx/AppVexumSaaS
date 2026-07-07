/**
 * useCartStore - Store del carrito de ventas (POS)
 * 
 * Maneja el estado del carrito de ventas local
 * Calcula totales, IVA y permite gestionar items
 */
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  // Estado del carrito
  cart: [],
  customerName: '',
  
  // Agregar producto al carrito
  addToCart: (product, quantity = 1) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Si ya existe, aumentar cantidad
      set({
        cart: cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      });
    } else {
      // Si no existe, agregar nuevo item
      set({
        cart: [...cart, {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          quantity
        }]
      });
    }
  },
  
  // Actualizar cantidad de un item
  updateQuantity: (productId, quantity) => {
    const { cart } = get();
    
    if (quantity <= 0) {
      // Si cantidad es 0 o menor, eliminar del carrito
      set({ cart: cart.filter(item => item.id !== productId) });
    } else {
      set({
        cart: cart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      });
    }
  },
  
  // Eliminar item del carrito
  removeFromCart: (productId) => {
    set({
      cart: get().cart.filter(item => item.id !== productId)
    });
  },
  
  // Limpiar carrito completo
  clearCart: () => {
    set({ cart: [], customerName: '' });
  },
  
  // Establecer nombre del cliente
  setCustomerName: (name) => {
    set({ customerName: name });
  },
  
  // Calcular subtotal (sin IVA)
  getSubtotal: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  
  // Calcular IVA (16%)
  getIVA: () => {
    const subtotal = get().getSubtotal();
    return subtotal * 0.16;
  },
  
  // Calcular total (con IVA incluido)
  getTotal: () => {
    const subtotal = get().getSubtotal();
    return subtotal + get().getIVA();
  },
  
  // Obtener total de items en el carrito
  getItemCount: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },
  
  // Convertir carrito a items para guardar en venta
  getCartItems: () => {
    const { cart } = get();
    return cart.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));
  }
}));

export default useCartStore;
