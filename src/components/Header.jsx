import { useState, useRef, useEffect } from 'react';
import { Bell, HelpCircle, Menu, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import NewTrialModal from './NewTrialModal';

const getPageInfo = (pathname) => {
  if (pathname === '/dashboard') return { title: 'Administrator Dashboard', subtitle: 'Welcome back, Admin' };
  if (pathname.includes('/clinical-trials')) return { title: 'Clinical Trials', subtitle: 'Manage active and pending trials' };
  if (pathname.includes('/participants')) return { title: 'Participants', subtitle: 'Participant registry and profiles' };
  if (pathname.includes('/pharmacovigilance')) return { title: 'Pharmacovigilance', subtitle: 'Safety monitoring and signals' };
  if (pathname.includes('/ethics')) return { title: 'Ethics & CTRI Tracker', subtitle: 'Compliance and submissions' };
  if (pathname.includes('/audit')) return { title: 'Audit Trail', subtitle: 'System activity logs' };
  if (pathname.includes('/settings')) return { title: 'System Settings', subtitle: 'Configuration & API' };
  
  // Default parsing for other routes
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  const formattedTitle = last.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return { title: formattedTitle, subtitle: 'Module details' };
};

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header className="bg-white border-b border-slate-200 h-20 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
      
      {/* Left side: Menu toggle & Titles */}
      <div className="flex items-center gap-6">
        <button className="text-slate-500 hover:text-slate-700 transition-colors">
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{pageInfo.title}</h2>
          <p className="text-xs text-slate-500 font-medium">{pageInfo.subtitle}</p>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-6">
        
        {/* New Trial Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm shadow-emerald-500/20"
        >
          <Plus size={16} /> New Trial
        </button>

        <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                if (unreadCount > 0) markAllAsRead();
              }}
              className={`relative transition-colors ${showNotifMenu ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                  <span className="text-xs text-slate-500 font-medium">{notifications.length} updates</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      <Bell size={24} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">No recent notifications</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b border-slate-100 flex gap-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {n.type === 'success' ? <Check size={14} /> : <Bell size={14} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(n.time).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group" onClick={logout}>
          <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-white font-bold shadow-sm group-hover:ring-2 ring-slate-300 transition-all">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] text-slate-500 font-medium">{user?.role || 'Super Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
    <NewTrialModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSuccess={() => window.location.reload()} 
    />
    </>
  );
};

export default Header;
