import { BarChart3, Users, Target, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', target: 4000, actual: 1200 },
  { month: 'Feb', target: 4000, actual: 1800 },
  { month: 'Mar', target: 4000, actual: 2400 },
  { month: 'Apr', target: 4000, actual: 2900 },
  { month: 'May', target: 4000, actual: 3245 },
];

const Recruitment = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <BarChart3 size={28} className="text-slate-800" /> Recruitment Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <Target size={32} className="text-blue-500 mb-2" />
          <p className="text-slate-500 font-semibold uppercase tracking-wide text-xs">Total Target</p>
          <p className="text-3xl font-extrabold text-slate-800">6,000</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <Users size={32} className="text-emerald-500 mb-2" />
          <p className="text-slate-500 font-semibold uppercase tracking-wide text-xs">Currently Enrolled</p>
          <p className="text-3xl font-extrabold text-slate-800">3,245</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <Activity size={32} className="text-purple-500 mb-2" />
          <p className="text-slate-500 font-semibold uppercase tracking-wide text-xs">Overall Progress</p>
          <p className="text-3xl font-extrabold text-slate-800">54.1%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-[400px] flex flex-col">
        <h3 className="font-semibold text-slate-800 mb-4">Enrollment Trajectory (YTD)</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3'}}
              />
              <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" fill="none" name="Target" />
              <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Enrollment" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
