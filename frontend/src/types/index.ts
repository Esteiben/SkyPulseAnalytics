export interface User {
  email: string;
  full_name: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface KPIData {
  total_flights: number;
  delayed_pct: number;
  avg_dep_delay: number;
  avg_arr_delay: number;
  cancelled_pct: number;
  diverted_pct: number;
}

export interface DelayEvolutionPoint {
  date_id: number;
  date_label: string;
  avg_delay: number;
  flight_count: number;
}

export interface DelayByTypeItem {
  category: string;
  value: number;
  percentage: number;
}

export interface DelayByAirlineItem {
  airline_id: number;
  airline_code: string;
  avg_delay: number;
  total_flights: number;
  delay_pct: number;
}

export interface PredictionResult {
  delay_probability: number;
  estimated_departure_delay: number;
  estimated_arrival_delay: number;
  confidence_score: number;
  meteorological_impact: string;
  historical_route_performance: string;
  airspace_congestion: string;
}

export interface MapRoute {
  origin_id: number;
  dest_id: number;
  origin_code: string;
  dest_code: string;
  flight_count: number;
  avg_delay: number;
  risk: string;
}

export interface AirportStatus {
  airport_id: number;
  airport_code: string;
  total_flights: number;
  avg_delay: number;
  delay_pct: number;
}

export interface DimItem {
  [key: string]: unknown;
}

export interface PaginatedResponse {
  items: DimItem[];
  total: number;
  page: number;
  size: number;
}
