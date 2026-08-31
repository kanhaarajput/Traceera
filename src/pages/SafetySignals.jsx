import { Activity, TrendingUp, AlertOctagon } from 'lucide-react';

const SafetySignals = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <Activity size={28} className="text-slate-800" /> Safety Signals
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-blue-500"/> Signal Detection Trends</h3>
          <div className="h-48 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
            {[4, 7, 3, 5, 12, 8, 4].map((h, i) => (
              <div key={i} className="w-full bg-blue-100 rounded-t-sm hover:bg-blue-200 transition-colors relative group" style={{ height: `${h * 10}%` }}>
                 <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-sm">{h} Signals</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertOctagon size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">1 Potential Signal Detected</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">An unusual cluster of mild gastrointestinal events has been detected in Trial AIIA-CT-2026-001. Requires medical monitor review.</p>
          <button className="mt-4 px-4 py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-md hover:bg-red-100 transition-colors">
            Review Signal Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetySignals;
