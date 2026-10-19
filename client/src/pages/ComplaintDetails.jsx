import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import TimelineView from '../components/TimelineView';
import './ComplaintDetails.css';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await api.get(`/complaints/${id}`);
      setComplaint(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'detail-status-open';
      case 'In Progress': return 'detail-status-progress';
      case 'Resolved': return 'detail-status-resolved';
      case 'Closed': return 'detail-status-closed';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent': return 'detail-priority-urgent';
      case 'High': return 'detail-priority-high';
      case 'Medium': return 'detail-priority-medium';
      case 'Low': return 'detail-priority-low';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Loading complaint details...</div>;
  if (error) return (
    <div className="detail-error-container">
      <div className="error-message">{error}</div>
      <button onClick={() => navigate(-1)} className="btn-back">← Go Back</button>
    </div>
  );
  if (!complaint) return null;

  return (
    <div className="complaint-details">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn-back">← Back</button>

      {/* Header */}
      <div className="detail-header">
        <div className="detail-header-left">
          <h2>{complaint.title}</h2>
          <div className="detail-badges">
            <span className={`detail-badge ${getStatusClass(complaint.status)}`}>
              {complaint.status}
            </span>
            <span className={`detail-badge ${getPriorityClass(complaint.priority)}`}>
              {complaint.priority} Priority
            </span>
            <span className="detail-badge detail-category">{complaint.category}</span>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Main Content */}
        <div className="detail-main">
          {/* Description */}
          <div className="detail-section">
            <h3>Description</h3>
            <p className="detail-description">{complaint.description}</p>
          </div>

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="detail-section">
              <h3>Attachments</h3>
              <div className="attachments-list">
                {complaint.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={`http://localhost:5000${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    📎 Attachment {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {complaint.location && (complaint.location.address || complaint.location.city) && (
            <div className="detail-section">
              <h3>Location</h3>
              <p className="detail-location">
                {[complaint.location.address, complaint.location.city, complaint.location.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="detail-section">
            <h3>Timeline</h3>
            <TimelineView timeline={complaint.timeline} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          {/* Info Card */}
          <div className="sidebar-card">
            <h4>Details</h4>
            <div className="sidebar-item">
              <span className="sidebar-label">Filed By</span>
              <span className="sidebar-value">{complaint.filedBy?.name || 'Unknown'}</span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-label">Email</span>
              <span className="sidebar-value">{complaint.filedBy?.email || 'N/A'}</span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-label">Department</span>
              <span className="sidebar-value">{complaint.department?.name || 'N/A'}</span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-label">Assigned To</span>
              <span className="sidebar-value">{complaint.assignedTo?.name || 'Unassigned'}</span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-label">Filed On</span>
              <span className="sidebar-value">
                {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-label">Last Updated</span>
              <span className="sidebar-value">
                {new Date(complaint.updatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
