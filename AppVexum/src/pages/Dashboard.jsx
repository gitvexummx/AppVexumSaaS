import React, { useState, useEffect } from 'react';
import { useSalesStore } from '../stores/useSalesStore';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingCart, Package, DollarSign, AlertCircle } from 'lucide-react';
import '../Pages.css';

/**
 * Dashboard con Datos Reales
 * - Conectado a useSalesStore para obtener estadísticas en tiempo real.
 * - Muestra: Total vendido hoy, # ventas, producto más vendido.
 * - Lista las últimas 5 ventas.
 * - Incluye estados de carga (skeletons) para mejor UX.
 */
const Dashboard = () => {
  const { getTodayStats, getRecentSales, getTopProduct } = useSalesStore();
  
  const [stats, setStats] = useState({ total: 0, count: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const [topProduct, setTopProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Cargar estadísticas de hoy
        const todayStats = await getTodayStats();
        setStats(todayStats);

        // Cargar últimas ventas
        const sales = await getRecentSales(5);
        setRecentSales(sales);

        // Cargar producto más vendido
        const top = await getTopProduct();
        setTopProduct(top);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [getTodayStats, getRecentSales, getTopProduct]);

  // Formateador de moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        {/* Skeleton Header */}
        <div className="skeleton-header"></div>
        
        {/* Skeleton Cards */}
        <div className="dashboard-metrics-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line long"></div>
            </div>
          ))}
        </div>

        {/* Skeleton List */}
        <div className="dashboard-section mt-6">
          <div className="skeleton-line short mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-list-item"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Resumen de actividad de hoy</p>
      </header>

      {/* Tarjetas de Métricas */}
      <section className="dashboard-metrics-grid">
        {/* Total Vendido */}
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-info">
            <p className="flex items-center gap-1">
              <DollarSign size={16} /> Total Vendido
            </p>
            <p className="dashboard-metric-value">{formatCurrency(stats.total)}</p>
          </div>
          <div className="dashboard-metric-icon">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Número de Ventas */}
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-info">
            <p className="flex items-center gap-1">
              <ShoppingCart size={16} /> Ventas Hoy
            </p>
            <p className="dashboard-metric-value">{stats.count}</p>
          </div>
          <div className="dashboard-metric-icon blue">
            <ShoppingCart size={24} />
          </div>
        </div>

        {/* Producto Destacado */}
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-info">
            <p className="flex items-center gap-1">
              <Package size={16} /> Más Vendido
            </p>
            <p className="dashboard-metric-value truncate max-w-[150px]">
              {topProduct ? topProduct.name : 'Sin datos'}
            </p>
            {topProduct && <p className="text-xs text-gray-500 dark:text-gray-400">{topProduct.soldQty} un.</p>}
          </div>
          <div className="dashboard-metric-icon purple">
            <Package size={24} />
          </div>
        </div>
      </section>

      {/* Últimas Ventas */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Últimas Ventas</h2>
        
        {recentSales.length === 0 ? (
          <div className="dashboard-empty-state">
            <AlertCircle size={40} className="mb-2 text-gray-300" />
            <p>No hay ventas registradas hoy.</p>
            <Link to="/pos" className="mt-2 text-blue-600 dark:text-blue-400 font-medium hover:underline">Ir al POS</Link>
          </div>
        ) : (
          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Hora</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 py-3 font-medium text-gray-800 dark:text-white">#{sale.id}</td>
                    <td className="px-3 py-3 text-gray-800 dark:text-white">
                      {new Date(sale.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-3 py-3 font-bold text-gray-700 dark:text-gray-300">{formatCurrency(sale.total)}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="dashboard-status-badge">Completada</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
