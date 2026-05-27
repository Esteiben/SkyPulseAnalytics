import { useState } from 'react';
import api from '../services/api';

export default function FlightDataPage() {
  const [form, setForm] = useState({ airline_code: '', flight_date: '', origin: '', destination: '', delay_min: 0, distance_nm: 0 });
  const [uploadStatus, setUploadStatus] = useState('');
  const [files] = useState([
    { name: 'historical_delays_2023.csv', size: '14.2 MB', status: 'Processed' },
    { name: 'wx_data_nordic.parquet', size: '8.1 MB', status: 'Queued' },
  ]);

  const handleManualSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
    try {
      await api.post('/flights/manual', formData);
      setUploadStatus('Record saved successfully');
    } catch {
      setUploadStatus('Error saving record');
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-background">Data Ingestion Hub</h2>
        <p className="font-body-md text-body-md text-secondary mt-1">Record manual anomalies or execute bulk parameter uploads.</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter mb-gutter">
        <div className="xl:col-span-5 bg-surface-container-lowest rounded-lg shadow-sm p-stack-lg border-t-4 border-primary-container flex flex-col">
          <div className="flex items-center justify-between mb-stack-md border-b border-surface-variant pb-4">
            <h3 className="font-title-lg text-title-lg text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">edit_document</span>
              Manual Entry
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-label-lg text-label-lg uppercase text-on-background mb-1">Airline Code</label>
                <input className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md rounded px-3 py-2 focus:ring-0 focus:border-2 focus:border-primary-container transition-all" placeholder="e.g., DL, UA" value={form.airline_code} onChange={(e) => setForm({ ...form, airline_code: e.target.value })} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-label-lg text-label-lg uppercase text-on-background mb-1">Flight Date</label>
                <input className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md rounded px-3 py-2 focus:ring-0 focus:border-2 focus:border-primary-container transition-all" type="date" value={form.flight_date} onChange={(e) => setForm({ ...form, flight_date: e.target.value })} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-label-lg text-label-lg uppercase text-on-background mb-1">Origin (IATA)</label>
                <input className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md rounded px-3 py-2 focus:ring-0 focus:border-2 focus:border-primary-container transition-all uppercase" placeholder="JFK" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-label-lg text-label-lg uppercase text-on-background mb-1">Destination (IATA)</label>
                <input className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md rounded px-3 py-2 focus:ring-0 focus:border-2 focus:border-primary-container transition-all uppercase" placeholder="LHR" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-label-lg text-label-lg uppercase text-on-background mb-1">Delay (Mins)</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md rounded px-3 py-2 focus:ring-0 focus:border-2 focus:border-primary-container transition-all pl-9" type="number" value={form.delay_min} onChange={(e) => setForm({ ...form, delay_min: Number(e.target.value) })} />
                  <span className="material-symbols-outlined absolute left-2 top-2.5 text-secondary text-[18px]">timer</span>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-label-lg text-label-lg uppercase text-on-background mb-1">Distance (NM)</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md rounded px-3 py-2 focus:ring-0 focus:border-2 focus:border-primary-container transition-all pl-9" type="number" value={form.distance_nm} onChange={(e) => setForm({ ...form, distance_nm: Number(e.target.value) })} />
                  <span className="material-symbols-outlined absolute left-2 top-2.5 text-secondary text-[18px]">straighten</span>
                </div>
              </div>
            </div>
            <div className="mt-stack-lg pt-4">
              {uploadStatus && <p className="text-sm text-emerald-600 mb-2">{uploadStatus}</p>}
              <button className="w-full bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md py-3 rounded transition-colors flex items-center justify-center gap-2" onClick={handleManualSubmit}>
                <span className="material-symbols-outlined">save</span>
                Save Record
              </button>
            </div>
          </div>
        </div>
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-lg shadow-sm p-stack-lg flex flex-col">
          <div className="flex items-center justify-between mb-stack-md border-b border-surface-variant pb-4">
            <h3 className="font-title-lg text-title-lg text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">cloud_upload</span>
              Bulk Ingestion
            </h3>
            <span className="bg-surface-variant text-on-background font-label-sm px-2 py-1 rounded uppercase">CSV / Parquet</span>
          </div>
          <div className="border-2 border-dashed border-outline-variant hover:border-primary-container bg-surface/50 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors mb-6">
            <div className="w-16 h-16 bg-surface-container-lowest rounded-full shadow-sm flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-secondary group-hover:text-primary-container text-[32px]">upload_file</span>
            </div>
            <p className="font-title-md text-title-md text-on-background mb-1">Drag and drop dataset files here</p>
            <p className="font-body-md text-body-md text-secondary">or click to browse local directories</p>
          </div>
          <div className="flex-1 overflow-auto rounded border border-surface-variant">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-variant">
                <tr>
                  <th className="py-2 px-4 font-label-lg text-label-lg uppercase text-on-background">File Name</th>
                  <th className="py-2 px-4 font-label-lg text-label-lg uppercase text-on-background">Size</th>
                  <th className="py-2 px-4 font-label-lg text-label-lg uppercase text-on-background">Status</th>
                  <th className="py-2 px-4 font-label-lg text-label-lg uppercase text-on-background text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface">
                {files.map((f, i) => (
                  <tr key={i} className="border-b border-surface-variant hover:bg-surface-container-high/30 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[16px]">description</span>
                      {f.name}
                    </td>
                    <td className="py-3 px-4 text-secondary">{f.size}</td>
                    <td className="py-3 px-4">
                      <span className={f.status === 'Processed' ? 'text-primary-container font-medium flex items-center gap-1' : 'text-secondary font-medium flex items-center gap-1'}>
                        <span className="material-symbols-outlined text-[14px]">{f.status === 'Processed' ? 'check_circle' : 'schedule'}</span>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-secondary hover:text-on-background"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
