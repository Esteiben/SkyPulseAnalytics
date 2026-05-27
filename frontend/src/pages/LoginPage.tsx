import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, full_name, role } = res.data;
      setAuth(access_token, { email, full_name, role });
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <body className="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop antialiased relative m-0">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>
      <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-[0_4px_12px_rgba(8,8,8,0.04)] relative z-10 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 mb-6 flex items-center justify-center bg-carmine-red rounded-xl">
            <span className="material-symbols-outlined text-white text-[32px] filled">flight_takeoff</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-background text-center tracking-tight">
            Sign in to SkyPulse
          </h1>
          <p className="font-body-md text-body-md text-secondary text-center mt-2">
            Aeronautical Reliability & Prediction
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-error-container/50 text-error p-3 rounded font-body-md text-body-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="block font-label-lg text-label-lg text-on-background uppercase">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 border border-surface-variant rounded bg-surface-container-lowest font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                type="email" placeholder="analyst@skypulse.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-label-lg text-label-lg text-on-background uppercase">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 border border-surface-variant rounded bg-surface-container-lowest font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                type="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input className="h-4 w-4 rounded border-surface-variant text-primary-container focus:ring-primary-container" type="checkbox" id="remember" />
              <label className="ml-2 block font-body-md text-body-md text-secondary cursor-pointer" htmlFor="remember">Remember me</label>
            </div>
            <a className="font-body-md text-body-md text-primary-container hover:text-primary transition-colors hover:underline" href="#">Forgot password?</a>
          </div>
          <div className="pt-4">
            <button
              className="w-full flex justify-center items-center gap-2 bg-primary-container hover:bg-primary text-white font-title-md text-title-md py-3 px-4 rounded transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50"
              type="submit" disabled={loading}
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </form>
        <div className="mt-8 text-center border-t border-surface-variant pt-6">
          <p className="font-body-md text-body-md text-secondary">
            Don't have an account?
            <a className="font-title-md text-title-md text-on-background hover:text-primary-container transition-colors ml-1" href="#">Request Access</a>
          </p>
        </div>
      </div>
    </body>
  );
}
