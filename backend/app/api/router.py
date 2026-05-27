from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.dimensions import router as dimensions_router
from app.api.prediction import router as prediction_router
from app.api.flight_data import router as flight_data_router
from app.api.map_routes import router as map_router
from app.api.settings_api import router as settings_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(dimensions_router)
api_router.include_router(prediction_router)
api_router.include_router(flight_data_router)
api_router.include_router(map_router)
api_router.include_router(settings_router)
