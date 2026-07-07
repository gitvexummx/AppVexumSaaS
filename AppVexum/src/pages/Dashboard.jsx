/**
 * Dashboard - Página de inicio con resumen del negocio
 * 
 * Muestra totales del día, ventas recientes y estado de suscripción
 * Primera vista después del login
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSalesStore from '../stores/useSalesStore';
import useAuthStore from '../stores/useAuthStore';

function Dashboard() {
  const { getTodayTotal, getTodayCount, sales, loadSales } = useSalesStore();
  const { user, subscription, isActive } = useAuthStore();
  
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const [total, count] = await Promise.all([
          getTodayTotal(),
          getTodayCount()
        ]);
        setTodayTotal(total);
        setTodayCount(count);
        await loadSales();
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Formato de moneda mexicana
  const formatMXN = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header con saludo */}
      <header className="bg-blue-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold">
          Hola, {user?.name || 'Usuario'}
        </h1>
        <p className="text-blue-100 mt-1">
          {isActive ? 'Suscripción activa' : 'Sin suscripción activa'}
        </p>
      </header>
      
      {/* Tarjetas de resumen */}
      <div className="px-4 -mt-4 space-y-4">
        {/* Total vendido hoy */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Ventas de hoy</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {formatMXN(todayTotal)}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {todayCount} {todayCount === 1 ? 'venta' : 'ventas'}
          </p>
        </div>
        
        {/* Estado de suscripción */}
        {!isActive && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">
              Tu suscripción está inactiva
            </p>
            <p className="text-yellow-600 text-sm mt-1">
              Renueva para seguir usando Vexum MX
            </p>
            <Link
              to="/suscripcion"
              className="inline-block mt-3 px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors h-12 items-center justify-center"
            >
              Ver planes
            </Link>
          </div>
        )}
        
        {/* Accesos rápidos */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/pos"
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center justify-center h-32 active:bg-blue-100 transition-colors"
          >
            <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-blue-700 font-medium">Nueva Venta</span>
          </Link>
          
          <Link
            to="/inventario"
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center justify-center h-32 active:bg-green-100 transition-colors"
          >
            <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-green-700 font-medium">Inventario</span>
          </Link>
        </div>
        
        {/* Últimas ventas */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Últimas ventas</h2>
          {sales.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No hay ventas registradas
            </p>
          ) : (
            <div className="space-y-2">
              {sales.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {sale.customerName || 'Cliente'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(sale.date).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {formatMXN(sale.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
