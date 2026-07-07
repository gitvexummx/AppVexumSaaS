# 🤖 Vexum MX - Contexto, Arquitectura y Reglas para Agente de IA

## 1. Contexto del Proyecto
Vexum MX es un SaaS/PWA "Offline-First" y "Mobile-First" diseñado para pequeños negocios en México. 
El objetivo actual es desarrollar el **MVP (Fase 1: Paquete Básico / Tier 1)**. 
El equipo de desarrollo está compuesto por desarrolladores junior/en formación que utilizan IA para acelerar el coding. **El código debe ser extremadamente limpio, modular, fácil de entender y estar bien comentado.**

## 2. Stack Tecnológico Oficial
- **Framework:** React 18+ (usando Vite como build tool).
- **Estilos:** TailwindCSS (Mobile-first, utility-first).
- **Estado Global:** Zustand (para estados de UI, carrito, y sesión).
- **Base de Datos Local:** Dexie.js (wrapper de IndexedDB) para almacenamiento offline persistente.
- **Enrutamiento:** React Router DOM v6.
- **Iconos:** Lucide-React.
- **Nota:** Next.js se usa EXCLUSIVAMENTE para la web corporativa/landing. NO usar Next.js en este repositorio de la App.

## 3. Conceptos Clave de Arquitectura
### A. Offline-First & PWA
- La app debe funcionar 100% sin internet.
- Toda lectura y escritura de datos (productos, ventas) se hace primero en **Dexie.js (IndexedDB)**.
- La sincronización con el backend en la nube es una característica futura (Fase 2). Por ahora, la app es 100% local.

### B. Validación de Suscripción (MVP)
- Por ahora, no hay backend de pagos. 
- Simularemos la validación: Al hacer login, se guarda un objeto en `localStorage` o Zustand con una fecha de expiración ficticia (ej. `expiresAt: Date.now() + 30 días`).
- Un "Guard" o "Wrapper" de rutas revisará esta fecha. Si expiró, bloquea el acceso y muestra pantalla de "Suscripción vencida".

## 4. Estructura de Datos (Dexie.js Schema)
La base de datos local debe inicializarse con este esquema base:

```javascript
// db.js
import Dexie from 'dexie';

export const db = new Dexie('VexumDB');
db.version(1).stores({
  products: '++id, name, barcode, price, stock, category',
  sales: '++id, date, total, paymentMethod, cashier',
  saleItems: '++id, saleId, productId, productName, quantity, price, subtotal',
  settings: 'key, value' // Para configuración local y token de suscripción
});
```

## 5. Manejo de Estados (Zustand)
Separa los stores por responsabilidad. No hagas un "store" gigante.
useAuthStore: Maneja el usuario logueado y el estado de la suscripción (activo/vencido).
useCartStore: Maneja los items del carrito del POS, totales, y limpieza del carrito.
useUIStore: Maneja modales abiertos, loading spinners, notificaciones (toasts).

## 6. Reglas Estrictas de Código (Para la IA)
LO MÁS IMPORTANTE: NUNCA INSTALES DEPENDENCIAS NI EDITES EL .gitifnore BAJO NINGUNA CIRCUNSTANCIA.
Componentes Pequeños: Si un componente pasa de 200 líneas, divídelo.
JSDoc: Si usamos JS, usa JSDoc para tipar las props y retornos. NO USAREMOS TS.
Tailwind: No uses CSS personalizado ni archivos .css (excepto el index.css base de Tailwind). Usa solo clases de utilidad.
Manejo de Errores: Siempre envuelve las llamadas a Dexie en try/catch y muestra un toast de error al usuario si la base de datos falla.
Comentarios Educativos: Como el equipo está aprendiendo, agrega comentarios breves explicando por qué se hace algo complejo (ej. // Usamos useMemo aquí para evitar recalcular el total en cada render).
Accesibilidad Móvil: Los botones en el POS deben ser grandes (mínimo h-12 o min-h-[48px]). Usa touch-action: manipulation para evitar doble tap zoom en iOS.

## 7. Estructura de Carpetas Sugerida
src/
├── assets/         # Imágenes, logos
├── components/     # Componentes reutilizables (Button, Modal, Input)
│   ├── ui/         # Componentes base de Tailwind
│   └── layout/     # Navbar, Sidebar, MobileBottomNav
├── db/             # Configuración de Dexie.js y schemas
├── hooks/          # Custom hooks (useProducts, useCart)
├── pages/          # Vistas principales (Login, Dashboard, POS, Inventory)
├── stores/         # Stores de Zustand
├── utils/          # Funciones helper (formatear moneda, calcular cambio)
└── App.jsx         # Rutas y providers

## 8. FASE 1: Tareas Inmediatas del MVP (Paso a Paso)
IA: Cuando te pidamos trabajar en el MVP, guíate por este orden de prioridades. No intentes hacer todo a la vez.
Paso 1: Setup y Base de Datos
Configurar Vite + React + Tailwind.
Instalar Dexie, Zustand, React Router, Lucide.
Crear el archivo db.js con el schema inicial y un script de "seed" (datos de prueba) para cargar 5 productos de ejemplo al abrir la app por primera vez.
Paso 2: Layout y Navegación Móvil
Crear un layout principal con una barra de navegación inferior (Bottom Navigation) para móvil: Inicio, POS (centro, grande), Inventario, Ajustes.
Configurar React Router para estas 4 vistas básicas.
Paso 3: Módulo de Inventario (CRUD Local)
Vista de lista de productos (buscador por nombre/código de barras).
Modal/Formulario para agregar/editar producto (Nombre, Precio, Stock, Código de Barras).
Hook useProducts que lea y escriba en Dexie.
Paso 4: Punto de Venta (POS) - El Corazón
Vista de POS: Lado izquierdo (o arriba en móvil) catálogo de productos. Lado derecho (o abajo) Carrito.
Implementar useCartStore: agregar producto, cambiar cantidad, eliminar, calcular subtotal e IVA (16% simple por ahora).
Botón "Cobrar": Modal que pida el monto recibido, calcule el cambio y confirme.
Al confirmar: Guardar la venta en la tabla sales y saleItems de Dexie, y descontar el stock en la tabla products. Limpiar carrito.
Paso 5: Dashboard y Validación de Suscripción
Pantalla de inicio: Mostrar total vendido hoy, número de transacciones.
Implementar el "Guard" de suscripción: Si la fecha local es mayor a la fecha de expiración, redirigir a una pantalla de "Pago Pendiente" que bloquee el resto de la app.
