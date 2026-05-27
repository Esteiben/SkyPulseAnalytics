from fastapi import APIRouter, Depends, Query
from app.core.pinot_client import pinot_client
from app.dependencies import get_current_user

router = APIRouter(prefix="/map", tags=["map"])


@router.get("/routes")
def get_map_routes(
    risk_level: str = Query("all"),
    airline_id: int = Query(0),
    current_user: dict = Depends(get_current_user),
):
    where = "1=1"
    if risk_level == "high":
        where = "AVG(dep_delay) > 30"
    elif risk_level == "moderate":
        where = "AVG(dep_delay) BETWEEN 15 AND 30"
    elif risk_level == "low":
        where = "AVG(dep_delay) < 15"

    sql = f"""
        SELECT
            origin_airport_id,
            dest_airport_id,
            COUNT(*) AS flight_count,
            AVG(dep_delay) AS avg_delay
        FROM fact_flights
        GROUP BY origin_airport_id, dest_airport_id
        HAVING {where}
        ORDER BY avg_delay DESC
        LIMIT 50
    """
    rows = pinot_client.query(sql)
    result = []
    for r in rows:
        orig_code = pinot_client.resolve_dim_value("dim_airport", r["origin_airport_id"], "airport_code") or f"AP{r['origin_airport_id']}"
        dest_code = pinot_client.resolve_dim_value("dim_airport", r["dest_airport_id"], "airport_code") or f"AP{r['dest_airport_id']}"
        avg_delay = r["avg_delay"] or 0
        if avg_delay > 30:
            risk = "high"
        elif avg_delay > 15:
            risk = "moderate"
        else:
            risk = "low"
        result.append({
            "origin_id": r["origin_airport_id"],
            "dest_id": r["dest_airport_id"],
            "origin_code": orig_code,
            "dest_code": dest_code,
            "flight_count": r["flight_count"],
            "avg_delay": round(avg_delay, 2),
            "risk": risk,
        })
    return result


@router.get("/airports")
def get_airport_status(current_user: dict = Depends(get_current_user)):
    sql = """
        SELECT
            origin_airport_id AS airport_id,
            COUNT(*) AS total_flights,
            AVG(dep_delay) AS avg_delay,
            SUM(CASE WHEN dep_delay > 15 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS delay_pct
        FROM fact_flights
        GROUP BY origin_airport_id
        ORDER BY total_flights DESC
    """
    rows = pinot_client.query(sql)
    result = []
    for r in rows:
        code = pinot_client.resolve_dim_value("dim_airport", r["airport_id"], "airport_code") or f"AP{r['airport_id']}"
        result.append({
            "airport_id": r["airport_id"],
            "airport_code": code,
            "total_flights": r["total_flights"],
            "avg_delay": round(r["avg_delay"] or 0, 2),
            "delay_pct": round(r["delay_pct"] or 0, 2),
        })
    return result


@router.get("/health")
def get_system_health(current_user: dict = Depends(get_current_user)):
    try:
        import httpx
        resp = httpx.get("http://192.168.3.84:9000/health", timeout=5)
        pinot_ok = resp.status_code == 200
    except Exception:
        pinot_ok = False
    return {
        "main_api_node": {"status": "healthy" if pinot_ok else "degraded"},
        "legacy_db": {"status": "offline"},
        "last_ping": "realtime",
    }
