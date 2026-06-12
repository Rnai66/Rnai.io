import React, { createContext, useContext, useState } from 'react';
import { COLORS, ColorScheme, ThemeType } from '../constants/design';

interface ThemeContextType {
  scheme: ColorScheme;
  colors: ThemeType;
  toggleScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<ColorScheme>('brand');

  const colors = COLORS[scheme];

  const toggleScheme = () => {
    setScheme(scheme === 'brand' ? 'modern' : 'brand');
  };

  return (
    <ThemeContext.Provider value={{ scheme, colors, toggleScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
