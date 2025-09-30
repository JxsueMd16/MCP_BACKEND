Este proyecto expone una API en Node.js/Express con métricas de rendimiento instrumentadas con Prometheus y análisis automático usando Gemini.

Requisitos

Node.js >= 20

MySQL corriendo y accesible

Prometheus (ya incluido en /prometheus-3.5.0.windows-amd64/)


Cómo levantar todo

1. Iniciar Prometheus

Desde la carpeta:
cd backend-mcp\prometheus-3.5.0.windows-amd64\prometheus-3.5.0.windows-amd64
.\prometheus.exe --config.file=prometheus.yml --web.enable-lifecycle


Prometheus quedará expuesto en:
http://localhost:9090

El target configurado (http://localhost:3000/metrics) debe aparecer como UP.

2. Iniciar el Backend

En otra terminal:

cd backend-mcp
npm install
node src/server.js

Servidor en:
 http://localhost:3000


Endpoints principales
Healthcheck
GET /health

Autenticación
POST /api/auth/register   { nombre, usuario, clave }
POST /api/auth/login      { usuario, clave }

Libros / Categorías
GET    /api/biblioteca/libros
POST   /api/biblioteca/libros
PUT    /api/biblioteca/libros/:id
DELETE /api/biblioteca/libros/:id
GET    /api/biblioteca/categorias
POST   /api/biblioteca/categorias

Métricas (Prometheus)
GET /metrics

Métricas + Gemini (IA)
GET /api/gemini/metrics