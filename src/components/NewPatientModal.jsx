import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '../api';

const NewPatientModal = ({ isOpen, onClose, onSuccess, prefilledTrialId = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    uhid: '',
    patient_code: '',
    trial: prefilledTrialId ? { id: prefilledTrialId } : null,
    site: null,
    age: '',
    gender: '',
    randomization_arm: '',
    enrollment_date: '',
    status: 'SCREENED',
    consentStatus: 'PENDING',
    consentDate: '',
    withdrawalReason: ''
  });

  const [trials, setTrials] = useState([]);
  const [sites, setSites] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For searchable Trial dropdown
  const [trialSearch, setTrialSearch] = useState('');
  const [isTrialDropdownOpen, setIsTrialDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (!prefilledTrialId) {
        setTrialSearch('');
      }
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [trialsRes, sitesRes] = await Promise.all([
        api.get('/api/trails?size=1000'),
        api.get('/api/sites?size=1000')
      ]);
      
      const fetchedTrials = trialsRes.data.content || trialsRes.data;
      setTrials(fetchedTrials);
      setSites(sitesRes.data.content || sitesRes.data);

      if (prefilledTrialId) {
        const found = fetchedTrials.find(t => t.id === prefilledTrialId);
        if (found) setTrialSearch(`${found.protocol_no} - ${found.title}`);
      }
    } catch (err) {
      console.error('Error fetching dropdowns:', err);
      setError('Failed to load trials and sites for dropdowns.');
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, id) => {
    setFormData((prev) => ({
      ...prev,
      [name]: id ? { id } : null
    }));
  };

  const handleTrialSelect = (trial) => {
    setTrialSearch(`${trial.protocol_no} - ${trial.title}`);
    handleDropdownChange('trial', trial.id);
    handleDropdownChange('site', ''); // reset site
    setIsTrialDropdownOpen(false);
  };

  const filteredTrials = trials.filter(t => 
    (t.protocol_no || '').toLowerCase().includes(trialSearch.toLowerCase()) || 
    (t.title || '').toLowerCase().includes(trialSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.uhid || !formData.patient_code || !formData.trial || !formData.site || !formData.enrollment_date) {
      setError('Name, UHID, Patient Code, Trial, Site, and Enrollment Date are required.');
      setLoading(false);
      return;
    }

    const payload = { ...formData };
    payload.age = payload.age ? parseInt(payload.age, 10) : 0;
    if (!payload.consentDate) payload.consentDate = null;
    if (!payload.enrollment_date) payload.enrollment_date = null;

    try {
      await api.post('/api/patients', payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating patient:', err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to create new patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Add New Participant</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {loadingData ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <form id="new-patient-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                
                {/* Personal Info */}
                <div className="col-span-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Participant Details</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      min="0"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Identifiers */}
                <div className="col-span-2 mt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Identifiers & Grouping</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">UHID <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="uhid"
                    required
                    value={formData.uhid}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="e.g., UHID-100234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Patient Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="patient_code"
                    required
                    value={formData.patient_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="e.g., P-001"
                  />
                </div>

                <div className="col-span-2 md:col-span-1 relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Clinical Trial <span className="text-red-500">*</span></label>
                  
                  <input
                    type="text"
                    required
                    disabled={!!prefilledTrialId}
                    value={trialSearch}
                    onChange={(e) => {
                      setTrialSearch(e.target.value);
                      setIsTrialDropdownOpen(true);
                      if (formData.trial) {
                        handleDropdownChange('trial', '');
                        handleDropdownChange('site', '');
                      }
                    }}
                    onFocus={() => setIsTrialDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsTrialDropdownOpen(false), 200)}
                    placeholder="Search by ID or Title..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  
                  {isTrialDropdownOpen && !prefilledTrialId && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredTrials.length > 0 ? (
                        filteredTrials.map(t => (
                          <div 
                            key={t.id} 
                            onClick={() => handleTrialSelect(t)}
                            className="px-3 py-2 text-sm hover:bg-purple-50 cursor-pointer border-b border-slate-50 last:border-0"
                          >
                            <span className="font-semibold text-slate-800">{t.protocol_no}</span>
                            <span className="text-slate-500 block text-xs truncate">{t.title}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-sm text-slate-500 text-center">No trials found</div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Trial Site <span className="text-red-500">*</span></label>
                  <select
                    name="site"
                    required
                    value={formData.site?.id || ''}
                    onChange={(e) => handleDropdownChange('site', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500"
                    disabled={!formData.trial?.id}
                  >
                    {formData.trial?.id && sites.filter(s => s.trial?.id === formData.trial?.id || s.trialId === formData.trial?.id).length === 0 ? (
                      <option value="" disabled>No sites assigned to this trial</option>
                    ) : (
                      <option value="">{formData.trial?.id ? 'Select Site...' : 'Please select a Trial first'}</option>
                    )}
                    {sites
                      .filter(s => s.trial?.id === formData.trial?.id || s.trialId === formData.trial?.id)
                      .map(s => (
                        <option key={s.id} value={s.id}>{s.site_name}</option>
                      ))}
                  </select>
                </div>

                {/* Status & Compliance */}
                <div className="col-span-2 mt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Status & Compliance</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Enrollment Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="enrollment_date"
                    required
                    value={formData.enrollment_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Patient Status <span className="text-red-500">*</span></label>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    <option value="SCREENED">Screened</option>
                    <option value="ENROLLED">Enrolled</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Consent Status <span className="text-red-500">*</span></label>
                  <select
                    name="consentStatus"
                    required
                    value={formData.consentStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="GIVEN">Given</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Consent Date</label>
                  <input
                    type="date"
                    name="consentDate"
                    value={formData.consentDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                
                {formData.status === 'WITHDRAWN' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Withdrawal Reason</label>
                    <textarea
                      name="withdrawalReason"
                      value={formData.withdrawalReason}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      placeholder="Reason for withdrawal..."
                    ></textarea>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Randomization Arm</label>
                  <input
                    type="text"
                    name="randomization_arm"
                    value={formData.randomization_arm}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="e.g., Placebo or Treatment A"
                  />
                </div>

              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            form="new-patient-form"
            type="submit" 
            disabled={loading || loadingData}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {loading ? 'Saving...' : 'Save Participant'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewPatientModal;
