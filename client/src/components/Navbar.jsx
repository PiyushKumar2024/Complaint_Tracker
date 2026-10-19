import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl animate-[navbar-enter_250ms_ease_both] md:px-8">
      <div className="mt-1">
        <Link className="text-xl font-bold text-ink-900 no-underline sm:text-2xl" to="/">Complaint Tracker</Link>
      </div>
      <button
        type="button"
        className="ml-auto grid size-10 place-content-center gap-1 rounded-lg border border-slate-200 bg-white md:hidden"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="h-0.5 w-5 rounded bg-ink-700" />
        <span className="h-0.5 w-5 rounded bg-ink-700" />
        <span className="h-0.5 w-5 rounded bg-ink-700" />
      </button>
      <div
        className={`${menuOpen ? 'flex animate-[menu-enter_180ms_ease_both]' : 'hidden'} order-3 w-full flex-col items-stretch gap-0 md:order-none md:flex md:w-auto md:flex-row md:items-center md:gap-6`}
        id="primary-navigation"
      >
        {user ? (
          <>
            <span className="border-b border-slate-100 py-3 font-semibold text-muted-500 md:border-0 md:py-0">Hello, {user.name}</span>
            {user.role === 'admin' && <Link className="border-b border-slate-100 py-3 font-medium text-ink-700 no-underline hover:text-brand-600 md:border-0 md:py-0" to="/admin">Admin Dashboard</Link>}
            {user.role === 'admin' && <Link className="border-b border-slate-100 py-3 font-medium text-ink-700 no-underline hover:text-brand-600 md:border-0 md:py-0" to="/admin/complaints">Complaints</Link>}
            {user.role === 'admin' && <Link className="border-b border-slate-100 py-3 font-medium text-ink-700 no-underline hover:text-brand-600 md:border-0 md:py-0" to="/admin/users">Users</Link>}
            {user.role === 'staff' && <Link className="border-b border-slate-100 py-3 font-medium text-ink-700 no-underline hover:text-brand-600 md:border-0 md:py-0" to="/staff">Assigned Tasks</Link>}
            {(user.role === 'student' || user.role === 'faculty') && <Link className="border-b border-slate-100 py-3 font-medium text-ink-700 no-underline hover:text-brand-600 md:border-0 md:py-0" to="/dashboard">My Complaints</Link>}
            <Link className="border-b border-slate-100 py-3 font-medium text-ink-700 no-underline hover:text-brand-600 md:border-0 md:py-0" to="/file-complaint">File Complaint</Link>
            <Link className="border-b border-slate-100 py-3 font-medium text-ink-700 no-underline hover:text-brand-600 md:border-0 md:py-0" to="/settings">Account Settings</Link>
            <button onClick={handleLogout} className="mt-2 self-start rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 md:mt-0 md:self-auto">Logout</button>
          </>
        ) : (
          <>
            <Link className="border-b border-slate-100 py-3 font-medium text-ink-700 no-underline hover:text-brand-600 md:border-0 md:py-0" to="/login">Login</Link>
            <Link className="border-b border-slate-100 py-3 font-medium text-ink-700 no-underline hover:text-brand-600 md:border-0 md:py-0" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
