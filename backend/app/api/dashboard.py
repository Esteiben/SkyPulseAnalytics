from fastapi import APIRouter, Depends
from app.core.pinot_client import pinot_client
from app.core.exceptions import PinotException
from app.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/kpis")
def get_kpis(current_user: dict = Depends(get_current_user)):
    sql = """
        SELECT
            COUNT(*) AS total_flights,
            AVG(dep_delay) AS avg_dep_delay,
            AVG(arr_delay) AS avg_arr_delay,
            SUM(carrier_delay) AS total_carrier_delay,
            SUM(weather_delay) AS total_weather_delay,
            SUM(nas_delay) AS total_nas_delay,
            SUM(security_delay) AS total_security_delay,
            SUM(late_aircraft_delay) AS total_late_aircraft_delay,
            SUM(cancelled) AS total_cancelled,
            SUM(diverted) AS total_diverted
        FROM fact_flights
    """
    rows = pinot_client.query(sql)
    if not rows:
        raise PinotException("No data returned")
    r = rows[0]
    total = r["total_flights"] or 1
    return {
        "total_flights": r["total_flights"],
        "avg_dep_delay": round(r["avg_dep_delay"] or 0, 2),
        "avg_arr_delay": round(r["avg_arr_delay"] or 0, 2),
        "delayed_pct": round(
            (r["total_carrier_delay"] or 0 + r["total_weather_delay"] or 0
             + r["total_nas_delay"] or 0 + r["total_security_delay"] or 0
             + r["total_late_aircraft_delay"] or 0) / total * 100, 2
        ),
        "cancelled_pct": round((r["total_cancelled"] or 0) / total * 100, 2),
        "diverted_pct": round((r["total_diverted"] or 0) / total * 100, 2),
        "total_carrier_delay": round(r["total_carrier_delay"] or 0, 2),
        "total_weather_delay": round(r["total_weather_delay"] or 0, 2),
        "total_nas_delay": round(r["total_nas_delay"] or 0, 2),
        "total_security_delay": round(r["total_security_delay"] or 0, 2),
        "total_late_aircraft_delay": round(r["total_late_aircraft_delay"] or 0, 2),
    }


@router.get("/delay-evolution")
def get_delay_evolution(current_user: dict = Depends(get_current_user)):
    sql = """
        SELECT
            date_id,
            COUNT(*) AS flight_count,
            AVG(dep_delay) AS avg_delay
        FROM fact_flights
        GROUP BY date_id
        ORDER BY date_id
    """
    rows = pinot_client.query(sql)
    result = []
    for r in rows:
        date_id = r["date_id"]
        label = str(date_id)
        if len(label) == 8:
            label = f"{label[:4]}-{label[4:6]}-{label[6:8]}"
        result.append({
            "date_id": date_id,
            "date_label": label,
            "avg_delay": round(r["avg_delay"] or 0, 2),
            "flight_count": r["flight_count"],
        })
    return result


@router.get("/delay-by-type")
def get_delay_by_type(current_user: dict = Depends(get_current_user)):
    sql = """
        SELECT
            SUM(carrier_delay) AS carrier,
            SUM(weather_delay) AS weather,
            SUM(nas_delay) AS nas,
            SUM(security_delay) AS security,
            SUM(late_aircraft_delay) AS late_aircraft
        FROM fact_flights
        WHERE dep_delay > 15
    """
    rows = pinot_client.query(sql)
    if not rows:
        return []
    r = rows[0]
    total = sum(v or 0 for v in r.values())
    if total == 0:
        return []
    categories = [
        ("Carrier", r["carrier"] or 0),
        ("Weather", r["weather"] or 0),
        ("NAS", r["nas"] or 0),
        ("Security", r["security"] or 0),
        ("Late Aircraft", r["late_aircraft"] or 0),
    ]
    return [
        {"category": name, "value": round(val, 2), "percentage": round(val / total * 100, 2)}
        for name, val in categories
    ]


@router.get("/delay-by-airline")
def get_delay_by_airline(current_user: dict = Depends(get_current_user)):
    sql = """
        SELECT
            airline_id,
            COUNT(*) AS total_flights,
            AVG(dep_delay) AS avg_delay,
            SUM(CASE WHEN dep_delay > 15 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS delay_pct
        FROM fact_flights
        GROUP BY airline_id
        ORDER BY avg_delay DESC
        LIMIT 10
    """
    rows = pinot_client.query(sql)
    result = []
    for r in rows:
        code = pinot_client.resolve_dim_value("dim_airline", r["airline_id"], "airline_code") or f"ID_{r['airline_id']}"
        result.append({
            "airline_id": r["airline_id"],
            "airline_code": code,
            "avg_delay": round(r["avg_delay"] or 0, 2),
            "total_flights": r["total_flights"],
            "delay_pct": round(r["delay_pct"] or 0, 2),
        })
    return result
