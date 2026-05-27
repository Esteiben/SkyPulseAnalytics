import { useEffect, useState } from 'react';
import DataTable from '../components/common/DataTable';
import api from '../services/api';

const DIMS = [
  { key: 'airlines', label: 'Airlines', headers: ['ID', 'Code', 'Name'] },
  { key: 'airports', label: 'Airports', headers: ['ID', 'Code', 'Name', 'City ID', 'State ID'] },
  { key: 'cancellation_codes', label: 'Cancellation Codes', headers: ['ID', 'Code', 'Description'] },
  { key: 'seasons', label: 'Seasons', headers: ['ID', 'Name'] },
  { key: 'time_buckets', label: 'Time Buckets', headers: ['ID', 'Name', 'Start Hour', 'End Hour'] },
  { key: 'day_types', label: 'Day Types', headers: ['ID', 'Type'] },
];

export default function DimensionsPage() {
  const [activeTab, setActiveTab] = useState(DIMS[0].key);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const active = DIMS.find((d) => d.key === activeTab)!;

  useEffect(() => {
    api.get(`/dimensions/${activeTab}?page=${page}&size=20&search=${search}`)
      .then((res) => {
        setData(res.data.items);
        setTotal(res.data.total);
      });
  }, [activeTab, page, search]);

  const renderCell = (row: Record<string, unknown>, header: string) => {
    const val = row[header.toLowerCase().replace(/\s+/g, '_')] ?? row[header.toLowerCase()] ?? '—';
    return String(val);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline/20 pb-4 mb-6">
        <div className="w-full md:w-auto">
          <h1 className="font-headline-lg text-headline-lg md:font-headline-lg-mobile text-on-background mb-4">Dimensions Management</h1>
          <div className="flex overflow-x-auto gap-6 w-full pb-1">
            {DIMS.map((dim) => (
              <button
                key={dim.key}
                className={`whitespace-nowrap pb-2 px-1 text-title-md transition-colors ${
                  activeTab === dim.key
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-secondary hover:bg-surface-container-high'
                }`}
                onClick={() => { setActiveTab(dim.key); setPage(1); }}
              >
                {dim.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-on-background text-on-primary font-title-md rounded-lg hover:bg-on-background/90 transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary font-title-md rounded-lg hover:bg-primary-container/90 transition-colors shadow-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New
          </button>
        </div>
      </div>
      <div className="flex gap-4 mb-4 items-center">
        <input
          className="pl-4 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all w-64"
          placeholder={`Search ${active.label}...`}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <span className="font-body-md text-body-md text-secondary">{total} entries</span>
      </div>
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-outline-variant/30 overflow-hidden">
        <DataTable
          headers={active.headers}
          rows={data.map((row) => active.headers.map((h) => renderCell(row, h)))}
        />
        <div className="p-4 border-t border-[#BEBEBE] bg-surface flex items-center justify-between">
          <span className="font-body-md text-body-md text-secondary">
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} entries
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-secondary hover:bg-surface-variant transition-colors disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-on-primary font-bold text-sm">{page}</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-secondary hover:bg-surface-variant transition-colors disabled:opacity-50" disabled={page * 20 >= total} onClick={() => setPage(page + 1)}>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
