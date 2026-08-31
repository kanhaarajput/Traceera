import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, MapPin, Activity, CheckCircle, RefreshCw, Plus } from 'lucide-react';
import api from '../api';
import NewSiteModal from '../components/NewSiteModal';

const Sites = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/sites?size=1000');
      setSites(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const filteredSites = sites.filter(site => 
    (site.site_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (site.location || '').toLowerCase().includes(search.toLowerCase()) ||
    (site.site_code || '').toLowerCase().includes(search.toLowerCase())
  );

  const activeSites = sites.filter(s => (s.siteStatus || '').toUpperCase() === 'ACTIVE').length;

  if (loading) {
    return <div className="flex h-full items-center justify-center"><RefreshCw className="animate-spin text-emerald-500 mr-2" /> Loading sites...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <Building2 size={28} className="text-slate-800" /> Sites Management
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Site
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Total Sites</p>
            <p className="text-3xl font-extrabold text-slate-800">{sites.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Active Sites</p>
            <p className="text-3xl font-extrabold text-slate-800">{activeSites}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Activation Rate</p>
            <p className="text-3xl font-extrabold text-slate-800">{sites.length ? Math.round((activeSites / sites.length) * 100) : 0}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-800">Site Directory</h3>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, location or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[11px] text-slate-500 bg-white uppercase font-bold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-6 py-4">Site Code</th>
                <th className="px-6 py-4">Site Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Principal Investigator</th>
                <th className="px-6 py-4 text-center">Enrollment Progress</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.map((site) => {
                const progressPct = site.target_patient ? Math.round((site.recruited_patient / site.target_patient) * 100) : 0;
                return (
                  <tr 
                    key={site.id} 
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/sites/${site.id}`)}
                  >
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{site.site_code}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{site.site_name}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {site.location}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{site.investigator}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 w-48 mx-auto">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 flex-1">
                          <div 
                            className={`h-1.5 rounded-full ${progressPct > 80 ? 'bg-emerald-500' : progressPct > 40 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${Math.min(100, progressPct)}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 w-16 text-right">
                          {site.recruited_patient} / {site.target_patient}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        (site.siteStatus||'').toUpperCase() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {site.siteStatus || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredSites.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No sites match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <NewSiteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchSites} 
      />
    </div>
  );
};

export default Sites;
