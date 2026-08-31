import { useState, useEffect } from 'react';
import api from '../api';
import { Settings as SettingsIcon, Server, Database, Globe, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const SettingsPage = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [stats, setStats] = useState({ trials: 0, patients: 0, sites: 0 });

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const [trialsRes, patientsRes, sitesRes] = await Promise.all([
          api.get('/api/trails?size=1000'),
          api.get('/api/patients?size=1000'),
          api.get('/api/sites?size=1000'),
        ]);
        const trials   = trialsRes.data.content   || trialsRes.data;
        const patients = patientsRes.data.content || patientsRes.data;
        const sites    = sitesRes.data.content    || sitesRes.data;
        setStats({ trials: trials.length, patients: patients.length, sites: sites.length });
        setBackendStatus('online');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  const apiEndpoints = [
    { method: 'GET', path: '/api/trails', description: 'List all clinical trials (paginated)' },
    { method: 'POST', path: '/api/trails', description: 'Create new trial(s)' },
    { method: 'GET', path: '/api/trails/{id}', description: 'Get a single trial by ID' },
    { method: 'PATCH', path: '/api/trails/{id}', description: 'Update trial status/fields' },
    { method: 'GET', path: '/api/patients', description: 'List all participants (paginated)' },
    { method: 'POST', path: '/api/patients', description: 'Register a new patient' },
    { method: 'GET', path: '/api/patients/by-trial/{id}', description: 'Patients for a given trial' },
    { method: 'GET', path: '/api/sites', description: 'List all trial sites (paginated)' },
    { method: 'POST', path: '/api/sites', description: 'Register new site(s)' },
    { method: 'POST', path: '/api/adverse-events', description: 'Report adverse event / SAE' },
    { method: 'GET', path: '/api/adverse-events/by-patient/{id}', description: 'AEs for a patient' },
  ];

  const methodColor = (method) => {
    switch (method) {
      case 'GET':   return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'POST':  return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'PATCH': return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'DELETE':return 'bg-red-50 text-red-600 border border-red-200';
      default:      return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
        <SettingsIcon size={28} className="text-slate-700" /> System Settings & API Reference
      </h2>

      {/* System Status */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`bg-white rounded-lg p-5 border shadow-sm flex items-center gap-4 ${backendStatus === 'online' ? 'border-emerald-200' : 'border-red-200'}`}>
          <Server size={36} className={backendStatus === 'online' ? 'text-emerald-500' : 'text-red-500'} />
          <div>
            <p className="text-slate-500 text-sm font-medium">Backend API</p>
            <div className="flex items-center gap-2 mt-1">
              {backendStatus === 'checking' && <RefreshCw size={16} className="animate-spin text-yellow-500" />}
              {backendStatus === 'online'   && <CheckCircle size={16} className="text-emerald-500" />}
              {backendStatus === 'offline'  && <XCircle size={16} className="text-red-500" />}
              <span className={`text-sm font-semibold capitalize ${backendStatus === 'online' ? 'text-emerald-600' : backendStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'}`}>
                {backendStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{import.meta.env.VITE_API_URL || 'http://localhost:8081'}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <Database size={36} className="text-blue-500" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Database</p>
            <p className="text-base font-semibold text-slate-800 mt-1">Live Database</p>
            <p className="text-xs text-slate-500">Connected to Cloud</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <Globe size={36} className="text-purple-500" />
          <div>
            <p className="text-slate-500 text-sm font-medium">Frontend</p>
            <p className="text-base font-semibold text-slate-800 mt-1">React + Vite</p>
            <p className="text-xs text-slate-500">http://localhost:5173</p>
          </div>
        </div>
      </div>

      {/* Live Data Counts */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Live Database Counts</h3>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Clinical Trials', value: stats.trials, color: 'text-blue-600' },
            { label: 'Participants', value: stats.patients, color: 'text-emerald-600' },
            { label: 'Trial Sites', value: stats.sites, color: 'text-purple-600' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center bg-slate-50 rounded-lg p-4 border border-slate-100">
              <span className={`text-4xl font-bold ${s.color}`}>{s.value}</span>
              <span className="text-slate-500 text-sm mt-1 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Endpoint Reference */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Available API Endpoints</h3>
          <p className="text-xs text-slate-500 mt-1">Base URL: <code className="text-emerald-600 font-semibold">{import.meta.env.VITE_API_URL || 'http://localhost:8081'}</code></p>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Method</th>
              <th className="px-6 py-3 font-semibold">Path</th>
              <th className="px-6 py-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {apiEndpoints.map((ep, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-[11px] font-bold font-mono ${methodColor(ep.method)}`}>{ep.method}</span>
                </td>
                <td className="px-6 py-3 font-mono text-slate-700 text-xs">{ep.path}</td>
                <td className="px-6 py-3 text-slate-600">{ep.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stack Info */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Technology Stack</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Backend Framework', value: 'Spring Boot 4.1 (Java 17)' },
            { label: 'ORM', value: 'Spring Data JPA + Hibernate' },
            { label: 'Database', value: 'H2 In-Memory (dev) / PostgreSQL (prod)' },
            { label: 'Frontend Framework', value: 'React 19 + Vite 5' },
            { label: 'Styling', value: 'Tailwind CSS v4' },
            { label: 'Charts', value: 'Recharts' },
            { label: 'CORS', value: 'Global CORS config (origins: 5173, 3000)' },
            { label: 'API Style', value: 'REST / JSON' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">{item.label}</span>
              <span className="text-slate-700 font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
