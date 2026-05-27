import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.router import api_router
from app.core.pinot_client import pinot_client
from app.core.exceptions import PinotException

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    try:
        pinot_client._load_dim_cache()
        logger.info("Pinot dimension cache loaded at startup")
    except Exception as e:
        logger.warning(f"Could not load Pinot cache at startup: {e}")
    yield
    logger.info("Shutting down SkyPulse API")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health")
def health_check():
    pinot_ok = pinot_client.health_check()
    return {
        "status": "ok" if pinot_ok else "degraded",
        "pinot": "connected" if pinot_ok else "disconnected",
    }
