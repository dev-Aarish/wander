import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .api import api_router
from .services.tiger_db import tiger_db_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to Tiger Data if configured
    print(f"🌲 Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    await tiger_db_service.connect_db()
    yield
    # Shutdown
    if tiger_db_service.pool:
        await tiger_db_service.pool.close()
        print("🌲 Tiger Data pool connection closed.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Open Phenology, Fall Peak Foliage Forecaster & Zero-Screen Trail Companion powered by TabPFN, Tiger Data, Temporal, and ElevenLabs.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
configured_origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
allow_all = "*" in configured_origins or configured_origins == ["*"]
allowed_origins_list = [] if allow_all else [o for o in configured_origins if o != "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_list,
    allow_origin_regex=r".*" if allow_all else r"^https?://.*\.onrender\.com$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)

# Resolve path to built frontend if available
frontend_dist = os.path.abspath(
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")
)
has_frontend = os.path.isdir(frontend_dist) and os.path.isfile(os.path.join(frontend_dist, "index.html"))

if has_frontend:
    from fastapi.staticfiles import StaticFiles
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/api/info", tags=["General"])
async def api_info():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "philosophy": "Zero-Screen Trail Companion (Touch Grass - Hacktoberfest 2026)",
        "docs": "/docs",
        "partners": {
            "tabpfn": "Tabular foundation regression for chlorophyll decay & 72h peak window",
            "tiger_data": "PostgreSQL + pgvector hybrid semantic route discovery",
            "temporal": "Durable micro-weather sync and batch prediction workflows",
            "elevenlabs": "45-second trailhead voice briefings"
        }
    }

@app.get("/", tags=["General"])
async def root(request: Request = None):
    from fastapi.responses import FileResponse
    # If frontend build exists and request is from a browser, serve web app
    if has_frontend:
        accept = request.headers.get("accept", "") if request else ""
        if "text/html" in accept:
            return FileResponse(os.path.join(frontend_dist, "index.html"))
    return await api_info()

@app.get("/health", tags=["General"])
async def health_check():
    return {
        "status": "healthy",
        "database_connected": tiger_db_service.is_connected_to_db,
        "total_trails_indexed": len(tiger_db_service.trails),
        "tabpfn_loaded": tiger_db_service.trails[0].foliage_stage_pct is not None if tiger_db_service.trails else False
    }

# SPA catch-all route for client-side routing when frontend is built
if has_frontend:
    from fastapi.responses import FileResponse

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        if full_path.startswith(("api", "docs", "redoc", "openapi.json", "health")):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
