from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Coordinates(BaseModel):
    latitude: float
    longitude: float

class CanopyComposition(BaseModel):
    sugar_maple_pct: float = 0.0
    quaking_aspen_pct: float = 0.0
    red_oak_pct: float = 0.0
    american_beech_pct: float = 0.0
    paper_birch_pct: float = 0.0
    alpine_larch_pct: float = 0.0
    sourwood_pct: float = 0.0
    conifer_pct: float = 0.0
    vine_maple_pct: float = 0.0
    colorado_blue_spruce_pct: float = 0.0
    lodgepole_pine_pct: float = 0.0
    douglas_fir_pct: float = 0.0

class CurrentWeather(BaseModel):
    temperature_c: float
    chill_hours_cumulative: int
    solar_radiation_mj: float
    drought_stress_index: float
    cloud_cover_pct: int = 20
    wind_speed_kmh: int = 15

class Viewpoint(BaseModel):
    name: str
    distance_km: float
    elevation_m: int
    species_focus: str

class Trail(BaseModel):
    id: str
    name: str
    region: str
    state: str
    coordinates: Coordinates
    elevation_m: int
    length_km: float
    difficulty: str  # "Easy", "Moderate", "Hard"
    summary: str
    canopy_composition: CanopyComposition
    current_weather: CurrentWeather
    viewpoints: List[Viewpoint] = []
    tags: List[str] = []
    foliage_stage_pct: Optional[float] = None
    peak_status: Optional[str] = None  # "Early Turning", "Approaching Peak", "Peak Vibrant", "Past Peak"
    days_to_peak: Optional[int] = None
    peak_window_start: Optional[str] = None
    peak_window_end: Optional[str] = None

class TrailSummary(BaseModel):
    id: str
    name: str
    region: str
    state: str
    elevation_m: int
    length_km: float
    difficulty: str
    foliage_stage_pct: float
    peak_status: str
    days_to_peak: int
    primary_species: str
    tags: List[str]

class SearchQuery(BaseModel):
    query: str = Field(..., description="Natural language search or keywords (e.g. 'golden aspen reflection mountain lake')")
    region: Optional[str] = None
    difficulty: Optional[str] = None
    min_elevation_m: Optional[int] = None
    max_elevation_m: Optional[int] = None
    max_days_to_peak: Optional[int] = None
    limit: int = 10

class SearchResult(BaseModel):
    trails: List[Trail]
    total_found: int
    search_mode: str = "hybrid_pgvector"  # "hybrid_pgvector", "semantic", "filter"
    query_parsed_intent: Optional[Dict[str, Any]] = None

class DiscoverTrailRequest(BaseModel):
    query: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    custom_name: Optional[str] = None
