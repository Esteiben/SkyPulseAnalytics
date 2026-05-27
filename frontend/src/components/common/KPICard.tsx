interface KPICardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  trendDown?: boolean;
  critical?: boolean;
  icon?: string;
}

export default function KPICard({ title, value, trend, trendUp, trendDown, critical, icon }: KPICardProps) {
  return (
    <div className={`bg-surface-container-lowest rounded shadow-[0_4px_12px_rgba(8,8,8,0.04)] p-4 flex flex-col gap-2 relative overflow-hidden group ${critical ? 'border-l-4 border-carmine-red' : ''}`}>
      {icon && (
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-[64px] text-jet-black">{icon}</span>
        </div>
      )}
      <div className="flex justify-between items-start">
        <h3 className="font-label-lg text-label-lg text-secondary uppercase">{title}</h3>
        {critical && <span className="material-symbols-outlined text-carmine-red text-[20px]">warning</span>}
      </div>
      <div className={`font-headline-lg text-headline-lg ${critical ? 'text-carmine-red' : 'text-jet-black'}`}>{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-600' : trendDown ? 'text-green-600' : critical ? 'text-carmine-red' : 'text-secondary'}`}>
          <span className="material-symbols-outlined text-[16px]">
            {trendUp ? 'trending_up' : trendDown ? 'trending_down' : 'horizontal_rule'}
          </span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
