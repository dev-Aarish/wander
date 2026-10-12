from pydantic import BaseModel, Field
from typing import Optional

class AudioBriefingRequest(BaseModel):
    trail_id: str
    voice_id: Optional[str] = None
    hiker_name: Optional[str] = "Adventurer"
    include_safety_tips: bool = True

class AudioBriefingResponse(BaseModel):
    trail_id: str
    trail_name: str
    audio_base64: Optional[str] = None
    audio_url: Optional[str] = None
    audio_mime_type: str = "audio/mpeg"
    duration_seconds: int = 45
    transcript: str
    voice_engine: str = "ElevenLabs Turbo v2.5 (Touch Grass Trailhead Mode)"
