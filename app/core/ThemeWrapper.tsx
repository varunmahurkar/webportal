/**
 * ALEXIKA AI Theme System - Centralized theme management with intelligent color generation
 * Automatically detects system preference and allows user overrides
 * 
 * Features:
 * - Automatic system theme preference detection
 * - Professional light theme with optimized contrast ratios
 * - GitHub-inspired dark theme for reduced eye strain
 * - Dynamic custom theme generation from single primary color
 * - CSS variable injection for seamless integration
 * - Local storage persistence for user preferences
 * - Ant Design theme integration with automatic token mapping
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ConfigProvider,
  theme as antdTheme,
  ColorPicker,
  Select,
  Space,
} from "antd";
import { Sun, Moon, Palette } from './icons';
import { Label } from './Typography';

const { Option } = Select;

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

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Converts HSL values back to hex color format for CSS usage
const hslToHex = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Intelligent color palette generator
const generateColorPalette = (primaryColor: string) => {
  const [h, s, l] = hexToHsl(primaryColor);

  const isVibrant = s > 60;
  const isBright = l > 60;
  const isDark = l < 40;

  let bgPrimary, bgSecondary, bgTertiary;
  let textPrimary, textSecondary, textTertiary;
  let borderColor, borderHover;

  if (isBright && isVibrant) {
    bgPrimary = hslToHex(h, Math.max(s - 80, 8), Math.min(l + 35, 97));
    bgSecondary = hslToHex(h, Math.max(s - 85, 5), Math.min(l + 40, 100));
    bgTertiary = hslToHex(h, Math.max(s - 75, 12), Math.min(l + 30, 94));
    textPrimary = "#1a1a1a";
    textSecondary = "#5f6368";
    textTertiary = "#80868b";
    borderColor = hslToHex(h, Math.max(s - 60, 15), Math.min(l + 20, 85));
    borderHover = hslToHex(h, Math.max(s - 50, 20), Math.min(l + 15, 80));
  } else if (isDark) {
    bgPrimary = hslToHex(h, Math.max(s - 60, 15), Math.max(l - 30, 6));
    bgSecondary = hslToHex(h, Math.max(s - 65, 12), Math.max(l - 25, 10));
    bgTertiary = hslToHex(h, Math.max(s - 55, 18), Math.max(l - 20, 14));
    textPrimary = "#e6edf3";
    textSecondary = "#7d8590";
    textTertiary = "#656d76";
    borderColor = hslToHex(h, Math.max(s - 40, 25), Math.max(l - 10, 20));
    borderHover = hslToHex(h, Math.max(s - 30, 30), Math.max(l - 5, 25));
  } else {
    const shouldBeLightTheme = l > 45;

    if (shouldBeLightTheme) {
      bgPrimary = hslToHex(h, Math.max(s - 70, 12), Math.min(l + 30, 96));
      bgSecondary = hslToHex(h, Math.max(s - 75, 8), Math.min(l + 35, 99));
      bgTertiary = hslToHex(h, Math.max(s - 65, 15), Math.min(l + 25, 93));
      textPrimary = "#1a1a1a";
      textSecondary = "#5f6368";
      textTertiary = "#80868b";
      borderColor = hslToHex(h, Math.max(s - 50, 20), Math.min(l + 15, 82));
      borderHover = hslToHex(h, Math.max(s - 40, 25), Math.min(l + 10, 77));
    } else {
      bgPrimary = hslToHex(h, Math.max(s - 50, 20), Math.max(l - 25, 8));
      bgSecondary = hslToHex(h, Math.max(s - 55, 17), Math.max(l - 20, 12));
      bgTertiary = hslToHex(h, Math.max(s - 45, 23), Math.max(l - 15, 16));
      textPrimary = "#e6edf3";
      textSecondary = "#7d8590";
      textTertiary = "#656d76";
      borderColor = hslToHex(h, Math.max(s - 30, 30), Math.max(l - 5, 22));
      borderHover = hslToHex(h, Math.max(s - 20, 35), Math.max(l, 27));
    }
  }

  return {
    secondary: hslToHex(
      (h + 40) % 360,
      Math.max(s - 15, 20),
      Math.max(Math.min(l, 65), 35)
    ),
    success: hslToHex(142, Math.max(s - 20, 50), isBright ? 45 : 55),
    warning: hslToHex(38, Math.max(s - 10, 70), isBright ? 50 : 60),
    error: hslToHex(0, Math.max(s - 15, 65), isBright ? 48 : 58),
    info: hslToHex(212, Math.max(s - 25, 60), isBright ? 45 : 55),
    backgroundPrimary: bgPrimary,
    backgroundSecondary: bgSecondary,
    backgroundTertiary: bgTertiary,
    textPrimary: textPrimary,
    textSecondary: textSecondary,
    textTertiary: textTertiary,
    borderColor: borderColor,
    borderHover: borderHover,
  };
};

// Loads theme configuration from localStorage with SSR safety
const loadThemeFromStorage = (): Partial<ThemeConfig> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn("Failed to load theme from localStorage:", error);
    return {};
  }
};

// Loads custom color palette from separate localStorage entry
const loadCustomColorsFromStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CUSTOM_COLORS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Failed to load custom colors from localStorage:", error);
    return null;
  }
};

// Saves theme configuration to localStorage
const saveThemeToStorage = (config: ThemeConfig) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));

    if (config.mode === "custom" && config.generatedColors) {
      localStorage.setItem(
        CUSTOM_COLORS_STORAGE_KEY,
        JSON.stringify({
          primaryColor: config.primaryColor,
          generatedColors: config.generatedColors,
        })
      );
    }
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
};

// Detects system theme preference
const getSystemThemePreference = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Main ThemeWrapper component
export default function ThemeWrapper({
  children,
  initialConfig = {},
}: ThemeWrapperProps) {
  // Initialize theme config with system preference or stored config
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const storedConfig = loadThemeFromStorage();
    
    // If user has no stored config, use system preference
    if (!storedConfig.mode) {
      const systemPreference = getSystemThemePreference();
      return {
        mode: systemPreference,
        primaryColor: "#386641",
        userOverride: false,
        ...initialConfig,
      };
    }
    
    // Use stored config
    return {
      mode: "light",
      primaryColor: "#386641",
      userOverride: false,
      ...initialConfig,
      ...storedConfig,
    };
  });

  const [isDark, setIsDark] = useState(false);

  // Effect to manage theme mode and automatic system preference detection
  useEffect(() => {
    const updateThemeMode = () => {
      if (config.mode === "custom") {
        // For custom themes, determine darkness from background
        if (config.generatedColors) {
          const [, , bgLightness] = hexToHsl(config.generatedColors.backgroundPrimary);
          setIsDark(bgLightness < 50);
        } else {
          setIsDark(false);
        }
      } else if (!config.userOverride) {
        // Follow system preference if no user override
        const systemPreference = getSystemThemePreference();
        setIsDark(systemPreference === "dark");
        
        // Update config if it differs from system preference
        if (config.mode !== systemPreference) {
          const newConfig = { ...config, mode: systemPreference };
          setConfig(newConfig);
          saveThemeToStorage(newConfig);
        }
      } else {
        // Use user's explicit choice
        setIsDark(config.mode === "dark");
      }
    };

    updateThemeMode();

    // Listen for system theme changes only if user hasn't overridden
    if (!config.userOverride) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateThemeMode);
      return () => mediaQuery.removeEventListener("change", updateThemeMode);
    }
  }, [config]);

  // Main effect that applies theme colors and classes
  useEffect(() => {
    const root = document.documentElement;

    requestAnimationFrame(() => {
      // Remove all theme classes first
      root.classList.remove("light-theme", "dark-theme", "custom-theme");
      
      if (config.mode === "custom" && config.generatedColors) {
        // Apply custom theme
        root.classList.add("custom-theme");
        
        const [, , bgLightness] = hexToHsl(config.generatedColors.backgroundPrimary);
        
        const customColors: Record<string, string> = {
          "--color-primary": config.primaryColor,
          "--color-secondary": config.generatedColors.secondary,
          "--color-success": config.generatedColors.success,
          "--color-warning": config.generatedColors.warning,
          "--color-error": config.generatedColors.error,
          "--color-info": config.generatedColors.info,
          "--bg-primary": config.generatedColors.backgroundPrimary,
          "--bg-secondary": config.generatedColors.backgroundSecondary,
          "--bg-tertiary": config.generatedColors.backgroundTertiary,
          "--text-primary": config.generatedColors.textPrimary,
          "--text-secondary": config.generatedColors.textSecondary,
          "--text-tertiary": config.generatedColors.textTertiary,
          "--border-color": config.generatedColors.borderColor,
          "--border-hover": config.generatedColors.borderHover,
          "--shadow-light": bgLightness > 50 ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.3)",
          "--shadow-medium": bgLightness > 50 ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.4)",
        };

        root.style.setProperty("color-scheme", bgLightness > 50 ? "light" : "dark");

        Object.entries(customColors).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });
      } else {
        // Remove custom overrides
        const customProperties = [
          "--color-primary", "--color-secondary", "--color-success", "--color-warning", 
          "--color-error", "--color-info", "--bg-primary", "--bg-secondary", 
          "--bg-tertiary", "--text-primary", "--text-secondary", "--text-tertiary", 
          "--border-color", "--border-hover", "--shadow-light", "--shadow-medium"
        ];
        
        customProperties.forEach(property => {
          root.style.removeProperty(property);
        });

        // Apply theme class only if user has overridden system preference
        if (config.userOverride) {
          if (config.mode === "light") {
            root.classList.add("light-theme");
          } else if (config.mode === "dark") {
            root.classList.add("dark-theme");
          }
        }
        // No class = automatic system preference via CSS light-dark()
      }
    });
  }, [config, isDark]);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setConfig((prev) => {
      const newConfig = {
        ...prev,
        ...updates,
      };

      saveThemeToStorage(newConfig);
      return newConfig;
    });
  };

  const handleThemeModeChange = (value: ThemeMode) => {
    if (value === "light" || value === "dark") {
      // User is explicitly choosing a theme
      updateTheme({ 
        mode: value, 
        generatedColors: undefined, 
        userOverride: true 
      });
    } else if (value === "custom") {
      // When switching to custom, restore saved custom colors or generate new ones
      const savedCustomColors = loadCustomColorsFromStorage();

      if (savedCustomColors && savedCustomColors.generatedColors) {
        updateTheme({
          mode: value,
          primaryColor: savedCustomColors.primaryColor,
          generatedColors: savedCustomColors.generatedColors,
          userOverride: true,
        });
      } else if (config.primaryColor) {
        const generatedColors = generateColorPalette(config.primaryColor);
        updateTheme({
          mode: value,
          generatedColors: generatedColors,
          userOverride: true,
        });
      } else {
        updateTheme({ mode: value, userOverride: true });
      }
    }
  };

  const handleColorChange = (color: { toHexString: () => string }) => {
    const newPrimaryColor = color.toHexString();
    const generatedColors = generateColorPalette(newPrimaryColor);
    updateTheme({
      primaryColor: newPrimaryColor,
      generatedColors: generatedColors,
    });
  };

  const resetToSystemPreference = () => {
    const systemPreference = getSystemThemePreference();
    updateTheme({ 
      mode: systemPreference, 
      generatedColors: undefined,
      userOverride: false 
    });
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return <Sun size={16} />;
      case "dark":
        return <Moon size={16} />;
      case "custom":
        return <Palette size={16} />;
      default:
        return <Sun size={16} />;
    }
  };

  const getAntdThemeConfig = () => {
    const isDarkMode =
      config.mode === "dark" ||
      (config.mode === "custom" &&
        config.generatedColors &&
        hexToHsl(config.generatedColors.backgroundPrimary)[2] < 50);

    return {
      algorithm: isDarkMode
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary:
          config.mode === "custom"
            ? config.primaryColor
            : isDarkMode
            ? "#e5e5e5"
            : "#2c2c2c",
        colorSuccess:
          config.mode === "custom" && config.generatedColors
            ? config.generatedColors.success
            : isDarkMode
            ? "#22c55e"
            : "#16a34a",
        colorWarning:
          config.mode === "custom" && config.generatedColors
            ? config.generatedColors.warning
            : isDarkMode
            ? "#f59e0b"
            : "#d97706",
        colorError:
          config.mode === "custom" && config.generatedColors
            ? config.generatedColors.error
            : isDarkMode
            ? "#ef4444"
            : "#dc2626",
        colorInfo:
          config.mode === "custom" && config.generatedColors
            ? config.generatedColors.info
            : isDarkMode
            ? "#3b82f6"
            : "#0ea5e9",
        colorBgContainer: isDarkMode ? "#171717" : "#ffffff",
        colorBgElevated: isDarkMode ? "#262626" : "#f8f7f4",
        colorBgLayout: isDarkMode ? "#0a0a0a" : "#ffffff",
        colorText: isDarkMode ? "#f5f5f5" : "#1a1a1a",
        colorTextSecondary: isDarkMode ? "#d4d4d4" : "#525252",
        colorTextTertiary: isDarkMode ? "#a3a3a3" : "#737373",
        colorBorder: isDarkMode ? "#404040" : "#e7e5e4",
        colorBorderSecondary: isDarkMode ? "#525252" : "#d6d3d1",
        fontFamily: "var(--font-geist-sans)",
        boxShadow: isDarkMode
          ? "0 2px 8px rgba(0, 0, 0, 0.3)"
          : "0 2px 8px rgba(0, 0, 0, 0.05)",
        boxShadowSecondary: isDarkMode
          ? "0 4px 16px rgba(0, 0, 0, 0.4)"
          : "0 4px 16px rgba(0, 0, 0, 0.10)",
      },
      components: {
        Card: {
          colorBgContainer: isDarkMode ? "#171717" : "#ffffff",
          colorBorder: isDarkMode ? "#404040" : "#e7e5e4",
        },
        Input: {
          colorBgContainer: isDarkMode ? "#262626" : "#ffffff",
          colorBorder: isDarkMode ? "#404040" : "#e7e5e4",
        },
        Select: {
          colorBgContainer: isDarkMode ? "#262626" : "#ffffff",
          colorBorder: isDarkMode ? "#404040" : "#e7e5e4",
        },
        Dropdown: {
          colorBgElevated: isDarkMode ? "#262626" : "#f8f7f4",
          colorBorder: isDarkMode ? "#404040" : "#e7e5e4",
          boxShadowSecondary: isDarkMode
            ? "0 6px 20px rgba(0, 0, 0, 0.4)"
            : "0 6px 20px rgba(0, 0, 0, 0.08)",
        },
        Button: {
          colorBgContainer: isDarkMode ? "#171717" : "#ffffff",
          colorBorder: isDarkMode ? "#404040" : "#e7e5e4",
        },
      },
    };
  };

  return (
    <ThemeContext.Provider value={{ config, updateTheme, isDark, resetToSystemPreference }}>
      <section 
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Space>
          <Select
            value={config.mode}
            onChange={handleThemeModeChange}
            style={{ minWidth: 140 }}
            suffixIcon={getThemeIcon(config.mode)}
          >
            <Option value="light">
              <Space>
                <Sun size={16} />
                Light Theme
              </Space>
            </Option>
            <Option value="dark">
              <Space>
                <Moon size={16} />
                Dark Theme
              </Space>
            </Option>
            <Option value="custom">
              <Space>
                <Palette size={16} />
                Custom Theme
              </Space>
            </Option>
          </Select>

          {config.mode === "custom" && (
            <Space>
              <Label>Color:</Label>
              <ColorPicker
                value={config.primaryColor}
                onChange={handleColorChange}
                showText={false}
                size="small"
              />
            </Space>
          )}
        </Space>
      </section>
      <ConfigProvider theme={getAntdThemeConfig()}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}