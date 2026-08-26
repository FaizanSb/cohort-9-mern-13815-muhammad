import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Branding Panel — sirf large screens pe dikhega */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-12">
        {/* Decorative floating sticky notes */}
        <div className="absolute top-16 left-16 w-40 h-32 bg-green-50 rounded-lg shadow-lg -rotate-6 border-l-4 border-l-green-400 p-3">
          <div className="h-2 w-16 bg-green-200 rounded mb-2" />
          <div className="h-1.5 w-full bg-green-100 rounded mb-1" />
          <div className="h-1.5 w-3/4 bg-green-100 rounded" />
        </div>
        <div className="absolute top-32 right-16 w-40 h-32 bg-pink-50 rounded-lg shadow-lg rotate-6 border-l-4 border-l-pink-400 p-3">
          <div className="h-2 w-16 bg-pink-200 rounded mb-2" />
          <div className="h-1.5 w-full bg-pink-100 rounded mb-1" />
          <div className="h-1.5 w-3/4 bg-pink-100 rounded" />
        </div>
        <div className="absolute bottom-24 left-24 w-40 h-32 bg-orange-50 rounded-lg shadow-lg rotate-3 border-l-4 border-l-orange-400 p-3">
          <div className="h-2 w-16 bg-orange-200 rounded mb-2" />
          <div className="h-1.5 w-full bg-orange-100 rounded mb-1" />
          <div className="h-1.5 w-3/4 bg-orange-100 rounded" />
        </div>

        <div className="relative z-10 text-center text-white max-w-sm">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-bold mb-3">Your ideas, organized</h1>
          <p className="text-blue-100">
            Capture, summarize, and pin what matters — all in one place.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Log in to access your notes</p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;