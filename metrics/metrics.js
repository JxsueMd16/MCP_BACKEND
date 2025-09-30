// metrics/metrics.js
import client from 'prom-client';

const register = new client.Registry();
register.setDefaultLabels({ app: 'backend-mcp' });

// métricas de proceso (cpu, memoria, event loop, gc, etc.)
client.collectDefaultMetrics({ register, prefix: 'node_' });

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestErrorsTotal = new client.Counter({
  name: 'http_request_errors_total',
  help: 'Total HTTP 5xx responses',
  labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestDurationSeconds);
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestErrorsTotal);

function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const deltaNs = Number(process.hrtime.bigint() - start);
    const seconds = deltaNs / 1e9;
    const route = req.route?.path || req.originalUrl.split('?')[0] || 'unknown';
    const labels = { method: req.method, route, status_code: String(res.statusCode) };
    httpRequestDurationSeconds.observe(labels, seconds);
    httpRequestsTotal.inc(labels);
    if (res.statusCode >= 500) httpRequestErrorsTotal.inc(labels);
  });
  next();
}

function metricsRoute(app) {
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
}

export { register, metricsMiddleware, metricsRoute };
