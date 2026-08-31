import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, RefreshCw, CheckCircle, Clock, Activity, Target, AlertTriangle, MapPin } from 'lucide-react';

const statusBadge = (status) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'ACTIVE':      return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'COMPLETED':   return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'PLANNED':
    case 'PENDING':     return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
    case 'HALTED':      return 'bg-red-50 text-red-600 border border-red-200';
    default:            return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
};

const TrialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trial, setTrial] = useState(null);
  const [kpi, setKpi] = useState(null);
  const [lifeline, setLifeline] = useState(null);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchTrialData = async () => {
      try {
        setLoading(true);
        const [trialRes, kpiRes, lifelineRes, sitesRes] = await Promise.all([
          api.get(`/api/trails/${id}`).catch(() => api.get(`/api/trials/${id}`)),
          api.get(`/api/kpis/trial/${id}`).catch(() => ({ data: null })),
          api.get(`/api/trials/${id}/lifeline`).catch(() => ({ data: null })),
          api.get('/api/sites').catch(() => ({ data: { content: [] } }))
        ]);
        
        setTrial(trialRes.data);
        setKpi(kpiRes.data);
        setLifeline(lifelineRes.data);
        
        const allSites = sitesRes.data.content || sitesRes.data || [];
        setSites(allSites.filter(s => s.trial?.id === id || s.trialId === id));
        
        setErrorMsg(null);
      } catch (err) {
        console.error('Error fetching trial details:', err);
        setErrorMsg(err.response?.data?.message || err.message || 'Failed to load trial data');
      } finally {
        setLoading(false);
      }
    };
    fetchTrialData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-500 mr-2" />
        <span className="text-slate-500">Loading trial details…</span>
      </div>
    );
  }

  if (errorMsg || !trial) {
    return (
      <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Trial</h2>
        <p className="text-slate-500 mb-4">{errorMsg || 'Trial not found'}</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const enrollmentPct = kpi?.enrollmentPercent ? (kpi.enrollmentPercent * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 bg-white border border-slate-200 shadow-sm rounded-md text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{trial.protocol_no || trial.title}</h2>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusBadge(trial.status)}`}>{trial.status}</span>
          </div>
          <p className="text-slate-500 text-sm">{trial.title}</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Info & KPIs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <Target size={20} className="text-blue-500 mb-2" />
              <p className="text-xs text-slate-500 font-medium">Target Patients</p>
              <p className="text-xl font-bold text-slate-800">{trial.target_patient || kpi?.targetPatient || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <Activity size={20} className="text-emerald-500 mb-2" />
              <p className="text-xs text-slate-500 font-medium">Recruited</p>
              <p className="text-xl font-bold text-slate-800">{kpi?.recruitedPatients || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <CheckCircle size={20} className="text-purple-500 mb-2" />
              <p className="text-xs text-slate-500 font-medium">Enrollment %</p>
              <p className="text-xl font-bold text-slate-800">{enrollmentPct}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <AlertTriangle size={20} className="text-orange-500 mb-2" />
              <p className="text-xs text-slate-500 font-medium">Overdue Visits</p>
              <p className="text-xl font-bold text-slate-800">{kpi?.overdueVisitCount || 0}</p>
            </div>
          </div>

          {/* Trial Overview */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Study Overview</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="block text-slate-500 mb-1">Principal Investigator</span>
                <span className="text-slate-900 font-medium">{trial.principle_investigator || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Sponsor / Team</span>
                <span className="text-slate-700">{trial.sponsor_team || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Phase</span>
                <span className="text-blue-600 font-medium">{trial.study_phase || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Study Type</span>
                <span className="text-slate-700">{trial.study_type || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Intervention</span>
                <span className="text-slate-700">{trial.intervention_name || '—'} ({trial.intervention_type})</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Start Date</span>
                <span className="text-slate-700">{trial.start_date || '—'}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="block text-slate-500 mb-1 text-sm">Primary Objective</span>
              <p className="text-slate-800 text-sm leading-relaxed">{trial.primary_objective || '—'}</p>
            </div>
          </div>
          
          {/* Sites / Locations */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapPin className="text-blue-500" size={18} /> Study Locations (Sites)
            </h3>
            {sites.length === 0 ? (
              <p className="text-sm text-slate-500">No sites registered for this trial yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sites.map(site => (
                  <div key={site.id} className="border border-slate-200 rounded-md p-4 bg-slate-50 flex items-start gap-3">
                    <MapPin className="text-slate-400 mt-0.5" size={16} />
                    <div>
                      <p className="font-semibold text-slate-800">{site.site_name}</p>
                      <p className="text-sm text-slate-600 mt-1">{site.location}</p>
                      <div className="mt-2 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded inline-block">
                        {site.site_code} • {site.siteStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Lifeline / Regulatory */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="text-blue-500" /> Regulatory Timeline
          </h3>
          
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
            
            <div className="relative pl-6">
              <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
              <p className="text-sm font-semibold text-slate-800">Protocol Design</p>
              <p className="text-xs text-slate-500 mt-1">{trial.created_at ? new Date(trial.created_at).toLocaleDateString() : '—'}</p>
            </div>

            <div className="relative pl-6">
              <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white ${lifeline?.iec_approval_date ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              <p className="text-sm font-semibold text-slate-800">IEC Approval</p>
              <p className="text-xs text-slate-500 mt-1">{lifeline?.iec_approval_date || trial.iec_approval_date || 'Pending'}</p>
            </div>

            <div className="relative pl-6">
              <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white ${lifeline?.ctri_registration_number ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              <p className="text-sm font-semibold text-slate-800">CTRI Registration</p>
              {lifeline?.ctri_registration_number || trial.ctri_registration_number ? (
                <>
                  <p className="text-xs text-blue-600 mt-1 font-mono">{lifeline?.ctri_registration_number || trial.ctri_registration_number}</p>
                  <p className="text-xs text-slate-500 mt-1">{lifeline?.ctri_registration_date || trial.ctri_registration_date}</p>
                </>
              ) : (
                <p className="text-xs text-slate-500 mt-1">Pending Registration</p>
              )}
            </div>

            <div className="relative pl-6">
              <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white ${(trial.status||'').toUpperCase() === 'ACTIVE' || (trial.status||'').toUpperCase() === 'COMPLETED' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              <p className="text-sm font-semibold text-slate-800">Site Initiation</p>
              <p className="text-xs text-slate-500 mt-1">{trial.start_date || 'Pending'}</p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrialDetail;
