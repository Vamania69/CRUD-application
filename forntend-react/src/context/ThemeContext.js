import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage for saved theme preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDarkMode: isDark, // Fix: use isDarkMode for consistency
    isDark,
    toggleTheme,
    colors: {
      // Light theme colors
      light: {
        primary: '#3B82F6',
        primaryHover: '#2563EB',
        secondary: '#6B7280',
        accent: '#10B981',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
      },
      // Dark theme colors
      dark: {
        primary: '#60A5FA',
        primaryHover: '#3B82F6',
        secondary: '#9CA3AF',
        accent: '#34D399',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        border: '#334155',
        error: '#F87171',
        success: '#34D399',
        warning: '#FBBF24',
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};