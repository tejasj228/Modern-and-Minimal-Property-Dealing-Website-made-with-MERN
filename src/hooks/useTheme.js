import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if localStorage is available (for SSR compatibility)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        // If user has manually set a preference, use that
        return savedTheme === 'dark';
      }
      // If no saved preference, automatically detect system theme
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      const navbar = document.querySelector('.navbar');
      const mobileHeader = document.querySelector('.mobile-header');
      
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.documentElement.style.setProperty('--theme-transition', 'all 0.3s ease');
        
        // Update navbar styles for dark mode
        if (navbar && !navbar.classList.contains('transparent')) {
          // Only set background if not transparent
          if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.99)';
            navbar.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.5)';
          } else {
            navbar.style.background = 'rgba(42, 42, 42, 0.98)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
          }
        }
        
        // Update mobile header for dark mode
        if (mobileHeader) {
          mobileHeader.style.background = 'var(--bg-card)';
          mobileHeader.style.borderBottomColor = '#404040';
        }
      } else {
        document.body.classList.remove('dark-mode');
        
        // Update navbar styles for light mode
        if (navbar && !navbar.classList.contains('transparent')) {
          // Only set background if not transparent
          if (window.scrollY > 100) {
            navbar.style.background = 'rgba(235, 235, 235, 0.99)';
            navbar.style.boxShadow = '0 15px 35px rgba(44, 62, 80, 0.2)';
          } else {
            navbar.style.background = 'rgba(245, 245, 245, 0.98)';
            navbar.style.boxShadow = '0 10px 30px rgba(44, 62, 80, 0.15)';
          }
        }
        
        // Update mobile header for light mode
        if (mobileHeader) {
          mobileHeader.style.background = 'var(--bg-white)';
          mobileHeader.style.borderBottomColor = 'var(--border-light)';
        }
      }
    };

    updateTheme();
    
    // Save theme preference (only when user manually changes it)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    // Add scroll listener for navbar
    const handleScroll = () => {
      updateTheme();
    };

    window.addEventListener('scroll', handleScroll);
    
    // Listen for system theme changes and auto-update if user hasn't set a manual preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      // Only auto-update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    
    // Add smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  };

  // Function to reset to system preference
  const resetToSystemTheme = () => {
    localStorage.removeItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPrefersDark);
  };

  return { 
    isDarkMode, 
    toggleTheme,
    resetToSystemTheme // Optional: expose this if you want a "reset to system" button
  };
};