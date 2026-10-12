from fastapi import APIRouter
from .trails import router as trails_router
from .search import router as search_router
from .predict import router as predict_router
from .audio import router as audio_router
from .card import router as card_router
from .workflows import router as workflows_router

api_router = APIRouter(prefix="/api")

api_router.include_router(trails_router)
api_router.include_router(search_router)
api_router.include_router(predict_router)
api_router.include_router(audio_router)
api_router.include_router(card_router)
api_router.include_router(workflows_router)

__all__ = ["api_router"]
