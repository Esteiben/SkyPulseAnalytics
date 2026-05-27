from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.dependencies import get_current_user

router = APIRouter(prefix="/settings", tags=["settings"])


class ProfileUpdate(BaseModel):
    full_name: str | None = None


class AlertConfig(BaseModel):
    critical_delay_email: bool = True
    model_updates_browser: bool = True
    weekly_digest: bool = False


class IngestionConfig(BaseModel):
    rate: str = "realtime"


@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "role": current_user["role"],
        "avatar_url": None,
    }


@router.put("/profile")
def update_profile(
    update: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    return {**current_user, **update.model_dump(exclude_none=True)}


@router.get("/alerts")
def get_alerts(current_user: dict = Depends(get_current_user)):
    return {
        "critical_delay_email": True,
        "model_updates_browser": True,
        "weekly_digest": False,
    }


@router.put("/alerts")
def update_alerts(
    config: AlertConfig,
    current_user: dict = Depends(get_current_user),
):
    return config.model_dump()


@router.get("/ingestion-rate")
def get_ingestion_rate(current_user: dict = Depends(get_current_user)):
    return {"rate": "realtime"}


@router.put("/ingestion-rate")
def update_ingestion_rate(
    config: IngestionConfig,
    current_user: dict = Depends(get_current_user),
):
    return config.model_dump()
