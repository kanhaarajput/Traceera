import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '../api';

const NewTrialModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    protocol_no: '',
    trail_code: '',
    study_phase: '',
    sponsor_team: '',
    status: 'Planned',
    target_patient: 1,
    start_date: '',
    expected_end_date: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields based on backend @NotNull annotations
    if (!formData.title || !formData.protocol_no || !formData.trail_code || formData.target_patient < 1) {
      setError('Title, Protocol No, Trial Code, and Target Patients (>0) are required.');
      setLoading(false);
      return;
    }
    const payload = { ...formData };
    if (!payload.start_date) payload.start_date = null;
    if (!payload.expected_end_date) payload.expected_end_date = null;
    payload.target_patient = parseInt(payload.target_patient, 10) || 1;

    try {
      await api.post('/api/trails', [payload]);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating trial:', err);
      setError(err.response?.data?.message || 'Failed to create new clinical trial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Create New Clinical Trial</h2>
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

          <form id="new-trial-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Trial Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="e.g., Ashwagandha in Stress Management"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Protocol Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="protocol_no"
                  required
                  value={formData.protocol_no}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="e.g., AIIA-CT-2026-001"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Trial Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="trail_code"
                  required
                  value={formData.trail_code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="e.g., ASHWA-001"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Study Phase <span className="text-red-500">*</span></label>
                <select
                  name="study_phase"
                  required
                  value={formData.study_phase}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="">Select Phase...</option>
                  <option value="Phase I">Phase I</option>
                  <option value="Phase II">Phase II</option>
                  <option value="Phase III">Phase III</option>
                  <option value="Phase IV">Phase IV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Sponsor Team</label>
                <input
                  type="text"
                  name="sponsor_team"
                  value={formData.sponsor_team}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="e.g., Dept of Neurology"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Initial Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="Planned">Planned</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rejected">Rejected</option>
                </select>
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
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Target Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Expected End Date</label>
                <input
                  type="date"
                  name="expected_end_date"
                  value={formData.expected_end_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Trial Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                  placeholder="Brief summary of the clinical trial objectives..."
                ></textarea>
              </div>

            </div>
          </form>
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
            form="new-trial-form"
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {loading ? 'Creating...' : 'Create Trial'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewTrialModal;
