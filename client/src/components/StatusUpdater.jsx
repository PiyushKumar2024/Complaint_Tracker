import { useState } from 'react';
import api from '../services/api';

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
    return <p className="text-sm text-muted-500">No further transitions available.</p>;
  }

  return (
    <div className="space-y-3">
      <textarea
        className="w-full resize-y rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        aria-label="Status update comment"
        placeholder="Add a comment (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        rows={3}
      />
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map(status => (
          <button
            key={status}
            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-brand-600 disabled:cursor-wait disabled:opacity-60"
            onClick={() => handleUpdate(status)}
            disabled={loading}
          >
            {loading ? 'Updating...' : `Move to ${status}`}
          </button>
        ))}
      </div>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {success && <p className="rounded-md bg-green-50 p-3 text-sm text-green-700" role="status">{success}</p>}
    </div>
  );
};

export default StatusUpdater;
