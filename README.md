# MCP Backend

API REST en Node.js/Express con métricas de rendimiento instrumentadas con Prometheus y análisis automático usando Gemini AI. Construido como backend de monitoreo para sistemas de gestión de contenido.

---

## ¿Qué hace?

- Expone endpoints REST para autenticación, biblioteca y categorías
- Instrumenta métricas de rendimiento con **Prometheus** (`/metrics`)
- Analiza métricas en tiempo real usando **Gemini API** (`/api/gemini/metrics`)
- Healthcheck integrado para monitoreo de disponibilidad

---

## Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)

---

## Requisitos

- Node.js >= 20
- MySQL corriendo y accesible
- Prometheus (incluido en `/prometheus-3.5.0.windows-amd64/`)

---

## Instalación

```bash
git clone https://github.com/JxsueMd16/MCP_BACKEND.git
cd MCP_BACKEND
npm install
```

Crea un archivo `.env` en la raíz basándote en `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=mcp_db
GEMINI_API_KEY=tu_api_key
PORT=3000
```

---

## Levantar el proyecto

### 1. Iniciar Prometheus

```bash
cd prometheus-3.5.0.windows-amd64\prometheus-3.5.0.windows-amd64
.\prometheus.exe --config.file=prometheus.yml --web.enable-lifecycle
```

Prometheus disponible en `http://localhost:9090`. El target `http://localhost:3000/metrics` debe aparecer como **UP**.

### 2. Iniciar el backend

```bash
node src/server.js
```

Servidor disponible en `http://localhost:3000`.

---

## Endpoints

### Healthcheck
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Estado del servidor |

### Autenticación
| Método | Ruta | Body |
|---|---|---|
| `POST` | `/api/auth/register` | `{ nombre, usuario, clave }` |
| `POST` | `/api/auth/login` | `{ usuario, clave }` |

### Biblioteca
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/biblioteca/libros` | Listar libros |
| `POST` | `/api/biblioteca/libros` | Crear libro |
| `PUT` | `/api/biblioteca/libros/:id` | Actualizar libro |
| `DELETE` | `/api/biblioteca/libros/:id` | Eliminar libro |
| `GET` | `/api/biblioteca/categorias` | Listar categorías |
| `POST` | `/api/biblioteca/categorias` | Crear categoría |

### Métricas
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/metrics` | Métricas en formato Prometheus |
| `GET` | `/api/gemini/metrics` | Análisis de métricas con Gemini AI |

---

## Estructura

```
MCP_BACKEND/
├── src/
│   └── server.js        # Punto de entrada
├── prometheus-3.5.0.windows-amd64/
│   └── prometheus.yml   # Configuración de Prometheus
├── .env.example         # Variables de entorno requeridas
├── .gitignore
├── package.json
└── README.md
```

---

## Contacto

[![Gmail](https://img.shields.io/badge/josuemorandelacruz16@gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:josuemorandelacruz16@gmail.com)
