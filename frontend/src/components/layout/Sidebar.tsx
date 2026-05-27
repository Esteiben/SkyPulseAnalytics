import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/dimensions', icon: 'category', label: 'Dimensions' },
  { path: '/flights', icon: 'flight_takeoff', label: 'Flight Data' },
  { path: '/prediction', icon: 'query_stats', label: 'Prediction' },
  { path: '/map', icon: 'map', label: 'Interactive Map' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed left-0 top-0 h-full w-[280px] z-50 bg-[#080808] border-r border-[#1a1a1a] shadow-2xl flex flex-col py-stack-lg hidden md:flex">
      <div className="px-6 mb-12 flex items-center gap-4">
        <div className="w-10 h-10 bg-carmine-red rounded flex items-center justify-center text-white">
          <span className="material-symbols-outlined filled">flight_takeoff</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-black text-white uppercase tracking-tighter">SkyPulse</h1>
          <p className="font-label-sm text-label-sm text-[#888888] tracking-widest uppercase">Analytics Engine</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.path}
            className={`relative flex items-center px-6 py-4 transition-all duration-200 cursor-pointer ${
              isActive(item.path)
                ? 'text-white bg-[#1a1a1a] border-l-4 border-carmine-red scale-[0.99] origin-left'
                : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className={`material-symbols-outlined mr-4 ${isActive(item.path) ? 'text-carmine-red' : ''}`}>
              {item.icon}
            </span>
            <span className="font-title-md text-title-md tracking-tight">{item.label}</span>
          </a>
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <a className="flex items-center text-[#888888] px-6 py-4 hover:text-white hover:bg-[#1a1a1a] transition-colors duration-200 cursor-pointer">
          <span className="material-symbols-outlined mr-4">help</span>
          <span className="font-title-md text-title-md tracking-tight">Help Center</span>
        </a>
        <a
          className="flex items-center text-[#888888] px-6 py-4 hover:text-white hover:bg-[#1a1a1a] transition-colors duration-200 cursor-pointer"
          onClick={() => { logout(); navigate('/login'); }}
        >
          <span className="material-symbols-outlined mr-4">logout</span>
          <span className="font-title-md text-title-md tracking-tight">Sign Out</span>
        </a>
      </div>
    </nav>
  );
}
