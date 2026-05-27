import { useEffect, useState } from 'react';
import api from '../services/api';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ full_name: '', email: '', role: '' });
  const [health, setHealth] = useState({ main_api_node: { status: 'checking' }, legacy_db: { status: 'offline' } });

  useEffect(() => {
    api.get('/settings/profile').then((r) => setProfile(r.data));
    api.get('/map/health').then((r) => setHealth(r.data));
  }, []);

  return (
      <div className="max-w-5xl mx-auto space-y-stack-lg">
        <div className="mb-8">
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">System Preferences</h1>
          <p className="font-body-lg text-body-lg text-secondary">Manage your operational workspace, alerts, and connection parameters.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 space-y-stack-lg">
            <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(8,8,8,0.04)] p-stack-lg flex flex-col sm:flex-row items-start sm:items-center gap-8 border border-outline-variant/30">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[48px] text-secondary">account_circle</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-headline-md text-headline-md text-on-background m-0">{profile.full_name || 'User'}</h3>
                  <span className="bg-primary-container/10 text-primary px-2 py-0.5 rounded font-label-sm text-label-sm uppercase tracking-wider font-bold">Verified</span>
                </div>
                <p className="font-body-md text-body-md text-secondary mb-4">{profile.email}</p>
                <div className="inline-flex items-center gap-2 bg-surface-variant px-3 py-1.5 rounded-md">
                  <span className="material-symbols-outlined text-[18px] text-on-surface">badge</span>
                  <span className="font-title-md text-title-md text-on-background capitalize">{profile.role || 'Analyst'}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 self-start sm:self-center">
                <button className="bg-primary hover:bg-surface-tint text-on-primary font-title-md py-2 px-6 rounded-lg transition-colors shadow-sm">
                  Edit Profile
                </button>
              </div>
            </section>
            <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(8,8,8,0.04)] p-stack-lg border border-outline-variant/30">
              <div className="border-b border-surface-variant pb-4 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-background mb-1">Alert Matrix</h3>
                  <p className="font-body-md text-body-md text-secondary">Configure threshold triggers and delivery channels.</p>
                </div>
                <span className="material-symbols-outlined text-secondary text-[28px]">notifications_active</span>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Critical Delay Anomalies (Email)', desc: 'Immediate routing for deviations > 15%', default: true },
                  { label: 'Predictive Model Updates (Browser)', desc: 'In-app toasts when new forecast vectors compile', default: true },
                  { label: 'Weekly Telemetry Digest', desc: 'Summary reports sent every Monday 00:00 UTC', default: false },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-background">{alert.label}</span>
                      <span className="font-body-md text-body-md text-secondary">{alert.desc}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={alert.default} />
                      <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="lg:col-span-4 space-y-stack-lg">
            <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(8,8,8,0.04)] p-stack-lg border border-outline-variant/30">
              <h3 className="font-title-lg text-title-lg text-on-background mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">dns</span>
                Connectivity
              </h3>
              <div className="bg-surface p-4 rounded-lg border border-surface-variant flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${health.main_api_node.status === 'healthy' ? 'bg-emerald-500 animate-ping' : ''}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${health.main_api_node.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  </div>
                  <span className="font-title-md text-title-md text-on-background">Main API Node</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{health.main_api_node.status}</span>
              </div>
              <div className="bg-surface p-4 rounded-lg border border-surface-variant flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </div>
                  <span className="font-title-md text-title-md text-on-background">Legacy DB</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">{health.legacy_db.status}</span>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-variant text-center">
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Last ping: realtime</p>
              </div>
            </section>
            <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(8,8,8,0.04)] p-stack-lg border border-outline-variant/30">
              <h3 className="font-title-lg text-title-lg text-on-background mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">sync</span>
                Ingestion Rate
              </h3>
              <p className="font-body-md text-body-md text-secondary mb-4">Define how frequently the dashboard requests new vectors from the flight stream.</p>
              <div className="relative">
                <select className="block w-full bg-surface-container-lowest border border-outline-variant text-on-background font-title-md py-3 px-4 pr-8 rounded-lg appearance-none focus:outline-none focus:border-2 focus:border-primary focus:ring-0 cursor-pointer shadow-sm">
                  <option>Real-time (WebSockets)</option>
                  <option>5 Minutes (Polling)</option>
                  <option>15 Minutes (Batch)</option>
                  <option>Manual Only</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-secondary">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
              <div className="mt-4 bg-error-container/20 border border-outline-variant/50 rounded p-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">info</span>
                <p className="font-body-md text-body-md text-on-surface text-sm">Real-time ingestion may increase browser memory consumption during high-density traffic periods.</p>
              </div>
            </section>
          </div>
        </div>
        <div className="flex justify-end pt-6 pb-12 gap-4">
          <button className="bg-transparent border border-on-background hover:bg-surface-variant text-on-background font-title-md py-2 px-6 rounded-lg transition-colors">Discard Changes</button>
          <button className="bg-primary hover:bg-surface-tint text-on-primary font-title-md py-2 px-8 rounded-lg transition-colors shadow-md">Apply Configuration</button>
        </div>
      </div>
  );
}
