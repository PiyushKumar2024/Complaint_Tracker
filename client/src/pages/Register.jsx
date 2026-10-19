import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: 'General'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    
    try {
      // By default, assigning new users to 'student' (citizen) role for safety
      const registrationData = { ...formData };
      delete registrationData.confirmPassword;
      await register({ ...registrationData, role: 'student' });
      showToast('Your account is ready. Welcome to Complaint Tracker.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-9">
        <h2 className="text-2xl font-bold text-ink-900">Create an Account</h2>
        <p className="mt-1 text-muted-500">Join to file and track your complaints</p>
        
        {error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="register-name">Full Name</label>
            <input 
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="register-name"
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange} 
              minLength={2}
              maxLength={50}
              required 
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="register-email">Email Address</label>
            <input 
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="register-email"
              type="email" 
              name="email"
              value={formData.email} 
              autoComplete="email"
              onChange={handleChange} 
              required 
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="register-phone">Phone Number (optional)</label>
            <input
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="register-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              maxLength={25}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="register-password">Password</label>
            <input 
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="register-password"
              type="password" 
              name="password"
              value={formData.password} 
              autoComplete="new-password"
              onChange={handleChange} 
              minLength={6}
              required 
              placeholder="Create a password"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-ink-700" htmlFor="register-confirm-password">Confirm Password</label>
            <input
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              id="register-confirm-password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
              placeholder="Enter your password again"
            />
          </div>
          <button type="submit" disabled={loading} className="mt-2 w-full rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-500">
          Already have an account? <Link className="font-semibold text-brand-600 no-underline hover:underline" to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
