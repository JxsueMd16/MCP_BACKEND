// services/promClient.js
const BASE = process.env.PROM_URL;

const toISO = (ms) => new Date(ms).toISOString();

export async function promQuery(q) {
  const url = `${BASE}/api/v1/query?query=${encodeURIComponent(q)}`;
  const r = await fetch(url);
  const j = await r.json();
  return j?.data || {};
}

export async function promRangeQuery(q, startMs, endMs, stepSec = 30) {
  const url = `${BASE}/api/v1/query_range?query=${encodeURIComponent(q)}&start=${toISO(startMs)}&end=${toISO(endMs)}&step=${stepSec}s`;
  const r = await fetch(url);
  const j = await r.json();
  return j?.data || {};
}
