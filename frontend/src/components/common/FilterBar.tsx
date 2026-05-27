import { useNavigate } from 'react-router-dom';

const FILTERS = [
  { key: 'dateRange', label: 'Date Range', icon: 'calendar_today', options: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date', 'All Time'] },
  { key: 'airline', label: 'Airline', icon: 'airlines', options: ['All Airlines'] },
  { key: 'airport', label: 'Airport', icon: 'flight', options: ['All Airports (System Wide)'] },
];

export default function FilterBar() {
  const navigate = useNavigate();

  return (
    <section className="bg-surface-container-lowest rounded shadow-sm p-4 flex flex-col lg:flex-row items-end lg:items-center gap-4 relative z-20">
      <div className="w-full lg:w-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {FILTERS.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="font-label-lg text-label-lg text-jet-black uppercase">{f.label}</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">{f.icon}</span>
              <select className="w-full pl-10 pr-4 py-2 border border-porsche-silver rounded bg-surface-container-lowest focus:outline-none focus:border-carmine-red focus:ring-0 text-sm font-medium appearance-none">
                {f.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full lg:w-auto px-6 py-2 bg-carmine-red text-white font-title-md text-title-md font-bold rounded hover:bg-[#a0162e] transition-colors h-[42px]">
        Apply Filters
      </button>
    </section>
  );
}
