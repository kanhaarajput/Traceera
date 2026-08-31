import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Users, UserCheck, UserX, RefreshCw, Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import NewPatientModal from '../components/NewPatientModal';

const statusBadge = (status) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'ACTIVE':      return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'COMPLETED':   return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'WITHDRAWN':   return 'bg-red-50 text-red-600 border border-red-200';
    case 'SCREENED':    return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
    default:            return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
};

const consentBadge = (cs) =>
  (cs || '').toUpperCase() === 'GIVEN' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200';

const ParticipantsDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/patients?size=1000');
      setPatients(res.data.content || res.data);
      setErrorMsg(null);
    } catch (err) {
      console.error('Error fetching patients:', err.message, err.response);
      setErrorMsg(err.response?.data?.message || err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = patients.filter(
    (p) =>
      (p.name || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (p.patient_code || '').toLowerCase().includes((search || '').toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeCount    = patients.filter(p => (p.status || '').toUpperCase() === 'ACTIVE').length;
  const completedCount = patients.filter(p => (p.status || '').toUpperCase() === 'COMPLETED').length;
  const withdrawnCount = patients.filter(p => (p.status || '').toUpperCase() === 'WITHDRAWN').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-500 mr-2" />
        <span className="text-slate-500">Loading participant data…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-tight uppercase drop-shadow-sm">Participant Profile Dashboard</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm shadow-purple-500/20"
        >
          <Plus size={16} /> Add Participant
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <Users size={36} className="text-blue-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Participants</p>
            <p className="text-3xl font-bold text-slate-800">{patients.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-emerald-200 shadow-sm flex items-center gap-4">
          <UserCheck size={36} className="text-emerald-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Active</p>
            <p className="text-3xl font-bold text-emerald-600">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-blue-200 shadow-sm flex items-center gap-4">
          <UserCheck size={36} className="text-blue-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-blue-600">{completedCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-red-200 shadow-sm flex items-center gap-4">
          <UserX size={36} className="text-red-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Withdrawn</p>
            <p className="text-3xl font-bold text-red-600">{withdrawnCount}</p>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-800 shrink-0">All Participants</h3>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Participant Code</th>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Age / Gender</th>
              <th className="px-6 py-3 font-semibold">Arm</th>
              <th className="px-6 py-3 font-semibold">Enrollment Date</th>
              <th className="px-6 py-3 font-semibold">Consent</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                  {errorMsg ? (
                    <span className="text-red-600 font-semibold">API Error: {errorMsg}</span>
                  ) : patients.length === 0
                    ? 'No participants found. Please restart the backend to re-seed data.'
                    : 'No participants match your search.'}
                </td>
              </tr>
            )}
            {paginated.map((p) => (
              <tr 
                key={p.id} 
                className="border-b border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/dashboard/patients/${p.id}`)}
              >
                <td className="px-6 py-4 font-mono text-slate-800 font-medium">{p.patient_code}</td>
                <td className="px-6 py-4 text-slate-700">{p.name}</td>
                <td className="px-6 py-4 text-slate-600">{p.age} / {p.gender}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${p.randomization_arm === 'Arm A' || p.randomization_arm === 'Standard Care' ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                    {p.randomization_arm || '—'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{p.enrollment_date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${consentBadge(p.consentStatus)}`}>{p.consentStatus}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge(p.status)}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500">
            {filtered.length === 0 
              ? 'Showing 0 participants'
              : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filtered.length)} of ${filtered.length} participants (Total fetched: ${patients.length})`}
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
      
      <NewPatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPatients} 
      />
    </div>
  );
};

export default ParticipantsDashboard;
