import { AlertTriangle, Download } from 'lucide-react';

const mockDeviations = [
  { id: 1, trial: 'AIIA-CT-2026-001', site: 'Site 004', subject: 'P-102', category: 'Informed Consent', description: 'Consent signed after first screening procedure', severity: 'Major', status: 'CAPA Pending' },
  { id: 2, trial: 'AIIA-CT-2025-010', site: 'Site 001', subject: 'P-88', category: 'Visit Schedule', description: 'Visit 3 conducted outside window (+3 days)', severity: 'Minor', status: 'Resolved' },
  { id: 3, trial: 'AIIA-CT-2026-003', site: 'Site 012', subject: 'P-405', category: 'Investigational Product', description: 'Temperature excursion in IP storage', severity: 'Major', status: 'Under Investigation' },
];

const Deviations = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <AlertTriangle size={28} className="text-red-700" /> Protocol Deviations
        </h2>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          <Download size={16} /> Export Log
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Deviation Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[11px] text-slate-500 bg-white uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Trial ID</th>
                <th className="px-6 py-3">Site</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-center">Severity</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockDeviations.map(d => (
                <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-medium text-slate-600">{d.trial}</td>
                  <td className="px-6 py-4 text-slate-600">{d.site}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{d.category}</td>
                  <td className="px-6 py-4 text-slate-500 whitespace-normal min-w-[200px]">{d.description}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${d.severity === 'Major' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
                      {d.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deviations;
