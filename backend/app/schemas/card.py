from pydantic import BaseModel, Field
from typing import List, Optional

class CardCheckpoint(BaseModel):
    name: str
    distance_km: float
    elevation_m: int
    foliage_note: str

class PocketCardRequest(BaseModel):
    trail_id: str
    custom_notes: Optional[str] = None
    compact_mode: bool = True

class PocketCardResponse(BaseModel):
    trail_id: str
    trail_name: str
    region: str
    elevation_gain_m: int
    total_length_km: float
    estimated_hiking_time_hours: float
    difficulty: str
    foliage_status: str
    foliage_stage_pct: float
    primary_tree_species: List[str]
    checkpoints: List[CardCheckpoint]
    emergency_contacts: List[str]
    field_guide_markdown: str
    field_guide_html: str
