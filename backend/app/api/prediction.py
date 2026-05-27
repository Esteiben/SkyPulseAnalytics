from fastapi import APIRouter, Depends
from app.core.pinot_client import pinot_client
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/prediction", tags=["prediction"])


@router.post("/calculate", response_model=PredictionResponse)
def calculate_prediction(
    req: PredictionRequest,
    current_user: dict = Depends(get_current_user),
):
    context_sql = f"""
        SELECT
            AVG(dep_delay) AS hist_avg_delay,
            AVG(arr_delay) AS hist_avg_arr_delay,
            COUNT(*) AS hist_flight_count,
            AVG(weather_delay) AS avg_weather_delay,
            AVG(nas_delay) AS avg_nas_delay,
            AVG(carrier_delay) AS avg_carrier_delay,
            AVG(late_aircraft_delay) AS avg_late_delay
        FROM fact_flights
        WHERE airline_id = {req.airline_id}
          AND origin_airport_id = {req.origin_airport_id}
          AND dest_airport_id = {req.dest_airport_id}
    """
    context_rows = pinot_client.query(context_sql)

    hist = context_rows[0] if context_rows else {}
    hist_count = hist.get("hist_flight_count", 0) or 0
    hist_avg_delay = hist.get("hist_avg_delay", 0) or 0
    hist_avg_arr = hist.get("hist_avg_arr_delay", 0) or 0
    avg_wx = hist.get("avg_weather_delay", 0) or 0
    avg_nas = hist.get("avg_nas_delay", 0) or 0
    avg_carrier = hist.get("avg_carrier_delay", 0) or 0

    delay_probability = _calculate_risk(hist_avg_delay, avg_wx, avg_nas)
    confidence = _calculate_confidence(hist_count, avg_wx, avg_nas)

    meteo_severity = _severity_label(avg_wx, 5, 15)
    route_severity = _severity_label(hist_avg_delay, 10, 30)
    congestion_severity = _severity_label(avg_nas, 5, 20)

    return PredictionResponse(
        delay_probability=round(delay_probability, 1),
        estimated_departure_delay=round(hist_avg_delay, 1),
        estimated_arrival_delay=round(hist_avg_arr, 1),
        confidence_score=round(confidence, 1),
        meteorological_impact=meteo_severity,
        historical_route_performance=route_severity,
        airspace_congestion=congestion_severity,
    )


def _calculate_risk(avg_delay: float, weather: float, nas: float) -> float:
    base = 50.0
    if avg_delay > 0:
        base += min(avg_delay * 0.8, 25)
    if weather > 0:
        base += min(weather * 0.5, 15)
    if nas > 0:
        base += min(nas * 0.3, 10)
    return min(base, 100)


def _calculate_confidence(flight_count: int, weather: float, nas: float) -> float:
    base = 70.0
    if flight_count > 100:
        base += 15
    elif flight_count > 30:
        base += 8
    if weather < 5 and nas < 5:
        base += 7
    return min(base, 99)


def _severity_label(value: float, medium: float, high: float) -> str:
    if value >= high:
        return "Severe"
    elif value >= medium:
        return "Moderate"
    else:
        return "Low"
