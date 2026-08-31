import { UsersRound, Shield, Search, UserPlus } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@tracera.org', role: 'Super Administrator', status: 'Active', lastLogin: '2026-08-31 08:00' },
  { id: 2, name: 'Dr. Sarah Chen', email: 'schen@hospital.org', role: 'Principal Investigator', status: 'Active', lastLogin: '2026-08-30 14:22' },
  { id: 3, name: 'Jane Doe', email: 'jdoe@cro.com', role: 'Clinical Monitor', status: 'Active', lastLogin: '2026-08-31 09:15' },
  { id: 4, name: 'Robert Smith', email: 'rsmith@data.org', role: 'Data Manager', status: 'Inactive', lastLogin: '2026-07-15 11:40' },
];

const UsersRoles = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <UsersRound size={28} className="text-slate-800" /> Users & Roles
        </h2>
        <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          <UserPlus size={16} /> Invite User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Shield size={18} className="text-slate-500" /> Access Control
          </h3>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-slate-400 focus:ring-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[11px] text-slate-500 bg-white uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">{u.name}</td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{u.role}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-mono">{u.lastLogin}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersRoles;
