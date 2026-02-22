import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext(undefined);

// 12 accent color presets
export const ACCENT_COLORS = [
  { id: "blue", label: "Blue", hex: "#465FFF" },
  { id: "violet", label: "Violet", hex: "#7C3AED" },
  { id: "indigo", label: "Indigo", hex: "#4338CA" },
  { id: "sky", label: "Sky", hex: "#0284C7" },
  { id: "cyan", label: "Cyan", hex: "#0891B2" },
  { id: "teal", label: "Teal", hex: "#0D9488" },
  { id: "emerald", label: "Emerald", hex: "#16A34A" },
  { id: "lime", label: "Lime", hex: "#65A30D" },
  { id: "amber", label: "Amber", hex: "#D97706" },
  { id: "orange", label: "Orange", hex: "#EA580C" },
  { id: "rose", label: "Rose", hex: "#E11D48" },
  { id: "pink", label: "Pink", hex: "#DB2777" },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [accentColor, setAccentColor] = useState("blue");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedAccent = localStorage.getItem("accentColor") || "blue";
    setTheme(savedTheme);
    setAccentColor(savedAccent);
    setIsInitialized(true);
  }, []);

  // Apply theme (dark/light class on <html>)
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isInitialized]);

  // Apply accent color as data-accent attribute on <html>
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("accentColor", accentColor);
    if (accentColor === "blue") {
      document.documentElement.removeAttribute("data-accent");
    } else {
      document.documentElement.setAttribute("data-accent", accentColor);
    }
  }, [accentColor, isInitialized]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, accentColor, setAccentColor, ACCENT_COLORS }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
