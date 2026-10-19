import { useState, useEffect } from 'react';
import api from '../services/api';

const AssignStaff = ({ complaintId, currentAssignee, onAssign }) => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get('/admin/users', { params: { role: 'staff' } });
      setStaffList(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff list');
    } finally {
      setFetching(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedStaff) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.patch(`/complaints/${complaintId}/assign`, {
        assignedTo: selectedStaff,
      });
      setSuccess(res.data.message);
      if (onAssign) onAssign(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign staff');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-sm text-muted-500">Loading staff...</p>;

  return (
    <div className="space-y-3">
      {currentAssignee && (
        <p className="text-sm text-muted-500">
          Currently: <strong>{currentAssignee.name}</strong>
        </p>
      )}
      <select
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink-700 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        aria-label="Select staff member to assign"
        value={selectedStaff}
        onChange={(e) => setSelectedStaff(e.target.value)}
      >
        <option value="">Select staff member</option>
        {staffList.map(staff => (
          <option key={staff._id} value={staff._id}>
            {staff.name} ({staff.email})
          </option>
        ))}
      </select>
      <button
        className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleAssign}
        disabled={!selectedStaff || loading}
      >
        {loading ? 'Assigning...' : 'Assign'}
      </button>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {success && <p className="rounded-md bg-green-50 p-3 text-sm text-green-700" role="status">{success}</p>}
    </div>
  );
};

export default AssignStaff;
