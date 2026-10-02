import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data.data);
    } catch (err) {
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = filter === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  if (loading) return <div className="loading">Loading your complaints...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>My Complaints</h2>
          <p>Track and manage your filed complaints</p>
        </div>
        <Link to="/file-complaint" className="btn-primary">
          + File New Complaint
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-tabs">
        {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
          <button 
            key={status}
            className={`tab-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <p>No complaints found.</p>
          {filter === 'All' && (
            <Link to="/file-complaint" className="btn-secondary">
              File your first complaint
            </Link>
          )}
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

export default StudentDashboard;
