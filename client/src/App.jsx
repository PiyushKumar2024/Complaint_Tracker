import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './components/LoadingState';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FileComplaint from './pages/FileComplaint';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AllComplaints from './pages/AllComplaints';
import ComplaintDetails from './pages/ComplaintDetails';
import UserManagement from './pages/UserManagement';
import AccountSettings from './pages/AccountSettings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

const DashboardRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingState label="Loading your account..." />;
  if (!user) return <LandingPage />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'staff') return <Navigate to="/staff" replace />;
  return <StudentDashboard />;
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<DashboardRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
                <Route path="/file-complaint" element={<ProtectedRoute><FileComplaint /></ProtectedRoute>} />
                <Route path="/complaint/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
                <Route
                  path="/staff"
                  element={<ProtectedRoute allowedRoles={['staff', 'admin']}><StaffDashboard /></ProtectedRoute>}
                />
                <Route
                  path="/admin"
                  element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
                />
                <Route
                  path="/admin/complaints"
                  element={<ProtectedRoute allowedRoles={['admin']}><AllComplaints /></ProtectedRoute>}
                />
                <Route
                  path="/admin/users"
                  element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
