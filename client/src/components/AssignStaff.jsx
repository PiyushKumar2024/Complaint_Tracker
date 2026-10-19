import { useState, useEffect } from 'react';
import api from '../services/api';
import './AssignStaff.css';

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
      setError('Failed to load staff list');
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

  if (fetching) return <p className="assign-loading">Loading staff...</p>;

  return (
    <div className="assign-staff">
      {currentAssignee && (
        <p className="current-assignee">
          Currently: <strong>{currentAssignee.name}</strong>
        </p>
      )}
      <select
        className="staff-select"
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
        className="btn-assign"
        onClick={handleAssign}
        disabled={!selectedStaff || loading}
      >
        {loading ? 'Assigning...' : 'Assign'}
      </button>
      {error && <p className="assign-error">{error}</p>}
      {success && <p className="assign-success">{success}</p>}
    </div>
  );
};

export default AssignStaff;
