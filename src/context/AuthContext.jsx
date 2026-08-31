import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

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
        const { token, username: resUsername, role } = response.data;
        localStorage.setItem('auth_token', token);
        
        const userData = {
          name: resUsername || username,
          role: role || 'User',
          email: `${resUsername || username}@traceera.org`,
          avatar: `https://ui-avatars.com/api/?name=${resUsername || username}&background=0D8ABC&color=fff`
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.response?.data || 'Invalid username or password');
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
