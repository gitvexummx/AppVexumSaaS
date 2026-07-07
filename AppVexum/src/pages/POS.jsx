/**
 * POS - Punto de Venta (Pantalla de ventas)
 * 
 * Catálogo de productos para agregar al carrito
 * Muestra carrito lateral con totales y botón de cobro
 */
import { useEffect, useState } from 'react';
import useProductsStore from '../stores/useProductsStore';
import useCartStore from '../stores/useCartStore';
import useSalesStore from '../stores/useSalesStore';
import { useToast } from '../context/ToastContext';

function POS() {
  const { products, loadProducts, searchProducts, decreaseStock } = useProductsStore();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getSubtotal, getIVA, getTotal, getItemCount, getCartItems, setCustomerName } = useCartStore();
  const { saveSale } = useSalesStore();
  const toast = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setLocalCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [isSaving, setIsSaving] = useState(false);
  
  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);
  
  // Filtrar productos
  const filteredProducts = searchProducts(searchQuery);
  
  // Formato de moneda
  const formatMXN = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };
  
  // Agregar producto al carrito
  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert('Producto sin stock');
      return;
    }
    
    const itemInCart = cart.find(item => item.id === product.id);
    const currentQty = itemInCart?.quantity || 0;
    
    if (currentQty >= product.stock) {
      alert('No hay más stock disponible');
      return;
    }
    
    addToCart(product, 1);
  };
  
  // Procesar venta
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsSaving(true);
    
    try {
      const saleData = {
        date: new Date(),
        total: getTotal(),
        subtotal: getSubtotal(),
        iva: getIVA(),
        customerName: customerName.trim() || 'Cliente',
        paymentMethod,
        itemsCount: getItemCount()
      };
      
      const items = getCartItems();
      
      // Guardar venta
      await saveSale(saleData, items);
      
      // Descontar stock de cada producto
      for (const item of cart) {
        await decreaseStock(item.id, item.quantity);
      }
      
      // Limpiar carrito
      clearCart();
      setShowCheckout(false);
      setShowCart(false);
      
      toast.success('¡Venta registrada con éxito!');
    } catch (error) {
      console.error('Error procesando venta:', error);
      toast.error('Error al procesar la venta. Intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pl-72">
      {/* Header con buscador */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold text-gray-800">Punto de Venta</h1>
          <button
            onClick={() => setShowCart(true)}
            className="relative px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-12"
          >
            🛒 Carrito
            {getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {getItemCount()}
              </span>
            )}
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
        />
      </header>
      
      {/* Catálogo de productos */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {searchQuery ? 'No se encontraron productos' : 'No hay productos en el inventario'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
                className={`bg-white rounded-lg shadow p-3 text-left active:scale-95 transition-transform ${
                  product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Stock: {product.stock}
                </p>
                <p className="font-bold text-blue-600 mt-2">
                  {formatMXN(product.price)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal del carrito */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-lg sm:rounded-lg p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Carrito ({getItemCount()} items)</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                El carrito está vacío
              </div>
            ) : (
              <>
                {/* Lista de items */}
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{formatMXN(item.price)} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-red-500 hover:text-red-700 text-xl"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Totales */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="font-medium">{formatMXN(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">IVA (16%):</span>
                    <span className="font-medium">{formatMXN(getIVA())}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatMXN(getTotal())}</span>
                  </div>
                </div>
                
                {/* Botón de cobrar */}
                <button
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                  }}
                  className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors h-12 font-bold text-lg"
                >
                  Cobrar
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Modal de checkout */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-lg sm:rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Finalizar venta</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del cliente (opcional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setLocalCustomerName(e.target.value)}
                  placeholder="Cliente"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`px-4 py-3 rounded-lg border h-12 font-medium transition-colors ${
                      paymentMethod === 'efectivo'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Efectivo
                  </button>
                  <button
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`px-4 py-3 rounded-lg border h-12 font-medium transition-colors ${
                      paymentMethod === 'tarjeta'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Tarjeta
                  </button>
                  <button
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`px-4 py-3 rounded-lg border h-12 font-medium transition-colors ${
                      paymentMethod === 'transferencia'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Transferencia
                  </button>
                </div>
              </div>
              
              {/* Resumen */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>{formatMXN(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">IVA:</span>
                  <span>{formatMXN(getIVA())}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total a pagar:</span>
                  <span className="text-green-600">{formatMXN(getTotal())}</span>
                </div>
              </div>
              
              {/* Acciones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCheckout(false)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isSaving}
                  className={`flex-1 px-4 py-3 rounded-lg transition-colors h-12 font-bold flex items-center justify-center gap-2 ${
                    isSaving
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Procesando...
                    </>
                  ) : (
                    'Confirmar venta'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POS;
