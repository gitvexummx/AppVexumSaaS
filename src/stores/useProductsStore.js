import { create } from 'zustand';
import { queryRecords, createRecord, updateRecord, deleteRecord } from '../db/db.js';

/**
 * Store de productos para gestión del inventario
 * Maneja CRUD local de productos con scoped IDs por negocio
 */
const useProductsStore = create((set, get) => ({
  // Estado
  products: [],
  isLoading: false,
  error: null,
  lastSync: null,
  
  // Filtros y búsqueda
  searchQuery: '',
  categoryFilter: null,
  
  // Acciones - Carga de productos
  loadProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await queryRecords('productos');
      set({ 
        products, 
        isLoading: false,
        lastSync: new Date()
      });
      return products;
    } catch (error) {
      console.error('Error al cargar productos:', error);
      set({ 
        error: 'No se pudieron cargar los productos', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Crear producto
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = {
        ...productData,
        activo: productData.activo !== undefined ? productData.activo : true,
        stock: productData.stock || 0,
        stockMinimo: productData.stockMinimo || 5,
        impuestos: productData.impuestos || 16,
        permiteDescuento: productData.permiteDescuento !== undefined ? productData.permiteDescuento : true,
        unidadMedida: productData.unidadMedida || 'pieza'
      };
      
      const id = await createRecord('productos', newProduct);
      const created = { ...newProduct, id };
      
      set((state) => ({
        products: [...state.products, created],
        isLoading: false
      }));
      
      return created;
    } catch (error) {
      console.error('Error al crear producto:', error);
      set({ 
        error: 'No se pudo crear el producto', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Actualizar producto
  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      await updateRecord('productos', id, productData);
      
      set((state) => ({
        products: state.products.map(p => 
          p.id === id 
            ? { ...p, ...productData, updatedAt: new Date() }
            : p
        ),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      set({ 
        error: 'No se pudo actualizar el producto', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Eliminar producto (soft delete marcando como inactivo)
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Opción A: Soft delete (recomendado para mantener historial de ventas)
      await updateRecord('productos', id, { activo: false });
      
      set((state) => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, activo: false, updatedAt: new Date() } : p
        ),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      set({ 
        error: 'No se pudo eliminar el producto', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Hard delete (solo si es absolutamente necesario)
  hardDeleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteRecord('productos', id);
      
      set((state) => ({
        products: state.products.filter(p => p.id !== id),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error('Error al eliminar permanentemente el producto:', error);
      set({ 
        error: 'No se pudo eliminar el producto', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Actualizar stock
  updateStock: async (id, quantityChange, operation = 'add') => {
    try {
      const product = get().products.find(p => p.id === id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      
      let newStock = product.stock;
      if (operation === 'add') {
        newStock += quantityChange;
      } else if (operation === 'subtract') {
        newStock -= quantityChange;
      } else if (operation === 'set') {
        newStock = quantityChange;
      }
      
      // Validar stock no negativo
      if (newStock < 0) {
        throw new Error('El stock no puede ser negativo');
      }
      
      await updateRecord('productos', id, { stock: newStock });
      
      set((state) => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, stock: newStock, updatedAt: new Date() } : p
        )
      }));
      
      return newStock;
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  },
  
  // Búsqueda de productos
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Filtro por categoría
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  
  // Obtener productos filtrados
  getFilteredProducts: () => {
    const state = get();
    let filtered = state.products;
    
    // Filtrar por búsqueda
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(query) ||
        p.codigo?.toLowerCase().includes(query) ||
        p.codigoBarras?.toLowerCase().includes(query)
      );
    }
    
    // Filtrar por categoría
    if (state.categoryFilter) {
      filtered = filtered.filter(p => p.categoria === state.categoryFilter);
    }
    
    // Solo mostrar activos
    filtered = filtered.filter(p => p.activo !== false);
    
    return filtered;
  },
  
  // Obtener categorías únicas
  getCategories: () => {
    const state = get();
    const categories = [...new Set(
      state.products
        .filter(p => p.activo !== false && p.categoria)
        .map(p => p.categoria)
    )];
    return categories.sort();
  },
  
  // Buscar producto por código de barras
  findByBarcode: (barcode) => {
    const state = get();
    return state.products.find(p => 
      p.codigoBarras === barcode && p.activo !== false
    ) || null;
  },
  
  // Buscar producto por código/SKU
  findByCode: (code) => {
    const state = get();
    return state.products.find(p => 
      p.codigo === code && p.activo !== false
    ) || null;
  },
  
  // Verificar stock bajo
  getLowStockProducts: () => {
    const state = get();
    return state.products.filter(p => 
      p.activo !== false && p.stock <= p.stockMinimo
    );
  },
  
  // Limpiar errores
  clearError: () => set({ error: null }),
  
  // Reiniciar estado
  reset: () => set({
    products: [],
    isLoading: false,
    error: null,
    lastSync: null,
    searchQuery: '',
    categoryFilter: null
  })
}));

export default useProductsStore;
