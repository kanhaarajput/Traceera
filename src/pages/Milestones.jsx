import { CalendarDays, Flag, CheckCircle2, Circle, Clock } from 'lucide-react';

const mockMilestones = [
  { id: 1, title: 'CTRI Registration', trial: 'AIIA-CT-2026-001', expectedDate: '2026-09-15', status: 'pending', owner: 'Regulatory Team' },
  { id: 2, title: 'First Patient In (FPI)', trial: 'AIIA-CT-2026-001', expectedDate: '2026-08-20', status: 'completed', owner: 'Clinical Ops' },
  { id: 3, title: 'Interim Analysis', trial: 'AIIA-CT-2025-010', expectedDate: '2026-08-30', status: 'overdue', owner: 'Data Management' },
  { id: 4, title: 'Site Initiation Visit (Site A)', trial: 'AIIA-CT-2026-003', expectedDate: '2026-09-05', status: 'pending', owner: 'Clinical Ops' },
  { id: 5, title: 'Last Patient Out (LPO)', trial: 'AIIA-CT-2024-002', expectedDate: '2026-11-10', status: 'pending', owner: 'Clinical Ops' },
];

const Milestones = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <CalendarDays size={28} className="text-slate-800" /> Milestones & Timelines
        </h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Flag size={18} className="text-blue-500" /> Upcoming Key Milestones
        </h3>
        
        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
          {mockMilestones.map((m) => (
            <div key={m.id} className="relative pl-6">
              <div className={`absolute -left-[11px] top-0 bg-white rounded-full ${
                m.status === 'completed' ? 'text-emerald-500' :
                m.status === 'overdue' ? 'text-red-500' : 'text-slate-300'
              }`}>
                {m.status === 'completed' ? <CheckCircle2 size={20} className="fill-emerald-50" /> : 
                 m.status === 'overdue' ? <Clock size={20} className="fill-red-50" /> :
                 <Circle size={20} />}
              </div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{m.title}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                    m.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    m.status === 'overdue' ? 'bg-red-50 text-red-600 border-red-200' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {m.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-slate-600 flex items-center gap-4">
                  <span><strong>Trial:</strong> {m.trial}</span>
                  <span><strong>Date:</strong> {m.expectedDate}</span>
                  <span><strong>Owner:</strong> {m.owner}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Milestones;
