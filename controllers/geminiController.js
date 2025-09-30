// controllers/geminiController.js
import { promQuery, promRangeQuery } from '../services/promClient.js';
import { resumirConGemini } from '../services/geminiService.js';

const Q = {
  rps: `sum by (route,method) (rate(http_requests_total[5m]))`,
  errRate: `
    sum(rate(http_requests_total{status_code=~"5.."}[5m])) 
    / clamp_min(sum(rate(http_requests_total[5m])), 1)
  `,
  p95: `
    histogram_quantile(0.95,
      sum by (le,route,method) (rate(http_request_duration_seconds_bucket[5m]))
    )
  `,
  cpu: `sum(rate(node_process_cpu_seconds_total[1m]))`,
  rss: `avg(node_process_resident_memory_bytes)`,
};

export async function metricsSummary(_req, res) {
  const now = Date.now();
  const start = now - 15 * 60 * 1000;

  const [rps, errRate, p95, cpu, rss] = await Promise.all([
    promQuery(Q.rps),
    promQuery(Q.errRate),
    promQuery(Q.p95),
    promRangeQuery(Q.cpu, start, now, 30),
    promQuery(Q.rss),
  ]);

  const parseScalar = (d) => Number(d?.result?.[0]?.value?.[1] ?? 0);
  const err = parseScalar(errRate);
  const rssBytes = parseScalar(rss);

  const topP95 = (p95.result || [])
    .map(r => ({ route: r.metric.route || r.metric.path || 'unknown', method: r.metric.method, value: Number(r.value?.[1] ?? 0) }))
    .filter(x => Number.isFinite(x.value))
    .sort((a,b) => b.value - a.value)
    .slice(0,5);

  const topRps = (rps.result || [])
    .map(r => ({ route: r.metric.route || r.metric.path || 'unknown', method: r.metric.method, value: Number(r.value?.[1] ?? 0) }))
    .filter(x => Number.isFinite(x.value))
    .sort((a,b) => b.value - a.value)
    .slice(0,5);

  const cpuSeries = (cpu.result?.[0]?.values || []).map(([ts, v]) => [Number(ts)*1000, Number(v)]);

  const metrics = {
    window: 'last_15m',
    error_rate: err,
    memory_rss_bytes: rssBytes,
    top_p95: topP95,
    top_rps: topRps,
    cpu_series: cpuSeries
  };

  let texto = 'Va bien: error rate bajo y p95 estable.';
  if (err > 0.01) texto = `Atento: error rate ${(err*100).toFixed(2)}%`;
  if (topP95[0]?.value > 0.6) {
    const ms = Math.round(topP95[0].value * 1000);
    texto += (texto.startsWith('Va bien') ? '' : '. ') + `p95 alto en ${topP95[0].route} (${ms}ms)`;
  }

  const ai = await resumirConGemini(metrics);
  return res.json({ metrics, gemini: ai || texto });
}
