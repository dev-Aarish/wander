from fastapi import APIRouter, HTTPException
from ..schemas.prediction import PredictionRequest, PredictionResponse, TimelineResponse
from ..services.phenology_model import phenology_service
from ..services.tiger_db import tiger_db_service

router = APIRouter(prefix="/predict", tags=["TabPFN Phenology Prediction"])

@router.post("/foliage", response_model=PredictionResponse)
async def predict_foliage_custom(req: PredictionRequest):
    """
    Run on-demand TabPFN foundation model prediction with custom environmental parameters.
    """
    return phenology_service.predict_foliage(
        elevation_m=req.elevation_m,
        latitude=req.latitude,
        day_of_year=req.day_of_year,
        weather=req.current_weather,
        canopy=req.canopy_composition,
        trail_id=req.trail_id
    )

@router.get("/timeline/{trail_id}", response_model=TimelineResponse)
async def get_trail_timeline(trail_id: str):
    """
    Generate 21-day historical and future foliage progression curve for time-series charts.
    """
    trail = await tiger_db_service.get_trail_by_id(trail_id)
    if not trail:
        raise HTTPException(status_code=404, detail=f"Trail '{trail_id}' not found.")
    
    return phenology_service.generate_timeline(trail)
