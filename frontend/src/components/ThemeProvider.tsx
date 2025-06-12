import { useState, useEffect } from "react";
import { ThemeProviderContext } from "@/hooks/useTheme";

export function ThemeProvider({
  children,
  storageKey = "distort-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [storedTheme, setStoredTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && "mode" in parsed) {
          return parsed as Theme;
        }
      } catch (e) {
        console.error("Invalid theme in localStorage", e);
      }
    }
    return { mode: "dark" }; // fallback default theme
  });

  // Read from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if (parsed && typeof parsed === "object" && "mode" in parsed) {
          setStoredTheme(parsed);
        }
      } catch (e) {
        console.error("Invalid theme data in localStorage", e);
      }
    }
  }, [storageKey]);

  // Write to localStorage whenever storedTheme changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(storedTheme));
  }, [storedTheme, storageKey]);

  const value = {
    theme: storedTheme,
    setTheme: (theme: Theme) => {
      setStoredTheme(theme);
    },
  };

  const currentMode =
    storedTheme.mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : storedTheme.mode;

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div className={currentMode} data-theme={currentMode}>
        {children}
      </div>
    </ThemeProviderContext.Provider>
  );
}
