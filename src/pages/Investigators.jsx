import { useState, useEffect } from 'react';
import { UserSquare2, Search, MapPin, Mail, Phone, BookOpen, RefreshCw } from 'lucide-react';
import api from '../api';

const Investigators = () => {
  const [investigators, setInvestigators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInvestigators = async () => {
      try {
        const response = await api.get('/api/sites?size=1000');
        const sites = response.data.content || response.data || [];
        
        // Group by investigator to create unique profiles
        const invMap = {};
        sites.forEach(site => {
          if (site.investigator && site.investigator !== 'N/A') {
            if (!invMap[site.investigator]) {
              invMap[site.investigator] = {
                name: site.investigator,
                sites: [],
                totalTarget: 0,
                totalRecruited: 0,
              };
            }
            invMap[site.investigator].sites.push(site);
            invMap[site.investigator].totalTarget += site.target_patient || 0;
            invMap[site.investigator].totalRecruited += site.recruited_patient || 0;
          }
        });

        setInvestigators(Object.values(invMap));
      } catch (error) {
        console.error('Error fetching investigators:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestigators();
  }, []);

  const filtered = investigators.filter(inv => 
    inv.name.toLowerCase().includes(search.toLowerCase()) ||
    inv.sites.some(s => s.location.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="flex h-full items-center justify-center"><RefreshCw className="animate-spin text-emerald-500 mr-2" /> Loading investigators...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <UserSquare2 size={28} className="text-slate-800" /> Investigators Directory
        </h2>
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search investigators or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
          No investigators found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((inv, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold text-slate-400 shrink-0">
                  {inv.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 leading-tight">{inv.name}</h3>
                  <p className="text-xs font-semibold text-emerald-600 tracking-wider uppercase mt-1">Principal Investigator</p>
                  <div className="flex gap-3 mt-3 text-slate-400 text-xs">
                    <button className="hover:text-slate-700 transition-colors"><Mail size={16} /></button>
                    <button className="hover:text-slate-700 transition-colors"><Phone size={16} /></button>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><MapPin size={14}/> Assigned Sites</p>
                <div className="space-y-3">
                  {inv.sites.map(site => (
                    <div key={site.id} className="bg-white border border-slate-200 rounded-md p-3 text-sm flex justify-between items-center shadow-sm">
                      <div>
                        <p className="font-semibold text-slate-700">{site.site_name}</p>
                        <p className="text-xs text-slate-500">{site.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${site.siteStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {site.siteStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 bg-white flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                  <BookOpen size={16} className="text-blue-500"/>
                  <span className="font-medium">Total Enrollment</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800">{inv.totalRecruited}</span>
                  <span className="text-xs text-slate-400 font-medium"> / {inv.totalTarget}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Investigators;
