import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      // Staff can access all complaints through admin route; filter client-side by assigned
      const res = await api.get('/admin/complaints');
      const allComplaints = res.data.data;
      // Filter to show only complaints assigned to this staff member
      const assigned = allComplaints.filter(
        c => c.assignedTo && c.assignedTo._id === user._id
      );
      setComplaints(assigned);
    } catch (err) {
      setError('Failed to fetch assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = filter === 'All'
    ? complaints
    : complaints.filter(c => c.status === filter);

  // Count by status for quick stats
  const statusCounts = {
    open: complaints.filter(c => c.status === 'Open').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    closed: complaints.filter(c => c.status === 'Closed').length,
  };

  if (loading) return <div className="loading">Loading your assignments...</div>;

  return (
    <div className="staff-dashboard">
      <div className="staff-header">
        <div>
          <h2>My Assigned Complaints</h2>
          <p>Manage complaints assigned to you</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Quick Stats */}
      <div className="staff-stats">
        <div className="staff-stat-item staff-stat-total">
          <span className="staff-stat-num">{complaints.length}</span>
          <span className="staff-stat-label">Total Assigned</span>
        </div>
        <div className="staff-stat-item staff-stat-open">
          <span className="staff-stat-num">{statusCounts.open}</span>
          <span className="staff-stat-label">Open</span>
        </div>
        <div className="staff-stat-item staff-stat-progress">
          <span className="staff-stat-num">{statusCounts.inProgress}</span>
          <span className="staff-stat-label">In Progress</span>
        </div>
        <div className="staff-stat-item staff-stat-resolved">
          <span className="staff-stat-num">{statusCounts.resolved}</span>
          <span className="staff-stat-label">Resolved</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
          <button
            key={status}
            className={`tab-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status}
            {status !== 'All' && (
              <span className="tab-count">
                {complaints.filter(c => c.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>
            {filter === 'All'
              ? 'No complaints assigned to you yet.'
              : `No ${filter.toLowerCase()} complaints.`}
          </p>
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map(complaint => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
