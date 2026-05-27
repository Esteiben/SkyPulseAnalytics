from pydantic import BaseModel
from typing import Optional


class PredictionRequest(BaseModel):
    airline_id: int
    origin_airport_id: int
    dest_airport_id: int
    date_id: int
    scheduled_dep_time_id: int


class PredictionResponse(BaseModel):
    delay_probability: float
    estimated_departure_delay: float
    estimated_arrival_delay: float
    confidence_score: float
    meteorological_impact: str
    historical_route_performance: str
    airspace_congestion: str


class DimensionItem(BaseModel):
    id: int
    code: Optional[str] = None
    name: Optional[str] = None
    extra: Optional[dict] = None


class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    size: int
