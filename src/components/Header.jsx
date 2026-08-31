import { Bell, Search, ShieldCheck, CheckCircle, Zap, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Protocol ID, Patient..." 
            className="bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-72 text-slate-800 placeholder-slate-400 transition-shadow"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1"><ShieldCheck size={16} className="text-blue-500"/> Secure</div>
          <div className="flex items-center gap-1"><CheckCircle size={16} className="text-emerald-500"/> Compliant</div>
          <div className="flex items-center gap-1"><Zap size={16} className="text-amber-500"/> Intelligent</div>
        </div>
        
        <div className="h-6 w-px bg-slate-200"></div>
        
        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-blue-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold border border-white">3</span>
          </button>
          <button className="hover:text-blue-600 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
