import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrials = async () => {
      try {
        const response = await api.get('/api/trails?size=1000');
        setTrials(response.data.content || response.data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trials', error);
        setLoading(false);
      }
    };
    fetchTrials();
  }, []);

  const totalStudies = trials.length;
  const activeStudies = trials.filter(t => t.status === 'Active' || t.status === 'ACTIVE').length;
  const completedStudies = trials.filter(t => t.status === 'Completed' || t.status === 'COMPLETED').length;

  const statusData = [
    { name: 'Active', value: activeStudies, color: '#3b82f6' },
    { name: 'Completed', value: completedStudies, color: '#10b981' },
    { name: 'Pending', value: trials.filter(t => t.status === 'Pending' || t.status === 'PENDING').length, color: '#f59e0b' }
  ].filter(d => d.value > 0);

  const recruitmentData = [
    { name: 'Jan', count: 120 },
    { name: 'Feb', count: 180 },
    { name: 'Mar', count: 240 },
    { name: 'Apr', count: 210 },
    { name: 'May', count: 280 },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight uppercase drop-shadow-sm">Super Admin / Leadership Dashboard</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium">Total Studies</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{totalStudies}</p>
        </div>
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium">Active Studies</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{activeStudies}</p>
        </div>
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium">Completed Studies</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{completedStudies}</p>
        </div>
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium">Delayed Studies</p>
          <p className="text-3xl font-bold text-red-600 mt-2">2</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200 shadow-sm flex flex-col justify-between">
          <p className="text-emerald-700 text-sm font-medium">Recruitment %</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">74%</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Study Status Pie Chart */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm col-span-1">
          <h3 className="text-sm font-medium text-slate-800 mb-4">Study Status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                  itemStyle={{ color: '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 mt-2">
             {statusData.map((item) => (
               <div key={item.name} className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                   <span className="text-slate-700">{item.name}</span>
                 </div>
                 <span className="font-semibold text-slate-900">{item.value}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Recruitment Bar Chart */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm col-span-1">
          <h3 className="text-sm font-medium text-slate-800 mb-4">Recruitment Overview</h3>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruitmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 High-Risk Studies */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm col-span-1">
          <h3 className="text-sm font-medium text-slate-800 mb-4">Top High-Risk Studies</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-xs text-slate-500">
              <span>Study ID</span>
              <span>Risk Level</span>
            </div>
            
            {trials.slice(0, 4).map((trial, i) => (
              <div 
                key={trial.id} 
                className="flex justify-between items-center text-sm cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                onClick={() => navigate(`/dashboard/trials/${trial.id}`)}
              >
                <span className="text-slate-800 font-medium">{trial.protocol_no}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  i === 0 ? 'bg-red-50 text-red-600' : 
                  i === 1 ? 'bg-orange-50 text-orange-600' : 
                  'bg-yellow-50 text-yellow-600'
                }`}>
                  {i === 0 ? 'High' : i === 1 ? 'High' : 'Medium'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
