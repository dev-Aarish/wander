import sys
import os
import unittest
from starlette.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

class TestAPIEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("tabpfn", data["partners"])

    def test_health_endpoint(self):
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "healthy")
        self.assertGreaterEqual(data["total_trails_indexed"], 8)

    def test_list_trails_endpoint(self):
        resp = self.client.get("/api/trails")
        self.assertEqual(resp.status_code, 200)
        trails = resp.json()
        self.assertGreaterEqual(len(trails), 8)

    def test_filter_trails_by_region(self):
        resp = self.client.get("/api/trails?region=Rockies")
        self.assertEqual(resp.status_code, 200)
        trails = resp.json()
        self.assertEqual(len(trails), 1)
        self.assertEqual(trails[0]["id"], "trail-maroon-bells-co")

    def test_single_trail_endpoint(self):
        resp = self.client.get("/api/trails/trail-franconia-ridge-nh")
        self.assertEqual(resp.status_code, 200)
        trail = resp.json()
        self.assertEqual(trail["name"], "Franconia Ridge Loop")
        self.assertIsNotNone(trail["foliage_stage_pct"])

    def test_hybrid_search_endpoint(self):
        resp = self.client.post("/api/search", json={
            "query": "crimson red oak sunset vista blue ridge",
            "limit": 3
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertGreaterEqual(data["total_found"], 1)
        self.assertEqual(data["trails"][0]["id"], "trail-craggy-gardens-nc")

    def test_predict_foliage_endpoint(self):
        resp = self.client.post("/api/predict/foliage", json={
            "elevation_m": 1500,
            "latitude": 44.0,
            "day_of_year": 280
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertGreater(data["foliage_stage_pct"], 0)
        self.assertIn("peak_window", data)

    def test_timeline_endpoint(self):
        resp = self.client.get("/api/predict/timeline/trail-franconia-ridge-nh")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data["timeline"]), 21)

    def test_audio_briefing_endpoint(self):
        resp = self.client.post("/api/audio/briefing", json={
            "trail_id": "trail-franconia-ridge-nh",
            "hiker_name": "Jordan"
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("Jordan", data["transcript"])
        self.assertIsNotNone(data["audio_base64"])

    def test_pocket_card_endpoint(self):
        resp = self.client.post("/api/card/export", json={
            "trail_id": "trail-maroon-bells-co",
            "custom_notes": "Depart at dawn"
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("field_guide_markdown", data)
        self.assertIn("field_guide_html", data)

    def test_workflows_trigger_endpoint(self):
        resp = self.client.post("/api/workflows/trigger-sync")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("dispatched", data["message"])

if __name__ == "__main__":
    unittest.main()
