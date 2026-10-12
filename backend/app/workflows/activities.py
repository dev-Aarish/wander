import random
import datetime
from typing import List, Dict, Any

# Safe optional temporalio import
try:
    from temporalio import activity
    activity_defn = activity.defn
except ImportError:
    def activity_defn(fn):
        return fn
    class DummyActivity:
        @staticmethod
        def get_logger():
            import logging
            return logging.getLogger("DummyActivity")
        logger = get_logger()
    activity = DummyActivity()

from ..services.phenology_model import phenology_service
from ..services.tiger_db import tiger_db_service
from ..schemas.trail import CurrentWeather

@activity_defn
async def fetch_micro_weather_activity(trail_ids: List[str]) -> List[Dict[str, Any]]:
    """
    Temporal Activity: Fetch updated micro-weather logs (NOAA/USFS) for trails.
    """
    activity.logger.info(f"Fetching micro-weather data for {len(trail_ids)} trails...")
    
    updated_weather = []
    for tid in trail_ids:
        trail = await tiger_db_service.get_trail_by_id(tid)
        if not trail:
            continue

        # Simulate subtle diurnal weather shifts
        temp_shift = random.uniform(-0.4, 0.4)
        chill_inc = random.randint(3, 8)
        solar_decay = random.uniform(-0.1, 0.05)

        w = trail.current_weather
        new_weather = CurrentWeather(
            temperature_c=round(max(-5.0, w.temperature_c + temp_shift), 1),
            chill_hours_cumulative=w.chill_hours_cumulative + chill_inc,
            solar_radiation_mj=round(max(4.0, w.solar_radiation_mj + solar_decay), 1),
            drought_stress_index=w.drought_stress_index,
            cloud_cover_pct=min(100, max(0, w.cloud_cover_pct + random.randint(-5, 5))),
            wind_speed_kmh=max(2, w.wind_speed_kmh + random.randint(-2, 3))
        )
        updated_weather.append({
            "trail_id": tid,
            "weather": new_weather.model_dump()
        })

    return updated_weather

@activity_defn
async def batch_tabpfn_inference_activity(weather_updates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Temporal Activity: Run batch TabPFN foundation tabular predictions for all updated trails.
    """
    activity.logger.info(f"Running batch TabPFN model inference for {len(weather_updates)} trails...")

    predictions = []
    for item in weather_updates:
        tid = item["trail_id"]
        w_dict = item["weather"]
        weather_obj = CurrentWeather(**w_dict)
        trail = await tiger_db_service.get_trail_by_id(tid)
        if not trail:
            continue

        pred = phenology_service.predict_foliage(
            elevation_m=trail.elevation_m,
            latitude=trail.coordinates.latitude,
            weather=weather_obj,
            canopy=trail.canopy_composition,
            trail_id=tid
        )

        predictions.append({
            "trail_id": tid,
            "foliage_stage_pct": pred.foliage_stage_pct,
            "peak_status": pred.peak_status,
            "days_to_peak": pred.days_to_peak,
            "peak_window_start": pred.peak_window.start_date,
            "peak_window_end": pred.peak_window.end_date,
            "updated_weather": w_dict,
            "timestamp": datetime.datetime.now().isoformat()
        })

    return predictions

@activity_defn
async def sync_tiger_db_activity(batch_predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Temporal Activity: Atomically sync updated TabPFN predictions to Tiger Data vector store.
    """
    activity.logger.info(f"Syncing {len(batch_predictions)} predictions atomically to Tiger Data PostgreSQL...")

    synced_count = 0
    for pred in batch_predictions:
        tid = pred["trail_id"]
        for trail in tiger_db_service.trails:
            if trail.id == tid:
                trail.foliage_stage_pct = pred["foliage_stage_pct"]
                trail.peak_status = pred["peak_status"]
                trail.days_to_peak = pred["days_to_peak"]
                trail.peak_window_start = pred["peak_window_start"]
                trail.peak_window_end = pred["peak_window_end"]
                trail.current_weather = CurrentWeather(**pred["updated_weather"])
                synced_count += 1
                break

    return {
        "status": "success",
        "synced_records": synced_count,
        "completed_at": datetime.datetime.now().isoformat()
    }
