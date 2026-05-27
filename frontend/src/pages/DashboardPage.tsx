import { useEffect, useState } from 'react';
import KPICard from '../components/common/KPICard';
import FilterBar from '../components/common/FilterBar';
import DailyDelayLineChart from '../components/charts/DailyDelayLineChart';
import DelayByTypeDonut from '../components/charts/DelayByTypeDonut';
import AvgDelayByAirlineBar from '../components/charts/AvgDelayByAirlineBar';
import api from '../services/api';
import { KPIData, DelayEvolutionPoint, DelayByTypeItem, DelayByAirlineItem } from '../types';

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [evolution, setEvolution] = useState<DelayEvolutionPoint[]>([]);
  const [delayByType, setDelayByType] = useState<DelayByTypeItem[]>([]);
  const [delayByAirline, setDelayByAirline] = useState<DelayByAirlineItem[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/kpis'),
      api.get('/dashboard/delay-evolution'),
      api.get('/dashboard/delay-by-type'),
      api.get('/dashboard/delay-by-airline'),
    ]).then(([k, e, t, a]) => {
      setKpis(k.data);
      setEvolution(e.data);
      setDelayByType(t.data);
      setDelayByAirline(a.data);
    });
  }, []);

  return (
    <>
      <FilterBar />
      <div className="mt-8">
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <KPICard title="Total Flights" value={kpis ? `${(kpis.total_flights / 1000).toFixed(0)}k` : '...'} trend="+5.2%" trendUp icon="flight" />
          <KPICard title="% Delayed" value={kpis ? `${kpis.delayed_pct.toFixed(1)}%` : '...'} trend={kpis ? `+${(kpis.delayed_pct * 0.1).toFixed(1)}%` : '...'} critical />
          <KPICard title="Avg Delay" value={kpis ? `${kpis.avg_dep_delay.toFixed(0)}m` : '...'} trend="No change" />
          <KPICard title="% Cancelled" value={kpis ? `${kpis.cancelled_pct.toFixed(1)}%` : '...'} trend={kpis ? `-${(kpis.cancelled_pct * 0.05).toFixed(1)}%` : '...'} trendDown />
          <KPICard title="% Diverted" value={kpis ? `${kpis.diverted_pct.toFixed(1)}%` : '...'} trend="Stable" />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <DailyDelayLineChart data={evolution} />
          <DelayByTypeDonut data={delayByType} />
          <AvgDelayByAirlineBar data={delayByAirline} />
        </section>
      </div>
    </>
  );
}
