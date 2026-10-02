import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      setError('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const { overview, departmentWise, recentComplaints } = stats;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Overview of all complaints and system activity</p>
        </div>
        <Link to="/admin/complaints" className="btn-primary">
          View All Complaints
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-number">{overview.totalComplaints}</span>
            <span className="stat-label">Total Complaints</span>
          </div>
        </div>
        <div className="stat-card stat-open">
          <div className="stat-icon">🔴</div>
          <div className="stat-info">
            <span className="stat-number">{overview.open}</span>
            <span className="stat-label">Open</span>
          </div>
        </div>
        <div className="stat-card stat-progress">
          <div className="stat-icon">🔵</div>
          <div className="stat-info">
            <span className="stat-number">{overview.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card stat-resolved">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <span className="stat-number">{overview.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
        <div className="stat-card stat-closed">
          <div className="stat-icon">⚪</div>
          <div className="stat-info">
            <span className="stat-number">{overview.closed}</span>
            <span className="stat-label">Closed</span>
          </div>
        </div>
        <div className="stat-card stat-users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-number">{overview.totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
      </div>

      {/* Department-wise Breakdown */}
      {departmentWise && departmentWise.length > 0 && (
        <div className="section-card">
          <h3>Department-wise Breakdown</h3>
          <div className="dept-table-wrapper">
            <table className="dept-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total</th>
                  <th>Open</th>
                  <th>In Progress</th>
                  <th>Resolved</th>
                </tr>
              </thead>
              <tbody>
                {departmentWise.map((dept, index) => (
                  <tr key={index}>
                    <td>
                      <span className="dept-name">{dept.department}</span>
                      <span className="dept-code">{dept.code}</span>
                    </td>
                    <td><span className="badge badge-total">{dept.total}</span></td>
                    <td><span className="badge badge-open">{dept.open}</span></td>
                    <td><span className="badge badge-progress">{dept.inProgress}</span></td>
                    <td><span className="badge badge-resolved">{dept.resolved}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Complaints */}
      <div className="section-card">
        <div className="section-header">
          <h3>Recent Complaints</h3>
          <Link to="/admin/complaints" className="link-view-all">View All →</Link>
        </div>
        {recentComplaints && recentComplaints.length > 0 ? (
          <div className="complaints-grid">
            {recentComplaints.map(complaint => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <p className="empty-text">No complaints filed yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
