import { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle, Clock, AlertTriangle, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const statusColor = (status) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'ACTIVE':   return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'PENDING':  return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
    case 'REJECTED': return 'bg-red-50 text-red-600 border border-red-200';
    default:         return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
};

const EthicsCommitteeDashboard = () => {
  const [trials, setTrials] = useState([]);
  const [sites, setSites]   = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trialsRes, sitesRes] = await Promise.all([
          api.get('/api/trails?size=1000'),
          api.get('/api/sites?size=1000'),
        ]);
        setTrials(trialsRes.data.content || trialsRes.data);
        setSites(sitesRes.data.content  || sitesRes.data);
      } catch (err) {
        console.error('Error fetching ethics data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const pending   = trials.filter(t => (t.status || '').toUpperCase() === 'PENDING');
  const active    = trials.filter(t => (t.status || '').toUpperCase() === 'ACTIVE');
  const rejected  = trials.filter(t => (t.status || '').toUpperCase() === 'REJECTED');

  const filteredTrials = trials.filter(
    (t) =>
      (t.title || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (t.protocol_no || '').toLowerCase().includes((search || '').toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredTrials.length / itemsPerPage);
  const paginatedTrials = filteredTrials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-500 mr-2" /> <span className="text-slate-500">Loading ethics data…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 tracking-tight uppercase drop-shadow-sm">Ethics Committee Dashboard</h2>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 border border-yellow-200 shadow-sm flex items-center gap-4">
          <Clock size={36} className="text-yellow-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Pending Submissions</p>
            <p className="text-3xl font-bold text-yellow-600">{pending.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-emerald-200 shadow-sm flex items-center gap-4">
          <CheckCircle size={36} className="text-emerald-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Approved / Active</p>
            <p className="text-3xl font-bold text-emerald-600">{active.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-red-200 shadow-sm flex items-center gap-4">
          <AlertTriangle size={36} className="text-red-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{rejected.length}</p>
          </div>
        </div>
      </div>

      {/* Pending Submissions Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Pending Submissions</h3>
          <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full border border-yellow-200 font-medium">{pending.length} awaiting review</span>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Study ID</th>
              <th className="px-6 py-3 font-semibold">Protocol Title</th>
              <th className="px-6 py-3 font-semibold">Investigator</th>
              <th className="px-6 py-3 font-semibold">Start Date</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {pending.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No pending submissions.</td></tr>
            )}
            {pending.slice(0, 5).map((trial) => (
              <tr key={trial.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-800 font-medium">{trial.protocol_no}</td>
                <td className="px-6 py-4 text-slate-700">{trial.title}</td>
                <td className="px-6 py-4 text-slate-600">{trial.principle_investigator || 'N/A'}</td>
                <td className="px-6 py-4 text-slate-600">{trial.start_date || 'TBD'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(trial.status)}`}>{trial.status}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2 transition-colors font-medium">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* All Trials & Ethics Status */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-800 shrink-0">All Trials — Ethics Status</h3>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or protocol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Study ID</th>
              <th className="px-6 py-3 font-semibold">Title</th>
              <th className="px-6 py-3 font-semibold">Phase</th>
              <th className="px-6 py-3 font-semibold">Sponsor Team</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrials.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No trials match your search.</td></tr>
            )}
            {paginatedTrials.map((trial) => (
              <tr key={trial.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-800 font-medium">{trial.protocol_no}</td>
                <td className="px-6 py-4 text-slate-700">{trial.title}</td>
                <td className="px-6 py-4 text-slate-600">{trial.study_phase}</td>
                <td className="px-6 py-4 text-slate-600">{trial.sponsor_team || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(trial.status)}`}>{trial.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500">
            {filteredTrials.length === 0 
              ? 'Showing 0 trials'
              : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredTrials.length)} of ${filteredTrials.length} trials`}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || filteredTrials.length === 0}
              className="px-3 py-1 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-600 text-xs font-medium rounded border border-slate-200 flex items-center gap-1 transition-colors shadow-sm"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-xs text-slate-500 self-center mx-2 font-medium">Page {currentPage} of {Math.max(1, totalPages)}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || filteredTrials.length === 0}
              className="px-3 py-1 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-600 text-xs font-medium rounded border border-slate-200 flex items-center gap-1 transition-colors shadow-sm"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Sites Overview */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Site Activations</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Site Code</th>
              <th className="px-6 py-3 font-semibold">Site Name</th>
              <th className="px-6 py-3 font-semibold">Location</th>
              <th className="px-6 py-3 font-semibold">Investigator</th>
              <th className="px-6 py-3 font-semibold">Recruited / Target</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {sites.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No sites found. Restart backend to re-seed data.</td></tr>
            )}
            {sites.map((site) => (
              <tr key={site.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-800 font-medium">{site.site_code}</td>
                <td className="px-6 py-4 text-slate-700">{site.site_name}</td>
                <td className="px-6 py-4 text-slate-600">{site.location}</td>
                <td className="px-6 py-4 text-slate-600">{site.investigator}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((site.recruited_patient / site.target_patient) * 100))}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 font-medium shrink-0">{site.recruited_patient}/{site.target_patient}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${(site.siteStatus || '').toUpperCase() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{site.siteStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EthicsCommitteeDashboard;
