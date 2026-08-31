import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/auth/login', { username, password });
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('auth_token', token);
        
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        const userData = {
          name: payload.sub || username,
          role: Array.isArray(payload.roles) ? payload.roles[0] : (payload.role || 'User'),
          email: `${payload.sub || username}@traceera.org`,
          avatar: `https://ui-avatars.com/api/?name=${payload.sub || username}&background=0D8ABC&color=fff`
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.response?.data || 'Invalid username or password. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, role = 'ADMIN') => {
    try {
      setLoading(true);
      setError(null);
      
      await api.post('/api/auth/register', { username, password, role });
      
      return await login(username, password);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Username might be taken.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
