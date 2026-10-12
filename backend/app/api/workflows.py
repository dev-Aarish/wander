import asyncio
from fastapi import APIRouter, BackgroundTasks
from typing import Dict, Any, List
from ..services.tiger_db import tiger_db_service
from ..workflows.activities import (
    fetch_micro_weather_activity,
    batch_tabpfn_inference_activity,
    sync_tiger_db_activity
)

router = APIRouter(prefix="/workflows", tags=["Temporal Durable Workflows"])

# In-memory tracking of recent sync runs
_sync_history: List[Dict[str, Any]] = []

async def _run_async_foliage_sync(trail_ids: List[str]):
    try:
        weather_updates = await fetch_micro_weather_activity(trail_ids)
        predictions = await batch_tabpfn_inference_activity(weather_updates)
        sync_result = await sync_tiger_db_activity(predictions)
        _sync_history.append({
            "status": "completed",
            "trails_synced": len(predictions),
            "result": sync_result
        })
    except Exception as e:
        _sync_history.append({
            "status": "failed",
            "error": str(e)
        })

@router.post("/trigger-sync")
async def trigger_foliage_sync_workflow(background_tasks: BackgroundTasks):
    """
    Trigger the Temporal Durable Workflow to fetch micro-weather shifts,
    recalculate TabPFN predictions, and sync updates to Tiger Data.
    """
    trail_ids = [t.id for t in tiger_db_service.trails]
    
    # Run async background orchestration
    background_tasks.add_task(_run_async_foliage_sync, trail_ids)

    return {
        "message": f"Foliage sync workflow dispatched for {len(trail_ids)} trails.",
        "task_queue": "foliage-sync-queue",
        "workflow_id": f"foliage-sync-{len(_sync_history) + 1}"
    }

@router.get("/status")
async def get_workflow_sync_status():
    """
    Retrieve status and execution history of recent foliage sync workflows.
    """
    return {
        "total_executions": len(_sync_history),
        "recent_runs": _sync_history[-5:] if _sync_history else []
    }
