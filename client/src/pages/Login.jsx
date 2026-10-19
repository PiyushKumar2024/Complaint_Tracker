import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await login(email.trim(), password);
      const dashboard = data.user.role === 'admin'
        ? '/admin'
        : data.user.role === 'staff'
          ? '/staff'
          : '/dashboard';
      showToast('You are now signed in.');
      navigate(dashboard, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-9">
        <h2 className="text-2xl font-bold text-ink-900">Welcome Back</h2>
        <p className="mt-1 text-muted-500">Login to your account to continue</p>
        
        {error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
        
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="login-email">Email Address</label>
            <input 
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="login-email"
              type="email" 
              value={email} 
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="login-password">Password</label>
            <input 
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="login-password"
              type="password" 
              value={password} 
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-500">
          Don't have an account? <Link className="font-semibold text-brand-600 no-underline hover:underline" to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
