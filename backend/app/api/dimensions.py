from fastapi import APIRouter, Depends, Query
from app.core.pinot_client import pinot_client
from app.dependencies import get_current_user

router = APIRouter(prefix="/dimensions", tags=["dimensions"])


DIMENSION_TABLES = {
    "airlines": "dim_airline",
    "airports": "dim_airport",
    "cities": "dim_city",
    "states": "dim_state",
    "routes": "dim_route",
    "dates": "dim_date",
    "cancellation_codes": "dim_cancellation_code",
    "day_types": "dim_day_type",
    "seasons": "dim_season",
    "time_buckets": "dim_time_bucket",
}


@router.get("/{dim_name}")
def list_dimension(
    dim_name: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: str = Query("", max_length=50),
    current_user: dict = Depends(get_current_user),
):
    table = DIMENSION_TABLES.get(dim_name)
    if not table:
        return {"error": f"Unknown dimension: {dim_name}"}

    sql = f"SELECT * FROM {table}"
    if search:
        search_cols = _get_search_columns(table)
        if search_cols:
            conditions = " OR ".join(
                f"CAST({col} AS STRING) LIKE '%{search}%'" for col in search_cols
            )
            sql += f" WHERE {conditions}"
    sql += f" LIMIT {size} OFFSET {(page - 1) * size}"

    rows = pinot_client.query(sql)

    count_sql = f"SELECT COUNT(*) AS cnt FROM {table}"
    if search:
        conditions = " OR ".join(
            f"CAST({col} AS STRING) LIKE '%{search}%'" for col in _get_search_columns(table)
        )
        count_sql += f" WHERE {conditions}"
    count_rows = pinot_client.query(count_sql)
    total = count_rows[0]["cnt"] if count_rows else 0

    return {"items": rows, "total": total, "page": page, "size": size}


def _get_search_columns(table: str) -> list[str]:
    search_map = {
        "dim_airline": ["airline_code", "airline_name"],
        "dim_airport": ["airport_code", "airport_name"],
        "dim_city": ["city_name"],
        "dim_state": ["state_name", "state_code"],
        "dim_cancellation_code": ["code", "description"],
        "dim_season": ["season_name"],
        "dim_time_bucket": ["bucket_name"],
        "dim_day_type": ["type_name"],
    }
    return search_map.get(table, [])
