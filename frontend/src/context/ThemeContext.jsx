/**
 * Open Location Number Platform — Theme Context Provider.
 * 
 * Purpose:
 *   Manages Light / Dark theme state with persistence in localStorage and class-level document styling.
 * 
 * Related Files:
 *   - frontend/src/components/Navbar.jsx: Renders light/dark mode toggle button.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Default to light theme for clean minimalist appearance
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('oln_theme');
    return saved ? saved : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('oln_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
