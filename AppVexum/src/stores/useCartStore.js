import { create } from 'zustand';

/**
 * Store del carrito de compras para el POS
 * Maneja items del carrito, cálculos de totales y operaciones de cobro
 */
const useCartStore = create((set, get) => ({
  // Estado del carrito
  items: [],
  
  // Descuentos y ajustes
  globalDiscount: 0,        // Descuento global en pesos (number flexible)
  globalDiscountPercent: 0, // Porcentaje de descuento global
  
  // Información del cliente (opcional)
  customerName: null,
  customerPhone: null,
  
  // Notas de la venta
  notes: null,
  
  // Métodos de pago seleccionados
  paymentMethods: [],
  
  // === ACCIONES DEL CARRITO ===
  
  /**
   * Agrega un producto al carrito o incrementa su cantidad si ya existe
   * @param {Object} product - Producto completo desde products store
   * @param {number} quantity - Cantidad a agregar (default: 1)
   */
  addItem: (product, quantity = 1) => set((state) => {
    // Verificar si el producto ya está en el carrito
    const existingIndex = state.items.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      // Incrementar cantidad
      const updatedItems = [...state.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity
      };
      
      return { items: updatedItems };
    } else {
      // Agregar nuevo item
      const newItem = {
        id: product.id,
        productId: product.id,
        nombre: product.nombre,
        codigo: product.codigo,
        codigoBarras: product.codigoBarras,
        precioUnitario: product.precioOferta || product.precioVenta,
        precioOriginal: product.precioVenta,
        tieneOferta: !!product.precioOferta,
        cantidad: quantity,
        descuento: 0,
        impuestos: product.impuestos || 16,
        notas: null,
        // Calculamos el subtotal del item
        subtotal: product.precioOferta ? product.precioOferta : product.precioVenta,
        total: 0 // Se calculará abajo
      };
      
      // Calcular total del item
      newItem.total = calculateItemTotal(newItem);
      
      return { 
        items: [...state.items, newItem]
      };
    }
  }),
  
  /**
   * Actualiza la cantidad de un item en el carrito
   * @param {string} itemId - ID del producto
   * @param {number} quantity - Nueva cantidad (0 o negativo elimina el item)
   */
  updateQuantity: (itemId, quantity) => set((state) => {
    if (quantity <= 0) {
      // Eliminar item si cantidad es 0 o negativa
      return {
        items: state.items.filter(item => item.id !== itemId)
      };
    }
    
    return {
      items: state.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, quantity };
          updatedItem.total = calculateItemTotal(updatedItem);
          return updatedItem;
        }
        return item;
      })
    };
  }),
  
  /**
   * Elimina un item del carrito
   * @param {string} itemId - ID del producto a eliminar
   */
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(item => item.id !== itemId)
  })),
  
  /**
   * Aplica un descuento individual a un item
   * @param {string} itemId - ID del producto
   * @param {number} discount - Descuento en pesos (number flexible)
   */
  applyItemDiscount: (itemId, discount) => set((state) => {
    return {
      items: state.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, descuento: discount };
          updatedItem.total = calculateItemTotal(updatedItem);
          return updatedItem;
        }
        return item;
      })
    };
  }),
  
  /**
   * Aplica un descuento global a toda la venta
   * @param {number} amount - Monto del descuento en pesos
   * @param {boolean} isPercent - Si es true, amount se interpreta como porcentaje
   */
  applyGlobalDiscount: (amount, isPercent = false) => set((state) => {
    if (isPercent) {
      return {
        globalDiscountPercent: amount,
        globalDiscount: 0
      };
    } else {
      return {
        globalDiscount: amount,
        globalDiscountPercent: 0
      };
    }
  }),
  
  /**
   * Elimina todos los descuentos
   */
  clearDiscounts: () => set({
    globalDiscount: 0,
    globalDiscountPercent: 0,
    items: get().items.map(item => ({ ...item, descuento: 0 }))
  }),
  
  /**
   * Establece información del cliente
   */
  setCustomerInfo: (name, phone) => set({
    customerName: name,
    customerPhone: phone
  }),
  
  /**
   * Establece notas de la venta
   */
  setNotes: (notes) => set({ notes }),
  
  /**
   * Agrega método de pago
   */
  addPaymentMethod: (method, amount, reference = null) => set((state) => ({
    paymentMethods: [...state.paymentMethods, { method, amount, reference }]
  })),
  
  /**
   * Limpia métodos de pago
   */
  clearPaymentMethods: () => set({ paymentMethods: [] }),
  
  /**
   * Limpia completamente el carrito
   */
  clearCart: () => set({
    items: [],
    globalDiscount: 0,
    globalDiscountPercent: 0,
    customerName: null,
    customerPhone: null,
    notes: null,
    paymentMethods: []
  }),
  
  /**
   * Obtiene el número total de items en el carrito
   */
  getTotalItems: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + item.cantidad, 0);
  },
  
  /**
   * Calcula el subtotal de la venta (suma de items antes de descuentos globales)
   */
  getSubtotal: () => {
    const state = get();
    return state.items.reduce((sum, item) => {
      return sum + (item.subtotal * item.cantidad);
    }, 0);
  },
  
  /**
   * Calcula el total de impuestos
   */
  getTaxes: () => {
    const state = get();
    return state.items.reduce((sum, item) => {
      const itemTotal = calculateItemTotal(item);
      const taxAmount = (itemTotal * item.impuestos) / 100;
      return sum + taxAmount;
    }, 0);
  },
  
  /**
   * Calcula el descuento total aplicado
   */
  getTotalDiscount: () => {
    const state = get();
    
    // Descuentos por item
    const itemsDiscount = state.items.reduce((sum, item) => {
      return sum + (item.descuento * item.cantidad);
    }, 0);
    
    // Descuento global
    let globalDiscount = state.globalDiscount;
    if (state.globalDiscountPercent > 0) {
      const subtotal = get().getSubtotal() - itemsDiscount;
      globalDiscount = (subtotal * state.globalDiscountPercent) / 100;
    }
    
    return itemsDiscount + globalDiscount;
  },
  
  /**
   * Calcula el total final de la venta
   */
  getTotal: () => {
    const state = get();
    
    // Subtotal de items
    let subtotal = state.items.reduce((sum, item) => {
      return sum + (item.subtotal * item.cantidad);
    }, 0);
    
    // Restar descuentos por item
    const itemsDiscount = state.items.reduce((sum, item) => {
      return sum + (item.descuento * item.cantidad);
    }, 0);
    subtotal -= itemsDiscount;
    
    // Aplicar descuento global
    if (state.globalDiscountPercent > 0) {
      subtotal -= (subtotal * state.globalDiscountPercent) / 100;
    } else {
      subtotal -= state.globalDiscount;
    }
    
    // Sumar impuestos
    const taxes = state.items.reduce((sum, item) => {
      const itemSubtotal = (item.subtotal * item.cantidad) - (item.descuento * item.cantidad);
      const taxAmount = (itemSubtotal * item.impuestos) / 100;
      return sum + taxAmount;
    }, 0);
    
    return subtotal + taxes;
  },
  
  /**
   * Valida si el carrito está listo para cobrar
   */
  canCheckout: () => {
    const state = get();
    return state.items.length > 0;
  },
  
  /**
   * Verifica si hay stock suficiente para todos los items
   * @param {Array} products - Lista completa de productos con stock actual
   */
  checkStockAvailability: (products) => {
    const state = get();
    const issues = [];
    
    state.items.forEach(cartItem => {
      const product = products.find(p => p.id === cartItem.id);
      if (!product) {
        issues.push({
          itemId: cartItem.id,
          nombre: cartItem.nombre,
          issue: 'Producto no encontrado'
        });
      } else if (product.stock < cartItem.cantidad) {
        issues.push({
          itemId: cartItem.id,
          nombre: cartItem.nombre,
          stockDisponible: product.stock,
          cantidadRequerida: cartItem.cantidad,
          issue: 'Stock insuficiente'
        });
      }
    });
    
    return {
      available: issues.length === 0,
      issues
    };
  }
}));

/**
 * Helper para calcular el total de un item individual
 * @param {Object} item - Item del carrito
 * @returns {number} Total del item
 */
const calculateItemTotal = (item) => {
  const subtotal = item.subtotal * item.cantidad;
  const discount = item.descuento * item.cantidad;
  const taxableAmount = subtotal - discount;
  const taxes = (taxableAmount * item.impuestos) / 100;
  
  return taxableAmount + taxes;
};

export default useCartStore;
