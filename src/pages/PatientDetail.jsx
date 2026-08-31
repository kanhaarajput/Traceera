import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, RefreshCw, User, Calendar, Activity, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

const statusBadge = (status) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'ACTIVE':      return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'COMPLETED':   return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'WITHDRAWN':   return 'bg-red-50 text-red-600 border border-red-200';
    case 'SCREENED':
    case 'ENROLLED':    return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
    default:            return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
};

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const [patRes, visitsRes, eventsRes] = await Promise.all([
          api.get(`/api/patients/${id}`),
          api.get(`/api/visits/by-patient/${id}`).catch(() => ({ data: [] })),
          api.get(`/api/adverse-events/by-patient/${id}`).catch(() => ({ data: [] }))
        ]);
        
        setPatient(patRes.data);
        setVisits(visitsRes.data.content || visitsRes.data || []);
        setEvents(eventsRes.data.content || eventsRes.data || []);
        setErrorMsg(null);
      } catch (err) {
        console.error('Error fetching patient details:', err);
        setErrorMsg(err.response?.data?.message || err.message || 'Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-500 mr-2" />
        <span className="text-slate-500">Loading patient dossier…</span>
      </div>
    );
  }

  if (errorMsg || !patient) {
    return (
      <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Participant</h2>
        <p className="text-slate-500 mb-4">{errorMsg || 'Participant not found'}</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 bg-white border border-slate-200 shadow-sm rounded-md text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
          <User className="text-blue-600" size={24} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{patient.name || 'Anonymous Participant'}</h2>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusBadge(patient.status)}`}>{patient.status}</span>
          </div>
          <p className="text-slate-500 text-sm font-mono">Code: {patient.patient_code} | UHID: {patient.uhid}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Demographics */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Demographics & Study Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Age / Gender</span>
                <span className="text-slate-800 font-medium">{patient.age} Y / {patient.gender}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Research Site (Location)</span>
                <span className="text-slate-800 font-medium flex items-center gap-1 text-right max-w-[50%]">
                  {patient.site ? (
                    <>
                      <MapPin size={14} className="text-blue-500 shrink-0"/> 
                      <span className="truncate" title={`${patient.site.site_name}, ${patient.site.location}`}>
                        {patient.site.location}
                      </span>
                    </>
                  ) : '—'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Randomization Arm</span>
                <span className="text-purple-600 font-medium">{patient.randomization_arm || 'Pending'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Enrollment Date</span>
                <span className="text-slate-800">{patient.enrollment_date || '—'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Consent Status</span>
                <span className={patient.consentStatus === 'GIVEN' ? 'text-emerald-600 font-medium' : 'text-yellow-600 font-medium'}>{patient.consentStatus || '—'}</span>
              </div>
              {patient.withdrawalReason && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <span className="text-red-700 text-xs font-semibold block mb-1">Withdrawal Reason</span>
                  <span className="text-red-900 text-xs">{patient.withdrawalReason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Warning / AEs Mini Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="text-red-500" size={18}/> Safety / Adverse Events
            </h3>
            {events.length === 0 ? (
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <CheckCircle className="text-emerald-500" size={16}/> No adverse events reported.
              </p>
            ) : (
              <div className="space-y-3">
                {events.map(ev => (
                  <div key={ev.id} className="text-xs bg-slate-50 p-3 rounded border border-slate-200 shadow-sm">
                    <div className="flex justify-between font-semibold mb-1 text-slate-800">
                      <span>{ev.description || 'Event'}</span>
                      <span className={ev.severity === 'SEVERE' || ev.severity === 'FATAL' ? 'text-red-600 font-bold' : 'text-yellow-600 font-bold'}>{ev.severity}</span>
                    </div>
                    <div className="text-slate-600">Drug: <span className="font-medium text-slate-800">{ev.suspectedDrug || '—'}</span></div>
                    <div className="text-slate-600">Reported: {ev.reportedDate || '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Clinical Visits Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50 rounded-t-lg">
            <Calendar className="text-blue-500" size={20} />
            <h3 className="font-semibold text-slate-800">Clinical Visit Schedule</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-100 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Visit Type</th>
                  <th className="px-6 py-3 font-semibold">Scheduled Date</th>
                  <th className="px-6 py-3 font-semibold">Actual Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {visits.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      No visits recorded for this participant.
                    </td>
                  </tr>
                ) : (
                  visits.map(v => (
                    <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{v.visitType || 'Visit'}</td>
                      <td className="px-6 py-4 text-slate-500">{v.scheduledDate || '—'}</td>
                      <td className="px-6 py-4 text-slate-800">{v.actualDate || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          (v.visitStatus||'').toUpperCase() === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
                          (v.visitStatus||'').toUpperCase() === 'MISSED' ? 'bg-red-50 text-red-600 border border-red-200' : 
                          'bg-yellow-50 text-yellow-600 border border-yellow-200'
                        }`}>
                          {v.visitStatus || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDetail;
