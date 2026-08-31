import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import InvestigatorDashboard from './pages/InvestigatorDashboard';
import EthicsDashboard from './pages/EthicsDashboard';
import PharmacovigilanceDashboard from './pages/PharmacovigilanceDashboard';
import ParticipantsDashboard from './pages/ParticipantsDashboard';
import TrialDetail from './pages/TrialDetail';
import PatientDetail from './pages/PatientDetail';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="investigator" element={<InvestigatorDashboard />} />
          <Route path="ethics" element={<EthicsDashboard />} />
          <Route path="pharmacovigilance" element={<PharmacovigilanceDashboard />} />
          <Route path="participants" element={<ParticipantsDashboard />} />
          <Route path="trials/:id" element={<TrialDetail />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
