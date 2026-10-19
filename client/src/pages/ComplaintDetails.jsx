import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AssignStaff from '../components/AssignStaff';
import LoadingState from '../components/LoadingState';
import StatusUpdater from '../components/StatusUpdater';
import TimelineView from '../components/TimelineView';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const serverOrigin = new URL(api.defaults.baseURL).origin;

  useEffect(() => {
    setLoading(true);
    setError(null);
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
      case 'Open': return 'bg-amber-100 text-amber-800';
      case 'In Progress': return 'bg-sky-100 text-sky-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-slate-100 text-slate-700';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-slate-100 text-slate-700';
      default: return '';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this complaint? This action cannot be undone.')) return;

    setDeleting(true);
    setError(null);
    try {
      await api.delete(`/complaints/${id}`);
      navigate('/admin/complaints', { replace: true });
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Failed to delete complaint');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState label="Loading complaint details..." count={2} />;
  if (error) return (
    <div className="mx-auto max-w-5xl p-5">
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700" role="alert">{error}</div>
      <button onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-ink-700 hover:bg-slate-50">← Go Back</button>
    </div>
  );
  if (!complaint) return null;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="mb-5 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-ink-700 hover:bg-slate-50">← Back</button>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 rounded-xl bg-white p-5 shadow-sm sm:p-7">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{complaint.title}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(complaint.status)}`}>
              {complaint.status}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClass(complaint.priority)}`}>
              {complaint.priority} Priority
            </span>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">{complaint.category}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main Content */}
        <div className="min-w-0 space-y-5">
          {/* Description */}
          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7">
            <h3 className="mb-3 text-lg font-semibold text-ink-900">Description</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-ink-700">{complaint.description}</p>
          </div>

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7">
              <h3 className="mb-3 text-lg font-semibold text-ink-900">Attachments</h3>
              <div className="flex flex-wrap gap-2">
                {complaint.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={`${serverOrigin}${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-brand-700 no-underline hover:bg-brand-50"
                  >
                    📎 Attachment {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {complaint.location && (complaint.location.address || complaint.location.city) && (
            <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7">
              <h3 className="mb-3 text-lg font-semibold text-ink-900">Location</h3>
              <p className="text-ink-700">
                {[complaint.location.address, complaint.location.city, complaint.location.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7">
            <h3 className="mb-3 text-lg font-semibold text-ink-900">Timeline</h3>
            <TimelineView timeline={complaint.timeline} />
          </div>

          {(user?.role === 'staff' || user?.role === 'admin') && (
            <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7">
              <h3 className="mb-3 text-lg font-semibold text-ink-900">Update status</h3>
              <StatusUpdater
                complaintId={complaint._id}
                currentStatus={complaint.status}
                onUpdate={setComplaint}
              />
            </div>
          )}

          {user?.role === 'admin' && (
            <div className="rounded-xl bg-white p-5 shadow-sm sm:p-7">
              <h3 className="mb-3 text-lg font-semibold text-ink-900">Assign staff</h3>
              <AssignStaff
                complaintId={complaint._id}
                currentAssignee={complaint.assignedTo}
                onAssign={setComplaint}
              />
              <button
                type="button"
                className="mt-5 rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete complaint'}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="min-w-0">
          {/* Info Card */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-ink-900">Details</h4>
            <div className="border-b border-slate-100 py-3">
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-500">Filed By</span>
              <span className="mt-1 block break-words font-medium text-ink-700">{complaint.filedBy?.name || 'Unknown'}</span>
            </div>
            <div className="border-b border-slate-100 py-3">
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-500">Email</span>
              <span className="mt-1 block break-all font-medium text-ink-700">{complaint.filedBy?.email || 'N/A'}</span>
            </div>
            <div className="border-b border-slate-100 py-3">
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-500">Department</span>
              <span className="mt-1 block font-medium text-ink-700">{complaint.department?.name || 'N/A'}</span>
            </div>
            <div className="border-b border-slate-100 py-3">
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-500">Assigned To</span>
              <span className="mt-1 block font-medium text-ink-700">{complaint.assignedTo?.name || 'Unassigned'}</span>
            </div>
            <div className="border-b border-slate-100 py-3">
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-500">Filed On</span>
              <span className="mt-1 block font-medium text-ink-700">
                {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </div>
            <div className="py-3">
              <span className="block text-xs font-medium uppercase tracking-wide text-muted-500">Last Updated</span>
              <span className="mt-1 block font-medium text-ink-700">
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
