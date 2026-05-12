// AFSNIT 01 – Data loader
export async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Kunne ikke hente ${path}`);
  }
  return response.json();
}
