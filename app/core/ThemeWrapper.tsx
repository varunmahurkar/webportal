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
  Dropdown,
  Button,
  Space,
} from "antd";
import {
  SunOutlined,
  MoonOutlined,
  BgColorsOutlined,
  DownOutlined,
} from "@ant-design/icons";

export type ThemeMode = "light" | "dark" | "custom";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  generatedColors?: {
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

const defaultThemeConfig: ThemeConfig = {
  mode: "light",
  primaryColor: "#386641",
};

interface ThemeContextValue {
  config: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  isDark: boolean;
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

const THEME_STORAGE_KEY = "theme-config";

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

const generateColorPalette = (primaryColor: string) => {
  const [h, s, l] = hexToHsl(primaryColor);

  // Create a more flexible approach based on the primary color's characteristics
  const isVibrant = s > 60; // High saturation
  const isBright = l > 60; // High lightness
  const isDark = l < 40; // Low lightness

  // Generate backgrounds that complement the primary color
  let bgPrimary, bgSecondary, bgTertiary;
  let textPrimary, textSecondary, textTertiary;
  let borderColor, borderHover;

  if (isBright && isVibrant) {
    // Bright, vibrant colors - create a light theme with color tints
    bgPrimary = hslToHex(h, Math.max(s - 80, 8), Math.min(l + 35, 97));
    bgSecondary = hslToHex(h, Math.max(s - 85, 5), Math.min(l + 40, 100));
    bgTertiary = hslToHex(h, Math.max(s - 75, 12), Math.min(l + 30, 94));
    textPrimary = "#1a1a1a";
    textSecondary = "#5f6368";
    textTertiary = "#80868b";
    borderColor = hslToHex(h, Math.max(s - 60, 15), Math.min(l + 20, 85));
    borderHover = hslToHex(h, Math.max(s - 50, 20), Math.min(l + 15, 80));
  } else if (isDark) {
    // Dark colors - create a darker theme with subtle color hints
    bgPrimary = hslToHex(h, Math.max(s - 60, 15), Math.max(l - 30, 6));
    bgSecondary = hslToHex(h, Math.max(s - 65, 12), Math.max(l - 25, 10));
    bgTertiary = hslToHex(h, Math.max(s - 55, 18), Math.max(l - 20, 14));
    textPrimary = "#e6edf3";
    textSecondary = "#7d8590";
    textTertiary = "#656d76";
    borderColor = hslToHex(h, Math.max(s - 40, 25), Math.max(l - 10, 20));
    borderHover = hslToHex(h, Math.max(s - 30, 30), Math.max(l - 5, 25));
  } else {
    // Medium colors - create a balanced theme
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

const CUSTOM_COLORS_STORAGE_KEY = "custom-theme-colors";

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

const saveThemeToStorage = (config: ThemeConfig) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));

    // Also save custom colors separately for persistence
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

export default function ThemeWrapper({
  children,
  initialConfig = {},
}: ThemeWrapperProps) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const storedConfig = loadThemeFromStorage();
    return {
      ...defaultThemeConfig,
      ...initialConfig,
      ...storedConfig,
    };
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateThemeMode = () => {
      if (config.mode === "custom") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDark(prefersDark);
      } else {
        setIsDark(config.mode === "dark");
      }
    };

    updateThemeMode();

    if (config.mode === "custom") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateThemeMode);
      return () => mediaQuery.removeEventListener("change", updateThemeMode);
    }
  }, [config.mode]);

  useEffect(() => {
    const root = document.documentElement;

    // Apply colors based on theme mode
    if (config.mode === "custom" && config.generatedColors) {
      // Custom theme: apply all generated colors, backgrounds, and text colors
      root.style.setProperty("--color-primary", config.primaryColor);
      root.style.setProperty(
        "--color-secondary",
        config.generatedColors.secondary
      );
      root.style.setProperty("--color-success", config.generatedColors.success);
      root.style.setProperty("--color-warning", config.generatedColors.warning);
      root.style.setProperty("--color-error", config.generatedColors.error);
      root.style.setProperty("--color-info", config.generatedColors.info);

      // Apply custom backgrounds
      root.style.setProperty(
        "--bg-primary",
        config.generatedColors.backgroundPrimary
      );
      root.style.setProperty(
        "--bg-secondary",
        config.generatedColors.backgroundSecondary
      );
      root.style.setProperty(
        "--bg-tertiary",
        config.generatedColors.backgroundTertiary
      );

      // Apply custom text colors
      root.style.setProperty(
        "--text-primary",
        config.generatedColors.textPrimary
      );
      root.style.setProperty(
        "--text-secondary",
        config.generatedColors.textSecondary
      );
      root.style.setProperty(
        "--text-tertiary",
        config.generatedColors.textTertiary
      );

      // Apply custom borders
      root.style.setProperty(
        "--border-color",
        config.generatedColors.borderColor
      );
      root.style.setProperty(
        "--border-hover",
        config.generatedColors.borderHover
      );

      // Apply custom shadows based on theme lightness
      const [, , bgLightness] = hexToHsl(
        config.generatedColors.backgroundPrimary
      );
      const shadowLight =
        bgLightness > 50 ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.3)";
      const shadowMedium =
        bgLightness > 50 ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.4)";
      root.style.setProperty("--shadow-light", shadowLight);
      root.style.setProperty("--shadow-medium", shadowMedium);
    } else {
      // Light/Dark themes: remove ANY custom overrides and use CSS classes + reset primary color
      root.style.removeProperty("--bg-primary");
      root.style.removeProperty("--bg-secondary");
      root.style.removeProperty("--bg-tertiary");
      root.style.removeProperty("--text-primary");
      root.style.removeProperty("--text-secondary");
      root.style.removeProperty("--text-tertiary");
      root.style.removeProperty("--border-color");
      root.style.removeProperty("--border-hover");
      root.style.removeProperty("--shadow-light");
      root.style.removeProperty("--shadow-medium");
      root.style.removeProperty("--color-secondary");
      root.style.removeProperty("--color-success");
      root.style.removeProperty("--color-warning");
      root.style.removeProperty("--color-error");
      root.style.removeProperty("--color-info");

      // Set standard primary colors for light/dark themes (no custom primary)
      if (config.mode === "light") {
        root.style.setProperty("--color-primary", "#1677ff");
        root.style.setProperty("--color-secondary", "#888888");
        root.style.setProperty("--color-success", "#52c41a");
        root.style.setProperty("--color-warning", "#faad14");
        root.style.setProperty("--color-error", "#ff4d4f");
        root.style.setProperty("--color-info", "#1677ff");
      } else if (config.mode === "dark") {
        root.style.setProperty("--color-primary", "#177ddc");
        root.style.setProperty("--color-secondary", "#666666");
        root.style.setProperty("--color-success", "#49aa19");
        root.style.setProperty("--color-warning", "#d89614");
        root.style.setProperty("--color-error", "#dc4446");
        root.style.setProperty("--color-info", "#177ddc");
      }
    }

    // Set font family from Geist fonts
    root.style.setProperty("--font-family", "var(--font-geist-sans)");

    // Remove existing theme classes
    root.classList.remove("dark-theme", "light-theme");

    // Apply appropriate theme class
    if (config.mode === "custom") {
      // For custom theme, determine based on generated background lightness
      if (config.generatedColors) {
        const [, , bgLightness] = hexToHsl(
          config.generatedColors.backgroundPrimary
        );
        root.classList.add(bgLightness > 50 ? "light-theme" : "dark-theme");
      } else {
        root.classList.add(isDark ? "dark-theme" : "light-theme");
      }
    } else {
      // For light/dark themes, apply directly
      root.classList.add(config.mode === "dark" ? "dark-theme" : "light-theme");
    }
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
      // Clear any custom generated colors when switching to light/dark
      updateTheme({ mode: value, generatedColors: undefined });
    } else if (value === "custom") {
      // When switching to custom, restore saved custom colors or generate new ones
      const savedCustomColors = loadCustomColorsFromStorage();

      if (savedCustomColors && savedCustomColors.generatedColors) {
        // Restore saved custom theme
        updateTheme({
          mode: value,
          primaryColor: savedCustomColors.primaryColor,
          generatedColors: savedCustomColors.generatedColors,
        });
      } else if (config.primaryColor) {
        // Generate colors from current primary color
        const generatedColors = generateColorPalette(config.primaryColor);
        updateTheme({
          mode: value,
          generatedColors: generatedColors,
        });
      } else {
        // Fallback: just switch mode
        updateTheme({ mode: value });
      }
    } else {
      updateTheme({ mode: value });
    }
  };

  const handleColorChange = (color: any) => {
    const newPrimaryColor = color.toHexString();
    const generatedColors = generateColorPalette(newPrimaryColor);
    updateTheme({
      primaryColor: newPrimaryColor,
      generatedColors: generatedColors,
    });
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
            ? "#177ddc"
            : "#1677ff",
        colorSuccess:
          config.mode === "custom" && config.generatedColors
            ? config.generatedColors.success
            : isDarkMode
            ? "#49aa19"
            : "#52c41a",
        colorWarning:
          config.mode === "custom" && config.generatedColors
            ? config.generatedColors.warning
            : isDarkMode
            ? "#d89614"
            : "#faad14",
        colorError:
          config.mode === "custom" && config.generatedColors
            ? config.generatedColors.error
            : isDarkMode
            ? "#dc4446"
            : "#ff4d4f",
        colorInfo:
          config.mode === "custom" && config.generatedColors
            ? config.generatedColors.info
            : isDarkMode
            ? "#177ddc"
            : "#1677ff",

        // Background colors
        colorBgContainer: isDarkMode ? "#161b22" : "#ffffff",
        colorBgElevated: isDarkMode ? "#21262d" : "#ffffff",
        colorBgLayout: isDarkMode ? "#0d1117" : "#fafbfc",

        // Text colors
        colorText: isDarkMode ? "#e6edf3" : "#1a1a1a",
        colorTextSecondary: isDarkMode ? "#7d8590" : "#5f6368",
        colorTextTertiary: isDarkMode ? "#656d76" : "#80868b",

        // Border colors
        colorBorder: isDarkMode ? "#30363d" : "#e8eaed",
        colorBorderSecondary: isDarkMode ? "#21262d" : "#f1f3f4",

        fontFamily: "var(--font-geist-sans)",

        // Shadows
        boxShadow: isDarkMode
          ? "0 2px 8px rgba(0, 0, 0, 0.3)"
          : "0 2px 8px rgba(0, 0, 0, 0.08)",
        boxShadowSecondary: isDarkMode
          ? "0 4px 16px rgba(0, 0, 0, 0.4)"
          : "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
      components: {
        Card: {
          colorBgContainer: isDarkMode ? "#161b22" : "#ffffff",
          colorBorder: isDarkMode ? "#30363d" : "#e8eaed",
        },
        Input: {
          colorBgContainer: isDarkMode ? "#21262d" : "#ffffff",
          colorBorder: isDarkMode ? "#30363d" : "#e8eaed",
        },
        Select: {
          colorBgContainer: isDarkMode ? "#21262d" : "#ffffff",
          colorBorder: isDarkMode ? "#30363d" : "#e8eaed",
        },
      },
    };
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return <SunOutlined />;
      case "dark":
        return <MoonOutlined />;
      case "custom":
        return <BgColorsOutlined />;
      default:
        return <SunOutlined />;
    }
  };

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "custom":
        return "Custom";
      default:
        return "Light";
    }
  };

  const dropdownItems = [
    {
      key: "light",
      label: (
        <div className="theme-dropdown-item">
          <div className="theme-icon light-theme-icon">
            <SunOutlined />
          </div>
          <div>
            <div className="theme-name">Light Theme</div>
            <div className="theme-description">Clean and minimal</div>
          </div>
        </div>
      ),
      onClick: () => handleThemeModeChange("light"),
    },
    {
      key: "dark",
      label: (
        <div className="theme-dropdown-item">
          <div className="theme-icon dark-theme-icon">
            <MoonOutlined />
          </div>
          <div>
            <div className="theme-name">Dark Theme</div>
            <div className="theme-description">Easy on the eyes</div>
          </div>
        </div>
      ),
      onClick: () => handleThemeModeChange("dark"),
    },
    {
      key: "custom",
      label: (
        <div className="theme-dropdown-item">
          <div 
            className="theme-icon custom-theme-icon"
            style={{
              background: `linear-gradient(135deg, ${config.primaryColor}20 0%, ${config.primaryColor}40 100%)`,
              borderColor: `${config.primaryColor}60`,
              color: config.primaryColor,
            }}
          >
            <BgColorsOutlined />
          </div>
          <div>
            <div className="theme-name">Custom Theme</div>
            <div className="theme-description">Your personal style</div>
          </div>
        </div>
      ),
      onClick: () => handleThemeModeChange("custom"),
    },
  ];

  return (
    <ThemeContext.Provider value={{ config, updateTheme, isDark }}>
      <div className="theme-wrapper-header">
        <div className="theme-controls">
          <Dropdown
            menu={{ items: dropdownItems }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button className="theme-selector-button">
              {getThemeIcon(config.mode)}
              <span className="theme-label">
                {getThemeLabel(config.mode)}
              </span>
              <DownOutlined className="dropdown-arrow" />
            </Button>
          </Dropdown>

          {config.mode === "custom" && (
            <Space align="center">
              <span className="color-picker-label">
                Primary Color:
              </span>
              <ColorPicker
                value={config.primaryColor}
                onChange={handleColorChange}
                showText={false}
                size="small"
                className="theme-color-picker"
              />
            </Space>
          )}
        </div>
      </div>
      <ConfigProvider theme={getAntdThemeConfig()}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
