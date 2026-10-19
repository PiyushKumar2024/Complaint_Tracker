import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import LoadingState from '../components/LoadingState';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState label="Loading dashboard..." count={4} />;
  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-700" role="alert">
          {error}
          <button type="button" className="ml-3 rounded-md border border-current px-3 py-1 text-sm font-semibold" onClick={fetchStats}>Try again</button>
        </div>
      </div>
    );
  }

  const { overview, departmentWise, recentComplaints } = stats;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <div className="mb-8 flex items-center justify-between gap-4 max-[768px]:flex-col max-[768px]:items-start">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-ink-900">Admin Dashboard</h2>
          <p className="text-muted-500">Overview of all complaints and system activity</p>
        </div>
        <div className="flex items-center gap-3 max-[768px]:flex-wrap max-[480px]:w-full max-[480px]:flex-col max-[480px]:items-stretch">
          <Link to="/admin/complaints" className="rounded-lg bg-brand-500 px-5 py-3 text-center font-semibold text-white no-underline hover:bg-brand-600">
            View All Complaints
          </Link>
          <Link to="/admin/users" className="rounded-lg border border-brand-500 bg-white px-5 py-3 text-center font-semibold text-brand-600 no-underline hover:bg-brand-50">
            Manage Users
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[
          ['📊', 'Total Complaints', overview.totalComplaints, 'border-l-violet-500'],
          ['🔴', 'Open', overview.open, 'border-l-amber-500'],
          ['🔵', 'In Progress', overview.inProgress, 'border-l-sky-500'],
          ['🟢', 'Resolved', overview.resolved, 'border-l-green-500'],
          ['⚪', 'Closed', overview.closed, 'border-l-slate-400'],
          ['👥', 'Total Users', overview.totalUsers, 'border-l-pink-500'],
          ['🏢', 'Departments', overview.totalDepartments, 'border-l-teal-600'],
        ].map(([icon, label, value, border]) => (
          <div key={label} className={`flex items-center gap-3 rounded-xl border-l-4 ${border} bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card sm:p-5`}>
            <span className="text-2xl">{icon}</span>
            <div className="flex min-w-0 flex-col">
              <span className="text-2xl font-bold leading-none text-ink-900">{value}</span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-500">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Department-wise Breakdown */}
      {departmentWise && departmentWise.length > 0 && (
        <div className="mb-8 rounded-xl bg-white p-4 shadow-sm sm:p-7">
          <h3 className="mb-5 text-lg font-semibold text-ink-900">Department-wise Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] border-collapse">
              <thead>
                <tr>
                  {['Department', 'Total', 'Open', 'In Progress', 'Resolved'].map((heading) => (
                    <th key={heading} className="border-b-2 border-slate-100 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-500">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departmentWise.map((dept, index) => (
                  <tr key={index} className="transition hover:bg-slate-50">
                    <td className="border-b border-slate-100 px-3 py-3">
                      <span className="block font-semibold text-ink-900">{dept.department}</span>
                      <span className="text-xs text-slate-400">{dept.code}</span>
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3"><span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">{dept.total}</span></td>
                    <td className="border-b border-slate-100 px-3 py-3"><span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">{dept.open}</span></td>
                    <td className="border-b border-slate-100 px-3 py-3"><span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">{dept.inProgress}</span></td>
                    <td className="border-b border-slate-100 px-3 py-3"><span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">{dept.resolved}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Complaints */}
      <div className="mb-8 rounded-xl bg-white p-4 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-ink-900">Recent Complaints</h3>
          <Link to="/admin/complaints" className="text-sm font-semibold text-brand-600 no-underline hover:text-brand-700">View All →</Link>
        </div>
        {recentComplaints && recentComplaints.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
            {recentComplaints.map(complaint => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-muted-500">No complaints filed yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
