// src/server.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from '../routes/authRoutes.js';
import bibliotecaRoutes from '../routes/bibliotecaRoutes.js';
import { testDbConnection } from '../db.js';
import { metricsMiddleware, metricsRoute } from '../metrics/metrics.js';
import geminiRoutes from '../routes/geminiRoutes.js';

const app = express();
app.use(express.json());

// métricas antes de las rutas
app.use(metricsMiddleware);

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

// rutas de negocio
app.use('/api/auth', authRoutes);
app.use('/api/biblioteca', bibliotecaRoutes);

// endpoint de métricas para Prometheus
metricsRoute(app);

//endpoint gemini
app.use('/api/gemini', geminiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  try {
    await testDbConnection();
    console.log('✅ Conectado a MySQL correctamente');
  } catch (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
  }
});
