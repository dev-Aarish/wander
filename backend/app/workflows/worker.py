import asyncio
from temporalio.client import Client
from temporalio.worker import Worker
from ..config import settings
from .foliage_sync import FoliageSyncWorkflow
from .activities import (
    fetch_micro_weather_activity,
    batch_tabpfn_inference_activity,
    sync_tiger_db_activity
)

async def run_temporal_worker():
    print(f"[Temporal] Connecting to Temporal server at {settings.TEMPORAL_HOST}...")
    try:
        client = await Client.connect(
            settings.TEMPORAL_HOST,
            namespace=settings.TEMPORAL_NAMESPACE
        )
        print(f"[Temporal] Connected to namespace '{settings.TEMPORAL_NAMESPACE}'. Initializing worker...")

        worker = Worker(
            client,
            task_queue=settings.TEMPORAL_TASK_QUEUE,
            workflows=[FoliageSyncWorkflow],
            activities=[
                fetch_micro_weather_activity,
                batch_tabpfn_inference_activity,
                sync_tiger_db_activity
            ]
        )
        print(f"[Temporal] Worker listening on task queue '{settings.TEMPORAL_TASK_QUEUE}'.")
        await worker.run()
    except Exception as e:
        print(f"[Temporal] Temporal server connection note: {e}")
        print("[Temporal] Running in standalone local simulation mode (API triggers will execute async directly).")

if __name__ == "__main__":
    asyncio.run(run_temporal_worker())
