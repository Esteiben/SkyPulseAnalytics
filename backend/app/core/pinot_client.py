import json
import logging
from typing import Any
import httpx
from app.config import settings
from app.core.exceptions import PinotException

logger = logging.getLogger(__name__)


class PinotClient:
    def __init__(self):
        self.broker_url = settings.pinot_broker_url
        self.controller_url = settings.pinot_controller_url
        self._dim_cache: dict[str, dict[int, dict[str, Any]]] = {}
        self._cache_loaded = False

    def query(self, sql: str) -> list[dict[str, Any]]:
        payload = {"sql": sql}
        try:
            resp = httpx.post(
                f"{self.broker_url}/query/sql",
                json=payload,
                timeout=30,
            )
            resp.raise_for_status()
            data = resp.json()
        except httpx.TimeoutException:
            raise PinotException("Pinot query timeout")
        except httpx.HTTPError as e:
            raise PinotException(f"Pinot HTTP error: {e}")

        if data.get("exceptions") and len(data["exceptions"]) > 0:
            errs = data["exceptions"]
            if "lookup" in str(errs).lower() or "Unsupported function" in str(errs).lower():
                raise PinotException("LOOKUP function not supported in this Pinot version")
            raise PinotException(f"Pinot query error: {errs}")

        result_table = data.get("resultTable")
        if not result_table:
            return []

        columns = result_table["dataSchema"]["columnNames"]
        rows = result_table["rows"]
        return [dict(zip(columns, row)) for row in rows]

    def health_check(self) -> bool:
        try:
            resp = httpx.get(f"{self.controller_url}/health", timeout=5)
            return resp.status_code == 200
        except Exception:
            return False

    def _load_dim_cache(self):
        if self._cache_loaded:
            return
        try:
            dim_tables = [
                ("dim_airline", "airline_id"),
                ("dim_airport", "airport_id"),
                ("dim_city", "city_id"),
                ("dim_state", "state_id"),
                ("dim_route", "route_id"),
                ("dim_date", "date_id"),
                ("dim_time", "time_id"),
                ("dim_cancellation_code", "cancellation_code_id"),
                ("dim_day_type", "day_type_id"),
                ("dim_season", "season_id"),
                ("dim_time_bucket", "bucket_id"),
            ]
            for table_name, pk_col in dim_tables:
                rows = self.query(f"SELECT * FROM {table_name}")
                lookup: dict[int, dict] = {}
                for row in rows:
                    pk = row.get(pk_col)
                    if pk is not None:
                        lookup[int(pk)] = row
                self._dim_cache[table_name] = lookup
            self._cache_loaded = True
            logger.info(f"Loaded {len(self._dim_cache)} dimension tables into cache")
        except Exception as e:
            logger.warning(f"Failed to load dim cache: {e}")

    def resolve_dim(self, table: str, id_val: int | None) -> dict | None:
        if not self._cache_loaded:
            self._load_dim_cache()
        if id_val is None:
            return None
        return self._dim_cache.get(table, {}).get(int(id_val))

    def resolve_dim_value(self, table: str, id_val: int | None, column: str) -> Any:
        entry = self.resolve_dim(table, id_val)
        if entry:
            return entry.get(column)
        return None


pinot_client = PinotClient()
