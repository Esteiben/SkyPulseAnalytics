from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.dependencies import get_current_user

router = APIRouter(prefix="/flights", tags=["flights"])


@router.post("/manual")
def save_manual_record(
    airline_code: str = Form(...),
    flight_date: str = Form(...),
    origin: str = Form(...),
    destination: str = Form(...),
    delay_min: int = Form(0),
    distance_nm: int = Form(0),
    current_user: dict = Depends(get_current_user),
):
    return {
        "status": "recorded",
        "message": f"Flight {airline_code} on {flight_date} recorded",
    }


@router.post("/bulk/upload")
async def upload_bulk_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files supported")
    return {
        "status": "queued",
        "filename": file.filename,
        "size": 0,
        "message": f"File {file.filename} queued for ingestion",
    }


@router.get("/bulk/status")
def get_bulk_status(current_user: dict = Depends(get_current_user)):
    return {"items": [], "total": 0}
