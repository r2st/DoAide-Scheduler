import { useTheme } from "../hooks/useTheme";

const icons = {
  light: "☀️",
  dark: "🌙",
  system: "💻",
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  return (
    <button
      onClick={() => setTheme(next)}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={`Theme: ${theme}`}
    >
      {icons[theme]}
    </button>
  );
}
