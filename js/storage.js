// AFSNIT 01 – Sikker LocalStorage-hjælper
export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn("Kunne ikke læse LocalStorage", error);
    return fallback;
  }
}

// AFSNIT 02 – Gem data
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Kunne ikke gemme i LocalStorage", error);
  }
}
