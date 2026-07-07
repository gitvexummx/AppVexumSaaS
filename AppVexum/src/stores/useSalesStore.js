/**
 * useSalesStore - Store de ventas y historial
 *
 * Maneja el registro de ventas en IndexedDB
 * Permite consultar historial, totales por fecha y estadísticas
 */
import { create } from 'zustand';
import db from '../db';

const useSalesStore = create((set, get) => ({
  // Estado de ventas
  sales: [],
  loading: false,

  // Cargar ventas desde IndexedDB
  loadSales: async () => {
    set({ loading: true });
    try {
      const sales = await db.sales.reverse().sortBy('date');
      set({ sales, loading: false });
    } catch (error) {
      console.error('Error cargando ventas:', error);
      set({ loading: false });
      throw error;
    }
  },

  // Guardar nueva venta con sus items
  saveSale: async (saleData, items) => {
    try {
      // Transacción para guardar venta e items juntos
      const saleId = await db.transaction('rw', db.sales, db.saleItems, async () => {
        // Guardar venta principal
        const id = await db.sales.add(saleData);

        // Guardar cada item de la venta
        for (const item of items) {
          await db.saleItems.add({
            ...item,
            saleId: id
          });
        }

        return id;
      });

      // Recargar ventas después de guardar
      await get().loadSales();

      return saleId;
    } catch (error) {
      console.error('Error guardando venta:', error);
      throw error;
    }
  },

  // Obtener ventas por fecha
  getSalesByDate: async (startDate, endDate) => {
    try {
      const sales = await db.sales
        .filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= startDate && saleDate <= endDate;
        })
        .toArray();
      return sales;
    } catch (error) {
      console.error('Error obteniendo ventas por fecha:', error);
      throw error;
    }
  },

  // Calcular total vendido hoy
  getTodayTotal: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaySales = await db.sales
        .filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= today && saleDate < tomorrow;
        })
        .toArray();

      return todaySales.reduce((sum, sale) => sum + sale.total, 0);
    } catch (error) {
      console.error('Error calculando total del día:', error);
      return 0;
    }
  },

  // Contar ventas hoy
  getTodayCount: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const count = await db.sales
        .filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= today && saleDate < tomorrow;
        })
        .count();

      return count;
    } catch (error) {
      console.error('Error contando ventas:', error);
      return 0;
    }
  },

  // Obtener últimas N ventas
  getRecentSales: async (limit = 5) => {
    try {
      const sales = await db.sales
        .orderBy('date')
        .reverse()
        .limit(limit)
        .toArray();
      return sales;
    } catch (error) {
      console.error('Error obteniendo ventas recientes:', error);
      return [];
    }
  },

  // Obtener producto más vendido del día
  getTopProductToday: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Obtener ventas de hoy
      const todaySales = await db.sales
        .filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= today && saleDate < tomorrow;
        })
        .toArray();

      if (todaySales.length === 0) return null;

      // Obtener todos los items de las ventas de hoy
      const allItems = [];
      for (const sale of todaySales) {
        const items = await db.saleItems.where('saleId').equals(sale.id).toArray();
        allItems.push(...items);
      }

      if (allItems.length === 0) return null;

      // Contar cantidad vendida por producto
      const productCounts = {};
      for (const item of allItems) {
        const productId = item.productId;
        productCounts[productId] = (productCounts[productId] || 0) + (item.quantity || 1);
      }

      // Encontrar el producto con más ventas
      let topProductId = null;
      let maxCount = 0;
      for (const [productId, count] of Object.entries(productCounts)) {
        if (count > maxCount) {
          maxCount = count;
          topProductId = productId;
        }
      }

      if (!topProductId) return null;

      // Obtener información del producto
      const product = await db.products.get(parseInt(topProductId));
      return product ? { ...product, totalSold: maxCount } : null;

    } catch (error) {
      console.error('Error obteniendo producto más vendido:', error);
      return null;
    }
  },

  // Eliminar venta (con todos sus items)
  deleteSale: async (saleId) => {
    try {
      await db.transaction('rw', db.sales, db.saleItems, async () => {
        await db.sales.delete(saleId);
        await db.saleItems.where('saleId').equals(saleId).delete();
      });

      await get().loadSales();
    } catch (error) {
      console.error('Error eliminando venta:', error);
      throw error;
    }
  }
}));

export default useSalesStore;
