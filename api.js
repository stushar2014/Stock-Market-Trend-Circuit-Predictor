// Single place where the frontend talks to the backend.
// In dev the Vite proxy (vite.config.js) forwards /api to localhost:5000.
// In production set VITE_API_BASE to your deployed API origin.
const BASE = import.meta.env.VITE_API_BASE ?? "";

export async function requestPrediction(params) {
  const res = await fetch(`${BASE}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  // The server always answers with JSON, including for errors.
  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(payload?.error ?? `Request failed with status ${res.status}`);
  }
  return payload;
}
