/**
 * Inventario - Página de gestión de productos
 * 
 * Lista todos los productos con buscador
 * Permite agregar, editar y eliminar productos
 */
import { useEffect, useState } from 'react';
import useProductsStore from '../stores/useProductsStore';
import { useToast } from '../context/ToastContext';

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
    <div className="min-h-screen bg-gray-50 pb-20 md:pl-72">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-800">Inventario</h1>
        
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
        />
      </header>
      
      {/* Lista de productos */}
      <div className="p-4">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Cargando...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {searchQuery ? 'No se encontraron productos' : 'No hay productos registrados'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {product.category || 'Sin categoría'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: <span className={product.stock <= 5 ? 'text-red-500 font-medium' : ''}>{product.stock}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatMXN(product.price)}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleOpenForm(product)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors h-10"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors h-10"
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
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors z-40"
      >
        +
      </button>
      
      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-lg sm:rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de barras
                </label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors h-12 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
