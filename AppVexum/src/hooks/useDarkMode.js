import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Leer preferencia guardada en LocalStorage al inicializar
    const saved = localStorage.getItem('vexum-dark-mode');
    return saved === 'true';
  });

  useEffect(() => {
    // Guardar en LocalStorage cada vez que cambie el modo
    localStorage.setItem('vexum-dark-mode', isDarkMode.toString());
    
    // Aplicar clase 'dark' al elemento root para estilos globales
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleDarkMode };
};
