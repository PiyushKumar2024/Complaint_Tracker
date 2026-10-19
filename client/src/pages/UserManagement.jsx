import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ROLES = ['student', 'faculty', 'staff', 'admin'];

const UserManagement = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingUserId, setSavingUserId] = useState('');
  const [message, setMessage] = useState('');
  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    const previousRole = users.find((user) => user._id === userId)?.role;
    setUsers((currentUsers) => currentUsers.map((user) => (
      user._id === userId ? { ...user, role } : user
    )));
    setSavingUserId(userId);
    setError('');
    setMessage('');

    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      setUsers((currentUsers) => currentUsers.map((user) => (
        user._id === userId ? response.data.data : user
      )));
      setMessage(`Role updated to ${role}.`);
    } catch (requestError) {
      setUsers((currentUsers) => currentUsers.map((user) => (
        user._id === userId ? { ...user, role: previousRole } : user
      )));
      setError(requestError.response?.data?.message || 'Failed to update user role.');
    } finally {
      setSavingUserId('');
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <header className="mb-6 flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">User Management</h2>
          <p className="mt-1 text-muted-500">Review registered accounts and manage their access roles.</p>
        </div>
        {!loading && <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">{users.length} users</span>}
      </header>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700" role="alert">{error}</div>}
      {message && <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700" role="status">{message}</div>}

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-muted-500 shadow-sm">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center text-muted-500 shadow-sm">No users are registered yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr>
                {['User', 'Department', 'Joined', 'Role'].map((heading) => (
                  <th key={heading} className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr className="hover:bg-slate-50" key={user._id}>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="User">
                    <strong className="block text-ink-900">{user.name}</strong>
                    <span className="text-xs text-muted-500">{user.email}</span>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Department">{user.department || 'General'}</td>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Joined">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3" data-label="Role">
                    <select
                      className="min-h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm capitalize outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
                      aria-label={`Role for ${user.name}`}
                      value={user.role}
                      disabled={savingUserId === user._id || currentUserId === user._id}
                      onChange={(event) => updateRole(user._id, event.target.value)}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {currentUserId === user._id && (
                      <span className="mt-1 block text-xs text-muted-500">Your own role cannot be changed here.</span>
                    )}
                    {savingUserId === user._id && <span className="mt-1 block text-xs text-muted-500">Saving...</span>}
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

export default UserManagement;
