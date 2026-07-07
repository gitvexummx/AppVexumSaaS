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
import '../Pages.css';

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
    <div className="pos-container">
      {/* Header con buscador */}
      <header className="pos-header">
        <div className="flex justify-between items-center mb-3">
          <h1 className="pos-title">Punto de Venta</h1>
          <button
            onClick={() => setShowCart(true)}
            className="pos-cart-button"
          >
            🛒 Carrito
            {getItemCount() > 0 && (
              <span className="pos-cart-badge">
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
          className="pos-search-input"
        />
      </header>
      
      {/* Catálogo de productos */}
      <div className="pos-catalog">
        {filteredProducts.length === 0 ? (
          <div className="pos-catalog-empty">
            {searchQuery ? 'No se encontraron productos' : 'No hay productos en el inventario'}
          </div>
        ) : (
          <div className="pos-products-grid">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
                className={`pos-product-card ${product.stock <= 0 ? 'disabled' : ''}`}
              >
                <h3 className="pos-product-name">{product.name}</h3>
                <p className="pos-product-stock">
                  Stock: {product.stock}
                </p>
                <p className="pos-product-price">
                  {formatMXN(product.price)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal del carrito */}
      {showCart && (
        <div className="pos-modal-overlay">
          <div className="pos-modal">
            <div className="pos-modal-header">
              <h2 className="pos-modal-title">Carrito ({getItemCount()} items)</h2>
              <button
                onClick={() => setShowCart(false)}
                className="pos-modal-close"
              >
                ×
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="pos-cart-empty">
                El carrito está vacío
              </div>
            ) : (
              <>
                {/* Lista de items */}
                <div className="pos-cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="pos-cart-item">
                      <div className="pos-cart-item-info">
                        <p className="pos-cart-item-name">{item.name}</p>
                        <p className="pos-cart-item-price">{formatMXN(item.price)} c/u</p>
                      </div>
                      <div className="pos-cart-item-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="pos-cart-quantity-btn"
                        >
                          −
                        </button>
                        <span className="pos-cart-quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="pos-cart-quantity-btn"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="pos-cart-remove-btn"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Totales */}
                <div className="pos-totals">
                  <div className="pos-total-row">
                    <span className="pos-total-label">Subtotal:</span>
                    <span className="pos-total-value">{formatMXN(getSubtotal())}</span>
                  </div>
                  <div className="pos-total-row">
                    <span className="pos-total-label">IVA (16%):</span>
                    <span className="pos-total-value">{formatMXN(getIVA())}</span>
                  </div>
                  <div className="pos-total-row pos-total-final">
                    <span>Total:</span>
                    <span className="pos-total-value">{formatMXN(getTotal())}</span>
                  </div>
                </div>
                
                {/* Botón de cobrar */}
                <button
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                  }}
                  className="pos-checkout-button"
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
        <div className="pos-modal-overlay">
          <div className="pos-modal">
            <h2 className="pos-modal-title mb-4">Finalizar venta</h2>
            
            <div className="pos-checkout-form">
              <div>
                <label className="pos-checkout-label">
                  Nombre del cliente (opcional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setLocalCustomerName(e.target.value)}
                  placeholder="Cliente"
                  className="pos-checkout-input"
                />
              </div>
              
              <div>
                <label className="pos-checkout-label mb-2">
                  Método de pago
                </label>
                <div className="pos-payment-methods">
                  <button
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`pos-payment-btn ${paymentMethod === 'efectivo' ? 'active' : ''}`}
                  >
                    Efectivo
                  </button>
                  <button
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`pos-payment-btn ${paymentMethod === 'tarjeta' ? 'active' : ''}`}
                  >
                    Tarjeta
                  </button>
                  <button
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`pos-payment-btn ${paymentMethod === 'transferencia' ? 'active' : ''}`}
                  >
                    Transferencia
                  </button>
                </div>
              </div>
              
              {/* Resumen */}
              <div className="pos-summary">
                <div className="pos-total-row">
                  <span className="pos-total-label">Subtotal:</span>
                  <span>{formatMXN(getSubtotal())}</span>
                </div>
                <div className="pos-total-row">
                  <span className="pos-total-label">IVA:</span>
                  <span>{formatMXN(getIVA())}</span>
                </div>
                <div className="pos-summary-total">
                  <span>Total a pagar:</span>
                  <span className="pos-total-value">{formatMXN(getTotal())}</span>
                </div>
              </div>
              
              {/* Acciones */}
              <div className="pos-actions">
                <button
                  onClick={() => setShowCheckout(false)}
                  disabled={isSaving}
                  className="pos-cancel-btn disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isSaving}
                  className={`pos-confirm-btn ${isSaving ? 'disabled' : 'enabled'}`}
                >
                  {isSaving ? (
                    <>
                      <div className="pos-spinner"></div>
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
