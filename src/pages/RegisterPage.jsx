import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight, ShieldCheck, Shield } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_PI');
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    const success = await register(username, password, role);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900 overflow-hidden">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <ShieldCheck size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h1>
          <p className="text-sm font-medium text-slate-500 mt-2 text-center">Join TRACEERA to manage your clinical trials and sites.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}
          
          <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
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
                  placeholder="e.g. dr.smith"
                />
              </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700">Account Role</label>
            <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield size={18} className="text-slate-400" />
                </div>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
                >
                  <option value="ROLE_ADMIN">System Administrator</option>
                  <option value="ROLE_PI">Principal Investigator (PI)</option>
                  <option value="ROLE_PV">Pharmacovigilance (PV)</option>
                </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Creating Account...' : 'Sign Up'} {!loading && <ArrowRight size={18} />}
          </button>
          
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} className="text-slate-800 hover:text-emerald-600 font-semibold transition-colors">
              Log in here
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>By creating an account, you agree to the Terms of Service & Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
