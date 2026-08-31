import { useState, useEffect } from 'react';
import api from '../api';
import { Activity, AlertOctagon, AlertTriangle, CheckCircle, ShieldAlert, RefreshCw, Search, FileX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const severityBadge = (severity) => {
  const s = (severity || '').toUpperCase();
  switch (s) {
    case 'SEVERE':
    case 'FATAL':       return 'bg-red-50 text-red-600 border-red-200';
    case 'MODERATE':    return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'MILD':        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    default:            return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const statusBadge = (status) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'REPORTED':       return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'UNDER_REVIEW':   return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'RESOLVED':       return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    default:               return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const PharmacovigilanceDashboard = () => {
  const [adverseEvents, setAdverseEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Step 1: Fetch patients to get their IDs
        const patientsRes = await api.get('/api/patients?size=1000');
        const patientsList = patientsRes.data.content || patientsRes.data || [];
        
        // Step 2: Fetch Adverse Events for all patients (limited to top 20 for performance)
        const topPatients = patientsList.slice(0, 20);
        const aePromises = topPatients.map(p => 
          api.get(`/api/adverse-events/by-patient/${p.id}`).catch(() => ({ data: [] }))
        );
        
        const aeResponses = await Promise.all(aePromises);
        
        // Step 3: Flatten all adverse events into a single array
        let allAEs = [];
        aeResponses.forEach(res => {
          if (Array.isArray(res.data)) {
            allAEs = [...allAEs, ...res.data];
          } else if (res.data && res.data.content) {
            allAEs = [...allAEs, ...res.data.content];
          }
        });
        
        // Sort by reported date descending
        allAEs.sort((a, b) => new Date(b.reportedDate) - new Date(a.reportedDate));
        
        setAdverseEvents(allAEs);
        setErrorMsg(null);
      } catch (error) {
        console.error('Error fetching pharmacovigilance data:', error);
        setErrorMsg(error.response?.data?.message || error.message || 'Failed to load safety data');
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

  // KPIs
  const totalEvents = adverseEvents.length;
  const severeEvents = adverseEvents.filter(ae => (ae.severity || '').toUpperCase() === 'SEVERE' || (ae.severity || '').toUpperCase() === 'FATAL').length;
  const unresolvedEvents = adverseEvents.filter(ae => (ae.status || '').toUpperCase() !== 'RESOLVED').length;

  // Chart Data preparation
  const severityCount = { MILD: 0, MODERATE: 0, SEVERE: 0, FATAL: 0 };
  adverseEvents.forEach(ae => {
    const sev = (ae.severity || 'MILD').toUpperCase();
    if (severityCount[sev] !== undefined) severityCount[sev]++;
  });
  
  const pieData = [
    { name: 'Mild', value: severityCount.MILD, color: '#eab308' },
    { name: 'Moderate', value: severityCount.MODERATE, color: '#f97316' },
    { name: 'Severe', value: severityCount.SEVERE, color: '#ef4444' },
    { name: 'Fatal', value: severityCount.FATAL, color: '#991b1b' },
  ].filter(d => d.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-red-500 mr-2" />
        <span className="text-slate-500">Loading safety signals…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <ShieldAlert className="text-red-500" size={28} /> Pharmacovigilance & Safety
        </h2>
        {errorMsg && <div className="text-red-700 text-sm font-medium bg-red-100 px-3 py-1 rounded border border-red-200">Error: {errorMsg}</div>}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 border border-slate-200 flex items-center gap-4 hover:border-slate-300 transition-colors shadow-sm">
          <Activity size={36} className="text-blue-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Adverse Events</p>
            <p className="text-3xl font-bold text-slate-800">{totalEvents}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-red-200 flex items-center gap-4 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <AlertOctagon size={36} className="text-red-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Severe / Fatal</p>
            <p className="text-3xl font-bold text-red-600">{severeEvents}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-orange-200 flex items-center gap-4 shadow-sm">
          <AlertTriangle size={36} className="text-orange-500 shrink-0" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Action Required (Unresolved)</p>
            <p className="text-3xl font-bold text-orange-600">{unresolvedEvents}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">Safety Reports</h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search description, drug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 w-64 placeholder-slate-400"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 bg-slate-50">
            {filteredAEs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FileX size={48} className="mb-4 opacity-20" />
                <p>No adverse events found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAEs.map(ae => (
                  <div key={ae.id} className="bg-white border border-slate-200 shadow-sm p-4 rounded-md hover:border-slate-300 transition-colors flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-800">{ae.description || 'Unknown Event'}</h4>
                        <p className="text-xs text-slate-500 mt-1">Patient: <span className="text-slate-700 font-medium">{ae.patientName || ae.patientId}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${severityBadge(ae.severity)}`}>
                          {ae.severity || 'UNKNOWN'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge(ae.status)}`}>
                          {ae.status || 'REPORTED'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-500 block">Reported On</span>
                        <span className="text-slate-700 font-medium">{ae.reportedDate || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Suspected Drug</span>
                        <span className="text-blue-600 font-medium">{ae.suspectedDrug || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Causality</span>
                        <span className="text-slate-700 font-medium">{ae.causalityStatus || '—'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 h-[500px] flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-6 shrink-0">Severity Distribution</h3>
          <div className="flex-1 min-h-0">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                    itemStyle={{ color: '#1e293b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No severity data available
              </div>
            )}
          </div>
          {pieData.length > 0 && (
            <div className="shrink-0 mt-4 flex flex-wrap justify-center gap-4">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacovigilanceDashboard;
