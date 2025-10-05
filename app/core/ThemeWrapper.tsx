/**
 * ALEXIKA AI Theme System - Centralized theme management with shadcn/ui integration
 * Properly integrates with next-themes for shadcn/ui compatibility
 * 
 * Features:
 * - Automatic system theme preference detection
 * - Professional light theme with optimized contrast ratios
 * - Dark theme for reduced eye strain
 * - Dynamic custom theme generation from single primary color
 * - CSS variable injection for seamless integration
 * - Local storage persistence for user preferences
 * - shadcn/ui theme integration via next-themes
 */

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Palette } from './icons';
import { Label } from './Typography';

// Theme modes: light/dark themes or custom generated palette
export type ThemeMode = "light" | "dark" | "custom";

// Theme configuration interface
export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string; // Main brand color for custom theme generation
  userOverride: boolean; // Whether user has manually selected a theme
  generatedColors?: { // Auto-generated colors for custom themes only
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    backgroundPrimary: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    borderColor: string;
    borderHover: string;
  };
}

// Context value interface for theme state and actions
interface ThemeContextValue {
  config: ThemeConfig;                                    // Current theme configuration
  updateTheme: (updates: Partial<ThemeConfig>) => void;   // Function to update theme settings
  isDark: boolean;                                        // Boolean indicating if current theme is dark
  resetToSystemPreference: () => void;                    // Function to reset to system preference
}

// React Context for global theme state management
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Hook for accessing theme context in components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeWrapper");
  }
  return context;
};

// Props interface for ThemeWrapper component
interface ThemeWrapperProps {
  children: ReactNode;
  initialConfig?: Partial<ThemeConfig>; // Optional initial theme overrides
}

// localStorage keys for theme persistence
const THEME_STORAGE_KEY = "theme-config";
const CUSTOM_COLORS_STORAGE_KEY = "custom-theme-colors";

