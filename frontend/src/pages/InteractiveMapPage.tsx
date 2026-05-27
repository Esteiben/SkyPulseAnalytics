import { useEffect, useState } from 'react';
import api from '../services/api';
import { MapRoute, AirportStatus } from '../types';

export default function InteractiveMapPage() {
  const [routes, setRoutes] = useState<MapRoute[]>([]);
  const [airports, setAirports] = useState<AirportStatus[]>([]);
  const [riskFilter, setRiskFilter] = useState('all');

  useEffect(() => {
    api.get(`/map/routes?risk_level=${riskFilter}`).then((r) => setRoutes(r.data));
    api.get('/map/airports').then((r) => setAirports(r.data));
  }, [riskFilter]);

  const riskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#C51C39';
      case 'moderate': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const topAirports = airports.slice(0, 30);

  return (
      <div className="flex-1 relative" style={{ minHeight: 'calc(100vh - 180px)' }}>
        <div className="absolute left-0 top-0 w-80 bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant z-10 flex flex-col max-h-[calc(100%-48px)] overflow-y-auto">
          <div className="p-4 border-b border-surface-variant bg-surface flex justify-between items-center sticky top-0">
            <h2 className="font-title-md text-title-md text-on-background">Route Filters</h2>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <label className="block font-label-lg text-label-lg uppercase text-secondary mb-3">Risk Severity</label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Routes', color: '#6b7280' },
                  { value: 'low', label: 'On-time / Low Risk', color: '#10b981' },
                  { value: 'moderate', label: 'Moderate Delay Risk', color: '#f59e0b' },
                  { value: 'high', label: 'High Risk / Critical', color: '#C51C39' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio" name="risk"
                      className="rounded-full border-outline text-primary focus:ring-primary h-4 w-4"
                      checked={riskFilter === opt.value}
                      onChange={() => setRiskFilter(opt.value)}
                    />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: opt.color }}></span>
                    <span className="font-body-md text-on-background">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 map-container relative w-full h-full ml-80 rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1c1c', minHeight: 'calc(100vh - 180px)' }}>
          <div className="absolute inset-0 overflow-auto p-6">
            <div className="text-white mb-4">
              <h3 className="font-title-lg mb-2">Route Risk Overview</h3>
              <p className="text-sm text-gray-400">{routes.length} routes • {airports.length} airports monitored</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h4 className="font-title-md text-white mb-3">Top Routes by Delay Risk</h4>
                <div className="space-y-2">
                  {routes.slice(0, 8).map((r, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: riskColor(r.risk) }}></div>
                        <span className="text-sm">{r.origin_code} → {r.dest_code}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{r.flight_count} flights</span>
                        <span className="text-sm font-bold" style={{ color: riskColor(r.risk) }}>{r.avg_delay}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h4 className="font-title-md text-white mb-3">Airport Activity</h4>
                <div className="space-y-2">
                  {topAirports.slice(0, 8).map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-gray-400">flight</span>
                        <span className="text-sm font-bold">{a.airport_code}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{a.total_flights} flights</span>
                        <span className={`text-sm font-bold ${a.avg_delay > 30 ? 'text-carmine-red' : a.avg_delay > 15 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {a.avg_delay}m
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-4">
              <h4 className="font-title-md text-white mb-3">Delay Distribution</h4>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-emerald-500"></div>
                  <span className="text-xs text-gray-300">Low Risk (&lt;15m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-amber-500"></div>
                  <span className="text-xs text-gray-300">Moderate (15-30m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-carmine-red"></div>
                  <span className="text-xs text-gray-300">High Risk (&gt;30m)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 flex flex-col gap-4 items-end">
            <div className="bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant flex flex-col">
              <button className="p-2 text-secondary hover:text-on-background hover:bg-surface-variant rounded-t-lg transition-colors border-b border-surface-variant">
                <span className="material-symbols-outlined">add</span>
              </button>
              <button className="p-2 text-secondary hover:text-on-background hover:bg-surface-variant rounded-b-lg transition-colors">
                <span className="material-symbols-outlined">remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
