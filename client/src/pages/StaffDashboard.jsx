import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import LoadingState from '../components/LoadingState';

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
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/complaints');
      const currentUserId = user?._id || user?.id;
      setComplaints(user?.role === 'admin'
        ? res.data.data.filter((complaint) => complaint.assignedTo?._id === currentUserId)
        : res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assigned complaints');
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

  if (loading) return <LoadingState label="Loading your assignments..." />;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <div className="mb-8">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-ink-900">My Assigned Complaints</h2>
          <p className="text-muted-500">Manage complaints assigned to you</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700" role="alert">
          {error}
          <button type="button" className="ml-3 rounded-md border border-current px-3 py-1 text-sm font-semibold" onClick={fetchAssignedComplaints}>
            Try again
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Total Assigned', complaints.length, 'border-t-violet-500'],
          ['Open', statusCounts.open, 'border-t-amber-500'],
          ['In Progress', statusCounts.inProgress, 'border-t-sky-500'],
          ['Resolved', statusCounts.resolved, 'border-t-green-500'],
        ].map(([label, value, border]) => (
          <div key={label} className={`flex flex-col items-center rounded-xl border-t-4 ${border} bg-white p-5 shadow-sm`}>
            <span className="text-2xl font-bold text-ink-900">{value}</span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="mb-5 flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
        {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
          <button
            key={status}
            className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium transition ${filter === status ? 'bg-ink-700 text-white' : 'text-muted-500 hover:bg-slate-100 hover:text-ink-700'}`}
            onClick={() => setFilter(status)}
          >
            {status}
            {status !== 'All' && (
              <span className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.68rem] font-bold ${filter === status ? 'bg-white/20' : 'bg-black/10'}`}>
                {complaints.filter(c => c.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      {error ? null : filteredComplaints.length === 0 ? (
        <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-4 text-4xl">📋</div>
          <p className="text-lg text-muted-500">
            {filter === 'All'
              ? 'No complaints assigned to you yet.'
              : `No ${filter.toLowerCase()} complaints.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
          {filteredComplaints.map(complaint => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
