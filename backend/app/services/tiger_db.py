import os
import json
import math
import re
from typing import List, Optional, Dict, Any
from ..config import settings
from ..schemas.trail import Trail, SearchQuery, SearchResult, Coordinates, CanopyComposition, CurrentWeather, Viewpoint
from .phenology_model import phenology_service

class TigerDataVectorStore:
    """
    Tiger Data (PostgreSQL + pgvector) integration service for Wander.
    Provides hybrid search combining structural metadata filters (elevation, region, difficulty)
    with high-dimensional semantic vector search directly in Tiger Data TimescaleDB/PostgreSQL.
    """

    def __init__(self):
        self.trails: List[Trail] = []
        self.is_connected_to_db = False
        self.pool = None
        self._load_seed_data()

    def _load_seed_data(self):
        try:
            if os.path.exists(settings.TRAILS_FILE):
                with open(settings.TRAILS_FILE, "r") as f:
                    raw_trails = json.load(f)
                    self.trails = [self._enrich_trail(Trail(**t)) for t in raw_trails]
                print(f"[TigerData] Successfully loaded {len(self.trails)} curated trails into local store.")
            else:
                print(f"[TigerData] Warning: Seed file not found at {settings.TRAILS_FILE}")
        except Exception as e:
            print(f"[TigerData] Error loading seed trails: {e}")

    def _enrich_trail(self, trail: Trail) -> Trail:
        """
        Calculates real-time TabPFN phenology prediction for a trail.
        """
        pred = phenology_service.predict_foliage(
            elevation_m=trail.elevation_m,
            latitude=trail.coordinates.latitude,
            weather=trail.current_weather,
            canopy=trail.canopy_composition,
            trail_id=trail.id
        )
        trail.foliage_stage_pct = pred.foliage_stage_pct
        trail.peak_status = pred.peak_status
        trail.days_to_peak = pred.days_to_peak
        trail.peak_window_start = pred.peak_window.start_date
        trail.peak_window_end = pred.peak_window.end_date
        return trail

    async def connect_db(self):
        """
        Connect to Tiger Data / PostgreSQL, ensure schema, and synchronize trails into the cloud database.
        """
        if not settings.DATABASE_URL:
            print("[TigerData] No DATABASE_URL provided. Operating in high-performance local pgvector simulation mode.")
            return

        try:
            import asyncpg
            # Clean connection string for asyncpg if needed
            dsn = settings.DATABASE_URL
            if dsn.startswith("postgresql+asyncpg://"):
                dsn = dsn.replace("postgresql+asyncpg://", "postgresql://")

            self.pool = await asyncpg.create_pool(dsn=dsn, timeout=15)
            async with self.pool.acquire() as conn:
                # 1. Enable pgvector extension
                await conn.execute("CREATE EXTENSION IF NOT EXISTS vector;")

                # 2. Ensure table schema
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS trails (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        region TEXT NOT NULL,
                        state TEXT NOT NULL,
                        latitude FLOAT NOT NULL,
                        longitude FLOAT NOT NULL,
                        elevation_m INT NOT NULL,
                        length_km FLOAT NOT NULL,
                        difficulty TEXT NOT NULL,
                        summary TEXT NOT NULL,
                        canopy_json JSONB NOT NULL,
                        weather_json JSONB NOT NULL,
                        viewpoints_json JSONB NOT NULL,
                        tags TEXT[] NOT NULL,
                        embedding vector(128)
                    );
                """)

                # 3. Synchronize trails into live Tiger Data database table
                count = await conn.fetchval("SELECT COUNT(*) FROM trails;")
                if count < len(self.trails):
                    print(f"[TigerData] Syncing {len(self.trails)} trails with vector embeddings into Tiger Cloud database...")
                    for t in self.trails:
                        trail_corpus = f"{t.name} {t.region} {t.state} {t.summary} {' '.join(t.tags)}"
                        vec = self._generate_simple_embedding(trail_corpus)
                        vec_str = "[" + ",".join(str(round(x, 6)) for x in vec) + "]"

                        await conn.execute("""
                            INSERT INTO trails (
                                id, name, region, state, latitude, longitude,
                                elevation_m, length_km, difficulty, summary,
                                canopy_json, weather_json, viewpoints_json, tags, embedding
                            ) VALUES (
                                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                                $11::jsonb, $12::jsonb, $13::jsonb, $14, $15::vector
                            ) ON CONFLICT (id) DO UPDATE SET
                                name = EXCLUDED.name,
                                summary = EXCLUDED.summary,
                                canopy_json = EXCLUDED.canopy_json,
                                weather_json = EXCLUDED.weather_json,
                                viewpoints_json = EXCLUDED.viewpoints_json,
                                tags = EXCLUDED.tags,
                                embedding = EXCLUDED.embedding;
                        """,
                            t.id, t.name, t.region, t.state, t.coordinates.latitude, t.coordinates.longitude,
                            t.elevation_m, t.length_km, t.difficulty, t.summary,
                            json.dumps(t.canopy_composition.model_dump()),
                            json.dumps(t.current_weather.model_dump()),
                            json.dumps([vp.model_dump() for vp in t.viewpoints]),
                            t.tags, vec_str
                        )
                    print(f"[TigerData] Successfully populated and indexed {len(self.trails)} trails in Tiger Data Cloud!")

            self.is_connected_to_db = True
            print("[TigerData] Live connection active: Querying directly from Tiger Data PostgreSQL + pgvector.")
        except Exception as e:
            print(f"[TigerData] Database connection notice: {e}. Falling back to local vector store.")
            self.is_connected_to_db = False

    def _row_to_trail(self, row) -> Trail:
        canopy_dict = json.loads(row["canopy_json"]) if isinstance(row["canopy_json"], str) else row["canopy_json"]
        weather_dict = json.loads(row["weather_json"]) if isinstance(row["weather_json"], str) else row["weather_json"]
        viewpoints_list = json.loads(row["viewpoints_json"]) if isinstance(row["viewpoints_json"], str) else row["viewpoints_json"]

        trail = Trail(
            id=row["id"],
            name=row["name"],
            region=row["region"],
            state=row["state"],
            coordinates=Coordinates(latitude=row["latitude"], longitude=row["longitude"]),
            elevation_m=row["elevation_m"],
            length_km=row["length_km"],
            difficulty=row["difficulty"],
            summary=row["summary"],
            canopy_composition=CanopyComposition(**canopy_dict),
            current_weather=CurrentWeather(**weather_dict),
            viewpoints=[Viewpoint(**vp) for vp in viewpoints_list],
            tags=list(row["tags"]) if row["tags"] else []
        )
        return self._enrich_trail(trail)

    def _generate_simple_embedding(self, text: str, dim: int = 128) -> List[float]:
        """
        Generates deterministic normalized semantic vector representation
        for lightweight, zero-dependency hybrid vector similarity.
        """
        vec = [0.0] * dim
        tokens = re.findall(r'\w+', text.lower())
        for token in tokens:
            h = hash(token)
            idx = abs(h) % dim
            vec[idx] += 1.0 + (len(token) / 10.0)
        
        # Normalize L2 norm
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec

    def _cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        if not vec_a or not vec_b:
            return 0.0
        return sum(a * b for a, b in zip(vec_a, vec_b))

    def _matches_region(self, region_query: str, trail_region: str, trail_state: str) -> bool:
        q = region_query.lower().strip()
        reg = trail_region.lower()
        st = trail_state.lower()

        if q in reg or q in st:
            return True

        synonyms = {
            "rockies": "rocky",
            "smokies": "smoky",
            "whites": "white mountains",
            "adirondacks": "adirondack",
            "greens": "green mountains"
        }
        mapped_q = synonyms.get(q, q)
        if mapped_q in reg or mapped_q in st:
            return True

        words = q.split()
        return any(w[:4] in reg for w in words if len(w) >= 4)

    async def get_all_trails(
        self,
        region: Optional[str] = None,
        difficulty: Optional[str] = None,
        min_elevation: Optional[int] = None,
        max_elevation: Optional[int] = None,
        max_days_to_peak: Optional[int] = None
    ) -> List[Trail]:
        # Live query from Tiger Data PostgreSQL if connected
        if self.is_connected_to_db and self.pool:
            try:
                async with self.pool.acquire() as conn:
                    rows = await conn.fetch("SELECT * FROM trails ORDER BY name ASC;")
                    loaded = [self._row_to_trail(r) for r in rows]
                    
                    results = []
                    for t in loaded:
                        if region and not self._matches_region(region, t.region, t.state):
                            continue
                        if difficulty and difficulty.lower() != t.difficulty.lower():
                            continue
                        if min_elevation and t.elevation_m < min_elevation:
                            continue
                        if max_elevation and t.elevation_m > max_elevation:
                            continue
                        if max_days_to_peak is not None and t.days_to_peak is not None:
                            if t.days_to_peak > max_days_to_peak:
                                continue
                        results.append(t)
                    return results
            except Exception as e:
                print(f"[TigerData] Live query error: {e}. Falling back to cache.")

        # Fallback local in-memory
        results = []
        for trail in self.trails:
            enriched = self._enrich_trail(trail)
            if region and not self._matches_region(region, enriched.region, enriched.state):
                continue
            if difficulty and difficulty.lower() != enriched.difficulty.lower():
                continue
            if min_elevation and enriched.elevation_m < min_elevation:
                continue
            if max_elevation and enriched.elevation_m > max_elevation:
                continue
            if max_days_to_peak is not None and enriched.days_to_peak is not None:
                if enriched.days_to_peak > max_days_to_peak:
                    continue
            results.append(enriched)

        return results

    async def get_trail_by_id(self, trail_id: str) -> Optional[Trail]:
        if self.is_connected_to_db and self.pool:
            try:
                async with self.pool.acquire() as conn:
                    row = await conn.fetchrow("SELECT * FROM trails WHERE id = $1;", trail_id)
                    if row:
                        return self._row_to_trail(row)
            except Exception as e:
                print(f"[TigerData] Live trail query error: {e}")

        for trail in self.trails:
            if trail.id == trail_id:
                return self._enrich_trail(trail)
        return None

    async def save_trail(self, trail: Trail) -> Trail:
        """
        Dynamically stores a newly discovered trail into Tiger Data PostgreSQL with pgvector embeddings,
        making it immediately available across all users and searches.
        """
        enriched = self._enrich_trail(trail)
        # Update or prepend in local cache
        existing_idx = next((i for i, t in enumerate(self.trails) if t.id == enriched.id), None)
        if existing_idx is not None:
            self.trails[existing_idx] = enriched
        else:
            self.trails.insert(0, enriched)

        if self.is_connected_to_db and self.pool:
            try:
                trail_corpus = f"{enriched.name} {enriched.region} {enriched.state} {enriched.summary} {' '.join(enriched.tags)}"
                vec = self._generate_simple_embedding(trail_corpus)
                vec_str = "[" + ",".join(str(round(x, 6)) for x in vec) + "]"
                async with self.pool.acquire() as conn:
                    await conn.execute("""
                        INSERT INTO trails (
                            id, name, region, state, latitude, longitude,
                            elevation_m, length_km, difficulty, summary,
                            canopy_json, weather_json, viewpoints_json, tags, embedding
                        ) VALUES (
                            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                            $11::jsonb, $12::jsonb, $13::jsonb, $14, $15::vector
                        ) ON CONFLICT (id) DO UPDATE SET
                            name = EXCLUDED.name,
                            summary = EXCLUDED.summary,
                            canopy_json = EXCLUDED.canopy_json,
                            weather_json = EXCLUDED.weather_json,
                            viewpoints_json = EXCLUDED.viewpoints_json,
                            tags = EXCLUDED.tags,
                            embedding = EXCLUDED.embedding;
                    """,
                        enriched.id, enriched.name, enriched.region, enriched.state,
                        enriched.coordinates.latitude, enriched.coordinates.longitude,
                        enriched.elevation_m, enriched.length_km, enriched.difficulty, enriched.summary,
                        json.dumps(enriched.canopy_composition.model_dump()),
                        json.dumps(enriched.current_weather.model_dump()),
                        json.dumps([vp.model_dump() for vp in enriched.viewpoints]),
                        enriched.tags, vec_str
                    )
                print(f"[TigerData] Live database persisted new discovered trail: '{enriched.name}' with vector embedding.")
            except Exception as e:
                print(f"[TigerData] Error saving trail to Tiger Data Cloud: {e}")

        return enriched

    async def hybrid_search(self, search_req: SearchQuery) -> SearchResult:
        """
        Hybrid Natural Language Search:
        Combines semantic pgvector cosine similarity directly inside Tiger Data PostgreSQL
        with keyword matching and metadata filters.
        """
        query_text = search_req.query.strip().lower()
        query_vec = self._generate_simple_embedding(query_text)
        vec_str = "[" + ",".join(str(round(x, 6)) for x in query_vec) + "]"

        # Direct Tiger Data Cloud pgvector query
        if self.is_connected_to_db and self.pool:
            try:
                async with self.pool.acquire() as conn:
                    rows = await conn.fetch("""
                        SELECT id, name, region, state, latitude, longitude,
                               elevation_m, length_km, difficulty, summary,
                               canopy_json, weather_json, viewpoints_json, tags,
                               1 - (embedding <=> $1::vector) AS vector_sim
                        FROM trails
                        ORDER BY embedding <=> $1::vector ASC
                        LIMIT 20;
                    """, vec_str)

                    candidates = [self._row_to_trail(r) for r in rows]
                    scored = []
                    for t, r in zip(candidates, rows):
                        if search_req.region and not self._matches_region(search_req.region, t.region, t.state):
                            continue
                        if search_req.difficulty and search_req.difficulty.lower() != t.difficulty.lower():
                            continue
                        if search_req.min_elevation_m and t.elevation_m < search_req.min_elevation_m:
                            continue
                        if search_req.max_elevation_m and t.elevation_m > search_req.max_elevation_m:
                            continue

                        vector_sim = float(r["vector_sim"])
                        # Keyword match bonus
                        lexical_score = 0.0
                        for word in query_text.split():
                            if word in t.name.lower(): lexical_score += 0.5
                            if word in t.summary.lower(): lexical_score += 0.3
                            if any(word in tag.lower() for tag in t.tags): lexical_score += 0.4

                        combined_score = (vector_sim * 0.6) + (min(1.0, lexical_score) * 0.4)
                        scored.append((combined_score, t))

                    scored.sort(key=lambda x: x[0], reverse=True)
                    matched = [t for _, t in scored[:search_req.limit]]

                    return SearchResult(
                        trails=matched,
                        total_found=len(matched),
                        search_mode="live_tiger_data_pgvector",
                        query_parsed_intent={
                            "raw_query": search_req.query,
                            "database": "Tiger Data Cloud (cutie-pie on us-east-1)",
                            "filters_applied": {
                                "region": search_req.region,
                                "difficulty": search_req.difficulty,
                            }
                        }
                    )
            except Exception as e:
                print(f"[TigerData] Live pgvector query exception: {e}")

        # Fallback local simulation
        scored_trails = []
        for trail in self.trails:
            enriched = self._enrich_trail(trail)
            if search_req.region and not self._matches_region(search_req.region, enriched.region, enriched.state):
                continue
            if search_req.difficulty and search_req.difficulty.lower() != enriched.difficulty.lower():
                continue
            if search_req.min_elevation_m and enriched.elevation_m < search_req.min_elevation_m:
                continue
            if search_req.max_elevation_m and enriched.elevation_m > search_req.max_elevation_m:
                continue

            trail_corpus = f"{enriched.name} {enriched.region} {enriched.state} {enriched.summary} {' '.join(enriched.tags)}"
            trail_vec = self._generate_simple_embedding(trail_corpus)
            vector_sim = self._cosine_similarity(query_vec, trail_vec)

            lexical_score = 0.0
            for word in query_text.split():
                if word in enriched.name.lower(): lexical_score += 0.5
                if word in enriched.summary.lower(): lexical_score += 0.3
                if any(word in tag.lower() for tag in enriched.tags): lexical_score += 0.4

            hybrid_score = (vector_sim * 0.6) + (min(1.0, lexical_score) * 0.4)
            scored_trails.append((hybrid_score, enriched))

        scored_trails.sort(key=lambda x: x[0], reverse=True)
        matched_trails = [t for _, t in scored_trails[:search_req.limit]]

        return SearchResult(
            trails=matched_trails,
            total_found=len(matched_trails),
            search_mode="hybrid_pgvector_simulated",
            query_parsed_intent={
                "raw_query": search_req.query,
                "filters_applied": {
                    "region": search_req.region,
                    "difficulty": search_req.difficulty,
                }
            }
        )

# Global singleton instance
tiger_db_service = TigerDataVectorStore()
