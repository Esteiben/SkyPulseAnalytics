import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopAppBar from './TopAppBar';

const ROUTE_CONFIG: Record<string, { title: string; subtitle?: string; showSearch: boolean }> = {
  '/dashboard': { title: 'Flight Analytics', showSearch: true },
  '/dimensions': { title: 'Flight Analytics', showSearch: true },
  '/flights': { title: 'Flight Analytics', showSearch: true },
  '/prediction': { title: 'Flight Analytics', subtitle: 'Delay Probability Engine', showSearch: true },
  '/map': { title: 'Flight Analytics', subtitle: 'Interactive Route Map', showSearch: true },
  '/settings': { title: 'Flight Analytics', showSearch: true },
};

export default function AppLayout() {
  const location = useLocation();
  const config = ROUTE_CONFIG[location.pathname] ?? { title: 'Flight Analytics', showSearch: false };

  return (
    <div className="min-h-screen flex bg-porsche-silver">
      <Sidebar />
      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen">
        <TopAppBar
          title={config.title}
          subtitle={config.subtitle}
          showSearch={config.showSearch}
        />
        <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
