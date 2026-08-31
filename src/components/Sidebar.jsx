import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FlaskConical, 
  Building2, 
  Users, 
  UserSquare2, 
  BarChart3, 
  CalendarDays, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  HeartPulse, 
  FileWarning, 
  Activity, 
  ClipboardCheck, 
  FolderOpen, 
  Shield, 
  UsersRound, 
  Settings, 
  PanelLeftClose,
  Leaf
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-emerald-500/10 text-emerald-400 font-medium'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
    }`;

  const activeDashboard = location.pathname === '/dashboard';

  return (
    <aside className="w-64 bg-[#0f172a] h-screen flex flex-col border-r border-slate-800 text-slate-300">
      {/* Logo Area */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/50 mb-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
          <Leaf size={20} className="text-slate-900" />
        </div>
        <div>
          <h1 className="font-extrabold text-white text-lg tracking-wider leading-none">TRACEERA</h1>
          <p className="text-[10px] text-emerald-400 tracking-widest font-semibold mt-0.5">AIIA CTMS</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-6 space-y-5">
        
        {/* Main Dashboard Link */}
        <div className="px-2">
          <NavLink to="/dashboard" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeDashboard ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Home size={18} /> Dashboard
          </NavLink>
        </div>

        {/* Portfolio Management */}
        <div>
          <div className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Portfolio Management</div>
          <NavLink to="/dashboard/clinical-trials" className={navLinkClass}><FlaskConical size={16} /> Clinical Trials</NavLink>
          <NavLink to="/dashboard/sites" className={navLinkClass}><Building2 size={16} /> Sites</NavLink>
          <NavLink to="/dashboard/investigators" className={navLinkClass}><UserSquare2 size={16} /> Investigators</NavLink>
          <NavLink to="/dashboard/participants" className={navLinkClass}><Users size={16} /> Participants</NavLink>
        </div>

        {/* Operations */}
        <div>
          <div className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operations</div>
          <NavLink to="/dashboard/recruitment" className={navLinkClass}><BarChart3 size={16} /> Recruitment Overview</NavLink>
          <NavLink to="/dashboard/milestones" className={navLinkClass}><CalendarDays size={16} /> Milestones & Timelines</NavLink>
          <NavLink to="/dashboard/monitoring" className={navLinkClass}><Eye size={16} /> Monitoring</NavLink>
          <NavLink to="/dashboard/data-quality" className={navLinkClass}><ShieldCheck size={16} /> Data Quality</NavLink>
          <NavLink to="/dashboard/deviations" className={navLinkClass}><AlertTriangle size={16} /> Protocol Deviations</NavLink>
        </div>

        {/* Safety */}
        <div>
          <div className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Safety (NPWCC)</div>
          <NavLink to="/dashboard/pharmacovigilance" className={navLinkClass}><HeartPulse size={16} /> Pharmacovigilance</NavLink>
          <NavLink to="/dashboard/ae-reports" className={navLinkClass}><FileWarning size={16} /> AE / SAE Reports</NavLink>
          <NavLink to="/dashboard/safety-signals" className={navLinkClass}><Activity size={16} /> Safety Signals</NavLink>
        </div>

        {/* Compliance */}
        <div>
          <div className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compliance</div>
          <NavLink to="/dashboard/ethics" className={navLinkClass}><ClipboardCheck size={16} /> Ethics & CTRI Tracker</NavLink>
          <NavLink to="/dashboard/documents" className={navLinkClass}><FolderOpen size={16} /> Documents</NavLink>
          <NavLink to="/dashboard/audit" className={navLinkClass}><Shield size={16} /> Audit Trail</NavLink>
        </div>

        {/* Administration */}
        <div>
          <div className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Administration</div>
          <NavLink to="/dashboard/users" className={navLinkClass}><UsersRound size={16} /> Users & Roles</NavLink>
          <NavLink to="/dashboard/settings" className={navLinkClass}><Settings size={16} /> System Settings</NavLink>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/80">
        <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors w-full px-2">
          <PanelLeftClose size={18} /> Collapse
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
