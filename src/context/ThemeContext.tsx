import React, { createContext, useContext, useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mkt_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply theme classes synchronously before first paint to prevent FOUC
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('mkt_theme', theme);
    } catch {
      // ignore in iframe storage restrict
    }
  }, [theme]);

  // Cleanup transition timer and CSS class on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      document.documentElement.classList.remove('theme-transitioning');
    };
  }, []);

  // Execute smooth theme transition across CSS and View Transition API
  const applyThemeSmoothly = useCallback((nextTheme: Theme) => {
    const root = document.documentElement;

    // Apply temporary class for smooth CSS interpolation of colors, backgrounds, borders & shadows
    root.classList.add('theme-transitioning');
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 480);

    // If browser supports View Transitions API and user hasn't requested reduced motion, use it
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      try {
        (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
          setThemeState(nextTheme);
        });
        return;
      } catch {
        // fallback to standard state update
      }
    }

    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    applyThemeSmoothly(next);
  }, [theme, applyThemeSmoothly]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (newTheme !== theme) {
      applyThemeSmoothly(newTheme);
    }
  }, [theme, applyThemeSmoothly]);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    const isDocDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return {
      theme: (isDocDark ? 'dark' : 'light') as Theme,
      isDark: isDocDark,
      toggleTheme: () => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark');
        }
      },
      setTheme: () => {},
    };
  }
  return context;
};
