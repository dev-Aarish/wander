# Wander — Render Deployment Guide 🚀

This guide provides instructions for deploying **Wander** (Open Phenology, Fall Peak Foliage Forecaster & Zero-Screen Trail Companion) on [Render](https://render.com).

---

## 🏗️ Architecture on Render

Wander is configured to support **two production deployment models** on Render:

| Deployment Model | Architecture | Render Services Used | Free Tier Compatibility |
| :--- | :--- | :--- | :--- |
| **Option 1: Render Blueprint (Recommended)** | Decoupled Backend Web Service + Static Site | 1 Web Service (Python) + 1 Static Site (React/Vite) | **100% Free** (Static Sites do not consume free instance hours) |
| **Option 2: Unified Container** | Single container serving both FastAPI and Vite SPA | 1 Web Service (Docker) | **100% Free** (Uses 1 Web Service) |

---

## ⚡ Option 1: One-Click Blueprint Deployment (`render.yaml`)

The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint specification that automatically provisions and wires together both the backend and frontend.

### Step 1: Connect Your Repository to Render
1. Push your latest code to GitHub or GitLab.
2. Go to the [Render Dashboard](https://dashboard.render.com).
3. Click **New +** in the top navigation bar and select **Blueprint**.
4. Select your Wander repository.

### Step 2: Review and Apply Blueprint
Render will detect `render.yaml` and configure:
1. **`wander-api` (Web Service)**:
   - **Environment**: Python 3.12.8
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`
2. **`wander-web` (Static Site)**:
   - **Type / Runtime**: `type: web` + `runtime: static` (Official Render Blueprint schema for static sites)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **SPA Routing**: Automatic rewrite `/* -> /index.html`
   - **API Connection**: Automatically injects `VITE_API_BASE_URL` from the `wander-api` host.

### Step 3: Configure Environment Variables (Optional Secrets)
In your Render Dashboard for `wander-api`, configure your secret partner API keys as needed:

| Variable | Description | Default / Fallback |
| :--- | :--- | :--- |
| `DATABASE_URL` | Tiger Data PostgreSQL + pgvector connection string | In-memory / local vector store fallback |
| `ELEVENLABS_API_KEY` | ElevenLabs voice synthesis API key | Browser Web Speech fallback |
| `ELEVENLABS_VOICE_ID` | ElevenLabs Voice ID (e.g. `nPczCjzI2devNBz1zQrb` for Brian, `pNInz6obpgDQGcFmaJgB` for Adam) | `21m00Tcm4TlvDq8ikWAM` (Rachel) |
| `TABPFN_API_KEY` | Prior Labs TabPFN API key | Calibrated USFS/NOAA biophysical phenology model |
| `TEMPORAL_HOST` | Temporal workflow orchestrator host | In-process asynchronous task orchestrator |

Click **Apply Blueprint** to trigger your deployment!

---

## 🐳 Option 2: Unified Container Deployment (`Dockerfile`)

If you prefer to host Wander as a single unified service on one URL:

1. Click **New +** > **Web Service** in Render.
2. Select your repository.
3. Choose **Docker** as the runtime.
4. Leave Root Directory blank (it builds from repo root).
5. Render will automatically detect the multi-stage `Dockerfile`:
   - Stage 1 compiles the React + Vite frontend.
   - Stage 2 installs Python dependencies and copies the built frontend into FastAPI's static assets directory.
6. Under **Health Check Path**, set `/health`.
7. Click **Create Web Service**.

Both the interactive web UI (at `/`) and the API (at `/api/...` and `/docs`) will be served from a single Render URL.

---

## 🛠️ Option 3: Manual Service Creation

If you prefer to configure services manually without Blueprints:

### Backend (Web Service)
- **Type**: Web Service
- **Name**: `wander-api`
- **Runtime**: Python 3
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`
- **Environment Variables**:
  - `PYTHON_VERSION`: `3.12.8`
  - `ENVIRONMENT`: `production`
  - `DEBUG`: `false`

### Frontend (Static Site)
- **Type**: Static Site
- **Name**: `wander-web`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Rewrite Rules**:
  - Under **Redirects/Rewrites**:
    - **Type**: `Rewrite`
    - **Source**: `/*`
    - **Destination**: `/index.html`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://wander-api.onrender.com` (use your actual backend URL)

---

## 🔒 CORS Configuration

The backend in `app/main.py` is pre-configured with zero-config CORS for Render:
- Any `https://*.onrender.com` origin is automatically permitted.
- Any origins defined in the `CORS_ORIGINS` environment variable are permitted.
- Standard credentials and headers are enabled.

---

## 🩺 Verification & Health Check

After deployment completes:

1. **Verify Backend Health**:
   ```bash
   curl https://<your-backend>.onrender.com/health
   # Expected response: {"status":"healthy","database_connected":...,"total_trails_indexed":8,"tabpfn_loaded":true}
   ```
2. **Verify Interactive API Documentation**:
   Navigate to `https://<your-backend>.onrender.com/docs`.
3. **Verify Frontend UI**:
   Navigate to `https://<your-frontend>.onrender.com` to explore live foliage forecasts, audio briefings, and pocket field cards.
