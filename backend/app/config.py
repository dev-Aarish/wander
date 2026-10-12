import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App config
    PROJECT_NAME: str = "Wander Backend API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        return ["*"]

    # Tiger Data / PostgreSQL + pgvector
    DATABASE_URL: str = ""
    TIGER_DATA_API_KEY: str = ""

    # ElevenLabs TTS
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"  # Default clean narrator voice (Rachel)

    # Temporal Workflow Orchestration
    TEMPORAL_HOST: str = "localhost:7233"
    TEMPORAL_NAMESPACE: str = "default"
    TEMPORAL_TASK_QUEUE: str = "foliage-sync-queue"

    # TabPFN Model Config
    TABPFN_API_KEY: str = ""
    TABPFN_DEVICE: str = "cpu"
    TABPFN_N_ENSEMBLE: int = 8

    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    TRAILS_FILE: str = os.path.join(DATA_DIR, "seed_trails.json")
    PHENOLOGY_FILE: str = os.path.join(DATA_DIR, "phenology_dataset.csv")

    class Config:
        env_file = (
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "backend", ".env"),
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
            ".env",
            "backend/.env"
        )
        extra = "ignore"

settings = Settings()
