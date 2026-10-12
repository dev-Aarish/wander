from datetime import timedelta
from typing import List, Dict, Any

try:
    from temporalio import workflow
    from temporalio.common import RetryPolicy
    workflow_defn = workflow.defn
    workflow_run = workflow.run
    workflow_query = workflow.query
    with workflow.unsafe.imports_passed_through():
        from .activities import (
            fetch_micro_weather_activity,
            batch_tabpfn_inference_activity,
            sync_tiger_db_activity
        )
except ImportError:
    def workflow_defn(cls):
        return cls
    def workflow_run(fn):
        return fn
    def workflow_query(fn):
        return fn
    class DummyRetryPolicy:
        def __init__(self, **kwargs):
            pass
    RetryPolicy = DummyRetryPolicy
    from .activities import (
        fetch_micro_weather_activity,
        batch_tabpfn_inference_activity,
        sync_tiger_db_activity
    )

@workflow_defn
class FoliageSyncWorkflow:
    """
    Temporal Durable Workflow:
    Orchestrates periodic batch weather updates, TabPFN phenology recalculation,
    and Tiger Data atomic vector store synchronization.
    """

    def __init__(self):
        self._status = "initialized"
        self._last_sync_result: Dict[str, Any] = {}

    @workflow_query
    def get_workflow_status(self) -> Dict[str, Any]:
        return {
            "status": self._status,
            "last_sync_result": self._last_sync_result
        }

    @workflow_run
    async def run(self, trail_ids: List[str]) -> Dict[str, Any]:
        self._status = "running"
        workflow.logger.info(f"Starting FoliageSyncWorkflow for {len(trail_ids)} trails.")

        retry_policy = RetryPolicy(
            initial_interval=timedelta(seconds=2),
            backoff_coefficient=2.0,
            maximum_interval=timedelta(minutes=1),
            maximum_attempts=3
        )

        # Step 1: Poll micro-weather
        self._status = "fetching_weather"
        weather_updates = await workflow.execute_activity(
            fetch_micro_weather_activity,
            trail_ids,
            start_to_close_timeout=timedelta(seconds=60),
            retry_policy=retry_policy
        )

        # Step 2: Batch TabPFN Inference
        self._status = "batch_tabpfn_inference"
        predictions = await workflow.execute_activity(
            batch_tabpfn_inference_activity,
            weather_updates,
            start_to_close_timeout=timedelta(seconds=120),
            retry_policy=retry_policy
        )

        # Step 3: Atomic Sync to Tiger Data
        self._status = "syncing_tiger_data"
        sync_result = await workflow.execute_activity(
            sync_tiger_db_activity,
            predictions,
            start_to_close_timeout=timedelta(seconds=60),
            retry_policy=retry_policy
        )

        self._status = "completed"
        self._last_sync_result = {
            "trails_updated": len(predictions),
            "sync_details": sync_result
        }

        workflow.logger.info("FoliageSyncWorkflow completed successfully.")
        return self._last_sync_result
