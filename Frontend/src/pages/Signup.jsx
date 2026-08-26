import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-600 to-blue-700 items-center justify-center p-12">
        <div className="absolute top-20 right-20 w-40 h-32 bg-blue-50 rounded-lg shadow-lg -rotate-3 border-l-4 border-l-blue-400 p-3">
          <div className="h-2 w-16 bg-blue-200 rounded mb-2" />
          <div className="h-1.5 w-full bg-blue-100 rounded mb-1" />
          <div className="h-1.5 w-3/4 bg-blue-100 rounded" />
        </div>
        <div className="absolute top-40 left-14 w-40 h-32 bg-purple-50 rounded-lg shadow-lg rotate-6 border-l-4 border-l-purple-400 p-3">
          <div className="h-2 w-16 bg-purple-200 rounded mb-2" />
          <div className="h-1.5 w-full bg-purple-100 rounded mb-1" />
          <div className="h-1.5 w-3/4 bg-purple-100 rounded" />
        </div>
        <div className="absolute bottom-20 right-24 w-40 h-32 bg-pink-50 rounded-lg shadow-lg -rotate-6 border-l-4 border-l-pink-400 p-3">
          <div className="h-2 w-16 bg-pink-200 rounded mb-2" />
          <div className="h-1.5 w-full bg-pink-100 rounded mb-1" />
          <div className="h-1.5 w-3/4 bg-pink-100 rounded" />
        </div>

        <div className="relative z-10 text-center text-white max-w-sm">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-3xl font-bold mb-3">Start writing today</h1>
          <p className="text-purple-100">
            Rich text notes with AI summaries, search, and pinning — built for how you think.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
            <p className="text-gray-500 text-sm mt-1">Start organizing your notes today</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;