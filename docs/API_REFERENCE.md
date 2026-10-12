# Wander REST API Reference 📡

Base URL: `http://localhost:8000/api`

---

## 1. Trails

### `GET /api/trails`
List all indexed trails with metadata filtering and real-time TabPFN phenology predictions.

**Query Parameters:**
- `region` (string, optional): Filter by region name (e.g. `White Mountains`, `Rockies`).
- `difficulty` (string, optional): Filter by `Easy`, `Moderate`, `Hard`.
- `min_elevation_m` (int, optional): Minimum elevation in meters.
- `max_elevation_m` (int, optional): Maximum elevation in meters.
- `max_days_to_peak` (int, optional): Maximum days until 72h peak color.

```bash
curl -X GET "http://localhost:8000/api/trails?region=Rockies"
```

---

### `GET /api/trails/{trail_id}`
Retrieve full details for a single trail including viewpoints, canopy composition, and current weather.

```bash
curl -X GET "http://localhost:8000/api/trails/trail-franconia-ridge-nh"
```

---

## 2. Hybrid Natural Language Search

### `POST /api/search`
Execute hybrid natural language search across Tiger Data vector store.

**Request Body:**
```json
{
  "query": "golden aspen groves near alpine lakes with mountain reflections",
  "difficulty": "Moderate",
  "limit": 5
}
```

```bash
curl -X POST "http://localhost:8000/api/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "golden aspen reflection mountain lake", "limit": 5}'
```

---

## 3. TabPFN Phenology Prediction

### `POST /api/predict/foliage`
Run on-demand TabPFN foundation model prediction with custom environmental inputs.

**Request Body:**
```json
{
  "elevation_m": 1600,
  "latitude": 44.14,
  "current_weather": {
    "temperature_c": 7.5,
    "chill_hours_cumulative": 340,
    "solar_radiation_mj": 11.0,
    "drought_stress_index": 0.15
  },
  "canopy_composition": {
    "sugar_maple_pct": 50.0,
    "paper_birch_pct": 30.0,
    "red_oak_pct": 10.0,
    "american_beech_pct": 10.0
  }
}
```

---

### `GET /api/predict/timeline/{trail_id}`
Retrieve a 21-day historical and future foliage progression curve for time-series charts.

```bash
curl -X GET "http://localhost:8000/api/predict/timeline/trail-franconia-ridge-nh"
```

---

## 4. ElevenLabs Audio Briefing

### `POST /api/audio/briefing`
Generate 45-second trailhead audio briefing.

**Request Body:**
```json
{
  "trail_id": "trail-franconia-ridge-nh",
  "hiker_name": "Maya"
}
```

---

## 5. Printable 1-Page Pocket Guide

### `POST /api/card/export`
Generate print-ready 1-page pocket field card.

**Request Body:**
```json
{
  "trail_id": "trail-maroon-bells-co",
  "custom_notes": "Depart at 6:00 AM for sunrise lake reflection."
}
```

---

## 6. Temporal Durable Workflows

### `POST /api/workflows/trigger-sync`
Trigger the automated background weather sync and batch model recalculation pipeline.

```bash
curl -X POST "http://localhost:8000/api/workflows/trigger-sync"
```
