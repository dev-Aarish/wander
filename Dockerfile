# ==============================================================================
# Multi-stage Dockerfile for Wander (Fullstack Unified Container)
# Supports single-service deployment on Render, DigitalOcean, or Docker environments.
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend Assets
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci || npm install

COPY frontend/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Python Backend & Production Runner
# ------------------------------------------------------------------------------
FROM python:3.12-slim AS runner
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    ENVIRONMENT=production \
    DEBUG=false

# Install minimal system tools
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install backend Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend source code & data
COPY backend/ ./backend/

# Copy compiled frontend distribution into place so FastAPI serves the SPA UI
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 8000

# Healthcheck endpoint for zero-downtime container monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Launch uvicorn listening on the dynamic port assigned by Render ($PORT)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
