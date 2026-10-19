import { useState } from 'react';
import api from '../services/api';
import './StatusUpdater.css';

const VALID_TRANSITIONS = {
  'Open': ['In Progress'],
  'In Progress': ['Resolved'],
  'Resolved': ['Closed'],
  'Closed': [],
};

const StatusUpdater = ({ complaintId, currentStatus, onUpdate }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const nextStatuses = VALID_TRANSITIONS[currentStatus] || [];

  const handleUpdate = async (newStatus) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.patch(`/complaints/${complaintId}/status`, {
        status: newStatus,
        comment: comment || `Status changed to ${newStatus}`,
      });
      setSuccess(`Status updated to ${newStatus}`);
      setComment('');
      if (onUpdate) onUpdate(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (nextStatuses.length === 0) {
    return <p className="status-note">No further transitions available.</p>;
  }

  return (
    <div className="status-updater">
      <textarea
        className="status-comment"
        placeholder="Add a comment (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <div className="status-actions">
        {nextStatuses.map(status => (
          <button
            key={status}
            className={`btn-status btn-status-${status.toLowerCase().replace(' ', '-')}`}
            onClick={() => handleUpdate(status)}
            disabled={loading}
          >
            {loading ? 'Updating...' : `Move to ${status}`}
          </button>
        ))}
      </div>
      {error && <p className="status-error">{error}</p>}
      {success && <p className="status-success">{success}</p>}
    </div>
  );
};

export default StatusUpdater;
