"use client";

import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on localStorage or system preference
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.body.classList.remove('dark-mode');
    } else {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.body.classList.add('dark-mode');
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[var(--text-secondary)]">
        {isDarkMode ? <FaMoon size={16} /> : <FaSun size={16} />}
      </span>
      <label className="theme-toggle">
        <input 
          type="checkbox" 
          className="theme-toggle-checkbox"
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <span className="theme-toggle-slider"></span>
      </label>
    </div>
  );
};

export default ThemeToggle;
