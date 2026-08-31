import { useState, useEffect } from 'react';
import api from '../api';
import { FileWarning, Search, Download, AlertOctagon, RefreshCw } from 'lucide-react';

const AeReports = () => {
  const [adverseEvents, setAdverseEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const patientsRes = await api.get('/api/patients?size=1000');
        const patientsList = patientsRes.data.content || patientsRes.data || [];
        
        // Fetch AEs for all patients
        const aePromises = patientsList.slice(0, 50).map(p => 
          api.get(`/api/adverse-events/by-patient/${p.id}`).catch(() => ({ data: [] }))
        );
        
        const aeResponses = await Promise.all(aePromises);
        
        let allAEs = [];
        aeResponses.forEach(res => {
          if (Array.isArray(res.data)) {
            allAEs = [...allAEs, ...res.data];
          } else if (res.data && res.data.content) {
            allAEs = [...allAEs, ...res.data.content];
          }
        });
        
        allAEs.sort((a, b) => new Date(b.reportedDate) - new Date(a.reportedDate));
        setAdverseEvents(allAEs);
      } catch (error) {
        console.error('Error fetching AE reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAEs = adverseEvents.filter(ae => 
    (ae.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (ae.suspectedDrug || '').toLowerCase().includes(search.toLowerCase()) ||
    (ae.patientName || '').toLowerCase().includes(search.toLowerCase())
  );

  const severityColor = (severity) => {
    const s = (severity || '').toUpperCase();
    if (s === 'SEVERE' || s === 'FATAL') return 'bg-red-50 text-red-600 border-red-200';
    if (s === 'MODERATE') return 'bg-orange-50 text-orange-600 border-orange-200';
    if (s === 'MILD') return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const statusColor = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'RESOLVED') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (s === 'UNDER_REVIEW') return 'bg-purple-50 text-purple-600 border-purple-200';
    return 'bg-blue-50 text-blue-600 border-blue-200';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-rose-600 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <FileWarning size={28} className="text-red-700" /> AE / SAE Reports
        </h2>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          <Download size={16} /> Export Regulatory Report
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[75vh]">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              Adverse Event Master Log
            </h3>
            <p className="text-xs text-slate-500 mt-1">Consolidated safety reports across all active clinical trials.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search event, drug, or patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white">
          {loading ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              <RefreshCw className="animate-spin text-red-500 mr-2" /> Compiling safety reports...
            </div>
          ) : filteredAEs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <AlertOctagon size={48} className="mb-4 opacity-20" />
              <p>No matching adverse events found.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase font-bold border-b border-slate-200 tracking-wider sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4">Report ID</th>
                  <th className="px-6 py-4">Event Description</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Suspected Drug</th>
                  <th className="px-6 py-4">Reported On</th>
                  <th className="px-6 py-4 text-center">Severity</th>
                  <th className="px-6 py-4 text-center">Causality</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAEs.map((ae) => (
                  <tr key={ae.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-500">AE-{ae.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 whitespace-normal min-w-[250px]">{ae.description}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{ae.patientName || ae.patientId}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{ae.suspectedDrug || '—'}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{ae.reportedDate || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${severityColor(ae.severity)}`}>
                        {ae.severity || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {ae.causalityStatus || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${statusColor(ae.status)}`}>
                        {ae.status || 'REPORTED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 text-center shrink-0">
          Showing {filteredAEs.length} adverse event reports.
        </div>
      </div>
    </div>
  );
};

export default AeReports;
