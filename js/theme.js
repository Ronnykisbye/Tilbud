// AFSNIT 01 – Dag/nat-mode
import { getTheme, setTheme } from "./storage.js";

export function initTheme() {
  const theme = getTheme();
  document.documentElement.dataset.theme = theme;
  updateThemeButton(theme);

  document.querySelector("#themeToggle")?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = current;
    setTheme(current);
    updateThemeButton(current);
  });
}

function updateThemeButton(theme) {
  const btn = document.querySelector("#themeToggle");
  if (btn) btn.textContent = theme === "light" ? "☀️" : "🌙";
}
