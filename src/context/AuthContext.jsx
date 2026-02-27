import { createContext, useContext, useState } from 'react';
import { getToken, setToken } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [pendingEmail, setPendingEmail] = useState('');

  const requestOtp = (email) => {
    setPendingEmail(email);
  };

  const verifyOtp = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setPendingEmail('');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        pendingEmail,
        requestOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
