/**
 * Nurav AI Theme System - Centralized theme management with shadcn/ui integration
 *
 * Features:
 * - Automatic system theme preference detection
 * - Light and dark theme support
 * - Dynamic custom theme generation from primary color
 * - CSS variable injection for seamless integration
 * - Local storage persistence for user preferences
 */

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Palette } from './icons';
import { Label } from './Typography';

export type ThemeMode = "light" | "dark" | "custom";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  userOverride: boolean;
}

interface ThemeContextValue {
  config: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  isDark: boolean;
  resetToSystemPreference: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeWrapper");
  }
  return context;
};

interface ThemeWrapperProps {
  children: ReactNode;
  initialConfig?: Partial<ThemeConfig>;
}

const THEME_STORAGE_KEY = "nurav-theme-config";

/**
 * Convert hex color to RGB values
 */
const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

/**
 * Convert RGB to hex color
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Get perceived luminance of a color (0-1)
 */
const getLuminance = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

/**
 * Lighten a hex color by a percentage
 */
const lighten = (hex: string, percent: number): string => {
  const [r, g, b] = hexToRgb(hex);
  const amount = 255 * (percent / 100);
  return rgbToHex(r + amount, g + amount, b + amount);
};

/**
 * Darken a hex color by a percentage
 */
const darken = (hex: string, percent: number): string => {
  const [r, g, b] = hexToRgb(hex);
  const amount = 255 * (percent / 100);
  return rgbToHex(r - amount, g - amount, b - amount);
};

/**
 * Generate custom theme colors from primary color
 */
const generateCustomTheme = (primaryColor: string) => {
  const isLight = getLuminance(primaryColor) > 0.5;

  return {
    primary: primaryColor,
    primaryForeground: isLight ? '#1a1a1a' : '#fafafa',
    background: isLight ? lighten(primaryColor, 45) : '#0a0a0a',
    foreground: isLight ? '#0a0a0a' : '#fafafa',
    card: isLight ? lighten(primaryColor, 42) : '#141414',
    cardForeground: isLight ? '#0a0a0a' : '#fafafa',
    popover: isLight ? lighten(primaryColor, 42) : '#141414',
    popoverForeground: isLight ? '#0a0a0a' : '#fafafa',
    secondary: isLight ? lighten(primaryColor, 35) : '#262626',
    secondaryForeground: isLight ? '#1a1a1a' : '#fafafa',
    muted: isLight ? lighten(primaryColor, 38) : '#262626',
    mutedForeground: isLight ? '#525252' : '#a3a3a3',
    accent: isLight ? lighten(primaryColor, 30) : '#2a2a2a',
    accentForeground: isLight ? '#1a1a1a' : '#fafafa',
    border: isLight ? lighten(primaryColor, 25) : '#2a2a2a',
    input: isLight ? lighten(primaryColor, 25) : '#2a2a2a',
    ring: primaryColor,
  };
};

const defaultThemeConfig: ThemeConfig = {
  mode: "light",
  primaryColor: "#6366f1",
  userOverride: false,
};

/**
 * Internal Theme Provider that manages Nurav theme state
 */
