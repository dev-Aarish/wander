import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.CORS_ORIGINS == ["*"] else settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)

@app.get("/", tags=["General"])
async def root():
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

@app.get("/health", tags=["General"])
async def health_check():
    return {
        "status": "healthy",
        "database_connected": tiger_db_service.is_connected_to_db,
        "total_trails_indexed": len(tiger_db_service.trails),
        "tabpfn_loaded": tiger_db_service.trails[0].foliage_stage_pct is not None if tiger_db_service.trails else False
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
