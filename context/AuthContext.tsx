import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MockBackend } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string, apiKey?: string) => boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  updateProfile: (user: User) => void;
  hasApiKey: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('techpulse_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, pass: string, apiKey?: string): boolean => {
    const authUser = MockBackend.login(email, pass, apiKey);
    if (authUser) {
      setUser(authUser);
      localStorage.setItem('techpulse_current_user', JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => {
    const googleUser = MockBackend.loginWithGoogle();
    setUser(googleUser);
    localStorage.setItem('techpulse_current_user', JSON.stringify(googleUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('techpulse_current_user');
  };

  const updateProfile = (updatedUser: User) => {
    MockBackend.updateUser(updatedUser);
    setUser(updatedUser);
    localStorage.setItem('techpulse_current_user', JSON.stringify(updatedUser));
  };

  // Utility to check if API key exists (prefer user key, then env)
  const hasApiKey = !!(user?.apiKey || process.env.API_KEY);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, updateProfile, hasApiKey, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);