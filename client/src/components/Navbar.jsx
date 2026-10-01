import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Complaint Tracker</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">Hello, {user.name}</span>
            {user.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
            {user.role === 'staff' && <Link to="/staff">Assigned Tasks</Link>}
            {user.role === 'student' && <Link to="/dashboard">My Complaints</Link>}
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
