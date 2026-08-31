import { Eye, MapPin, Calendar, CheckSquare } from 'lucide-react';

const mockVisits = [
  { id: 1, site: 'AIIMS New Delhi', type: 'Site Initiation Visit (SIV)', date: '2026-09-10', cra: 'Jane Doe', status: 'Scheduled' },
  { id: 2, site: 'Tata Memorial', type: 'Routine Monitoring', date: '2026-08-25', cra: 'John Smith', status: 'Report Pending' },
  { id: 3, site: 'CMC Vellore', type: 'Close-out Visit', date: '2026-08-15', cra: 'Sarah Connor', status: 'Completed' },
];

const Monitoring = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <Eye size={28} className="text-slate-800" /> Clinical Monitoring
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">Upcoming & Recent Visits</h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-500 bg-white uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Site</th>
                <th className="px-6 py-3">Visit Type</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">CRA</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockVisits.map(v => (
                <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2"><MapPin size={14} className="text-slate-400"/> {v.site}</td>
                  <td className="px-6 py-4 text-slate-600">{v.type}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{v.date}</td>
                  <td className="px-6 py-4 text-slate-600">{v.cra}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${v.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : v.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><CheckSquare size={18} className="text-emerald-500"/> Action Items</h3>
          <ul className="space-y-3">
            <li className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800">
              <strong>Action Required:</strong> Review pending monitoring report for Tata Memorial (Overdue 5 days).
            </li>
            <li className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
              <strong>Task:</strong> Schedule SIV for Site 004 (Apollo Hospitals).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
