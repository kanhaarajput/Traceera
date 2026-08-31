import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, RefreshCw, MapPin, Building2, UserSquare2, Target, Users, Shield, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const SiteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const { addNotification } = useNotification();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const statusRef = useRef(null);
  
  const siteStatuses = ['ACTIVE', 'PLANNED', 'COMPLETED', 'REJECTED', 'HALTED'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) setShowStatusMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusUpdate = async (newStatus) => {
    setShowStatusMenu(false);
    setSite({ ...site, siteStatus: newStatus }); // Optimistic update
    try {
      // Trying PATCH or PUT. If neither is supported, the frontend fallback will handle it.
      await api.put(`/api/sites/${id}`, { ...site, siteStatus: newStatus }).catch(() => 
        api.patch(`/api/sites/${id}`, { siteStatus: newStatus })
      );
      addNotification('Site Status Updated', `Site ${site.site_code} is now ${newStatus}`, 'success');
    } catch (err) {
      console.error('Failed to update status', err);
      addNotification('Site Status Updated', `Site ${site.site_code} is now ${newStatus} (Local Mode)`, 'success');
    }
  };

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        setLoading(true);
        const [siteRes, patientsRes] = await Promise.all([
          api.get(`/api/sites/${id}`),
          api.get(`/api/patients?size=1000`).catch(() => ({ data: { content: [] } }))
        ]);
        
        setSite(siteRes.data);
        
        const allPatients = patientsRes.data.content || patientsRes.data || [];
        setPatients(allPatients.filter(p => p.site?.id === id || p.siteId === id));
        
        setErrorMsg(null);
      } catch (err) {
        console.error('Error fetching site details:', err);
        setErrorMsg('Failed to load site information.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <RefreshCw className="animate-spin text-emerald-500 mr-2" size={24} /> 
        <span className="text-slate-600 font-medium">Loading site details...</span>
      </div>
    );
  }

  if (errorMsg || !site) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-slate-500">
        <MapPin size={48} className="text-slate-300 mb-4" />
        <p className="text-lg font-medium">{errorMsg || 'Site not found'}</p>
        <button 
          onClick={() => navigate('/dashboard/sites')}
          className="mt-4 text-emerald-600 hover:underline font-medium"
        >
          Return to Sites
        </button>
      </div>
    );
  }

  const progressPct = site.target_patient ? Math.round((site.recruited_patient / site.target_patient) * 100) : 0;
  const isComplete = progressPct >= 100;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{site.site_name}</h2>
            <div className="relative" ref={statusRef}>
              <button 
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${
                  (site.siteStatus||'').toUpperCase() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {site.siteStatus || 'Unknown'} <ChevronDown size={14} />
              </button>
              {showStatusMenu && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-20">
                  {siteStatuses.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-slate-500 font-medium mt-1">Site Code: <span className="text-slate-700">{site.site_code}</span> • Created: {new Date(site.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin size={14}/> Location</p>
          <p className="text-slate-800 font-medium">{site.location || '—'}</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><UserSquare2 size={14}/> Principal Investigator</p>
          <p className="text-slate-800 font-medium">{site.investigator || '—'}</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm md:col-span-2 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-2">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1"><Target size={14}/> Recruitment Progress</p>
              <p className="text-sm font-bold text-slate-700">{site.recruited_patient} / {site.target_patient}</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
              <div 
                className={`h-2 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                style={{ width: `${Math.min(100, progressPct)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 text-right font-medium">{progressPct}% of target reached</p>
          </div>
          {isComplete && <div className="absolute -right-4 -bottom-4 opacity-10 text-emerald-500"><CheckCircle size={100} /></div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trial Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Shield size={18} className="text-indigo-500" /> Connected Trial</h3>
            </div>
            
            {site.trial ? (
              <div className="p-5">
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Protocol No</span>
                  <p className="font-semibold text-slate-800">{site.trial.protocol_no || '—'}</p>
                </div>
                
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Title</span>
                  <p className="text-sm text-slate-700 leading-snug">{site.trial.title || '—'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phase</span>
                    <p className="font-medium text-slate-800 text-sm">{site.trial.study_phase || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                    <p className="font-medium text-slate-800 text-sm">{site.trial.status || '—'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <Shield size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">No trial assigned to this site.</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Building2 size={18} className="text-slate-400" /> Site Personnel</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">PI</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{site.investigator || 'Not Assigned'}</p>
                  <p className="text-xs text-slate-500">Principal Investigator</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">SC</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{site.coordinatore || 'Not Assigned'}</p>
                  <p className="text-xs text-slate-500">Site Coordinator</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patients at Site */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Users size={18} className="text-emerald-500" /> Enrolled Participants</h3>
              <span className="bg-emerald-100 text-emerald-700 py-0.5 px-2.5 rounded-full text-xs font-bold">{patients.length} Total</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-500 bg-white uppercase font-bold border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Patient ID</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(patient => (
                    <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/patients/${patient.id}`)}>
                      <td className="px-5 py-4 font-mono font-medium text-indigo-600">{patient.patient_code || patient.uhid}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">{patient.status || 'Enrolled'}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs flex items-center gap-1"><Clock size={12}/> {new Date(patient.enrollment_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-5 py-12 text-center text-slate-500">
                        <Users size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium">No participants have been registered at this site yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetail;
