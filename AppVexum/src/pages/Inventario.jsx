/**
 * Inventario - Página de gestión de productos
 * 
 * Lista todos los productos con buscador
 * Permite agregar, editar y eliminar productos
 */
import { useEffect, useState } from 'react';
import useProductsStore from '../stores/useProductsStore';
import { useToast } from '../context/ToastContext';
import '../Pages.css';

function Inventario() {
  const { products, loading, loadProducts, addProduct, updateProduct, deleteProduct, searchProducts } = useProductsStore();
  const toast = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    barcode: ''
  });
  
  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);
  
  // Filtrar productos según búsqueda
  const filteredProducts = searchProducts(searchQuery);
  
  // Manejar apertura de formulario (nuevo o editar)
  const handleOpenForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
        barcode: product.barcode || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: '',
        barcode: ''
      });
    }
    setShowForm(true);
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      category: formData.category.trim(),
      barcode: formData.barcode.trim()
    };
    
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Producto actualizado correctamente');
      } else {
        await addProduct(productData);
        toast.success('Producto guardado correctamente');
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error guardando producto:', error);
      toast.error('Error al guardar producto. Intente nuevamente.');
    }
  };
  
  // Manejar eliminación
  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando producto:', error);
      toast.error('Error al eliminar producto. Intente nuevamente.');
    }
  };
  
  // Formato de moneda
  const formatMXN = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };
  
  return (
    <div className="inventario-container">
      {/* Header */}
      <header className="inventario-header">
        <h1 className="inventario-title">Inventario</h1>
        
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="inventario-search"
        />
      </header>
      
      {/* Lista de productos */}
      <div className="inventario-list">
        {loading ? (
          <div className="inventario-loading">Cargando...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="inventario-empty">
            {searchQuery ? 'No se encontraron productos' : 'No hay productos registrados'}
          </div>
        ) : (
          <div className="inventario-products">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="inventario-product-card"
              >
                <div className="inventario-product-info">
                  <h3 className="inventario-product-name">{product.name}</h3>
                  <p className="inventario-product-category">
                    {product.category || 'Sin categoría'}
                  </p>
                  <p className="inventario-product-stock">
                    Stock: <span className={product.stock <= 5 ? 'low' : ''}>{product.stock}</span>
                  </p>
                </div>
                <div className="inventario-product-actions">
                  <p className="inventario-product-price">{formatMXN(product.price)}</p>
                  <div className="inventario-product-actions-buttons">
                    <button
                      onClick={() => handleOpenForm(product)}
                      className="inventario-edit-btn"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="inventario-delete-btn"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Botón flotante para agregar */}
      <button
        onClick={() => handleOpenForm()}
        className="inventario-fab"
      >
        +
      </button>
      
      {/* Modal de formulario */}
      {showForm && (
        <div className="inventario-modal-overlay">
          <div className="inventario-modal">
            <div className="inventario-modal-header">
              <h2 className="inventario-modal-title">
                {editingProduct ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="inventario-modal-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="inventario-form">
              <div>
                <label className="inventario-label">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="inventario-input"
                />
              </div>
              
              <div className="inventario-grid-cols-2">
                <div>
                  <label className="inventario-label">
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="1.00"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="inventario-input"
                  />
                </div>
                <div>
                  <label className="inventario-label">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="inventario-input"
                  />
                </div>
              </div>
              
              <div>
                <label className="inventario-label">
                  Categoría
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="inventario-input"
                />
              </div>
              
              <div>
                <label className="inventario-label">
                  Código de barras
                </label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="inventario-input"
                />
              </div>
              
              <div className="inventario-actions">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inventario-cancel-btn"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inventario-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inventario-submit-loading">
                      <span className="inventario-spinner"></span>
                      Guardando...
                    </span>
                  ) : (
                    editingProduct ? 'Actualizar' : 'Guardar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventario;
