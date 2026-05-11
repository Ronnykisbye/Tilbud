// AFSNIT 01 – Tema
import { APP_CONFIG } from "./config.js";
import { readStorage, writeStorage } from "./storage.js";

export function initTheme(button) {
  const saved = readStorage(APP_CONFIG.storageKeys.theme, APP_CONFIG.defaultTheme);
  setTheme(saved, button);
  button.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || APP_CONFIG.defaultTheme;
    setTheme(current === "dark" ? "light" : "dark", button);
  });
}

export function setTheme(theme, button) {
  document.documentElement.dataset.theme = theme;
  writeStorage(APP_CONFIG.storageKeys.theme, theme);
  if (button) button.textContent = theme === "dark" ? "🌙" : "☀️";
}
