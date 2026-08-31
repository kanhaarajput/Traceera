import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '../api';

const INDIAN_STATES_AND_CITIES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Rohtak"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Dharamshala", "Solan"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur"],
  "Meghalaya": ["Shillong", "Tura", "Nongstoin"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Dimapur", "Kohima", "Mokokchung"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Prayagraj"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol"]
};

const NewSiteModal = ({ isOpen, onClose, onSuccess, prefilledTrialId = null }) => {
  const [formData, setFormData] = useState({
    trial: prefilledTrialId ? { id: prefilledTrialId } : null,
    site_name: '',
    site_code: '',
    state: '',
    city: '',
    investigator: '',
    coordinatore: '',
    target_patient: 1,
    siteStatus: 'PLANNED'
  });

  const [trials, setTrials] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchTrials();
    }
  }, [isOpen]);

  const fetchTrials = async () => {
    try {
      setLoadingData(true);
      const res = await api.get('/api/trails?size=1000');
      setTrials(res.data.content || res.data);
    } catch (err) {
      console.error('Error fetching trials:', err);
      setError('Failed to load clinical trials.');
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'state') {
        updated.city = ''; // Reset city when state changes
      }
      return updated;
    });
  };

  const handleDropdownChange = (name, id) => {
    setFormData((prev) => ({
      ...prev,
      [name]: id ? { id } : null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.trial || !formData.site_name || !formData.site_code || !formData.state || !formData.city || formData.target_patient < 1) {
      setError('Trial, Site Name, Code, State, City, and Target Patients (>0) are required.');
      setLoading(false);
      return;
    }

    const payload = {
      trial: formData.trial,
      site_name: formData.site_name,
      site_code: formData.site_code,
      location: `${formData.city}, ${formData.state}`,
      investigator: formData.investigator,
      coordinatore: formData.coordinatore,
      target_patient: parseInt(formData.target_patient, 10),
      siteStatus: formData.siteStatus,
      recruited_patient: 0
    };

    try {
      await api.post('/api/sites', [payload]); // Backend expects List<TrialSite>
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating site:', err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to create new site.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Register New Trial Site</h2>
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
            <form id="new-site-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                
                {/* Assignment */}
                <div className="col-span-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Assignment</h3>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Clinical Trial <span className="text-red-500">*</span></label>
                  <select
                    required
                    disabled={!!prefilledTrialId}
                    value={formData.trial?.id || ''}
                    onChange={(e) => handleDropdownChange('trial', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="">Select Trial...</option>
                    {trials.map(t => (
                      <option key={t.id} value={t.id}>{t.protocol_no} - {t.title}</option>
                    ))}
                  </select>
                </div>

                {/* Site Details */}
                <div className="col-span-2 mt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Site Details</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Site Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="site_name"
                    required
                    value={formData.site_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="e.g., Apollo Hospitals"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Site Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="site_code"
                    required
                    value={formData.site_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="e.g., SITE-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">State <span className="text-red-500">*</span></label>
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    <option value="">Select State...</option>
                    {Object.keys(INDIAN_STATES_AND_CITIES).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">City <span className="text-red-500">*</span></label>
                  <select
                    name="city"
                    required
                    disabled={!formData.state}
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="">{formData.state ? 'Select City...' : 'Select State First'}</option>
                    {formData.state && INDIAN_STATES_AND_CITIES[formData.state]?.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Personnel & Metrics */}
                <div className="col-span-2 mt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">Personnel & Goals</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Principal Investigator</label>
                  <input
                    type="text"
                    name="investigator"
                    value={formData.investigator}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="e.g., Dr. Sharma"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Site Coordinator</label>
                  <input
                    type="text"
                    name="coordinatore"
                    value={formData.coordinatore}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="e.g., Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Target Patients <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="target_patient"
                    min="1"
                    required
                    value={formData.target_patient}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Site Status <span className="text-red-500">*</span></label>
                  <select
                    name="siteStatus"
                    required
                    value={formData.siteStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="PENDING">Pending Approval</option>
                    <option value="ACTIVE">Active</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
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
            form="new-site-form"
            type="submit" 
            disabled={loading || loadingData}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {loading ? 'Saving...' : 'Save Trial Site'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewSiteModal;
