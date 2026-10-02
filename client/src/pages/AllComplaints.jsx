import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './AllComplaints.css';

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    priority: '',
    search: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [filters.status, filters.department, filters.priority]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch (err) {
      console.error('Failed to load departments');
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.department) params.department = filters.department;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const res = await api.get('/admin/complaints', { params });
      setComplaints(res.data.data);
    } catch (err) {
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const clearFilters = () => {
    setFilters({ status: '', department: '', priority: '', search: '' });
  };

  const hasActiveFilters = filters.status || filters.department || filters.priority || filters.search;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Critical': return 'priority-critical';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="all-complaints">
      <div className="all-complaints-header">
        <div>
          <h2>All Complaints</h2>
          <p>Manage and review all submitted complaints</p>
        </div>
        <span className="complaint-count">{complaints.length} complaints</span>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">Search</button>
        </form>

        <div className="filter-dropdowns">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          {hasActiveFilters && (
            <button className="btn-clear-filters" onClick={clearFilters}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Complaints Table */}
      {loading ? (
        <div className="loading">Loading complaints...</div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No complaints found matching your filters.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Filed By</th>
                <th>Department</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint._id}>
                  <td className="td-title">
                    <span className="complaint-title-text">{complaint.title}</span>
                    <span className="complaint-category">{complaint.category}</span>
                  </td>
                  <td>
                    <span className="user-name">{complaint.filedBy?.name || 'Unknown'}</span>
                    <span className="user-email">{complaint.filedBy?.email || ''}</span>
                  </td>
                  <td>{complaint.department?.name || 'N/A'}</td>
                  <td>
                    <span className={`table-badge ${getStatusClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>
                    <span className={`table-badge ${getPriorityClass(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td>{complaint.assignedTo?.name || '—'}</td>
                  <td className="td-date">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Link to={`/complaint/${complaint._id}`} className="btn-view-link">
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
