import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const InvestigatorDashboard = () => {
  const [trials, setTrials] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trialsRes, patientsRes] = await Promise.all([
          api.get('/api/trails?size=1000'),
          api.get('/api/patients?size=1000').catch(() => ({ data: { content: [] } }))
        ]);
        setTrials(trialsRes.data.content || trialsRes.data || []);
        setPatients(patientsRes.data.content || patientsRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = trials.filter(
    (t) =>
      (t.title || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (t.protocol_no || '').toLowerCase().includes((search || '').toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (['ACTIVE', 'ONGOING'].includes(s)) return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    if (['COMPLETED'].includes(s)) return 'bg-blue-50 text-blue-600 border border-blue-200';
    if (['CANCELLED', 'TERMINATED', 'SUSPENDED'].includes(s)) return 'bg-red-50 text-red-600 border border-red-200';
    return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 tracking-tight uppercase drop-shadow-sm">Investigator Dashboard</h2>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-800 shrink-0">My Studies</h3>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or protocol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Study ID</th>
              <th className="px-6 py-3 font-semibold">Protocol Title</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Recruitment %</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                  {trials.length === 0 ? 'No trials found.' : 'No trials match your search.'}
                </td>
              </tr>
            )}
            {paginated.map((trial) => {
              const enrolledCount = patients.filter(p => p.trial?.id === trial.id).length;
              const target = trial.target_patient || 1;
              const recruitmentPct = Math.min(100, Math.round((enrolledCount / target) * 100));

              return (
                <tr 
                  key={trial.id} 
                  className="border-b border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/dashboard/trials/${trial.id}`)}
                >
                  <td className="px-6 py-4 font-medium text-slate-800">{trial.protocol_no}</td>
                  <td className="px-6 py-4 text-slate-600">{trial.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${getStatusBadge(trial.status)}`}>
                      {trial.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <span>{recruitmentPct}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${recruitmentPct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500">
            {filtered.length === 0 
              ? 'Showing 0 studies'
              : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filtered.length)} of ${filtered.length} studies (Total: ${trials.length})`}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || filtered.length === 0}
              className="px-3 py-1 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-600 text-xs font-medium rounded border border-slate-200 flex items-center gap-1 transition-colors shadow-sm"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-xs text-slate-500 self-center mx-2 font-medium">Page {currentPage} of {Math.max(1, totalPages)}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || filtered.length === 0}
              className="px-3 py-1 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-600 text-xs font-medium rounded border border-slate-200 flex items-center gap-1 transition-colors shadow-sm"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">My Study Overview ({trials[0]?.protocol_no || 'N/A'})</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-slate-500 text-xs uppercase mb-1 font-medium">Screened</p>
              <p className="text-2xl font-bold text-slate-800">320</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-xs uppercase mb-1 font-medium">Enrolled</p>
              <p className="text-2xl font-bold text-slate-800">210</p>
            </div>
            <div className="text-center border-l border-slate-200 pl-4">
              <p className="text-slate-500 text-xs uppercase mb-1 font-medium">Randomized</p>
              <p className="text-2xl font-bold text-blue-600">180</p>
            </div>
          </div>
          
          <div className="flex gap-4 border-t border-slate-100 pt-4">
             <div className="flex-1">
               <h4 className="text-sm text-slate-800 mb-2 font-medium">Upcoming Visits</h4>
               <ul className="space-y-2 text-xs">
                 <li className="flex justify-between"><span className="text-slate-500">P-001</span><span className="text-slate-700">26 Aug 2026</span></li>
                 <li className="flex justify-between"><span className="text-slate-500">P-002</span><span className="text-slate-700">28 Aug 2026</span></li>
                 <li className="flex justify-between"><span className="text-slate-500">P-003</span><span className="text-slate-700">29 Aug 2026</span></li>
               </ul>
             </div>
             <div className="flex-1">
               <h4 className="text-sm text-slate-800 mb-2 font-medium">Recent Alerts</h4>
               <ul className="space-y-2 text-xs text-red-600">
                 <li>• Protocol deviation reported</li>
                 <li>• Lab results pending for P-018</li>
                 <li>• SAE reported for P-004</li>
               </ul>
             </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold text-slate-800 mb-2">Participant Engagement</h3>
            <p className="text-slate-500 text-sm mb-6">Retention and visit compliance across all sites</p>
            
            <div className="w-48 h-48 mx-auto relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{name: 'Compliant', value: 85}, {name: 'Missed', value: 15}]}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-slate-800">85%</span>
                <span className="text-xs text-slate-500 font-medium">Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigatorDashboard;
