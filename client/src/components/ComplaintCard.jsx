import { Link } from 'react-router-dom';
import './ComplaintCard.css';

const ComplaintCard = ({ complaint }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#e67e22';
      case 'In Progress': return '#3498db';
      case 'Resolved': return '#2ecc71';
      case 'Closed': return '#7f8c8d';
      default: return '#95a5a6';
    }
  };

  const getPriorityBadge = (priority) => {
    const isHigh = priority === 'High' || priority === 'Critical';
    return (
      <span className={`priority-badge ${isHigh ? 'priority-high' : 'priority-normal'}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="complaint-card">
      <div className="card-header">
        <h3 className="card-title">{complaint.title}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(complaint.status) }}
        >
          {complaint.status}
        </span>
      </div>
      
      <div className="card-body">
        <p className="card-desc">
          {complaint.description.length > 100 
            ? `${complaint.description.substring(0, 100)}...` 
            : complaint.description}
        </p>
        
        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-label">Department:</span>
            <span className="meta-value">{complaint.department?.name || 'N/A'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Category:</span>
            <span className="meta-value">{complaint.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Filed On:</span>
            <span className="meta-value">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        {getPriorityBadge(complaint.priority)}
        <Link to={`/complaint/${complaint._id}`} className="btn-view">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ComplaintCard;