const InternalThemeProvider: React.FC<ThemeWrapperProps> = ({ children, initialConfig = {} }) => {
  const { theme, setTheme } = useNextTheme();
  const [config, setConfig] = useState<ThemeConfig>(() => ({
    ...defaultThemeConfig,
    ...initialConfig,
  }));
  const [mounted, setMounted] = useState(false);

  const isDark = theme === "dark" || config.mode === "dark";

  const getSystemTheme = (): ThemeMode => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const loadSavedTheme = React.useCallback((): ThemeConfig => {
    if (typeof window === "undefined") return defaultThemeConfig;

    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        return { ...defaultThemeConfig, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn("Failed to load saved theme:", error);
    }

    return { ...defaultThemeConfig, mode: getSystemTheme() };
  }, []);

  const saveTheme = (themeConfig: ThemeConfig) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeConfig));
    } catch (error) {
      console.warn("Failed to save theme:", error);
    }
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates, userOverride: true };
      saveTheme(newConfig);
      return newConfig;
    });
  };

  const resetToSystemPreference = () => {
    const systemTheme = getSystemTheme();
    const resetConfig = { ...defaultThemeConfig, mode: systemTheme, userOverride: false };
    setConfig(resetConfig);
    saveTheme(resetConfig);
  };

  // Load saved theme on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = loadSavedTheme();
    setConfig(savedTheme);
  }, [loadSavedTheme]);

  // Sync with next-themes
  useEffect(() => {
    if (!mounted) return;
    if (config.mode === "custom") {
      setTheme("light");
    } else {
      setTheme(config.mode);
    }
  }, [config.mode, setTheme, mounted]);

  // Apply custom theme CSS variables
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    const root = document.documentElement;
    const customVars = [
      "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
      "primary", "primary-foreground", "secondary", "secondary-foreground",
      "muted", "muted-foreground", "accent", "accent-foreground", "border", "input", "ring"
    ];

    if (config.mode === "custom") {
      const colors = generateCustomTheme(config.primaryColor);

      root.style.setProperty("--background", colors.background);
      root.style.setProperty("--foreground", colors.foreground);
      root.style.setProperty("--card", colors.card);
      root.style.setProperty("--card-foreground", colors.cardForeground);
      root.style.setProperty("--popover", colors.popover);
      root.style.setProperty("--popover-foreground", colors.popoverForeground);
      root.style.setProperty("--primary", colors.primary);
      root.style.setProperty("--primary-foreground", colors.primaryForeground);
      root.style.setProperty("--secondary", colors.secondary);
      root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
      root.style.setProperty("--muted", colors.muted);
      root.style.setProperty("--muted-foreground", colors.mutedForeground);
      root.style.setProperty("--accent", colors.accent);
      root.style.setProperty("--accent-foreground", colors.accentForeground);
      root.style.setProperty("--border", colors.border);
      root.style.setProperty("--input", colors.input);
      root.style.setProperty("--ring", colors.ring);

      document.documentElement.classList.remove("dark");
      document.body.classList.add("custom-theme");
    } else {
      // Remove custom CSS variables to let default themes apply
      customVars.forEach(varName => root.style.removeProperty(`--${varName}`));
      document.body.classList.remove("custom-theme");
    }
  }, [config, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (config.userOverride || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, mode: e.matches ? "dark" : "light" }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [config.userOverride]);

  const contextValue: ThemeContextValue = {
    config,
    updateTheme,
    isDark,
    resetToSystemPreference,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Main ThemeWrapper component
 */
const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children, initialConfig }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <InternalThemeProvider initialConfig={initialConfig}>
        {children}
      </InternalThemeProvider>
    </NextThemesProvider>
  );
};

/**
 * Theme Control Panel Component
 */
export const ThemeControls: React.FC = () => {
  const { config, updateTheme, resetToSystemPreference } = useTheme();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Theme Mode</Label>
          <div className="flex gap-2">
            <Button
              variant={config.mode === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => updateTheme({ mode: "light" })}
              className="flex items-center gap-1"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={config.mode === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => updateTheme({ mode: "dark" })}
              className="flex items-center gap-1"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={config.mode === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => updateTheme({ mode: "custom" })}
              className="flex items-center gap-1"
            >
              <Palette className="h-4 w-4" />
              Custom
            </Button>
          </div>
        </div>

        {config.mode === "custom" && (
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="w-12 h-10 border border-border rounded cursor-pointer bg-transparent"
              />
              <span className="text-sm text-muted-foreground font-mono">
                {config.primaryColor.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={resetToSystemPreference}
          className="w-full"
        >
          Reset to System
        </Button>
      </CardContent>
    </Card>
  );
};

export default ThemeWrapper;
