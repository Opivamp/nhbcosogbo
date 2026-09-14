import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken, setToken, getUser, setUser } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        setCurrentUser(res.user);
        setUser(res.user);
      } catch (err) {
        setToken(null);
        setUser(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);
    setUser(res.user);
    setCurrentUser(res.user);
    return res.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCurrentUser(null);
  };

  const value = {
    user: currentUser,
    isAuthenticated: !!currentUser,
    role: currentUser?.role || null,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}