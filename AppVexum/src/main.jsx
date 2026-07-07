/**
 * main.jsx - Punto de entrada de la aplicación Vexum MX
 * 
 * Renderiza el componente App en el DOM
 * Configura modo estricto de React
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Crear root y renderizar la aplicación
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
