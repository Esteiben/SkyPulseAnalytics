import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { DelayEvolutionPoint } from '../../types';

interface Props {
  data: DelayEvolutionPoint[];
}

export default function DailyDelayLineChart({ data }: Props) {
  return (
    <div className="lg:col-span-2 bg-surface-container-lowest rounded shadow-[0_4px_12px_rgba(8,8,8,0.04)] p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-porsche-silver pb-4">
        <h2 className="font-title-lg text-title-lg text-jet-black">Daily Delay Evolution</h2>
        <button className="text-secondary hover:text-jet-black">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C51C39" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#C51C39" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#BEBEBE" opacity={0.5} />
            <XAxis dataKey="date_label" tick={{ fontSize: 11 }} stroke="#5f5e5e" />
            <YAxis tick={{ fontSize: 11 }} stroke="#5f5e5e" />
            <Tooltip />
            <Area type="monotone" dataKey="avg_delay" stroke="#C51C39" fill="url(#redGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
