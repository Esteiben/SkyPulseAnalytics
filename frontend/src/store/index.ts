import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  user: { email: string; full_name: string; role: string } | null;
  setAuth: (token: string, user: { email: string; full_name: string; role: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('skypulse_token'),
  user: JSON.parse(localStorage.getItem('skypulse_user') || 'null'),
  setAuth: (token, user) => {
    localStorage.setItem('skypulse_token', token);
    localStorage.setItem('skypulse_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('skypulse_token');
    localStorage.removeItem('skypulse_user');
    set({ token: null, user: null });
  },
}));

interface FilterStore {
  dateRange: string;
  airline: string;
  airport: string;
  setDateRange: (v: string) => void;
  setAirline: (v: string) => void;
  setAirport: (v: string) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  dateRange: 'Last 30 Days',
  airline: 'All Airlines',
  airport: 'All Airports (System Wide)',
  setDateRange: (v) => set({ dateRange: v }),
  setAirline: (v) => set({ airline: v }),
  setAirport: (v) => set({ airport: v }),
}));
