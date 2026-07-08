import { NavLink } from 'react-router-dom';
import '../Elements.css';

/**
 * BottomNav - Barra de navegación responsiva
 * 
 * Navegación principal que se adapta al dispositivo:
 * - Móvil (< 768px): Barra inferior fija
 * - PC (>= 768px): Sidebar lateral fijo
 * Optimizado para touch con h-12 mínimo en botones
 */
function BottomNav() {
  const navItems = [
    {
      path: '/dashboard',
      label: 'Inicio',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/pos',
      label: 'Venta',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      path: '/inventario',
      label: 'Inventario',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      path: '/ajustes',
      label: 'Ajustes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Versión móvil: Barra inferior (visible solo en pantallas < 768px) */}
      <nav className="bottom-nav-mobile safe-area-bottom">
        <div className="bottom-nav-mobile-container">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `bottom-nav-item-mobile ${isActive ? 'bottom-nav-item-mobile-active' : 'bottom-nav-item-mobile-inactive'}`
              }
            >
              <div className={`bottom-nav-icon-mobile ${index === 0 ? '' : ''}`}>
                {item.icon}
              </div>
              <span className="bottom-nav-label-mobile">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Versión desktop: Sidebar lateral (visible solo en pantallas >= 768px) */}
      <nav className="bottom-nav-desktop">
        <div className="bottom-nav-desktop-header">
          <h1 className="bottom-nav-desktop-title">Vexum MX</h1>
          <p className="bottom-nav-desktop-subtitle">Sistema de ventas</p>
        </div>
        <div className="bottom-nav-desktop-items">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `bottom-nav-item-desktop ${isActive ? 'bottom-nav-item-desktop-active' : 'bottom-nav-item-desktop-inactive'}`
              }
            >
              <div className="bottom-nav-icon-desktop">
                {item.icon}
              </div>
              <span className="bottom-nav-label-desktop">{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="bottom-nav-desktop-footer">
          <p className="bottom-nav-desktop-copyright">© 2026 Vexum MX</p>
        </div>
      </nav>
    </>
  );
}

export default BottomNav;
