from fastapi import APIRouter, HTTPException
from ..schemas.audio import AudioBriefingRequest, AudioBriefingResponse
from ..services.elevenlabs_tts import elevenlabs_service
from ..services.tiger_db import tiger_db_service

router = APIRouter(prefix="/audio", tags=["ElevenLabs Audio Briefing"])

@router.post("/briefing", response_model=AudioBriefingResponse)
async def generate_audio_briefing(req: AudioBriefingRequest):
    """
    Generate 45-second pre-trail audio briefing via ElevenLabs TTS.
    Allows hikers to listen at the trailhead and put their phones away.
    """
    trail = await tiger_db_service.get_trail_by_id(req.trail_id)
    if not trail:
        raise HTTPException(status_code=404, detail=f"Trail '{req.trail_id}' not found.")

    return await elevenlabs_service.generate_briefing(
        trail=trail,
        voice_id=req.voice_id,
        hiker_name=req.hiker_name or "Adventurer"
    )
