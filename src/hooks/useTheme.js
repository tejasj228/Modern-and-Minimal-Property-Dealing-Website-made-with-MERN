import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if localStorage is available (for SSR compatibility)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const updateNavbarStyles = () => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;

      if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (window.scrollY > 100) {
          navbar.style.background = 'rgba(26, 26, 26, 0.99)';
          navbar.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.5)';
        } else {
          navbar.style.background = 'rgba(42, 42, 42, 0.98)';
          navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
        }
      } else {
        document.body.classList.remove('dark-mode');
        if (window.scrollY > 100) {
          navbar.style.background = 'rgba(235, 235, 235, 0.99)';
          navbar.style.boxShadow = '0 15px 35px rgba(44, 62, 80, 0.2)';
        } else {
          navbar.style.background = 'rgba(245, 245, 245, 0.98)';
          navbar.style.boxShadow = '0 10px 30px rgba(44, 62, 80, 0.15)';
        }
      }
    };

    updateNavbarStyles();
    
    // Save theme preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    // Add scroll listener for navbar
    const handleScroll = () => {
      updateNavbarStyles();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return { isDarkMode, toggleTheme };
};