from fastapi import APIRouter
from ..schemas.trail import SearchQuery, SearchResult
from ..services.tiger_db import tiger_db_service

router = APIRouter(prefix="/search", tags=["Hybrid Search"])

@router.post("", response_model=SearchResult)
async def hybrid_trail_search(search_req: SearchQuery):
    """
    Execute hybrid natural language search across Tiger Data PostgreSQL + pgvector store.
    Combines semantic vector embeddings with keyword heuristics and categorical filters.
    """
    return await tiger_db_service.hybrid_search(search_req)
