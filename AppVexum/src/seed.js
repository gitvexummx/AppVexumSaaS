/**
 * seed.js - Script para poblar la base de datos con datos de ejemplo
 * 
 * Ejecutar manualmente desde la consola del navegador o en el componente Login
 * 5 productos típicos de una tiendita mexicana
 */
import db from './db';

/**
 * Productos de ejemplo para una tienda de abarrotes
 */
const productosEjemplo = [
  {
    name: 'Coca-Cola 600ml',
    price: 18.00,
    stock: 24,
    category: 'Bebidas',
    barcode: '7501234567890'
  },
  {
    name: 'Sabritas Original 55g',
    price: 19.00,
    stock: 18,
    category: 'Botanas',
    barcode: '7501234567891'
  },
  {
    name: 'Marinela Pan Integral',
    price: 22.00,
    stock: 12,
    category: 'Panificación',
    barcode: '7501234567892'
  },
  {
    name: 'Leche Lala 1L',
    price: 24.00,
    stock: 8,
    category: 'Lácteos',
    barcode: '7501234567893'
  },
  {
    name: 'Huevo Blanco Kg',
    price: 42.00,
    stock: 15,
    category: 'Abarrotes',
    barcode: ''
  }
];

/**
 * Función para ejecutar el seed
 * Se puede llamar desde la consola del navegador: seedDatabase()
 */
export async function seedDatabase() {
  try {
    // Verificar si ya hay productos
    const existingProducts = await db.products.count();
    
    if (existingProducts > 0) {
      console.log('⚠️ La base de datos ya tiene productos. ¿Deseas borrarlos y reiniciar?');
      const confirmReset = window.confirm('Esto borrará todos los productos existentes. ¿Continuar?');
      if (!confirmReset) return;
      
      await db.products.clear();
      await db.sales.clear();
      await db.saleItems.clear();
    }
    
    // Insertar productos de ejemplo
    for (const producto of productosEjemplo) {
      await db.products.add({
        ...producto,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log('✅ Base de datos poblada con éxito!');
    console.log(`📦 ${productosEjemplo.length} productos agregados`);
    
    // Mostrar productos insertados
    const allProducts = await db.products.toArray();
    console.table(allProducts);
    
    return allProducts;
  } catch (error) {
    console.error('❌ Error al hacer seed:', error);
    throw error;
  }
}

// Exportar para uso en consola del navegador
window.seedDatabase = seedDatabase;

export default productosEjemplo;
