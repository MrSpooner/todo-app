import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import type { DefaultTheme } from "styled-components";
import { loadTheme, saveTheme } from "../utils/themeStorage";

export type ThemeName = "light" | "dark";

type ThemeContextType = {
  theme: ThemeName;
  toggle: () => void;
};

const ThemeCtx = createContext<ThemeContextType | undefined>(undefined);

const lightTheme: DefaultTheme = {
  bg: "#f7f7f9",
  card: "#ffffff",
  text: "#0f172a",
  sub: "#64748b",
  accent: "#2563eb",
};

const darkTheme: DefaultTheme = {
  bg: "#0b1220",
  card: "#0f172a",
  text: "#e6eef8",
  sub: "#94a3b8",
  accent: "#60a5fa",
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>(() => (loadTheme() as ThemeName) || "light");

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);

  const themeObject = useMemo<DefaultTheme>(() => (theme === "light" ? lightTheme : darkTheme), [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <SCThemeProvider theme={themeObject}>{children}</SCThemeProvider>
    </ThemeCtx.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
