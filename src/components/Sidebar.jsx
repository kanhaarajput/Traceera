import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Stethoscope, FileText, Activity, Users, Settings, User } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Investigator', path: '/dashboard/investigator', icon: <Stethoscope size={20} /> },
    { name: 'Ethics Committee', path: '/dashboard/ethics', icon: <FileText size={20} /> },
    { name: 'Pharmacovigilance', path: '/dashboard/pharmacovigilance', icon: <Activity size={20} /> },
    { name: 'Participants', path: '/dashboard/participants', icon: <Users size={20} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  const activeClass = 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-semibold';
  const inactiveClass = 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-slate-200">
        <img src="/logo.jpg" alt="Tracera Logo" className="w-8 h-8 rounded-md object-cover" />
        <div>
          <h1 className="font-bold text-xl tracking-tight text-slate-900">Tracera</h1>
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive ? activeClass : inactiveClass
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <User size={16} className="text-blue-700" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">Kanhaa Rajput</p>
            <p className="text-xs text-slate-500 truncate">kanhaa@tracera.org</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
