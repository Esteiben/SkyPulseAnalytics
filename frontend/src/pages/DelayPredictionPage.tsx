import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import CircularGauge from '../components/common/CircularGauge';
import api from '../services/api';
import { PredictionResult } from '../types';

export default function DelayPredictionPage() {
  const [airlineId, setAirlineId] = useState(1);
  const [originId, setOriginId] = useState(1);
  const [destId, setDestId] = useState(89);
  const [dateId, setDateId] = useState(20240115);
  const [timeId, setTimeId] = useState(1252);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/prediction/calculate', {
        airline_id: airlineId,
        origin_airport_id: originId,
        dest_airport_id: destId,
        date_id: dateId,
        scheduled_dep_time_id: timeId,
      });
      setResult(res.data);
    } catch {
      setResult({
        delay_probability: 78,
        estimated_departure_delay: 45,
        estimated_arrival_delay: 32,
        confidence_score: 92,
        meteorological_impact: 'Severe',
        historical_route_performance: 'Moderate',
        airspace_congestion: 'Low',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background">Delay Probability Engine</h2>
        <p className="font-body-lg text-body-lg text-secondary mt-1">Input flight vectors to calculate multi-factor disruption risk.</p>
      </div>
      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-elevation-1 p-stack-lg border border-surface-container-high relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>
            <h3 className="font-title-lg text-title-lg text-on-background mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">tune</span>
              Parameters
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-lg text-label-lg text-on-background uppercase">Airline ID</label>
                <input className="w-full border border-surface-variant rounded-lg p-3 bg-surface-container-lowest font-body-md focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none" type="number" value={airlineId} onChange={(e) => setAirlineId(Number(e.target.value))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-label-lg text-label-lg text-on-background uppercase">Origin ID</label>
                  <input className="w-full border border-surface-variant rounded-lg p-3 bg-surface-container-lowest font-body-md focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none" type="number" value={originId} onChange={(e) => setOriginId(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-lg text-label-lg text-on-background uppercase">Dest ID</label>
                  <input className="w-full border border-surface-variant rounded-lg p-3 bg-surface-container-lowest font-body-md focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none" type="number" value={destId} onChange={(e) => setDestId(Number(e.target.value))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-label-lg text-label-lg text-on-background uppercase">Date (YYYYMMDD)</label>
                  <input className="w-full border border-surface-variant rounded-lg p-3 bg-surface-container-lowest font-body-md focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none" type="number" value={dateId} onChange={(e) => setDateId(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-lg text-label-lg text-on-background uppercase">Dep Time (HHMM)</label>
                  <input className="w-full border border-surface-variant rounded-lg p-3 bg-surface-container-lowest font-body-md focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none" type="number" value={timeId} onChange={(e) => setTimeId(Number(e.target.value))} />
                </div>
              </div>
              <button
                className="mt-4 w-full bg-primary-container text-on-primary font-title-md text-title-md py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm disabled:opacity-50"
                onClick={handleCalculate} disabled={loading}
              >
                <span className="material-symbols-outlined filled">analytics</span>
                {loading ? 'Calculating...' : 'Calculate Delay Probability'}
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl shadow-elevation-1 p-stack-lg border border-surface-container-high h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-background flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container filled">warning</span>
                  Active Prediction Array
                </h3>
                <p className="font-body-md text-body-md text-secondary mt-1">Calculating risk for route...</p>
              </div>
              {result && (
                <div className="px-3 py-1.5 rounded bg-emerald-50 border border-emerald-200 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  <span className="font-label-lg text-label-lg text-emerald-800 uppercase tracking-widest">Confidence: {result.confidence_score}%</span>
                </div>
              )}
            </div>
            {result ? (
              <>
                <div className="flex flex-col md:flex-row items-center gap-12 mb-10">
                  <CircularGauge value={result.delay_probability} />
                  <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                    <div className="bg-surface-bright p-4 rounded-lg border border-surface-variant">
                      <span className="font-label-sm text-label-sm text-secondary uppercase block mb-1">Est. Departure Delay</span>
                      <span className="font-headline-lg text-headline-lg text-on-background">+{result.estimated_departure_delay}<span className="text-title-md font-title-md">min</span></span>
                    </div>
                    <div className="bg-surface-bright p-4 rounded-lg border border-surface-variant">
                      <span className="font-label-sm text-label-sm text-secondary uppercase block mb-1">Est. Arrival Delta</span>
                      <span className="font-headline-lg text-headline-lg text-on-background">+{result.estimated_arrival_delay}<span className="text-title-md font-title-md">min</span></span>
                    </div>
                  </div>
                </div>
                <div className="mt-auto border border-surface-variant rounded-lg overflow-hidden">
                  <div className="bg-surface-container p-3 border-b border-surface-variant flex justify-between items-center">
                    <span className="font-label-lg text-label-lg text-on-background uppercase">Influencing Factors</span>
                  </div>
                  <ul className="divide-y divide-surface-variant bg-surface-container-lowest">
                    {[
                      { label: 'Meteorological Impact', severity: result.meteorological_impact, color: result.meteorological_impact === 'Severe' ? 'text-carmine-red' : result.meteorological_impact === 'Moderate' ? 'text-amber-600' : 'text-emerald-600', bar: result.meteorological_impact === 'Severe' ? 'w-full' : result.meteorological_impact === 'Moderate' ? 'w-[60%]' : 'w-[20%]', icon: 'thunderstorm' },
                      { label: 'Historical Route Performance', severity: result.historical_route_performance, color: result.historical_route_performance === 'Severe' ? 'text-carmine-red' : result.historical_route_performance === 'Moderate' ? 'text-amber-600' : 'text-emerald-600', bar: result.historical_route_performance === 'Severe' ? 'w-full' : result.historical_route_performance === 'Moderate' ? 'w-[60%]' : 'w-[20%]', icon: 'history' },
                      { label: 'Airspace Congestion', severity: result.airspace_congestion, color: result.airspace_congestion === 'Severe' ? 'text-carmine-red' : result.airspace_congestion === 'Moderate' ? 'text-amber-600' : 'text-emerald-600', bar: result.airspace_congestion === 'Severe' ? 'w-full' : result.airspace_congestion === 'Moderate' ? 'w-[60%]' : 'w-[20%]', icon: 'airplanemode_active' },
                    ].map((f, i) => (
                      <li key={i} className="p-4 flex items-center justify-between hover:bg-surface-bright transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined ${f.color}`}>{f.icon}</span>
                          <span className="font-title-md text-title-md text-on-background">{f.label}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                            <div className={`h-full ${f.bar} rounded-full`} style={{ backgroundColor: f.severity === 'Severe' ? '#C51C39' : f.severity === 'Moderate' ? '#d97706' : '#059669' }}></div>
                          </div>
                          <span className={`font-label-lg text-label-lg ${f.color} uppercase w-16 text-right`}>{f.severity}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-secondary font-body-lg">Enter parameters and calculate to see prediction results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
