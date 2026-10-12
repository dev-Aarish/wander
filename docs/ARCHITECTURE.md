# Wander System Architecture 🌲

Wander is an open-source phenological forecasting engine and zero-screen trail companion built for **Hacktoberfest 2026: Week 1 — Touch Grass**.

---

## 🏗️ High-Level System Flow

```mermaid
flowchart TD
    subgraph Client ["Client Tier"]
        UI["Web Dashboard (React + Vite + Tailwind)"]
        PrintCard["1-Page Printable Pocket Field Card (PDF/HTML)"]
        AudioPlayer["Trailhead Audio Briefing Player"]
    end

    subgraph Backend ["Backend API (FastAPI)"]
        Router["REST & Hybrid Search Endpoints"]
        PocketCardEngine["Pocket Card Generator"]
        ElevenLabsClient["ElevenLabs TTS Service"]
        TabPFNEngine["TabPFN Tabular Regressor Engine"]
        TigerDataClient["Tiger Data Vector Store Client"]
    end

    subgraph Storage ["Database & AI Engine"]
        TigerDB[("Tiger Data (PostgreSQL + pgvector)")]
        PhenologyData[("NOAA Weather + USFS Phenology Dataset")]
    end

    subgraph Orchestration ["Temporal Durable Execution"]
        FoliageWorkflow["FoliageSyncWorkflow"]
        WeatherActivity["fetch_micro_weather_activity"]
        InferenceActivity["batch_tabpfn_inference_activity"]
        SyncActivity["sync_tiger_db_activity"]
    end

    UI --> Router
    PrintCard --> PocketCardEngine
    AudioPlayer --> ElevenLabsClient

    Router --> TigerDataClient
    Router --> TabPFNEngine
    Router --> PocketCardEngine
    Router --> ElevenLabsClient

    TigerDataClient --> TigerDB
    TabPFNEngine --> PhenologyData

    FoliageWorkflow --> WeatherActivity
    WeatherActivity --> InferenceActivity
    InferenceActivity --> TabPFNEngine
    InferenceActivity --> SyncActivity
    SyncActivity --> TigerDB
```

---

## 🏆 Partner Integrations

### 1. TabPFN (Prior Labs) — Tabular Foundation Model
- **Role:** Predicts canopy chlorophyll decay %, 72-hour peak foliage window, and days-to-peak.
- **Inputs:** Elevation, latitude, cumulative chill hours (hours $0^\circ\text{C}-7^\circ\text{C}$ since Sept 1), solar irradiance shortening, drought stress index, and species distribution (Sugar Maple, Quaking Aspen, Red Oak, American Beech, Alpine Larch).
- **Zero-Shot Generalization:** TabPFN fits historical USFS phenology curves instantly without extensive fine-tuning.

### 2. Tiger Data — PostgreSQL + `pgvector`
- **Role:** High-performance relational metadata + high-dimensional vector embeddings for hybrid natural language trail search.
- **Hybrid Search Algorithm:** Blends cosine similarity over trail biome embeddings ($60\%$) with keyword and structural metadata filters ($40\%$).

### 3. Temporal — Durable Workflow Orchestration
- **Role:** Periodic micro-weather polling and automated batch TabPFN model recalculations with automated exponential backoff retries.

### 4. ElevenLabs — Voice Briefing Synthesis
- **Role:** Generates 45-second high-fidelity trailhead audio briefings to minimize screen time outdoors.