// Converts hex color to HSL values for intelligent color manipulation
const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Converts HSL values back to hex color
const hslToHex = (h: number, s: number, l: number): string => {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Generates a comprehensive color palette from a primary color
const generateColorPalette = (primaryColor: string) => {
  const [h, s, l] = hexToHsl(primaryColor);
  
  // Create complementary and analogous colors
  const complementaryHue = (h + 180) % 360;
  const analogousHue1 = (h + 30) % 360;
  const analogousHue2 = (h - 30 + 360) % 360;
  
  return {
    secondary: hslToHex(analogousHue1, Math.max(15, s - 15), Math.min(90, l + 10)),
    success: hslToHex(142, 71, 45), // Enhanced green
    warning: hslToHex(38, 92, 50),  // Enhanced orange
    error: hslToHex(0, 84, 60),     // Red
    info: hslToHex(199, 89, 48),    // Blue
    backgroundPrimary: hslToHex(h, Math.max(5, s - 30), 98),
    backgroundSecondary: hslToHex(h, Math.max(5, s - 35), 96),
    backgroundTertiary: hslToHex(h, Math.max(5, s - 40), 94),
    textPrimary: hslToHex(h, Math.min(50, s + 10), 10),
    textSecondary: hslToHex(h, Math.max(10, s - 10), 40),
    textTertiary: hslToHex(h, Math.max(5, s - 15), 60),
    borderColor: hslToHex(h, Math.max(5, s - 25), 88),
    borderHover: hslToHex(h, Math.max(10, s - 20), 82),
  };
};

// Default theme configuration
const defaultThemeConfig: ThemeConfig = {
  mode: "light",
  primaryColor: "#2c2c2c",
  userOverride: false,
  generatedColors: undefined,
};

/**
 * Internal Theme Provider that manages ALEXIKA theme state
 */
const InternalThemeProvider: React.FC<ThemeWrapperProps> = ({ 
  children, 
  initialConfig = {} 
}) => {
  const { theme, setTheme } = useNextTheme();
  const [config, setConfig] = useState<ThemeConfig>(() => ({
    ...defaultThemeConfig,
    ...initialConfig,
  }));

  // Computed property for dark theme detection
  const isDark = theme === "dark" || config.mode === "dark";

  // Detects system theme preference using CSS media query
  const getSystemTheme = (): ThemeMode => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  // Loads saved theme configuration from localStorage
  const loadSavedTheme = (): ThemeConfig => {
    if (typeof window === "undefined") return defaultThemeConfig;
    
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      const savedColors = localStorage.getItem(CUSTOM_COLORS_STORAGE_KEY);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        if (savedColors && parsed.mode === "custom") {
          parsed.generatedColors = JSON.parse(savedColors);
        }
        return { ...defaultThemeConfig, ...parsed };
      }
    } catch (error) {
      console.warn("Failed to load saved theme:", error);
    }
    
    return {
      ...defaultThemeConfig,
      mode: getSystemTheme(),
    };
  };

  // Saves current theme configuration to localStorage
  const saveTheme = (themeConfig: ThemeConfig) => {
    if (typeof window === "undefined") return;
    
    try {
      const { generatedColors, ...configToSave } = themeConfig;
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(configToSave));
      
      if (generatedColors && themeConfig.mode === "custom") {
        localStorage.setItem(CUSTOM_COLORS_STORAGE_KEY, JSON.stringify(generatedColors));
      }
    } catch (error) {
      console.warn("Failed to save theme:", error);
    }
  };

  // Updates theme configuration and applies CSS variables
  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates, userOverride: true };
      
      // Generate color palette for custom themes
      if (updates.mode === "custom" || (updates.primaryColor && newConfig.mode === "custom")) {
        const primaryColor = updates.primaryColor || newConfig.primaryColor;
        newConfig.generatedColors = generateColorPalette(primaryColor);
      }
      
      // Update next-themes
      if (updates.mode && updates.mode !== "custom") {
        setTheme(updates.mode);
      } else if (updates.mode === "custom") {
        setTheme("light"); // Use light as base for custom themes
      }
      
      saveTheme(newConfig);
      return newConfig;
    });
  };

  // Resets theme to system preference
  const resetToSystemPreference = () => {
    const systemTheme = getSystemTheme();
    const resetConfig = {
      ...defaultThemeConfig,
      mode: systemTheme,
      userOverride: false,
    };
    
    setConfig(resetConfig);
    setTheme(systemTheme);
    saveTheme(resetConfig);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem(CUSTOM_COLORS_STORAGE_KEY);
    }
  };

  // Load saved theme on component mount
  useEffect(() => {
    const savedTheme = loadSavedTheme();
    setConfig(savedTheme);
    
    // Set next-themes theme
    if (savedTheme.mode !== "custom") {
      setTheme(savedTheme.mode);
    }
  }, [setTheme, loadSavedTheme]);

  // Apply CSS variables when theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    
    // Apply theme class and CSS variables
    if (config.mode === "custom" && config.generatedColors) {
      // Apply custom generated colors to both ALEXIKA and shadcn/ui variables
      const colors = config.generatedColors;
      
      // ALEXIKA custom variables
      root.style.setProperty("--color-primary", colors.textPrimary);
      root.style.setProperty("--color-secondary", colors.secondary);
      root.style.setProperty("--color-success", colors.success);
      root.style.setProperty("--color-warning", colors.warning);
      root.style.setProperty("--color-error", colors.error);
      root.style.setProperty("--color-info", colors.info);
      root.style.setProperty("--bg-primary", colors.backgroundPrimary);
      root.style.setProperty("--bg-secondary", colors.backgroundSecondary);
      root.style.setProperty("--bg-tertiary", colors.backgroundTertiary);
      root.style.setProperty("--text-primary", colors.textPrimary);
      root.style.setProperty("--text-secondary", colors.textSecondary);
      root.style.setProperty("--text-tertiary", colors.textTertiary);
      root.style.setProperty("--border-color", colors.borderColor);
      root.style.setProperty("--border-hover", colors.borderHover);
      
      // Convert hex colors to HSL for shadcn/ui compatibility
      const primaryHsl = hexToHsl(config.primaryColor);
      const secondaryHsl = hexToHsl(colors.secondary);
      const backgroundHsl = hexToHsl(colors.backgroundPrimary);
      const textHsl = hexToHsl(colors.textPrimary);
      const borderHsl = hexToHsl(colors.borderColor);
      
      // Apply shadcn/ui CSS variables for custom theme
      root.style.setProperty("--background", `${backgroundHsl[0]} ${backgroundHsl[1]}% ${backgroundHsl[2]}%`);
      root.style.setProperty("--foreground", `${textHsl[0]} ${textHsl[1]}% ${textHsl[2]}%`);
      root.style.setProperty("--card", `${backgroundHsl[0]} ${backgroundHsl[1]}% ${Math.max(backgroundHsl[2] - 2, 95)}%`);
      root.style.setProperty("--card-foreground", `${textHsl[0]} ${textHsl[1]}% ${textHsl[2]}%`);
      root.style.setProperty("--popover", `${backgroundHsl[0]} ${backgroundHsl[1]}% ${backgroundHsl[2]}%`);
      root.style.setProperty("--popover-foreground", `${textHsl[0]} ${textHsl[1]}% ${textHsl[2]}%`);
      root.style.setProperty("--primary", `${primaryHsl[0]} ${primaryHsl[1]}% ${primaryHsl[2]}%`);
      root.style.setProperty("--primary-foreground", `${backgroundHsl[0]} ${backgroundHsl[1]}% ${backgroundHsl[2]}%`);
      root.style.setProperty("--secondary", `${secondaryHsl[0]} ${secondaryHsl[1]}% ${secondaryHsl[2]}%`);
      root.style.setProperty("--secondary-foreground", `${textHsl[0]} ${textHsl[1]}% ${textHsl[2]}%`);
      root.style.setProperty("--muted", `${backgroundHsl[0]} ${Math.max(backgroundHsl[1] - 5, 5)}% ${Math.max(backgroundHsl[2] - 4, 92)}%`);
      root.style.setProperty("--muted-foreground", `${textHsl[0]} ${Math.max(textHsl[1] - 20, 10)}% ${Math.min(textHsl[2] + 35, 55)}%`);
      root.style.setProperty("--accent", `${secondaryHsl[0]} ${Math.max(secondaryHsl[1] - 10, 10)}% ${Math.max(secondaryHsl[2] - 5, 90)}%`);
      root.style.setProperty("--accent-foreground", `${textHsl[0]} ${textHsl[1]}% ${textHsl[2]}%`);
      root.style.setProperty("--border", `${borderHsl[0]} ${borderHsl[1]}% ${borderHsl[2]}%`);
      root.style.setProperty("--input", `${borderHsl[0]} ${borderHsl[1]}% ${borderHsl[2]}%`);
      root.style.setProperty("--ring", `${primaryHsl[0]} ${primaryHsl[1]}% ${primaryHsl[2]}%`);
      
      // Add custom theme class
      document.body.classList.add("alexika-custom-theme");
      document.body.classList.remove("dark");
    } else {
      // Remove custom theme class for light/dark themes
      document.body.classList.remove("alexika-custom-theme");
    }
  }, [config]);

  // Listen for system theme changes (only if user hasn't overridden)
  useEffect(() => {
    if (config.userOverride || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? "dark" : "light";
      setConfig(prev => ({
        ...prev,
        mode: newMode,
      }));
      setTheme(newMode);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [config.userOverride, setTheme]);

  // Context value with theme state and actions
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
 * Main ThemeWrapper component that provides theme context and next-themes integration
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
 * Provides UI controls for theme switching and customization
 */
export const ThemeControls: React.FC = () => {
  const { config, updateTheme, resetToSystemPreference } = useTheme();

  const handleModeChange = (mode: ThemeMode) => {
    updateTheme({ mode });
  };

  const handleColorChange = (color: string) => {
    updateTheme({ primaryColor: color, mode: "custom" });
  };

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
              onClick={() => handleModeChange("light")}
              className="flex items-center gap-1"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={config.mode === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("dark")}
              className="flex items-center gap-1"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={config.mode === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("custom")}
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
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-8 border border-border rounded cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">
                {config.primaryColor}
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