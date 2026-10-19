import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingState from '../components/LoadingState';

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedSearch, setAppliedSearch] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    category: '',
    priority: '',
    search: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [filters.status, filters.department, filters.category, filters.priority, appliedSearch]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load departments');
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.department) params.department = filters.department;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      if (appliedSearch) params.search = appliedSearch;

      const res = await api.get('/admin/complaints', { params });
      setComplaints(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(filters.search.trim());
  };

  const clearFilters = () => {
    setFilters({ status: '', department: '', category: '', priority: '', search: '' });
    setAppliedSearch('');
  };

  const hasActiveFilters = filters.status || filters.department || filters.category || filters.priority || filters.search;
  const availableCategories = [...new Set(
    departments
      .filter((department) => !filters.department || department._id === filters.department)
      .flatMap((department) => department.categories || [])
  )].sort();

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

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4 max-[640px]:flex-col max-[640px]:items-start">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">All Complaints</h2>
          <p className="mt-1 text-muted-500">Manage and review all submitted complaints</p>
        </div>
        <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">{complaints.length} complaints</span>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm sm:p-5">
        <form className="mb-4 flex gap-2 max-[520px]:flex-col" onSubmit={handleSearchSubmit}>
          <input
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            type="text"
            aria-label="Search complaints by title or description"
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <button type="submit" className="rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-600">Search</button>
        </form>

        <div className="flex flex-wrap gap-3">
          <select
            className="min-h-10 min-w-40 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            aria-label="Filter by status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            className="min-h-10 min-w-40 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            aria-label="Filter by department"
            value={filters.department}
            onChange={(e) => {
              setFilters((current) => ({
                ...current,
                department: e.target.value,
                category: '',
              }));
            }}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>

          <select
            className="min-h-10 min-w-40 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            aria-label="Filter by priority"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            className="min-h-10 min-w-40 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            aria-label="Filter by category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-slate-50" onClick={clearFilters}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {error && <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700" role="alert">{error}</div>}

      {/* Complaints Table */}
      {loading ? (
        <LoadingState label="Loading complaints..." count={4} />
      ) : complaints.length === 0 ? (
        <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-4 text-4xl">📭</div>
          <p className="text-muted-500">No complaints found matching your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr>
                {['Title', 'Filed By', 'Department', 'Status', 'Priority', 'Assigned To', 'Date', 'Action'].map((heading) => (
                  <th key={heading} className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr className="hover:bg-slate-50" key={complaint._id}>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Title">
                    <span className="block font-semibold text-ink-900">{complaint.title}</span>
                    <span className="text-xs text-muted-500">{complaint.category}</span>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Filed by">
                    <span className="block font-medium text-ink-700">{complaint.filedBy?.name || 'Unknown'}</span>
                    <span className="text-xs text-muted-500">{complaint.filedBy?.email || ''}</span>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Department">{complaint.department?.name || 'N/A'}</td>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Status">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Priority">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClass(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Assigned to">{complaint.assignedTo?.name || '—'}</td>
                  <td className="border-b border-slate-100 px-4 py-3 whitespace-nowrap" data-label="Date">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Action">
                    <Link to={`/complaint/${complaint._id}`} className="rounded-md bg-brand-50 px-3 py-1.5 font-semibold text-brand-700 no-underline hover:bg-brand-100">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllComplaints;
