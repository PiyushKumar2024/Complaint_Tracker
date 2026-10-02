import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FileComplaint from './pages/FileComplaint';
import ProtectedRoute from './components/ProtectedRoute';

// Temporary placeholder for dashboards
const Home = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>Welcome to the Complaint Tracker</h2>
    <p>Please select an option from the menu.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Everyone logged in) */}
            <Route path="/" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/file-complaint" element={<ProtectedRoute><FileComplaint /></ProtectedRoute>} />
            
            {/* Staff/Admin Routes */}
            <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><Home /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Home /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
