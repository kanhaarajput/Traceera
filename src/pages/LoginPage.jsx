import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <ShieldCheck size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">TRACEERA</h1>
          <p className="text-sm font-medium text-emerald-600 tracking-widest uppercase mt-1">AIIA CTMS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}
          
          <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username or Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="admin@tracera.org or testuser"
                />
              </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-emerald-600 font-semibold hover:text-emerald-700">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'} {!loading && <ArrowRight size={18} />}
          </button>
          
          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/register')} className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors">
              Request access
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Secure Clinical Trial Management System</p>
          <p className="mt-1">&copy; 2026 Tracera AIIA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
