import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PageStub from './pages/PageStub';
import AuditTrail from './pages/AuditTrail';
import Recruitment from './pages/Recruitment';
import Sites from './pages/Sites';
import Investigators from './pages/Investigators';
import AeReports from './pages/AeReports';
import Milestones from './pages/Milestones';
import Monitoring from './pages/Monitoring';
import DataQuality from './pages/DataQuality';
import Deviations from './pages/Deviations';
import SafetySignals from './pages/SafetySignals';
import Documents from './pages/Documents';
import UsersRoles from './pages/UsersRoles';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            
            {/* Portfolio Management */}
            <Route path="clinical-trials" element={<InvestigatorDashboard />} />
            <Route path="sites" element={<Sites />} />
            <Route path="investigators" element={<Investigators />} />
            <Route path="participants" element={<ParticipantsDashboard />} />
            
            {/* Operations */}
            <Route path="recruitment" element={<Recruitment />} />
            <Route path="milestones" element={<Milestones />} />
            <Route path="monitoring" element={<Monitoring />} />
            <Route path="data-quality" element={<DataQuality />} />
            <Route path="deviations" element={<Deviations />} />
            
            {/* Safety */}
            <Route path="pharmacovigilance" element={<PharmacovigilanceDashboard />} />
            <Route path="ae-reports" element={<AeReports />} />
            <Route path="safety-signals" element={<SafetySignals />} />
            
            {/* Compliance */}
            <Route path="ethics" element={<EthicsDashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="audit" element={<AuditTrail />} />
            
            {/* Administration */}
            <Route path="users" element={<UsersRoles />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Drill-downs */}
            <Route path="trials/:id" element={<TrialDetail />} />
            <Route path="patients/:id" element={<PatientDetail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
