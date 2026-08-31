import { useState, useEffect } from 'react';
import { Shield, Clock, Search, FileText, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../api';

const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('ALL'); // ALL, UPDATED_TRIALS, BY_TRIAL
  const [trialIdSearch, setTrialIdSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      let endpoint = '/api/audit-logs';
      
      if (viewMode === 'UPDATED_TRIALS') {
        endpoint = '/api/audit-logs/trials/updated';
      } else if (viewMode === 'BY_TRIAL' && trialIdSearch.trim()) {
        endpoint = `/api/audit-logs/Trial/${trialIdSearch.trim()}`;
      } else if (viewMode === 'BY_TRIAL') {
        setLogs([]);
        setLoading(false);
        return; // Wait for user to type ID
      }

      const res = await api.get(endpoint);
      const data = res.data.content || res.data || [];
      // Sort by timestamp descending
      const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];
      setLogs(sorted);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce the trial ID search slightly to avoid too many requests
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [viewMode, trialIdSearch]);

  const filteredLogs = logs.filter(log => 
    (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.changedBy || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.entityName || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.entityId || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    try {
      // Backend returns timestamps without a timezone (e.g. "2026-08-31T08:31:38.435902").
      // JavaScript parses ISO strings without 'Z' as LOCAL time. 
      // We append 'Z' to force UTC parsing so it converts to the user's correct local timezone.
      const utcString = ts.endsWith('Z') || ts.includes('+') ? ts : `${ts}Z`;
      const d = new Date(utcString);
      return d.toLocaleString('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      });
    } catch (e) {
      return ts;
    }
  };

  const getActionColor = (action) => {
    switch ((action || '').toUpperCase()) {
      case 'CREATE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UPDATE': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DELETE': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <Shield size={28} className="text-slate-800" /> System Audit Trail
        </h2>
        <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          <FileText size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 mr-auto bg-slate-100 p-1 rounded-md">
          <button 
            onClick={() => setViewMode('ALL')}
            className={`px-4 py-1.5 text-sm font-semibold rounded ${viewMode === 'ALL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All Logs
          </button>
          <button 
            onClick={() => setViewMode('UPDATED_TRIALS')}
            className={`px-4 py-1.5 text-sm font-semibold rounded ${viewMode === 'UPDATED_TRIALS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Updated Trials
          </button>
          <button 
            onClick={() => setViewMode('BY_TRIAL')}
            className={`px-4 py-1.5 text-sm font-semibold rounded ${viewMode === 'BY_TRIAL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            By Trial ID
          </button>
        </div>

        {viewMode === 'BY_TRIAL' && (
          <div className="relative w-full md:w-64 animate-fade-in">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Trial UUID..."
              value={trialIdSearch}
              onChange={(e) => setTrialIdSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search within results..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        
        <button onClick={fetchLogs} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-indigo-50">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          {loading && logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <RefreshCw className="animate-spin text-indigo-500 mb-2" size={24} />
              <p className="text-sm text-slate-500">Fetching audit logs...</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Entity Type</th>
                  <th className="px-6 py-3">Entity ID</th>
                  <th className="px-6 py-3">Performed By</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 font-mono text-[11px]">{formatTimestamp(log.timestamp)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionColor(log.action)}`}>
                        {log.action || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{log.entityName || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-[11px] select-all">{log.entityId || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-700 font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                        {(log.changedBy || '?').charAt(0).toUpperCase()}
                      </div>
                      {log.changedBy || 'System'}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="inline-flex flex-col items-center justify-center">
                        <Shield size={32} className="text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No matching audit logs found.</p>
                        {viewMode === 'BY_TRIAL' && !trialIdSearch && (
                          <p className="text-xs text-slate-400 mt-1">Please enter a Trial ID in the search box above.</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
