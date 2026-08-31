import { ShieldCheck, Database, CheckSquare, AlertTriangle } from 'lucide-react';

const DataQuality = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <ShieldCheck size={28} className="text-slate-800" /> Data Quality Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="text-slate-500 mb-2 flex items-center gap-2 font-semibold uppercase tracking-wide text-xs"><Database size={16}/> Total eCRFs Entered</div>
          <div className="text-3xl font-extrabold text-slate-800">12,450</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="text-slate-500 mb-2 flex items-center gap-2 font-semibold uppercase tracking-wide text-xs"><AlertTriangle size={16} className="text-yellow-500"/> Open Queries</div>
          <div className="text-3xl font-extrabold text-yellow-600">342</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="text-slate-500 mb-2 flex items-center gap-2 font-semibold uppercase tracking-wide text-xs"><CheckSquare size={16} className="text-emerald-500"/> Resolution Rate</div>
          <div className="text-3xl font-extrabold text-emerald-600">97.2%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-slate-400">
        <Database size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium text-slate-500">Query Analytics Module</p>
        <p className="text-sm mt-2 max-w-md text-center">Detailed metrics on query aging, data missingness, and site performance are currently compiling.</p>
      </div>
    </div>
  );
};

export default DataQuality;
