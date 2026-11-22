import { useTheme } from "../hooks/useTheme";
import type { Theme } from "../context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, onThemeChange } = useTheme();
  const label = theme === "light" ? "Lülita tumedaks" : "Lülita heledaks";
  const nextTheme: Theme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => onThemeChange(nextTheme)}
    >
      {label}
    </button>
  );
};