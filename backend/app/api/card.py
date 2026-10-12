from fastapi import APIRouter, HTTPException
from ..schemas.card import PocketCardRequest, PocketCardResponse
from ..services.pocket_card import pocket_card_service
from ..services.tiger_db import tiger_db_service

router = APIRouter(prefix="/card", tags=["Printable Pocket Field Guide"])

@router.post("/export", response_model=PocketCardResponse)
async def generate_printable_card(req: PocketCardRequest):
    """
    Generate print-ready 1-page pocket field guide card with leaf identification,
    elevation checkpoints, and zero-screen safety rules.
    """
    trail = await tiger_db_service.get_trail_by_id(req.trail_id)
    if not trail:
        raise HTTPException(status_code=404, detail=f"Trail '{req.trail_id}' not found.")

    return pocket_card_service.generate_pocket_card(
        trail=trail,
        custom_notes=req.custom_notes
    )
