from pydantic import BaseModel
from typing import Any


class KPIResponse(BaseModel):
    total_flights: int
    delayed_pct: float
    avg_dep_delay: float
    avg_arr_delay: float
    cancelled_pct: float
    diverted_pct: float
    total_carrier_delay: float
    total_weather_delay: float
    total_nas_delay: float
    total_security_delay: float
    total_late_aircraft_delay: float


class DelayEvolutionItem(BaseModel):
    date_id: int
    date_label: str
    avg_delay: float
    flight_count: int


class DelayByTypeItem(BaseModel):
    category: str
    value: float
    percentage: float


class DelayByAirlineItem(BaseModel):
    airline_id: int
    airline_code: str
    avg_delay: float
    total_flights: int
    delay_pct: float
