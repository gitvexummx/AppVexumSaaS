/**
 * useProductsStore - Store de productos e inventario
 * 
 * Maneja CRUD de productos offline-first
 * Todos los cambios se sincronizan con IndexedDB
 */
import { create } from 'zustand';
import db from '../db';

const useProductsStore = create((set, get) => ({
  // Estado de productos
  products: [],
  loading: false,
  
  // Cargar todos los productos desde IndexedDB
  loadProducts: async () => {
    set({ loading: true });
    try {
      const products = await db.products.toArray();
      set({ products, loading: false });
    } catch (error) {
      console.error('Error cargando productos:', error);
      set({ loading: false });
      throw error;
    }
  },
  
  // Agregar nuevo producto
  addProduct: async (productData) => {
    try {
      const id = await db.products.add({
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      set((state) => ({
        products: [...state.products, { ...productData, id }]
      }));
      
      return id;
    } catch (error) {
      console.error('Error agregando producto:', error);
      throw error;
    }
  },
  
  // Actualizar producto existente
  updateProduct: async (id, updates) => {
    try {
      await db.products.update(id, {
        ...updates,
        updatedAt: new Date()
      });
      
      set((state) => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      }));
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  },
  
  // Eliminar producto
  deleteProduct: async (id) => {
    try {
      await db.products.delete(id);
      
      set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  },
  
  // Buscar productos por nombre o categoría
  searchProducts: (query) => {
    const { products } = get();
    if (!query.trim()) return products;
    
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name?.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery)
    );
  },
  
  // Obtener producto por ID
  getProductById: (id) => {
    const { products } = get();
    return products.find(p => p.id === id);
  },
  
  // Descontar stock después de una venta
  decreaseStock: async (productId, quantity) => {
    try {
      const product = await db.products.get(productId);
      if (!product) throw new Error('Producto no encontrado');
      
      const newStock = Math.max(0, (product.stock || 0) - quantity);
      
      await db.products.update(productId, { 
        stock: newStock,
        updatedAt: new Date()
      });
      
      set((state) => ({
        products: state.products.map(p =>
          p.id === productId ? { ...p, stock: newStock } : p
        )
      }));
    } catch (error) {
      console.error('Error descontando stock:', error);
      throw error;
    }
  }
}));

export default useProductsStore;
