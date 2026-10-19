import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import LoadingState from '../components/LoadingState';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(
    () => [...new Set(complaints.map((complaint) => complaint.category).filter(Boolean))].sort(),
    [complaints]
  );
  const statusCounts = useMemo(() => ({
    All: complaints.length,
    Open: complaints.filter((complaint) => complaint.status === 'Open').length,
    'In Progress': complaints.filter((complaint) => complaint.status === 'In Progress').length,
    Resolved: complaints.filter((complaint) => complaint.status === 'Resolved').length,
    Closed: complaints.filter((complaint) => complaint.status === 'Closed').length,
  }), [complaints]);
  const filteredComplaints = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return complaints
      .filter((complaint) => filter === 'All' || complaint.status === filter)
      .filter((complaint) => category === 'All' || complaint.category === category)
      .filter((complaint) => !normalizedSearch
        || `${complaint.title} ${complaint.description}`.toLowerCase().includes(normalizedSearch))
      .sort((first, second) => {
        const dateDifference = new Date(first.createdAt) - new Date(second.createdAt);
        return sortOrder === 'newest' ? -dateDifference : dateDifference;
      });
  }, [complaints, filter, category, search, sortOrder]);

  if (loading) return <LoadingState label="Loading your complaints..." />;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4 max-[768px]:flex-col">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-ink-900">My Complaints</h2>
          <p className="text-muted-500">Track and manage your filed complaints</p>
        </div>
        <Link to="/file-complaint" className="inline-flex w-fit items-center whitespace-nowrap rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white no-underline transition hover:scale-[1.02] hover:bg-brand-600">
          + File New Complaint
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700" role="alert">
          {error}
          <button type="button" className="ml-3 rounded-md border border-current px-3 py-1 text-sm font-semibold" onClick={fetchComplaints}>Try again</button>
        </div>
      )}

      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" aria-label="Complaint summary">
        {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
          <button
            type="button"
            className={`flex flex-col gap-1 rounded-xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-card ${filter === status ? 'border-brand-300 ring-2 ring-brand-100' : 'border-line-200'}`}
            key={status}
            onClick={() => setFilter(status)}
          >
            <span className="text-2xl font-bold text-ink-900">{statusCounts[status]}</span>
            <span className="text-xs font-semibold text-muted-500">{status === 'All' ? 'Total complaints' : status}</span>
          </button>
        ))}
      </section>

      <div className="mb-5 flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
        {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
          <button 
            key={status}
            className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium transition ${filter === status ? 'bg-ink-700 text-white' : 'text-muted-500 hover:bg-slate-100 hover:text-ink-700'}`}
            onClick={() => setFilter(status)}
          >
            {status}
            <span className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.68rem] font-bold ${filter === status ? 'bg-white/20' : 'bg-black/10'}`}>{statusCounts[status]}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center gap-3 max-[520px]:flex-col max-[520px]:items-stretch">
        <label className="min-w-0 flex-1 max-[520px]:w-full">
          <span className="sr-only">Search your complaints</span>
          <input
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            type="search"
            placeholder="Search title or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label className="max-[520px]:w-full">
          <span className="sr-only">Filter by category</span>
          <select className="min-h-11 w-full min-w-40 rounded-lg border border-slate-300 bg-white px-3 text-ink-700 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="All">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="max-[520px]:w-full">
          <span className="sr-only">Sort complaints</span>
          <select className="min-h-11 w-full min-w-40 rounded-lg border border-slate-300 bg-white px-3 text-ink-700 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {error ? null : filteredComplaints.length === 0 ? (
        <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">
          <p className="mb-6 text-lg text-muted-500">{complaints.length ? 'No complaints match these filters.' : 'No complaints found.'}</p>
          {filter === 'All' && (
            <Link to="/file-complaint" className="inline-block rounded-lg border border-brand-500 bg-white px-5 py-3 font-semibold text-brand-600 no-underline hover:bg-brand-50">
              File your first complaint
            </Link>
          )}
          {complaints.length > 0 && (
            <button
              className="ml-3 rounded-lg border border-brand-500 px-4 py-2.5 font-semibold text-brand-700"
              onClick={() => {
                setFilter('All');
                setCategory('All');
                setSearch('');
              }}
            >
              Clear filters
            </button>
          )}
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

export default StudentDashboard;
