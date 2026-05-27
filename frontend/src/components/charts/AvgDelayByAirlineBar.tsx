import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DelayByAirlineItem } from '../../types';

interface Props {
  data: DelayByAirlineItem[];
}

export default function AvgDelayByAirlineBar({ data }: Props) {
  return (
    <div className="lg:col-span-3 bg-surface-container-lowest rounded shadow-[0_4px_12px_rgba(8,8,8,0.04)] p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-porsche-silver pb-4">
        <h2 className="font-title-lg text-title-lg text-jet-black">Avg Delay by Airline (Top 5)</h2>
        <button className="text-sm font-medium text-carmine-red hover:underline">View Full Report</button>
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.slice(0, 5)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#BEBEBE" opacity={0.5} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="#5f5e5e" />
            <YAxis dataKey="airline_code" type="category" tick={{ fontSize: 12 }} stroke="#5f5e5e" width={120} />
            <Tooltip />
            <Bar dataKey="avg_delay" fill="#C51C39" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
