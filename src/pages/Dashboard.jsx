import { useState, useEffect } from 'react';
import { 
  FlaskConical, Building2, UsersRound, UserSquare2, ShieldCheck, CalendarX2, 
  TrendingUp, Clock, AlertTriangle, CalendarDays, FileWarning, Search, Filter,
  Eye, MoreVertical
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import api from '../api';

const Dashboard = () => {
  const [trials, setTrials] = useState([]);
  const [patients, setPatients] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trialsRes, patientsRes, sitesRes] = await Promise.all([
          api.get('/api/trails?size=1000'),
          api.get('/api/patients?size=1000'),
          api.get('/api/sites?size=1000')
        ]);
        setTrials(trialsRes.data.content || trialsRes.data);
        setPatients(patientsRes.data.content || patientsRes.data);
        setSites(sitesRes.data.content || sitesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Real Data Calculations
  const totalTrials = trials.length;
  const activeTrials = trials.filter(t => (t.status || '').toUpperCase() === 'ACTIVE').length;
  const totalPatients = patients.length;
  const totalSites = sites.length;
  const activePercent = totalTrials > 0 ? Math.round((activeTrials / totalTrials) * 100) : 0;

  // Trial Status Donut Data
  const statusCounts = trials.reduce((acc, trial) => {
    const s = (trial.status || 'UNKNOWN').toUpperCase();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  
  const statusColors = {
    ACTIVE: '#10b981', // green
    'NOT YET STARTED': '#f59e0b', // yellow
    PENDING: '#f59e0b', // yellow
    RECRUITING: '#3b82f6', // blue
    PAUSED: '#8b5cf6', // purple
    CLOSED: '#ef4444' // red
  };

  const statusPieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
    color: statusColors[status] || '#94a3b8'
  }));

  // Mock Recruitment Donut Data (since API doesn't have these specific stages yet)
  const recruitmentPieData = [
    { name: 'Enrolled', value: totalPatients, color: '#3b82f6' },
    { name: 'Screening', value: Math.round(totalPatients * 0.4), color: '#10b981' },
    { name: 'Screen Failed', value: Math.round(totalPatients * 0.1), color: '#facc15' },
    { name: 'Pending Enrollment', value: Math.round(totalPatients * 0.05), color: '#ef4444' }
  ];

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      
      {/* Top Row: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Clinical Trials */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <FlaskConical size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Clinical Trials</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{totalTrials}</p>
            </div>
          </div>
          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-2">
            <TrendingUp size={14} /> 3 new this month
          </p>
        </div>

        {/* Card 2: Active Trials */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Trials</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{activeTrials}</p>
            </div>
          </div>
          <p className="text-xs font-medium text-blue-500 mt-2">
            {activePercent}% of total
          </p>
        </div>

        {/* Card 3: Total Sites */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
              <UsersRound size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Sites</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{totalSites}</p>
            </div>
          </div>
          <p className="text-xs font-medium text-purple-600 flex items-center gap-1 mt-2">
            <TrendingUp size={14} /> 5 new this month
          </p>
        </div>

        {/* Card 4: Participants Enrolled */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
              <UserSquare2 size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Participants Enrolled</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{totalPatients}</p>
            </div>
          </div>
          <p className="text-xs font-medium text-orange-500 flex items-center gap-1 mt-2">
            <TrendingUp size={14} /> 12 this month
          </p>
        </div>

        {/* Card 5: Open AE / SAE */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-500 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Open AE / SAE</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">24</p>
            </div>
          </div>
          <p className="text-xs font-medium text-teal-600 mt-2">
            12 SAE | 12 AE
          </p>
        </div>

        {/* Card 6: Overdue Milestones */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
              <CalendarX2 size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Overdue Milestones</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">11</p>
            </div>
          </div>
          <p className="text-xs font-medium text-rose-500 mt-2">
            Requires attention
          </p>
        </div>
      </div>

      {/* Middle Row: Charts & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recruitment Overview Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-4">Recruitment Overview <span className="text-slate-400 font-normal">(Across All Trials)</span></h3>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={recruitmentPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                    {recruitmentPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-800">{totalPatients}</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase">Total Enrolled</span>
              </div>
            </div>
            <div className="w-1/2 pl-4 space-y-3">
              {recruitmentPieData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-slate-600 font-medium">{d.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-blue-600 bg-blue-50/50 p-2 rounded-md mt-4">
            <span>Targeted Participants: 6,000</span>
            <span>Overall Achievement: {Math.round((totalPatients / 6000) * 100)}%</span>
          </div>
        </div>

        {/* Trial Status Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-4">Trial Status Overview</h3>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 h-48 relative">
              {statusPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                      {statusPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No trials found</div>
              )}
              {statusPieData.length > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-800">{totalTrials}</span>
                  <span className="text-[10px] font-medium text-slate-500 uppercase">Total Trials</span>
                </div>
              )}
            </div>
            <div className="w-1/2 pl-4 space-y-3">
              {statusPieData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-slate-600 font-medium capitalize">{d.name.toLowerCase()}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone & Compliance Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-4">Milestone & Compliance Alerts</h3>
          <div className="flex-1 space-y-4">
            
            <div className="flex items-start justify-between group">
              <div className="flex gap-3">
                <div className="mt-0.5 text-orange-500"><Clock size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors cursor-pointer">CTRI Registration Due</p>
                  <p className="text-xs text-slate-500">Within next 30 days</p>
                </div>
              </div>
              <span className="text-orange-500 font-bold text-lg">05</span>
            </div>

            <div className="w-full h-px bg-slate-100"></div>

            <div className="flex items-start justify-between group">
              <div className="flex gap-3">
                <div className="mt-0.5 text-red-500"><AlertTriangle size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors cursor-pointer">Ethics Approval Expiring</p>
                  <p className="text-xs text-slate-500">Within next 30 days</p>
                </div>
              </div>
              <span className="text-red-500 font-bold text-lg">04</span>
            </div>

            <div className="w-full h-px bg-slate-100"></div>

            <div className="flex items-start justify-between group">
              <div className="flex gap-3">
                <div className="mt-0.5 text-purple-500"><CalendarDays size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors cursor-pointer">Monitoring Visits Overdue</p>
                  <p className="text-xs text-slate-500">Across 7 sites</p>
                </div>
              </div>
              <span className="text-purple-500 font-bold text-lg">06</span>
            </div>

            <div className="w-full h-px bg-slate-100"></div>

            <div className="flex items-start justify-between group">
              <div className="flex gap-3">
                <div className="mt-0.5 text-blue-500"><FileWarning size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors cursor-pointer">Overdue SAE Reporting</p>
                  <p className="text-xs text-slate-500">Beyond regulatory timelines</p>
                </div>
              </div>
              <span className="text-blue-500 font-bold text-lg">02</span>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Row: Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800 text-lg">Recent / Ongoing Trials</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search trials..."
                className="w-full sm:w-64 pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              View All
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[11px] text-slate-500 bg-white uppercase font-bold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-6 py-4">Trial ID</th>
                <th className="px-6 py-4">Trial Title</th>
                <th className="px-6 py-4">Phase</th>
                <th className="px-6 py-4">Therapeutic Area</th>
                <th className="px-6 py-4 text-center">Sites</th>
                <th className="px-6 py-4 text-center">Target</th>
                <th className="px-6 py-4 text-center">Enrolled</th>
                <th className="px-6 py-4 w-48">Progress</th>
                <th className="px-6 py-4 text-center">Overall Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trials.slice(0, 5).map((trial, idx) => {
                // Mock some data for the table to match the UI screenshot
                const target = 300 + (idx * 50);
                const enrolled = Math.min(target, Math.round(target * (Math.random() * 0.8 + 0.1)));
                const progressPct = Math.round((enrolled / target) * 100);
                const therapeuticArea = ['Mental Health', 'Immunology', 'Neurology', 'Musculoskeletal', 'Endocrinology'][idx % 5];
                
                return (
                  <tr key={trial.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{trial.protocol_no || `AIIA-CT-2024-00${idx+1}`}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{trial.title}</td>
                    <td className="px-6 py-4 text-slate-600">{trial.study_phase || `Phase ${idx % 3 + 1}`}</td>
                    <td className="px-6 py-4 text-slate-600">{therapeuticArea}</td>
                    <td className="px-6 py-4 text-center text-slate-600 font-medium">{Math.floor(Math.random() * 10) + 2}</td>
                    <td className="px-6 py-4 text-center text-slate-600 font-medium">{target}</td>
                    <td className="px-6 py-4 text-center text-slate-800 font-semibold">{enrolled} <span className="text-slate-400 font-normal text-xs">({progressPct}%)</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${progressPct > 80 ? 'bg-emerald-500' : progressPct > 40 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 w-8">{progressPct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        (trial.status||'').toUpperCase() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
                        (trial.status||'').toUpperCase() === 'COMPLETED' ? 'bg-blue-50 text-blue-600' : 
                        'bg-yellow-50 text-yellow-600'
                      }`}>
                        {trial.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <button className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"><Eye size={16} /></button>
                        <button className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
