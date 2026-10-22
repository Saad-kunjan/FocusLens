const API = "http://localhost:5000/api";

export async function getStats(date) {
  const res = await fetch(`${API}/stats${date ? `?date=${date}` : ""}`);
  if (!res.ok) throw new Error("Failed to load stats");
  return res.json();
}

export async function getHistory() {
  const res = await fetch(`${API}/history`);
  if (!res.ok) throw new Error("Failed to load history");
  return res.json();
}

export async function setCategory(domain, category) {
  const res = await fetch(`${API}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, category }),
  });
  if (!res.ok) throw new Error("Failed to update category");
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
