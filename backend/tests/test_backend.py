import sys
import os
import unittest
import asyncio

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.config import settings
from app.services.phenology_model import phenology_service
from app.services.tiger_db import tiger_db_service
from app.services.pocket_card import pocket_card_service
from app.services.elevenlabs_tts import elevenlabs_service
from app.schemas.trail import SearchQuery, CurrentWeather, CanopyComposition
from app.schemas.card import PocketCardRequest
from app.schemas.audio import AudioBriefingRequest
from app.main import app

class TestWanderBackend(unittest.TestCase):

    def test_settings_loaded(self):
        self.assertEqual(settings.PROJECT_NAME, "Wander Backend API")
        self.assertTrue(len(settings.CORS_ORIGINS) > 0)

    def test_seed_trails_loaded(self):
        self.assertGreaterEqual(len(tiger_db_service.trails), 8)
        first_trail = tiger_db_service.trails[0]
        self.assertIsNotNone(first_trail.name)
        self.assertIsNotNone(first_trail.foliage_stage_pct)
        self.assertIsNotNone(first_trail.peak_status)

    def test_phenology_prediction(self):
        weather = CurrentWeather(
            temperature_c=8.0,
            chill_hours_cumulative=330,
            solar_radiation_mj=11.2,
            drought_stress_index=0.15,
            cloud_cover_pct=25,
            wind_speed_kmh=15
        )
        canopy = CanopyComposition(
            sugar_maple_pct=50.0,
            paper_birch_pct=30.0,
            red_oak_pct=10.0,
            american_beech_pct=10.0
        )
        pred = phenology_service.predict_foliage(
            elevation_m=1590,
            latitude=44.14,
            day_of_year=280,
            weather=weather,
            canopy=canopy
        )
        self.assertGreater(pred.foliage_stage_pct, 0.0)
        self.assertIsNotNone(pred.peak_status)
        self.assertIsNotNone(pred.peak_window.start_date)
        self.assertIsNotNone(pred.peak_window.end_date)
        self.assertIn("chill_hours", pred.explanation.feature_contributions)

    def test_timeline_generation(self):
        trail = tiger_db_service.trails[0]
        timeline_res = phenology_service.generate_timeline(trail, days_span=21)
        self.assertEqual(len(timeline_res.timeline), 21)
        self.assertIsNotNone(timeline_res.peak_window)

    def test_hybrid_search(self):
        async def run_search():
            req = SearchQuery(query="golden aspen lake reflection", limit=3)
            res = await tiger_db_service.hybrid_search(req)
            self.assertGreaterEqual(res.total_found, 1)
            # Maroon Bells should be top hit for golden aspen
            self.assertIn("Maroon Bells", res.trails[0].name)
        asyncio.run(run_search())

    def test_pocket_card_generation(self):
        trail = tiger_db_service.trails[0]
        card = pocket_card_service.generate_pocket_card(trail, custom_notes="Early sunrise departure")
        self.assertEqual(card.trail_id, trail.id)
        self.assertIn("WANDER POCKET FIELD CARD", card.field_guide_markdown)
        self.assertIn("Early sunrise departure", card.field_guide_html)

    def test_elevenlabs_briefing(self):
        async def run_audio():
            trail = tiger_db_service.trails[0]
            briefing = await elevenlabs_service.generate_briefing(trail, hiker_name="Alex")
            self.assertIsNotNone(briefing.transcript)
            self.assertIn("Alex", briefing.transcript)
            self.assertIsNotNone(briefing.audio_base64)
        asyncio.run(run_audio())

if __name__ == "__main__":
    unittest.main()
