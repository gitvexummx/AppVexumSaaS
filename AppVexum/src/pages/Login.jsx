/**
 * Login - Página de inicio de sesión con Magic Link
 * 
 * Permite autenticación mediante código mágico enviado al email
 * Usa Supabase Auth para gestión segura de sesiones
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import '../Pages.css';

function Login() {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    isActive, 
    sendMagicLink, 
    checkSession,
    loading, 
    magicLinkSent, 
    error 
  } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'business' | 'sent'
  
  // Verificar sesión al cargar
  useEffect(() => {
    checkSession();
  }, []);
  
  // Si ya está autenticado y activo, redirigir
  useEffect(() => {
    if (isAuthenticated && isActive) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isActive, navigate]);
  
  // Manejar envío del email
  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    const result = await sendMagicLink(email);
    
    if (result.success) {
      setStep('sent');
    }
  };
  
  // Renderizar paso actual
  const renderStep = () => {
    switch (step) {
      case 'sent':
        return (
          <div className="login-message login-message-success">
            <div className="login-message-icon">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="login-message-title">¡Revisa tu email!</h2>
            <p className="login-message-text">
              Hemos enviado un código mágico a <strong>{email}</strong>
            </p>
            <p className="login-message-hint">
              Haz clic en el enlace para iniciar sesión automáticamente
            </p>
            <button
              onClick={() => setStep('email')}
              className="login-button login-button-secondary"
            >
              Volver e intentar con otro email
            </button>
          </div>
        );
      
      default:
        return (
          <form onSubmit={handleSendMagicLink} className="login-form">
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}
            
            <div className="login-input-group">
              <label className="login-label">
                Email de tu negocio
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@negocio.com"
                className="login-input"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`login-button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Enviando código...' : 'Enviar código mágico'}
            </button>
          </form>
        );
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
        
        {/* Contenido dinámico según el paso */}
        {renderStep()}
        
        {/* Info adicional */}
        <div className="login-info">
          <p className="login-info-text">
            ¿Necesitas ayuda? Contacta a soporte
          </p>
        </div>
        
        {/* Demo info */}
        <div className="login-demo-info">
          <p className="login-demo-info-title">¿Cómo funciona?</p>
          <ol className="login-demo-info-steps">
            <li>Ingresa tu email</li>
            <li>Recibe un código mágico en tu bandeja de entrada</li>
            <li>Haz clic en el enlace y listo! ✅</li>
          </ol>
          <p className="login-demo-info-note">
            No necesitas contraseña. Es más seguro y fácil.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
