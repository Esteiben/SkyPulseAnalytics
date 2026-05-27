import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { DelayByTypeItem } from '../../types';

interface Props {
  data: DelayByTypeItem[];
}

const COLORS = ['#C51C39', '#080808', '#5f5e5e', '#BEBEBE', '#9e0027'];

export default function DelayByTypeDonut({ data }: Props) {
  return (
    <div className="bg-surface-container-lowest rounded shadow-[0_4px_12px_rgba(8,8,8,0.04)] p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-porsche-silver pb-4">
        <h2 className="font-title-lg text-title-lg text-jet-black">Delay by Type</h2>
      </div>
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
