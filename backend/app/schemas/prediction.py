from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from .trail import CanopyComposition, CurrentWeather

class PredictionRequest(BaseModel):
    trail_id: Optional[str] = None
    elevation_m: int = Field(1500, description="Elevation in meters")
    latitude: float = Field(44.0, description="Latitude coordinate")
    day_of_year: Optional[int] = Field(None, description="Day of year (1-365). Defaults to current day")
    current_weather: Optional[CurrentWeather] = None
    canopy_composition: Optional[CanopyComposition] = None

class PeakWindow(BaseModel):
    start_date: str
    end_date: str
    duration_hours: int = 72
    peak_date: str

class ModelExplanation(BaseModel):
    model_name: str = "TabPFN Tabular Regressor (Prior Labs Foundation Model)"
    confidence_interval_low: float
    confidence_interval_high: float
    feature_contributions: Dict[str, float]
    chlorophyll_decay_rate_per_day: float
    estimated_carotenoid_unmask_pct: float
    anthocyanin_synthesis_pct: float
    inference_latency_ms: float

class PredictionResponse(BaseModel):
    trail_id: Optional[str] = None
    foliage_stage_pct: float = Field(..., description="0-100% (100% = Peak, >100% = Past Peak)")
    peak_status: str  # "Early Green", "Moderate Turning", "Approaching Peak", "Peak Vibrant (72h Window)", "Past Peak"
    days_to_peak: int
    peak_window: PeakWindow
    vibrancy_score: float = Field(..., description="1-10 color intensity index")
    explanation: ModelExplanation
    recommendation: str

class TimelineDataPoint(BaseModel):
    date: str
    day_of_year: int
    foliage_stage_pct: float
    chlorophyll_pct: float
    anthocyanin_pct: float
    is_peak: bool
    is_current_day: bool

class TimelineResponse(BaseModel):
    trail_id: str
    trail_name: str
    region: str
    timeline: List[TimelineDataPoint]
    peak_window: PeakWindow
