from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..schemas.trail import Trail
from ..services.tiger_db import tiger_db_service

router = APIRouter(prefix="/trails", tags=["Trails"])

@router.get("", response_model=List[Trail])
async def list_trails(
    region: Optional[str] = Query(None, description="Filter by region (e.g. 'White Mountains', 'Rockies')"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty ('Easy', 'Moderate', 'Hard')"),
    min_elevation_m: Optional[int] = Query(None, description="Minimum elevation in meters"),
    max_elevation_m: Optional[int] = Query(None, description="Maximum elevation in meters"),
    max_days_to_peak: Optional[int] = Query(None, description="Maximum days until peak color")
):
    """
    Retrieve all trails with optional metadata filtering and live TabPFN phenology predictions.
    """
    return await tiger_db_service.get_all_trails(
        region=region,
        difficulty=difficulty,
        min_elevation=min_elevation_m,
        max_elevation=max_elevation_m,
        max_days_to_peak=max_days_to_peak
    )

@router.get("/{trail_id}", response_model=Trail)
async def get_trail_detail(trail_id: str):
    """
    Retrieve single trail details with live canopy and weather calculations.
    """
    trail = await tiger_db_service.get_trail_by_id(trail_id)
    if not trail:
        raise HTTPException(status_code=404, detail=f"Trail '{trail_id}' not found.")
    return trail

@router.post("/discover", response_model=Trail)
async def discover_trail(req: "DiscoverTrailRequest"):
    """
    Dynamically discovers and predicts foliage for ANY user coordinate or location name globally.
    Fetches real-time satellite elevation and micro-weather from Open-Meteo,
    runs TabPFN zero-shot phenology regression, and saves directly into Tiger Data Cloud with vector embeddings!
    """
    from ..schemas.trail import DiscoverTrailRequest
    from ..services.geo_discovery import geo_discovery_service

    trail = await geo_discovery_service.discover_and_index(
        query=req.query,
        latitude=req.latitude,
        longitude=req.longitude,
        custom_name=req.custom_name
    )
    return trail
