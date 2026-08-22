import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me'); // niche is route ka backend code diya hai
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    const res = await api.post('/auth/signup', formData);
    setUser(res.data.user);
    toast.success('Account created!');
  };

  const login = async (formData) => {
    const res = await api.post('/auth/login', formData);
    setUser(res.data.user);
    toast.success('Logged in successfully!');
  };

  const logout = async () => {
    try {
      api.post('/auth/logout');
      setUser(null);
      toast.success("Logged out Successfully")
    } catch (error) {
      toast.error("Error in logging out the user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};