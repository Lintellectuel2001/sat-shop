
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Vérifier le thème stocké ou la préférence système
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (stored === 'dark' || (!stored && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full hover:bg-accent-50 transition-all duration-300"
      aria-label={isDark ? 'Activer le mode jour' : 'Activer le mode nuit'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-500 transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 transition-all duration-300 rotate-0 scale-100" />
      )}
    </Button>
  );
};

export default ThemeToggle;
