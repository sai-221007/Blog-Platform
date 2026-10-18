import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const AMBIENT_THEMES = [
  {
    id: 'cosmic-ink',
    name: 'Cosmic Ink',
    tagline: 'Floating glass spheres & chiseled icosahedrons',
    accentColor: '#56E0C5',
  },
  {
    id: 'origami-monoliths',
    name: 'Origami Monoliths',
    tagline: 'Architectural folded facets & brushed brass',
    accentColor: '#FFB86B',
  },
  {
    id: 'topographic-strata',
    name: 'Topographic Strata',
    tagline: 'Kinetic contour waves & sumi-e ink terrain',
    accentColor: '#2DD4BF',
  },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('inkora_theme') || 'dark';
  });

  const [ambient3d, setAmbient3dState] = useState(() => {
    return localStorage.getItem('inkora_ambient_3d') || 'cosmic-ink';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('inkora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setAmbient3d = (newTheme) => {
    setAmbient3dState(newTheme);
    localStorage.setItem('inkora_ambient_3d', newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        ambient3d,
        setAmbient3d,
        ambientThemes: AMBIENT_THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
