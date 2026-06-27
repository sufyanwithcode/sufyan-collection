import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const Ctx = createContext(null);

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  /* Restore session on mount */
  useEffect(() => {
    const token = localStorage.getItem('sc_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/auth/me')
        .then(r => setUser(r.data.user))
        .catch(() => { localStorage.removeItem('sc_token'); delete axios.defaults.headers.common['Authorization']; })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const _setSession = (token, u) => {
    localStorage.setItem('sc_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(u);
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });
    _setSession(data.token, data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await axios.post('/auth/register', { name, email, password, phone });
    _setSession(data.token, data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sc_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth outside AuthProvider');
  return c;
};
