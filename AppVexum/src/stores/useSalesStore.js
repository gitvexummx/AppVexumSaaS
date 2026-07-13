import { create } from 'zustand';
import { queryRecords, createRecord, updateRecord } from '../db/db.js';

/**
 * Store de ventas para gestión del historial y procesamiento de cobros
 * Maneja CRUD de ventas, items de venta y pagos
 */
const useSalesStore = create((set, get) => ({
  // Estado
  sales: [],
  saleItems: [],
  payments: [],
  isLoading: false,
  error: null,
  lastSync: null,
  
  // Filtros
  dateFilter: {
    start: null,
    end: null
  },
  statusFilter: null,
  
  // === ACCIONES DE VENTAS ===
  
  /**
   * Carga todas las ventas del negocio
   */
  loadSales: async () => {
    set({ isLoading: true, error: null });
    try {
      const [sales, saleItems, payments] = await Promise.all([
        queryRecords('ventas'),
        queryRecords('venta_items'),
        queryRecords('pagos')
      ]);
      
      set({ 
        sales,
        saleItems,
        payments,
        isLoading: false,
        lastSync: new Date()
      });
      
      return { sales, saleItems, payments };
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      set({ 
        error: 'No se pudieron cargar las ventas', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  /**
   * Procesa una nueva venta completa
   * @param {Object} saleData - Datos de la cabecera de venta
   * @param {Array} items - Items de la venta
   * @param {Array} payments - Pagos aplicados
   * @returns {Promise<Object>} Venta creada con todos sus detalles
   */
  processSale: async (saleData, items, payments) => {
    set({ isLoading: true, error: null });
    
    try {
      // 1. Crear la venta
      const saleId = await createRecord('ventas', {
        turnoId: saleData.turnoId,
        cajaId: saleData.cajaId,
        userId: saleData.userId,
        folio: saleData.folio,
        subtotal: saleData.subtotal,
        descuento: saleData.descuento,
        impuestos: saleData.impuestos,
        total: saleData.total,
        estado: 'completada',
        fecha: new Date(),
        clienteNombre: saleData.clienteNombre,
        clienteTelefono: saleData.clienteTelefono,
        observaciones: saleData.observaciones
      });
      
      // 2. Crear cada item de la venta
      const createdItems = [];
      for (const item of items) {
        const itemId = await createRecord('venta_items', {
          ventaId: saleId,
          productoId: item.productId,
          productoNombre: item.nombre,
          productoCodigo: item.codigo,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          subtotal: item.subtotal * item.cantidad,
          descuento: item.descuento * item.cantidad,
          impuestos: item.impuestos,
          total: item.total,
          notas: item.notas
        });
        createdItems.push({ ...item, id: itemId, ventaId: saleId });
      }
      
      // 3. Crear los pagos
      const createdPayments = [];
      for (const payment of payments) {
        const paymentId = await createRecord('pagos', {
          ventaId: saleId,
          metodoPago: payment.method,
          monto: payment.amount,
          referencia: payment.reference,
          estado: 'aprobado',
          fechaProcesamiento: new Date()
        });
        createdPayments.push({ ...payment, id: paymentId, ventaId: saleId });
      }
      
      // 4. Actualizar el estado local
      const newSale = {
        id: saleId,
        ...saleData,
        estado: 'completada',
        fecha: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set((state) => ({
        sales: [...state.sales, newSale],
        saleItems: [...state.saleItems, ...createdItems],
        payments: [...state.payments, ...createdPayments],
        isLoading: false
      }));
      
      console.log('✅ Venta procesada exitosamente:', saleId);
      return {
        sale: newSale,
        items: createdItems,
        payments: createdPayments
      };
      
    } catch (error) {
      console.error('Error al procesar venta:', error);
      set({ 
        error: 'No se pudo procesar la venta', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  /**
   * Cancela una venta existente
   * @param {string} saleId - ID de la venta a cancelar
   * @param {string} reason - Motivo de la cancelación
   */
  cancelSale: async (saleId, reason = '') => {
    set({ isLoading: true, error: null });
    try {
      await updateRecord('ventas', saleId, {
        estado: 'cancelada',
        observaciones: reason ? `Cancelada: ${reason}` : undefined
      });
      
      set((state) => ({
        sales: state.sales.map(sale => 
          sale.id === saleId 
            ? { ...sale, estado: 'cancelada', updatedAt: new Date() }
            : sale
        ),
        isLoading: false
      }));
      
      console.log('✅ Venta cancelada:', saleId);
      return true;
    } catch (error) {
      console.error('Error al cancelar venta:', error);
      set({ 
        error: 'No se pudo cancelar la venta', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  /**
   * Obtiene los items de una venta específica
   * @param {string} saleId - ID de la venta
   */
  getSaleItems: (saleId) => {
    const state = get();
    return state.saleItems.filter(item => item.ventaId === saleId);
  },
  
  /**
   * Obtiene los pagos de una venta específica
   * @param {string} saleId - ID de la venta
   */
  getSalePayments: (saleId) => {
    const state = get();
    return state.payments.filter(payment => payment.ventaId === saleId);
  },
  
  /**
   * Obtiene ventas filtradas por rango de fechas y estado
   */
  getFilteredSales: () => {
    const state = get();
    let filtered = state.sales;
    
    // Filtrar por fechas
    if (state.dateFilter.start) {
      filtered = filtered.filter(sale => 
        new Date(sale.fecha) >= new Date(state.dateFilter.start)
      );
    }
    if (state.dateFilter.end) {
      filtered = filtered.filter(sale => 
        new Date(sale.fecha) <= new Date(state.dateFilter.end)
      );
    }
    
    // Filtrar por estado
    if (state.statusFilter) {
      filtered = filtered.filter(sale => sale.estado === state.statusFilter);
    }
    
    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    return filtered;
  },
  
  /**
   * Establece filtro de fechas
   */
  setDateFilter: (start, end) => set({
    dateFilter: { start, end }
  }),
  
  /**
   * Establece filtro de estado
   */
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  /**
   * Limpia filtros
   */
  clearFilters: () => set({
    dateFilter: { start: null, end: null },
    statusFilter: null
  }),
  
  /**
   * Obtiene estadísticas básicas de ventas
   */
  getSalesStats: () => {
    const state = get();
    const filteredSales = state.getFilteredSales();
    
    const totalVentas = filteredSales.length;
    const totalIngresos = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const ventasCompletadas = filteredSales.filter(s => s.estado === 'completada').length;
    const ventasCanceladas = filteredSales.filter(s => s.estado === 'cancelada').length;
    const ticketPromedio = totalVentas > 0 ? totalIngresos / totalVentas : 0;
    
    return {
      totalVentas,
      totalIngresos,
      ventasCompletadas,
      ventasCanceladas,
      ticketPromedio
    };
  },
  
  /**
   * Obtiene el siguiente folio disponible
   * @param {string} turnoId - ID del turno actual
   */
  getNextFolio: (turnoId) => {
    const state = get();
    const turnoSales = state.sales.filter(sale => 
      sale.turnoId === turnoId && sale.estado !== 'cancelada'
    );
    
    if (turnoSales.length === 0) {
      return 1;
    }
    
    const maxFolio = Math.max(...turnoSales.map(s => s.folio));
    return maxFolio + 1;
  },
  
  /**
   * Busca una venta por folio
   */
  findByFolio: (folio) => {
    const state = get();
    return state.sales.find(sale => sale.folio === folio) || null;
  },
  
  /**
   * Reinicia el estado del store
   */
  reset: () => set({
    sales: [],
    saleItems: [],
    payments: [],
    isLoading: false,
    error: null,
    lastSync: null,
    dateFilter: { start: null, end: null },
    statusFilter: null
  }),
  
  /**
   * Limpia errores
   */
  clearError: () => set({ error: null })
}));

export default useSalesStore;
