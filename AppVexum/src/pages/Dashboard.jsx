import React, { useState, useEffect } from 'react';
import { useSalesStore } from '../stores/useSalesStore';
import { Link } from 'react-router-dom';

// Iconos SVG inline para evitar dependencia de lucide-react
const TrendingUp = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ShoppingCart = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const Package = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const DollarSign = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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
      <div className="p-4 space-y-4">
        {/* Skeleton Header */}
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-6"></div>
        
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-32 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Skeleton List */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Resumen de actividad de hoy</p>
      </header>

      {/* Tarjetas de Métricas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Vendido */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <DollarSign size={16} /> Total Vendido
            </p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(stats.total)}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Número de Ventas */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <ShoppingCart size={16} /> Ventas Hoy
            </p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.count}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <ShoppingCart size={24} />
          </div>
        </div>

        {/* Producto Destacado */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Package size={16} /> Más Vendido
            </p>
            <p className="text-lg font-bold text-gray-800 mt-1 truncate max-w-[150px]">
              {topProduct ? topProduct.name : 'Sin datos'}
            </p>
            {topProduct && <p className="text-xs text-gray-500">{topProduct.soldQty} un.</p>}
          </div>
          <div className="bg-purple-100 p-3 rounded-full text-purple-600">
            <Package size={24} />
          </div>
        </div>
      </section>

      {/* Últimas Ventas */}
      <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimas Ventas</h2>
        
        {recentSales.length === 0 ? (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center">
            <AlertCircle size={40} className="mb-2 text-gray-300" />
            <p>No hay ventas registradas hoy.</p>
            <Link to="/pos" className="mt-2 text-blue-600 font-medium hover:underline">Ir al POS</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Hora</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3 font-medium">#{sale.id}</td>
                    <td className="px-3 py-3">
                      {new Date(sale.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-3 py-3 font-bold text-gray-700">{formatCurrency(sale.total)}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completada</span>
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
