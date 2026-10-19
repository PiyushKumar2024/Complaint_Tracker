import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const AccountSettings = () => {
  const { user, updateProfile, changePassword } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || 'General',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [profileState, setProfileState] = useState({ loading: false, error: '', success: '' });
  const [passwordState, setPasswordState] = useState({ loading: false, error: '', success: '' });

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileState({ loading: true, error: '', success: '' });

    try {
      await updateProfile(profile);
      setProfileState({ loading: false, error: '', success: 'Your profile has been updated.' });
    } catch (error) {
      setProfileState({
        loading: false,
        error: error.response?.data?.message || 'Failed to update your profile.',
        success: '',
      });
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordState({ loading: true, error: '', success: '' });

    try {
      const result = await changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      setPasswordState({
        loading: false,
        error: '',
        success: result.message || 'Your password has been changed.',
      });
    } catch (error) {
      setPasswordState({
        loading: false,
        error: error.response?.data?.message || 'Failed to change your password.',
        success: '',
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8">
      <header className="mb-7">
        <h2 className="text-2xl font-bold text-ink-900">Account Settings</h2>
        <p className="mt-1 text-muted-500">Update your profile information and password.</p>
      </header>

      <section className="mb-6 rounded-xl bg-white p-5 shadow-sm sm:p-7">
        <h3 className="text-lg font-semibold text-ink-900">Profile information</h3>
        <p className="my-2 text-sm text-muted-500">
          Signed in as <strong>{user?.email}</strong> ({user?.role})
        </p>
        <form className="mt-5 space-y-4" onSubmit={handleProfileSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="profile-name">Full name</label>
            <input
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="profile-name"
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value })}
              minLength={2}
              maxLength={50}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="profile-phone">Phone number</label>
            <input
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              maxLength={25}
              value={profile.phone}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="profile-department">Department</label>
            <input
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="profile-department"
              value={profile.department}
              onChange={(event) => setProfile({ ...profile, department: event.target.value })}
              maxLength={100}
            />
          </div>
          {profileState.error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{profileState.error}</div>}
          {profileState.success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">{profileState.success}</div>}
          <button className="rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60" type="submit" disabled={profileState.loading}>
            {profileState.loading ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>

      <section className="mb-6 rounded-xl bg-white p-5 shadow-sm sm:p-7">
        <h3 className="text-lg font-semibold text-ink-900">Change password</h3>
        <form className="mt-5 space-y-4" onSubmit={handlePasswordSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="current-password">Current password</label>
            <input
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="new-password">New password</label>
            <input
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })}
              minLength={6}
              required
            />
            <small className="block text-xs text-muted-500">Use at least 6 characters.</small>
          </div>
          {passwordState.error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{passwordState.error}</div>}
          {passwordState.success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">{passwordState.success}</div>}
          <button className="rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60" type="submit" disabled={passwordState.loading}>
            {passwordState.loading ? 'Changing...' : 'Change password'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AccountSettings;
