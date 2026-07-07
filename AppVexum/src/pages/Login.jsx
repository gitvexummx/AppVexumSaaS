/**
 * Login - Página de inicio de sesión
 * 
 * Formulario simple para autenticación
 * Simula login offline-first (sin backend)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import '../Pages.css';

function Login() {
  const navigate = useNavigate();
  const { setUser, setSubscription, isAuthenticated, isActive } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Si ya está autenticado y activo, redirigir
  if (isAuthenticated && isActive) {
    navigate('/dashboard');
    return null;
  }
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulación de login offline-first
      // En producción esto validaría contra un backend
      const userData = {
        id: '1',
        name: 'Usuario Demo',
        email: formData.email,
        businessName: 'Mi Tiendita'
      };
      
      // Simular suscripción activa por defecto
      const subscriptionData = {
        plan: 'Básico',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
      };
      
      // Guardar en stores
      await setUser(userData);
      await setSubscription(subscriptionData);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo y título */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="login-title">Vexum MX</h1>
          <p className="login-subtitle">
            Sistema de punto de venta para pequeños negocios
          </p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}
          
          <div className="login-input-group">
            <label className="login-label">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu@email.com"
              className="login-input"
            />
          </div>
          
          <div className="login-input-group">
            <label className="login-label">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="login-input"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`login-button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        
        {/* Info adicional */}
        <div className="login-info">
          <p className="login-info-text">
            ¿Olvidaste tu contraseña? Contacta a soporte
          </p>
        </div>
        
        {/* Demo info */}
        <div className="login-demo-info">
          <p className="login-demo-info-text">
            Modo demo: cualquier email y contraseña funcionarán
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
